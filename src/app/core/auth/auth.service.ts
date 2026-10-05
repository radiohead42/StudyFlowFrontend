import { HttpClient } from '@angular/common/http';
import { Service } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class Auth {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  register(email: string, password: string){
    return this.http.post(
      `${this.apiUrl}/register`,
      { email,
        password
      }
    );
  }

  login(email: string, password: string){

    return this.http.post<
    {
      tokenType: string;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }
    >(`${this.apiUrl}/login?useCookies=false`,
      {email, password}
     ).pipe(
     tap(response => {
       sessionStorage.setItem(
         'studyflow_access_token',
         response.accessToken
       );
       sessionStorage.setItem(
         'studyflow_refresh_token',
         response.refreshToken
       );

       const expiresAt = Date.now() + response.expiresIn * 1000;

       sessionStorage.setItem(
         'studyflow_expires_at',
         expiresAt.toString()
       );
     })
     );
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('studyflow_access_token') !== null;
  }

  logout(): void {
    sessionStorage.removeItem('studyflow_access_token');
    sessionStorage.removeItem('studyflow_refresh_token');
    sessionStorage.removeItem('studyflow_expires_at');
  }

  refreshToken() {
    const refreshToken = sessionStorage.getItem('studyflow_refresh_token');

    if (!refreshToken) {
      return throwError( () => new Error('No existe refresh token'));
    }

    return this.http.post<{
      tokenType: string;
      accessToken: string;
      expiresIn: number;
      refreshToken: string;
    }>(`${this.apiUrl}/refresh`, { refreshToken })
    .pipe(tap( response => {
      sessionStorage.setItem('studyflow_access_token', response.accessToken);
      sessionStorage.setItem('studyflow_refresh_token', response.refreshToken);

      const expiresAt = Date.now() + response.expiresIn * 1000;

      sessionStorage.setItem('studyflow_expires_at', expiresAt.toString());
      console.log('Token renovado exitosamente:', response);
    })

         );
  }

  isAccessTokenExpired(): boolean {
    const expiresAt = sessionStorage.getItem('studyflow_expires_at');

    if (!expiresAt) {
      return true;
    }

    return Date.now() >= Number(expiresAt);
  }

}


