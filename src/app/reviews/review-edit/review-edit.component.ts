import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Review } from '../../shared/models/review.model';
import { BookService } from '../../shared/services/book.service';
import { ReviewService } from '../../shared/services/review.service';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-review-edit',
  templateUrl: './review-edit.component.html',
  styleUrls: ['./review-edit.component.css']
})

export class ReviewEditComponent implements OnInit {

  editedReview: Review = {
    id: '',
    review: '',
    insertDate: '',
    bookTitle: '',
    likes: 0
  };
  startEditing = false;
  allBooksRead: string[];
  filteredOptions: Observable<string[]>;

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private bookService: BookService) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id !== undefined) {
        const index = params.id;
        this.editedReview = this.reviewService.getReviews()[index];
        this.startEditing = !this.startEditing;
      }
    });

    this.getReadBooks();
  }

  getReadBooks(): void {
    this.bookService.getUserReadBooksTitles().subscribe(titles => {
      this.allBooksRead = titles;
    });
  }

  createReview(reviewForm: NgForm): void {
    if (!reviewForm.valid) {
      return;
    }

    const review = {
      review: reviewForm.value.review,
      bookTitle: reviewForm.value.bookTitle,
      userId: this.utilsService.getLoggedUserId()
    };

    this.reviewService.createNewReview(review).subscribe(
      response => {
        this.utilsService.showAlertMessage('Resenha incluída com sucesso!');
        this.router.navigate(['/user/reviews/mine']);
      },
      error => {
        this.utilsService.showAlertMessage('Já existe uma resenha adicionada para esse livro!');
      }
    );
  }

  updateReview(reviewForm: NgForm): void {
    if (!reviewForm.valid) {
      return;
    }

    const review = {
      id: this.editedReview.id,
      review: reviewForm.value.review,
      bookTitle: reviewForm.value.bookTitle,
      userId: this.utilsService.getLoggedUserId()
    };

    this.reviewService.updateReview(review).subscribe(
      response => {
        this.utilsService.showAlertMessage('Resenha atualizada com sucesso!');
        this.router.navigate(['/user/reviews/mine']);
      },
      error => {
        this.utilsService.showAlertMessage('Ocorreu um erro ao atualizar a resenha!');
      }
    );
  }

}
