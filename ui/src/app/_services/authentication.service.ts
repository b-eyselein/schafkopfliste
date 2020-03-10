import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Credentials, UserWithToken} from '../_interfaces/interfaces';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  readonly baseUrl = '/api';

  private currentUserSubject: BehaviorSubject<UserWithToken>;
  public currentUser: Observable<UserWithToken>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UserWithToken>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserWithToken {
    return this.currentUserSubject.value;
  }

  private activateLogin(user: UserWithToken): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(credentials: Credentials) {
    const url = `${this.baseUrl}/users/authentication`;

    return this.http.put<UserWithToken>(url, credentials)
      .pipe(tap((user) => this.activateLogin(user)));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/loginForm']);
  }
}

