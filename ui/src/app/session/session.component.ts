import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompleteSession, Game, UserWithToken} from '../_interfaces/interfaces';
import {ApiService} from '../_services/api.service';
import {AuthenticationService} from '../_services/authentication.service';
import {Subscription} from 'rxjs';
import {SessionGQL, SessionQuery} from '../_services/apollo.service';

@Component({templateUrl: './session.component.html'})
export class SessionComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  readonly playerIndexes = [0, 1, 2, 3];

  currentUser: UserWithToken;


  sessionQuery: SessionQuery;

  session: CompleteSession;

  game: Game;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private sessionGQL: SessionGQL,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.authenticationService.currentUser
      .subscribe((u) => this.currentUser = u);

    this.sub = this.route.paramMap.subscribe((paramMap) => {
      const groupId: number = parseInt(paramMap.get('groupId'), 10);
      const serialNumber: number = parseInt(paramMap.get('serialNumber'), 10);

      this.sessionGQL
        .watch({groupId, sessionId: serialNumber})
        .valueChanges
        .subscribe(({data}) => this.sessionQuery = data);

      this.apiService.getCompleteSession(groupId, serialNumber)
        .subscribe((session) => this.session = session);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  updateGame($event: Game) {
    this.game = {...$event};
  }

  endSession(): void {
    if (confirm('Wollen Sie die Sitzung wirklich beenden?\nAchtung: Sie können danach keine weiteren Spiele mehr eintragen!')) {
      this.apiService.endSession(this.session.group.id, this.session.id)
        .subscribe((ended) => this.session.hasEnded = ended);
    }
  }

  renderDate(): string {
    return this.session.dateDayOfMonth.toString().padStart(2, '0') + '.'
      + this.session.dateMonth.toString().padStart(2, '0') + '.'
      + this.session.dateYear.toString().padStart(4, '0');
  }

  renderTime(): string {
    return this.session.timeHours.toString().padStart(2, '0') + ':'
      + this.session.timeMinutes.toString().padStart(2, '0');
  }

}
