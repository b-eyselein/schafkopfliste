import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Credentials, LoggedInUserFragment, LoginGQL} from './apollo_services';

const currentUserField = 'currentUser';

export function getCurrentUser(): LoggedInUserFragment | undefined {
  const json: string | null = localStorage.getItem(currentUserField);

  return json ? JSON.parse(json) : null;
}


@Injectable({providedIn: 'root'})
export class AuthenticationService {

  readonly baseUrl = '/api';

  private currentUserSubject: BehaviorSubject<LoggedInUserFragment>;
  public currentUser: Observable<LoggedInUserFragment>;

  constructor(private router: Router, private loginGQL: LoginGQL) {
    this.currentUserSubject = new BehaviorSubject<LoggedInUserFragment>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoggedInUserFragment {
    return this.currentUserSubject.value;
  }

  private activateLogin(user: LoggedInUserFragment): void {
    localStorage.setItem(currentUserField, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(credentials: Credentials) {
    return this.loginGQL.mutate({credentials})
      .pipe(tap(({data}) => {
          if (data.login) {
            this.activateLogin(data.login);
          }
        }
      ));
  }

  logout() {
    localStorage.removeItem(currentUserField);
    this.currentUserSubject.next(null);

    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/loginForm']);
  }
}
