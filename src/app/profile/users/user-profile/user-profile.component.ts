import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';

import { UserService } from '../../../shared/services/users.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  index = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.user !== undefined) {
        this.index = params.user;
        this.user = this.userService.getUsers()[this.index];
      }
      if (params.userId !== undefined) {
        this.mountUserProfile(params.userId);
      }
    });
  }


  ngOnInit() {

  }

  mountUserProfile(userId: string): void {
    this.userService.mountUserProfile(userId).subscribe(
      response => {
        this.user = response[0];
      }
    );
  }

}
