import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthComponent } from './auth/auth.component';
import { BookSearchComponent } from './books/book-search/book-search.component';
import { BooksComponent } from './books/books.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material-module';
import { MenuComponent } from './menu/menu.component';
import { MessagesComponent } from './profile/messages/messages.component';
import { MessageSenderComponent } from './profile/messages/message-sender/message-sender.component';
import { MessageViewerComponent } from './profile/messages/message-viewer/message-viewer.component';
import { FollowingUsersComponent } from './profile/users/following-users/following-users.component';
import { UserProfileComponent } from './profile/users/user-profile/user-profile.component';
import { UsersComponent } from './profile/users/users.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewDetailsComponent } from './reviews/review-details/review-details.component';
import { SearchComponent } from './search/search.component';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { PlaceHolderDirective } from './shared/placeholder/placeholder.directive';
import { ReviewEditComponent } from 'src/app/reviews/review-edit/review-edit.component';
import { ReviewListComponent } from 'src/app/reviews/review-list/review-list.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ReviewsComponent,
    BooksComponent,
    SearchComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MessagesComponent,
    UsersComponent,
    AuthComponent,
    PlaceHolderDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    ReviewEditComponent,
    BookSearchComponent,
    MessageSenderComponent,
    ReviewDetailsComponent,
    UserProfileComponent,
    FollowingUsersComponent,
    MessageViewerComponent,
    ReviewListComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatCardModule,
    HttpClientModule,
    AppRoutingModule,
    MatPasswordStrengthModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'pt',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AlertComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
