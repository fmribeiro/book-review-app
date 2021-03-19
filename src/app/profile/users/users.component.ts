import { UtilsService } from './../../shared/services/utils.service';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @Input() users: User[];
  isAuthenticated = false;
  canFollow = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService) {

      this.activatedRoute.url.subscribe(params => {
        this.solveRoutes(params[0].path);
      });
    }

    ngOnInit(): void {
      this.isAuthenticated = this.utilsService.isUserAuthenticated();
    }

    solveRoutes(route: string): void {
      switch (route) {
        case 'users': {
          this.getUsers();
          break;
        }
        case 'following': {
          this.getFollowingUsers();
          break;
        }
      }
    }

    getUsers(): void {
      this.canFollow = true;
      const loggedUser = this.userService.getCurrentUser();

      this.userService.fetchUsers().subscribe(
        response => {
          this.users = response;
          this.users.forEach((user, position) => {
            if(loggedUser){
              if (user.id === loggedUser.id) {
                this.users.splice(position, 1);
              }

              const following = loggedUser.following.find(id => id === user.id);
              if(following){
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
      this.utilsService.showAlertMessage('Removido com sucesso!');
    }


  }
