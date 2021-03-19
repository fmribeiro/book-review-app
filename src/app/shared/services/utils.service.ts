import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../auth/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UtilsService {

  private isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router) {

    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getLoggedUserId(): string {
    if (localStorage.loggedUser) {
      return JSON.parse(localStorage.loggedUser).id;
    }
  }

  getLoggedUser(): User {
    if (localStorage.loggedUser) {
      return JSON.parse(localStorage.loggedUser);
    }
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  showAlertMessage(message: string): void {
    this.snackBar.open(message, null, {
      duration: 5000
    });
  }

  async showAlertMessageAndRedirect(message: string, path: string): Promise<void> {
    this.showAlertMessage(message);
    await this.delay(500);
    this.router.navigate([path]);
  }

  convertObjetIdToDate(objectId: string): string{
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000).toString();
  }

  getApiURL(): string{
    return environment.apiUrl;
  }

  public handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error ocurred';
    if (errorRes.status) {
      switch (errorRes.status) {
        case 400:
          errorMessage = 'Nao foi possivel atualizar o registro';
        case 401:
            errorMessage = 'Acesso nao autorizado, credenciais invalidas';
          break;
        case 404:
          errorMessage = 'Nao foram encontrados registros para a pesquisa';
          break;
        case 409:
          errorMessage = 'Ja existe um registro salvo com esses dados';
          break;
      }
    }
    return throwError(errorMessage);
  }


}
