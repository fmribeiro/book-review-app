import { getTestBed } from '@angular/core/testing';
import { Component, OnInit, Input } from '@angular/core';
import { BookService } from '../shared/services/book.service';
import { Book } from '../shared/models/book.model';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  @Input() books: Book[];
  isAuthenticated = false;
  canEditBook = false;

  constructor(
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService) {
    this.activatedRoute.url.subscribe(params => {
      this.solveRoutes(params[0].path);
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.utilsService.isUserAuthenticated();
  }

  solveRoutes(route: string) {
    switch (route) {
      case 'read': {
        this.getReadBooks();
        break;
      }
      case 'wishlist': {
        this.getBooksWishlist();
        break;
      }
      case 'recent': {
        this.getRecentBooks();
        break;
      }
    }
  }

  getRecentBooks(): void {
    this.bookService.fetchBooks().subscribe(books => {
      this.books = books;
    });
  }

  getReadBooks(): void {
    this.canEditBook = true;
    this.bookService.fetchReadBooks().subscribe(books => {
      this.books = books;
    });
  }

  getBooksWishlist(): void {
    this.canEditBook = true;
    this.bookService.fetchBooksWishlist().subscribe(books => {
      this.books = books;
    });
  }

  deleteBook(index: number): void {
    const book = this.books[index];
    this.bookService.deleteBook(book.id).subscribe(
      response => {
        this.books.splice(index, 1);
        this.utilsService.showAlertMessage('Livro excluido com sucesso!');
      },
      error => {
        this.utilsService.showAlertMessage('Não foi possível excluir o livro');
      }
    );
  }

  setBookAsRead(index: number): void {
    const book = this.books[index];
    book.readStatus = 'lido';
    this.bookService.updateBook(book).subscribe(
      response => {
        this.books.splice(index, 1);
        this.utilsService.showAlertMessageAndRedirect('Adicionado a lista de livros lidos!', 'user/books/read');
      },
      error => {
        this.utilsService.showAlertMessage('Não foi possível atualizar o livro');
      }
    );
  }

}
