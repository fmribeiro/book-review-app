import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Book } from "../models/book.model";
import { PageableSearch } from "../models/pageableSearch.model";
import { UtilsService } from "./utils.service";

@Injectable({ providedIn: "root" })
export class BookService {
  private books: Book[] = [];

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  mountBook(book: any): Book {
    return {
      id: book.id,
      authors: book.authors,
      description: book.description,
      imagePath: book.imagePath,
      pageCount: book.pageCount,
      title: book.title,
      nickname: book.user ? book.user.nickname : null,
      userId: book.userId,
      readStatus: book.readStatus,
      insertDate: this.utilsService.convertObjetIdToDate(book.id),
      publisher: book.publisher
    };
  }

  mountPageableBook(response: any): PageableSearch<Book> {
    const pageableSearch: PageableSearch<Book> = new PageableSearch<Book>();
    const books = response.books.map(book => {
      return this.mountBook(book);
    });

    pageableSearch.currentPage = response.currentPage;
    pageableSearch.totalItems = response.totalItems;
    pageableSearch.totalReturned = response.totalReturned;
    pageableSearch.totalPages = response.totalPages;
    pageableSearch.items = books;
    return pageableSearch;
  }

  fetchRecentBooks(page: number, size: number): Observable<PageableSearch<Book>> {
    const url = this.utilsService.getApiURL() + `/books/page/${page}/size/${size}`;
    return this.http.get<Book[]>(url).pipe(
      catchError(this.utilsService.handleError),
      map(response => {
        return this.mountPageableBook(response);
      }),
      tap(response => {
        this.books = response.items;
      })
    );
  }

  fetchReadBooks(): Observable<Book[]> {
    const url =
      this.utilsService.getApiURL() +
      `/books/user/${this.utilsService.getLoggedUserId()}/readStatus/lido`;
    return this.http.get<Book[]>(url).pipe(
      catchError(this.utilsService.handleError),
      map(books => {
        return books.map(book => {
          return this.mountBook(book);
        });
      }),
      tap(books => {
        this.books = books;
      })
    );
  }

  fetchBooksWishlist(): Observable<Book[]> {
    const url =
      this.utilsService.getApiURL() +
      `/books/user/${this.utilsService.getLoggedUserId()}/readStatus/lerei`;
    return this.http.get<Book[]>(url).pipe(
      catchError(this.utilsService.handleError),
      map(books => {
        return books.map(book => {
          return this.mountBook(book);
        });
      }),
      tap(books => {
        this.books = books;
      })
    );
  }

  createNewBook(book: Book): Observable<Book> {
    const url = this.utilsService.getApiURL() + "/books";
    return this.http.post(url, book).pipe(
      catchError(this.utilsService.handleError),
      map(savedBook => {
        return this.mountBook(savedBook);
      })
    );
  }

  updateBook(book: Book): Observable<Book> {
    const url = this.utilsService.getApiURL() + "/books";
    return this.http.put(url, book).pipe(
      catchError(this.utilsService.handleError),
      map(savedBook => {
        return this.mountBook(savedBook);
      })
    );
  }

  deleteBook(bookId: string): Observable<any> {
    const url = this.utilsService.getApiURL() + `/books/${bookId}`;
    return this.http.delete(url);
  }

  getUserReadBooksTitles(): Observable<string[]> {
    const url =
      this.utilsService.getApiURL() +
      `/books/user/${this.utilsService.getLoggedUserId()}/readStatus/lido`;
    return this.http.get<Book[]>(url).pipe(
      catchError(this.utilsService.handleError),
      map(books => {
        return books.map(book => {
          return book.title;
        });
      })
    );
  }
}
