import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {LoggedInUserFragment} from '../_services/apollo_services';

@Component({templateUrl: './index.component.html'})
export class IndexComponent implements OnInit {

  currentUser: LoggedInUserFragment;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((u) => this.currentUser = u);
  }

}
