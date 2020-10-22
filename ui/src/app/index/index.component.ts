import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {UserWithToken} from '../_interfaces/interfaces';

@Component({
  template: `
    <div class="container">

      <h1 class="title is-3 has-text-centered">SchafkopfListe</h1>

      <div class="buttons">
        <a class="button is-link is-fullwidth" routerLink="./groups">Zu den Gruppen</a>
        <a class="button is-link is-fullwidth" routerLink="./players" *ngIf="currentUser">Zu den Spielern</a>
        <a class="button is-link is-fullwidth" routerLink="./ruleSets">Zu den Regelsätzen</a>
      </div>

    </div>
  `
})
export class IndexComponent implements OnInit {

  currentUser: UserWithToken;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((u) => this.currentUser = u);
  }

}
