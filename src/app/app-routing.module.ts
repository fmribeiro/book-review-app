import { NgModule } from '@angular/core';
import { ReviewEditComponent } from 'src/app/reviews/review-edit/review-edit.component';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { BookSearchComponent } from './books/book-search/book-search.component';
import { BooksComponent } from './books/books.component';
import { MessagesComponent } from './profile/messages/messages.component';
import { UserProfileComponent } from './profile/users/user-profile/user-profile.component';
import { UsersComponent } from './profile/users/users.component';

import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewDetailsComponent } from './reviews/review-details/review-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/reviews/recent', pathMatch: 'full' },
  {
    path: 'users',
    data: { breadcrumb: '' },
    children: [
      {
        path: 'home',
        component: UsersComponent,
        data: { breadcrumb: 'Leitores' },
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        data: { breadcrumb: 'Perfil leitor' }
      }
    ]
  },
  {
    path: 'reviews',
    data: { breadcrumb: '' },
    children: [
      {
        path: 'recent',
        component: ReviewsComponent,
        data: { breadcrumb: 'Resenhas recentes' }
      },
      {
        path: 'liked',
        component: ReviewsComponent,
        data: { breadcrumb: 'Resenhas mais curtidas' }
      },
      {
        path: 'search',
        component: ReviewsComponent
      },
      {
        path: 'details',
        component: ReviewDetailsComponent,
        data: { breadcrumb: 'Visualizar resenha' }
      }
    ]
  },
  {
    path: 'books',
    children: [
      {
        path: 'recent',
        component: BooksComponent,
        data: { breadcrumb: 'Livros recém lidos' }
      }
    ]
  },
  {
    path: 'user/reviews',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'favorites',
        component: ReviewsComponent,
        data: { breadcrumb: 'Minhas resenhas favoritas' }
      },
      {
        path: 'mine',
        component: ReviewsComponent,
        data: { breadcrumb: 'Minhas resenhas' }
      },
      {
        path: 'following',
        component: ReviewsComponent,
        data: { breadcrumb: 'Resenhas de quem eu sigo' }
      },
      {
        path: 'edit',
        component: ReviewEditComponent,
        data: { breadcrumb: 'Editar resenha' },
        canActivate: [AuthGuard]
      },
      {
        path: 'create',
        component: ReviewEditComponent,
        data: { breadcrumb: 'Criar resenha' },
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'following',
        component: UsersComponent,
        data: { breadcrumb: 'Leitores que eu sigo' }
      },
      {
        path: 'messages',
        component: MessagesComponent,
        data: { breadcrumb: 'Mensagens' }
      }
    ]
  },
  {
    path: 'user/books',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'read',
        component: BooksComponent,
        data: { breadcrumb: 'Livros que li' }
      },
      {
        path: 'wishlist',
        component: BooksComponent,
        data: { breadcrumb: 'Livros que desejo ler' }
      },
      {
        path: 'create',
        component: BookSearchComponent,
        data: { breadcrumb: 'Adicionar livro' },
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'auth',
    component: AuthComponent,
    data: { breadcrumb: 'Autenticação' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
