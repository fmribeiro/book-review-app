import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Review } from '../shared/models/review.model';
import { ReviewService } from '../shared/services/review.service';
import { UserService } from '../shared/services/users.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  review: Review;
  @Input() reviews: Review[] = [];
  isAuthenticated = false;
  isReviewFound = false;
  canEditReview = false;
  user = null;
  bookTitleSearch = '';
  isLoading = false;
  startReviewSearch = false;

  delay = async (ms: number) => new Promise(res => setTimeout(res, ms));

  constructor(
    private reviewService: ReviewService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    private userService: UserService
  ) {
    this.activatedRoute.url.subscribe(params => {
      this.solveRoutes(params[0].path);
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.bookTitle !== undefined) {
        this.searchReview();
      }
      if (params.user !== undefined) {
        this.user = params.user;
      }
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.utilsService.isUserAuthenticated();
  }

  solveRoutes(route: string): void {
    switch (route) {
      case 'recent': {
        this.getRecentReviews();
        break;
      }
      case 'liked': {
        this.getFavoritesReviews();
        break;
      }
      case 'favorites': {
        this.getUserFavoritesReviews();
        break;
      }
      case 'mine': {
        this.getUserReviews();
        break;
      }
      case 'following': {
        this.getFollowUsersReviews();
        break;
      }
    }
  }

  getRecentReviews(): void {
    this.reviewService.fetchRecentReviews().subscribe(
      response => {
        this.reviews = response;
      },
      error => {
        this.reviews = [];
      }
    );
  }

  getFavoritesReviews(): void {
    this.reviewService.fetchFavoritesReviews().subscribe(
      response => {
        this.reviews = response;
      },
      error => {
        this.reviews = [];
      }
    );
  }

  getUserFavoritesReviews(): void {
    this.reviewService.fetchUserFavoritesReviews().subscribe(
      response => {
        this.reviews = response;
      },
      error => {
        this.reviews = [];
      }
    );
  }

  getUserReviews(): void {
    this.canEditReview = false;
    this.reviewService.fetchUserReviews().subscribe(
      response => {
        this.reviews = response;
        this.canEditReview = !this.canEditReview;
      },
      error => {
        this.reviews = [];
      }
    );
  }

  searchReview(): void {
    this.bookTitleSearch = this.activatedRoute.snapshot.queryParams.bookTitle;
    this.isLoading = true;
    this.startReviewSearch = true;
    this.reviewService.searchReviewsByBookTitle(this.bookTitleSearch).subscribe(
      response => {
        this.isReviewFound = true;
        this.reviews = response;
        this.isLoading = false;
      },
      error => {
        this.isReviewFound = false;
        this.isLoading = false;
        this.reviews = [];
      }
    );
  }

  addReviewToFavorites(index: number): void {
    const likedReview = {
      reviewId: this.reviews[index].id,
      userId: this.utilsService.getLoggedUserId()
    };

    this.reviewService.addReviewToFavorites(likedReview).subscribe(
      response => {
        this.reviews[index].favorites += 1;
      },
      error => {
        this.reviews[index].favorites -= 1;
      }
    );
  }

  editReview(index: number): void {
    this.router.navigate(['/user/reviews/edit/'], { queryParams: { id: index } });
  }

  deleteReview(index: number): void {
    const editReview = this.reviews[index];
    this.reviewService.deleteReview(editReview.id);
    this.reviews.splice(index, 1);
  }

  seeReview(index: number): void {
    this.review = this.reviews[index];
    this.router.navigate(['/reviews/details'], { state: { review: this.review } });
    this.user = null;
  }

  getFollowUsersReviews() {
    this.userService
      .mountFollowUsersProfile(this.utilsService.getLoggedUserId())
      .subscribe(users => {
        users.map(user => {
          user.reviews.map(review => {
            review.nickname = user.nickname;
            this.reviews.push(review);
          });
        });
      });
  }
}
