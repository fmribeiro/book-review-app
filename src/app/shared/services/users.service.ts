import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { PageableSearch } from '../models/pageableSearch.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private users: User[] = [];
  private currentUser: User;

  constructor(private http: HttpClient, private utilsService: UtilsService) {
  }

  mountUser(user: any): any {
    return {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      idToken: user.idToken,
      insertDate: user.insertDate,
      following: user.following ? user.following : []
    };
  }

  mountUserFullProfile(user: any): any {
    return {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      idToken: user.idToken,
      booksRead: user.books.length,
      reviewsDone: user.reviews.length,
      users: user.usersFollowing.length,
      books: user.books,
      reviews: user.reviews,
      usersFollowing: user.usersFollowing
    };
  }

  mountPageableUser(response: any): PageableSearch<User> {
    const pageableSearch: PageableSearch<User> = new PageableSearch<User>();
    const users = response.users.map(user => {
      return this.mountUserFullProfile(user);
    });

    pageableSearch.currentPage = response.currentPage;
    pageableSearch.totalItems = response.totalItems;
    pageableSearch.totalReturned = response.totalReturned;
    pageableSearch.totalPages = response.totalPages;
    pageableSearch.items = users;
    return pageableSearch;
  }


  fetchUsers(page: number, size: number): Observable<PageableSearch<User>> {
    const url = this.utilsService.getApiURL() + `/users/page/${page}/size/${size}`;
    return this.http
      .get<any[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(response => {
          return this.mountPageableUser(response);
        }),
        tap(response => {
          this.users = response.items;
        })
      );
  }

  mountFollowUsersProfile(userId: string): Observable<User[]> {
    const url = this.utilsService.getApiURL() + '/users/following/' + userId;
    return this.http
      .get<any[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(users => {
          return users.map(user => {
            return this.mountUserFullProfile(user);
          });
        }),
        tap(users => {
          this.users = users;
        })
      );
  }

  mountUserProfile(userId: string): Observable<User[]> {
    const url = this.utilsService.getApiURL() + '/users/profile/' + userId;
    return this.http
      .get<any[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(users => {
          return users.map(user => {
            return this.mountUserFullProfile(user);
          });
        }),
        tap(users => {
          this.users = users;
        })
      );
  }

  createNewUser(user: any): void {
    const url = this.utilsService.getApiURL() + '/users';
    this.http.post<any>(
      url,
      user
    )
      .subscribe(response => {
        this.saveUserInfoLocally(response);
      });
  }

  updateUser(user: any): void {
    const url = this.utilsService.getApiURL() + '/users';
    this.http.put<any>(
      url,
      user
    )
      .subscribe(response => {
        this.saveUserInfoLocally(response);
      });
  }

  getCurrentUserById(): Observable<User> {
    const url = this.utilsService.getApiURL() + '/users/' + this.utilsService.getLoggedUserId();
    return this.http
      .get<any>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(user => {
          return this.mountUser(user);
        }),
        tap(user => {
          this.currentUser = user;
        })
      );
  }

  getCurrentUserByIdToken(idToken: string): Observable<User> {
    const url = this.utilsService.getApiURL() + '/users/idToken/' + idToken;
    return this.http
      .get<any>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(user => {
          return this.mountUser(user);
        }),
        tap(user => {
          this.saveUserInfoLocally(user);
          this.currentUser = user;
        })
      );
  }

  saveUserInfoLocally(user: any): void {
    const loggedUser = this.mountUser(user);
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
  }

  getUsers(): User[] {
    return this.users;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

}
