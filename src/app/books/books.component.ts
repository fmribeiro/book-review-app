import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Book } from '../shared/models/book.model';
import { BookService } from '../shared/services/book.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, AfterViewInit {

  @Input() books: Book[] = [];
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  public virtualScroll?: CdkVirtualScrollViewport;
  isAuthenticated = false;
  isLoading = false;
  isPageable = false;
  isLastPage;
  totalPages = 0;
  currentPage = 0;
  canEditBook = false;
  currentPath = '';

  constructor(
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService) {
    this.activatedRoute.url.subscribe(params => {
      this.currentPath = params[0].path;
      this.solveRoutes(params[0].path);
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.utilsService.isUserAuthenticated();
  }

  ngAfterViewInit(): void {
    this.virtualScroll.elementRef.nativeElement.onscroll = (e) => { this.onScroll(); };
  }

  onScroll(): void {
    const scrollOffset = Math.round(this.virtualScroll.measureScrollOffset('bottom'));
    const isLastPage = this.currentPage >= this.totalPages - 1;

    if (this.isPageable && scrollOffset < 5 && !isLastPage) {
      console.log('nova busca...');
      console.log('totalItems: ' + this.books.length);
      this.currentPage = this.currentPage + 1;
      this.solveRoutes(this.currentPath);
    }
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

  getRecentBooks(size: number = 10): void {
    this.isLoading = true;
    this.isPageable = true;
    this.bookService.fetchRecentBooks(this.currentPage, size).subscribe(
      response => {
        this.isLoading = false;
        this.books = this.books.concat(response.items);
        this.totalPages = response.totalPages;
      },
      error => {
        this.isLoading = false;
        this.isLastPage = true;
        this.books = [];
      }
    );
  }

  getReadBooks(): void {
    this.canEditBook = true;
    this.isLoading = true;
    this.bookService.fetchReadBooks().subscribe(
      response => {
        this.books = response;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  getBooksWishlist(): void {
    this.canEditBook = true;
    this.isLoading = true;
    this.bookService.fetchBooksWishlist().subscribe(
      response => {
        this.books = response;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  deleteBook(index: number): void {
    const book = this.books[index];
    this.bookService.deleteBook(book.id).subscribe(
      response => {
        this.books.splice(index, 1);
        this.books = [...this.books];
        this.utilsService.showAlertMessage('Livro excluido com sucesso!');
      },
      error => {
        this.utilsService.showAlertMessage('Não foi possível excluir o livro');
      }
    );
  }

  setBookAsRead(index: number): void {
    const book = this.books[index];
    book.insertDate = null;
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
