import {Component} from '@angular/core';
import {AuthenticationService} from './_services/authentication.service';
import {UserWithToken} from './_interfaces/interfaces';

@Component({
  selector: 'skl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  title = 'schafkopf';

  currentUser: UserWithToken;

  navbarToggled = false;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe((u) => this.currentUser = u);
  }

  logout() {
    this.authenticationService.logout();
  }

}
