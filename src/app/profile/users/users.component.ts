import { UtilsService } from './../../shared/services/utils.service';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {

  @Input() users: User[] = [];
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  public virtualScroll?: CdkVirtualScrollViewport;
  isAuthenticated = false;
  canFollow = false;
  totalPages = 0;
  currentPage = 0;
  canEditBook = false;
  currentPath = '';
  isPageable = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService) {

    this.activatedRoute.url.subscribe(params => {
      this.currentPath = params[0].path;
      this.solveRoutes(params[0].path);
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.utilsService.isUserAuthenticated();
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

  solveRoutes(route: string): void {
    switch (route) {
      case 'home': {
        this.getUsers();
        break;
      }
      case 'following': {
        this.getFollowingUsers();
        break;
      }
    }
  }

  getUsers(size: number = 10): void {
    this.canFollow = true;
    this.isPageable = true;
    const loggedUser = this.userService.getCurrentUser();

    this.userService.fetchUsers(this.currentPage, size).subscribe(
      response => {
        this.users = this.users.concat(response.items);
        this.totalPages = response.totalPages;
        this.users.forEach((user, position) => {
          if (loggedUser) {
            if (user.id === loggedUser.id) {
              this.users.splice(position, 1);
            }

            const following = loggedUser.following.find(id => id === user.id);
            if (following) {
              user.isFollowingUser = true;
            }
          }
        });
      }
    );
  }

  getFollowingUsers(): void {
    this.canFollow = false;
    this.userService.mountFollowUsersProfile(this.utilsService.getLoggedUserId())
      .subscribe(
        response => {
          this.users = response;
        }
      );
  }

  followUser(index: number): void {
    const userToFollow = this.users[index];
    this.userService.getCurrentUserById().subscribe(
      user => {
        const loggedUser = user;
        loggedUser.following.push(userToFollow.id);
        this.userService.updateUser(loggedUser);
        this.utilsService.showAlertMessage('Adicionado com sucesso!');
      }
    );
  }

  async unfollowUser(index: number): Promise<void> {
    const userToUnfollow = this.users[index];
    let loggedUser;
    this.userService.getCurrentUserById().subscribe(
      user => {
        loggedUser = user;
      }
    );

    loggedUser.following.forEach((id, position) => {
      if (id === userToUnfollow.id) {
        loggedUser.following.splice(position, 1);
      }
    });
    this.userService.updateUser(loggedUser);
    this.users.splice(index, 1);
    this.users = [...this.users];
    this.utilsService.showAlertMessage('Removido com sucesso!');
  }


}
