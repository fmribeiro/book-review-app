import { Component, Input, OnInit } from '@angular/core';

import { Review } from '../../shared/models/review.model';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css']
})
export class ReviewDetailsComponent implements OnInit {
  @Input() review: Review;

  constructor(
  ) {
  }

  ngOnInit(): void {
    const historyState = window.history.state;
    this.getDataFromHistory(historyState);
  }

  getDataFromHistory(state: any): void {
    if (state.review) {
      this.review = state.review;
    }
  }

}
