import { Component, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
@Injectable({ providedIn: 'root' })
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() inputSideNav: MatSidenav;
  isAuthenticated = false;
  private userSub: Subscription;
  currentPage = '';

  searchTerm: Observable<string>;
  searchField = new FormControl();

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const reviewSearch = this.searchField.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(searchTerm => searchTerm.length >= 5),
      // tap(searchTerm => console.log('Buscando a resenha: '+searchTerm)),
      switchMap(searchTerm => this.searchReviewsByBookTitleOnChange(searchTerm))
    );
    reviewSearch.subscribe();

    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.mountNavigationHeader(this.activatedRoute);
      });
    this.authService.autoLogin();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  mountNavigationHeader(activatedRoute: any) {
    if (activatedRoute.children[0]) {
      this.currentPage = this.activatedRoute.children[0].snapshot.data.breadcrumb;
    }
    if (activatedRoute.children[0].children[0]) {
      this.currentPage = this.activatedRoute.children[0].children[0].snapshot.data.breadcrumb;
    }
  }

  logout() {
    this.authService.logout();
  }

  async searchReviewsByBookTitleOnChange(bookTitle: string) {
    if (!bookTitle) {
      return;
    }
    this.router.navigate(['/reviews/search/'], { queryParams: { bookTitle } });
  }

  getLoggedUser(): User {
    if (localStorage.loggedUser) {
      return JSON.parse(localStorage.loggedUser);
    }
  }

  getUserFirstName() {
    if (localStorage.loggedUser) {
      const userName: string = JSON.parse(localStorage.loggedUser).name;
      return userName.split(' ')[0];
    }
  }
}
