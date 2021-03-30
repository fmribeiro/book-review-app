import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-following-users',
  templateUrl: './following-users.component.html',
  styleUrls: ['./following-users.component.css']
})
export class FollowingUsersComponent implements OnInit {

  @Input() users: User[] = [];

  constructor() { }

  ngOnInit() {
  }

}
