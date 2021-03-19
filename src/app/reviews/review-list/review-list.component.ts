import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Review } from 'src/app/shared/models/review.model';
import { ReviewService } from '../../shared/services/review.service';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
    selector: 'app-review-list',
    templateUrl: 'review-list.component.html',
    styleUrls: ['review-list.component.css']
})
export class ReviewListComponent {

  @Input() reviews: Review[] = [];
  @Input() isBookFound = false;
  @Input() canEditReview = false;


}
