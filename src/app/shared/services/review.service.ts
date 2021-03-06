import { HttpClient } from '@angular/common/http';
import { UserService } from './users.service';
import { Injectable, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Review } from '../models/review.model';
import { PlaceHolderDirective } from '../placeholder/placeholder.directive';
import { UtilsService } from './utils.service';

@Injectable({ providedIn: 'root' })
export class ReviewService {

  private reviews: Review[] = [];
  @ViewChild(PlaceHolderDirective, { static: false }) alertHost: PlaceHolderDirective;

  getReviews(): Review[]{
    console.log('getReviews');
    return this.reviews.slice();
  }

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    private userService: UserService) {
  }

  mountReview(review: any): Review {
    return {
      id: review.id,
      review: review.review,
      insertDate: this.utilsService.convertObjetIdToDate(review.id),
      bookTitle: review.bookTitle,
      favorites: review.likes,
      nickname: review.user ? review.user.nickname : null,
      userId: review.user ? review.user.id : null
    };
  }

  mountFavoriteReview(review: any): Review {
    return {
      id: review.review.id,
      review: review.review.review,
      insertDate: this.utilsService.convertObjetIdToDate(review.id),
      bookTitle: review.review.bookTitle,
      favorites: review.review.likes,
      nickname: review.user ? review.user.nickname : null,
      userId: review.user ? review.user.id : null
    };
  }

  getFollowUsersReviews() {
    const usersFollow = [];
    this.reviews = [];
    this.userService.mountFollowUsersProfile(this.utilsService.getLoggedUserId())
    .subscribe(
      users => {
        users.map(user => {
          user.reviews.map(review => {
            review.nickname = user.nickname;
            this.reviews.push(review);
          });
        });
      }
    );
  }

  fetchFavoritesReviews(): Observable<Review[]> {
    const url = this.utilsService.getApiURL() + "/reviews/favorites";
    return this.http
      .get<Review[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(reviews => {
          return reviews.map(review => {
            return this.mountReview(review);
          });
        }),
        tap(reviews => {
          this.reviews = reviews;
        })
      );
  }

  fetchRecentReviews(): Observable<Review[]> {
    const url = this.utilsService.getApiURL() + "/reviews";
    return this.http
      .get<Review[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(reviews => {
          return reviews.map(review => {
            return this.mountReview(review);
          });
        }),
        tap(reviews => {
          this.reviews = reviews;
        })
      );
  }

  fetchUserFavoritesReviews(): Observable<Review[]> {
    const url = this.utilsService.getApiURL() + '/liked-reviews/user/' + this.utilsService.getLoggedUserId();
    return this.http
      .get<any[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(reviews => {
          return reviews.map(review => {
            return this.mountFavoriteReview(review);
          });
        }),
        tap(reviews => {
          this.reviews = reviews;
        })
      );
  }

  fetchUserReviews(): Observable<Review[]> {
    const url = this.utilsService.getApiURL() + '/reviews/user/' + this.utilsService.getLoggedUserId();
    return this.http
      .get<any[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(reviews => {
          return reviews.map(review => {
            return this.mountReview(review);
          });
        }),
        tap(reviews => {
          this.reviews = reviews;
        })
      );
  }

  searchReviewsByBookTitle(bookTitle: string): Observable<Review[]> {
    const url = this.utilsService.getApiURL() + '/reviews/book/' + bookTitle;
    return this.http
      .get<any>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(reviews => {
          return reviews._embedded.reviews.map(review => {
            return this.mountReview(review);
          });
        }),
        tap(reviews => {
          this.reviews = reviews;
        })
      );
  }

  addReviewToFavorites(likedReview: any): any {
    const url = this.utilsService.getApiURL() + '/liked-reviews';
    return this.http.post(url, likedReview)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  createNewReview(review: any): Observable<Review> {
    const url = this.utilsService.getApiURL() + '/reviews';
    return this.http
      .post(
        url,
        review
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(res => {
          return this.mountReview(res);
        })
      );
  }

  updateReview(review: any): Observable<Review> {
    const url = this.utilsService.getApiURL() + '/reviews';
    return this.http
      .put(
        url,
        review
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(res => {
          return this.mountReview(res);
        })
      );
  }


  deleteReview(reviewId: string) {
    const url = this.utilsService.getApiURL() + '/reviews/' + reviewId;
    this.http.delete(url)
      .subscribe(response => {
      });
  }



}
