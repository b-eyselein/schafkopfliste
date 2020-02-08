import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Credentials, User} from "../_interfaces/user";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  readonly baseUrl = environment.serverUrl;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  private activateLogin(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(credentials: Credentials) {
    const url = `${this.baseUrl}/api/users/authentication`;

    return this.http.put<User>(url, credentials)
      .pipe(tap((user) => this.activateLogin(user)));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/loginForm']);
  }
}

