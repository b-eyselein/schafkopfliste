import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {AuthenticationService} from '../_services/authentication.service';
import {
  GameInput,
  LoggedInUserFragment,
  SessionFragment,
  SessionGameFragment,
  SessionGQL
} from '../_services/apollo_services';
import {GraphQLError} from 'graphql';

@Component({templateUrl: './session.component.html'})
export class SessionComponent implements OnInit {

  readonly playerIndexes = [0, 1, 2, 3];

  groupName: string;
  sessionId: number;

  currentUser: LoggedInUserFragment;

  session: SessionFragment;
  queryError: GraphQLError;

  game: GameInput;

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

    this.route.paramMap.subscribe((paramMap) => {
      this.groupName = paramMap.get('groupName');
      this.sessionId = parseInt(paramMap.get('sessionId'), 10);

      this.sessionGQL.watch({groupName: this.groupName, sessionId: this.sessionId})
        .valueChanges
        .subscribe(
          ({data}) => {
            this.queryError = null;
            this.session = data.session;
          },
          (error) => {
            this.queryError = error;
            this.session = null;
            console.error(error);
          });
    });
  }

  updateGame(game: GameInput) {
    this.game = game;
  }

  addGame(game: SessionGameFragment): void {
    this.session.games.push(game);
  }

  endSession(): void {
    if (confirm('Wollen Sie die Sitzung wirklich beenden?\nAchtung: Sie können danach keine weiteren Spiele mehr eintragen!')) {
      this.apiService.endSession(this.groupName, this.sessionId)
        .subscribe((ended) => this.session.hasEnded = ended);
    }
  }

  renderDate(): string {
    // TODO!
    return this.session.date;
    /*
    return this.session.dateDayOfMonth.toString().padStart(2, '0') + '.'
      + this.session.dateMonth.toString().padStart(2, '0') + '.'
      + this.session.dateYear.toString().padStart(4, '0');

     */
  }

  renderTime(): string {
    // TODO!
    return this.session.date;
    /*
    return this.session.timeHours.toString().padStart(2, '0') + ':'
      + this.session.timeMinutes.toString().padStart(2, '0');
     */
  }

}
