import { Injectable } from "@angular/core";
import { HttpClient, HttpBackend } from "@angular/common/http";
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';
import { Book } from "../models/book.model";

@Injectable({
  providedIn: "root"
})
export class GoogleBooksService {

  private books: Book[] = [];
  private http: HttpClient;

  constructor(handler: HttpBackend, private utilsService: UtilsService) {
    //adicionado para que nao seja interceptado
    //e adicione um token no header
    this.http = new HttpClient(handler);
  }

  fetchGoogleBooksAPI(bookTitle: string): Observable<Book[]> {
    return this.http
      .get<any>(
        'https://www.googleapis.com/books/v1/volumes?q=' + bookTitle
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(books => {
          return books.items.map(book => {
            return this.mountGoogleBooksAPIBook(book);
          });
        }),
        tap(books => {
          this.books = books;
        })
      );
  }

  mountGoogleBooksAPIBook(book: any): Book {
    const bookTitle = book.volumeInfo.title;
    const bookSubTitle = book.volumeInfo.subtitle ? book.volumeInfo.subtitle : '';

    return {
      id: null,
      authors: book.volumeInfo.authors ? book.volumeInfo.authors : null,
      description: book.volumeInfo.description,
      imagePath: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.smallThumbnail : null,
      pageCount: book.volumeInfo.pageCount,
      title: bookTitle + ' ' + bookSubTitle,
      publisher: book.volumeInfo.publisher,
    };
  }

}
