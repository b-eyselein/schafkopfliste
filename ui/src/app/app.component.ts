import {Component} from '@angular/core';
import {AuthenticationService} from './_services/authentication.service';
import {LoggedInUserFragment} from './_services/apollo_services';

@Component({
  selector: 'skl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  title = 'schafkopf';

  currentUser: LoggedInUserFragment;

  navbarToggled = false;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe((u) => this.currentUser = u);
  }

  logout() {
    this.authenticationService.logout();
  }

}
