import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {UserWithToken} from '../_interfaces/interfaces';

@Component({templateUrl: './index.component.html'})
export class IndexComponent implements OnInit {

  currentUser: UserWithToken;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((u) => this.currentUser = u);
  }

}
