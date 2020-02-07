import {Component} from '@angular/core';
import {AuthenticationService} from "./_services/authentication.service";
import {User} from "./_interfaces/model";

@Component({
  selector: 'sk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  title = 'schafkopf';

  currentUser: User;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe((u) => this.currentUser = u);
  }

  logout() {
    this.authenticationService.logout();
  }

}
