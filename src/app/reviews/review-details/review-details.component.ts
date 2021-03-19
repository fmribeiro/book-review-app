import { Component, OnInit, Input, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Review } from "../../shared/models/review.model";
import { ReviewService } from "../../shared/services/review.service";
import { UserService } from "../../shared/services/users.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-review-details",
  templateUrl: "./review-details.component.html",
  styleUrls: ["./review-details.component.css"]
})
export class ReviewDetailsComponent implements OnInit {
  @Input() review: Review;

  constructor(
    private reviewService: ReviewService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: Review
  ) {
    this.review = data;
  }

  ngOnInit() {
  }
}
