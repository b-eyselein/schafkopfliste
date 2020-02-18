import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {SessionComponent} from './session/session.component';
import {PlayerListComponent} from './player-list/player-list.component';
import {LoginFormComponent} from './_forms/login-form/login-form.component';
import {AuthGuard} from './_helpers/auth-guard';
import {GroupListComponent} from './group-list/group-list.component';
import {GroupComponent} from './group/group.component';
import {RuleSetListComponent} from './rule-set-list/rule-set-list.component';
import {NewSessionComponent} from './new-session/new-session.component';
import {PlayersInGroupComponent} from './players-in-group/players-in-group.component';
import {UploadSpreadsheetComponent} from './upload-spreadsheet/upload-spreadsheet.component';
import {SessionListComponent} from './session-list/session-list.component';


export const routingComponents = [
  IndexComponent,
  LoginFormComponent,
  RuleSetListComponent,
  PlayerListComponent,
  GroupListComponent,
  GroupComponent,
  GroupListComponent,
  PlayersInGroupComponent,
  NewSessionComponent,
  SessionComponent
];

const routes: Routes = [
  {path: '', component: IndexComponent, canActivate: [AuthGuard]},
  {path: 'loginForm', component: LoginFormComponent},
  {path: 'ruleSets', component: RuleSetListComponent, canActivate: [AuthGuard]},
  {path: 'players', component: PlayerListComponent, canActivate: [AuthGuard]},
  {path: 'groups', component: GroupListComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupId', component: GroupComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupId/players', component: PlayersInGroupComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupId/newSession', component: NewSessionComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupId/sessions', component: SessionListComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupId/sessions/:serialNumber', component: SessionComponent, canActivate: [AuthGuard]},

  {path: 'groups/:groupId/uploadSpreadsheet', component: UploadSpreadsheetComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
