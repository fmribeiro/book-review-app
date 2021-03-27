import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Review } from '../shared/models/review.model';
import { ReviewService } from '../shared/services/review.service';
import { UserService } from '../shared/services/users.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
})
export class ReviewsComponent implements OnInit, AfterViewInit {

  review: Review;
  @Input() reviews: Review[] = [];
  isAuthenticated = false;
  isReviewFound = false;
  canEditReview = false;
  user = null;
  bookTitleSearch = '';
  isLoading = false;
  startReviewSearch = false;
  currentPath = '';
  isLastPage = false;
  currentPage = 0;
  totalPages = 0;
  isPageable = false;
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  public virtualScroll?: CdkVirtualScrollViewport;

  delay = async (ms: number) => new Promise(res => setTimeout(res, ms));

  constructor(
    private reviewService: ReviewService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    private userService: UserService
  ) {

    this.activatedRoute.url.subscribe(params => {
      this.currentPath = params[0].path;
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

  ngAfterViewInit(): void {
    this.virtualScroll.elementRef.nativeElement.onscroll = (e) => { this.onScroll(); };
  }

  onScroll(): void {
    const scrollOffset = Math.round(this.virtualScroll.measureScrollOffset('bottom'));
    const isLastPage = this.currentPage >= this.totalPages - 1;

    if (this.isPageable && scrollOffset < 5 && !isLastPage) {
      this.currentPage = this.currentPage + 1;
      this.solveRoutes(this.currentPath);
    }
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

  getRecentReviews(size: number = 10): void {
    this.isLoading = true;
    this.isPageable = true;
    this.reviewService.fetchRecentReviews(this.currentPage, size).subscribe(
      response => {
        this.isLoading = false;
        this.reviews = this.reviews.concat(response.items);
        this.totalPages = response.totalPages;
      },
      error => {
        this.isLoading = false;
        this.isLastPage = true;
        this.reviews = [];
      }
    );
  }

  getFavoritesReviews(size: number = 10): void {
    this.isLoading = true;
    this.isPageable = true;
    this.reviewService.fetchFavoritesReviews(this.currentPage, size).subscribe(
      response => {
        this.isLoading = false;
        this.reviews = this.reviews.concat(response.items);
        this.totalPages = response.totalPages;
      },
      error => {
        this.isLoading = false;
        this.isLastPage = true;
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
