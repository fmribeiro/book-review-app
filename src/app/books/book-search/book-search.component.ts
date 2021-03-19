import { Component, OnInit } from "@angular/core";
import { NgForm, FormControl } from "@angular/forms";
import { BookService } from "../../shared/services/book.service";
import { Book } from "../../shared/models/book.model";
import { UtilsService } from "../../shared/services/utils.service";
import { GoogleBooksService } from "../../shared/services/googleBooks.service"
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  map,
  tap
} from "rxjs/operators";

@Component({
  selector: "app-book-search",
  templateUrl: "./book-search.component.html",
  styleUrls: ["./book-search.component.css"]
})
export class BookSearchComponent implements OnInit {
  books: Book[];
  searchTerm: Observable<string>;
  searchField = new FormControl();
  bookTitle = "";
  startTheSearch = false;
  isLoading = false;

  constructor(
    private bookService: BookService,
    private googleBooksService: GoogleBooksService,
    private utilsService: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const booksSearch = this.searchField.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(searchTerm => searchTerm.length >= 5),
      switchMap(searchTerm => this.fetchBookOnGoogleBooksAPI(searchTerm))
    );
    booksSearch.subscribe();
  }

  async fetchBookOnGoogleBooksAPI(searchTerm: string) {
    if (!searchTerm) {
      return;
    }
    this.startTheSearch = true;
    this.bookTitle = searchTerm;
    this.isLoading = true;
    this.googleBooksService.fetchGoogleBooksAPI(searchTerm).subscribe(
      books => {
        this.books = books;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  createNewBook(index: number, readStatus: string, redirectTo: string) {
    const book = this.books[index];
    book.userId = this.utilsService.getLoggedUserId();
    book.readStatus = readStatus;

    this.bookService.createNewBook(book).subscribe(
      response => {
        this.router.navigate([redirectTo]);
        if (readStatus === "lido") {
          this.utilsService.showAlertMessage("Livro adicionado com sucesso!");
        } else if (readStatus === "lerei") {
          this.utilsService.showAlertMessage(
            "Livro adicionado com sucesso a lista de desejos!"
          );
        }
      },
      error => {
        this.utilsService.showAlertMessage(
          "Não foi possível adicionar o livro. Livro já foi adionado anteriormente"
        );
      }
    );
  }

  saveBook(index: number): void {
    this.createNewBook(index, "lido", "user/books/read");
  }

  addToWishlist(index: number): void {
    this.createNewBook(index, "lerei", "user/books/wishlist");
  }
}
