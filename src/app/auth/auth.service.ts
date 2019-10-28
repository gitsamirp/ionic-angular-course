import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string; // A Firebase Auth ID token for the authenticated user.
  email: string; // The email for the authenticated user.
  refreshToken: string; // A Firebase Auth refresh token for the authenticated user.
  expiresIn: string; // The number of seconds in which the ID token expires.
  localId: string; // The uid of the authenticated user.
  registered?: boolean; // Whether the email is for an existing account.

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token;
      } else {
        return false;
      }
    })); 
  }

  constructor(private http: HttpClient) { }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      } else {
        return false;
      }
    }
    ));
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    this._user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime));
  }
}
