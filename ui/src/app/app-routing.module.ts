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
import {RegisterFormComponent} from './_forms/register-form/register-form.component';


export const routingComponents = [
  IndexComponent,
  RegisterFormComponent,
  LoginFormComponent,
  RuleSetListComponent,
  PlayerListComponent,
  GroupListComponent,
  GroupComponent,
  PlayersInGroupComponent,
  NewSessionComponent,
  SessionComponent,
  UploadSpreadsheetComponent
];

const routes: Routes = [
  {path: '', component: IndexComponent},

  {path: 'registerForm', component: RegisterFormComponent},
  {path: 'loginForm', component: LoginFormComponent},

  {path: 'ruleSets', component: RuleSetListComponent},
  {path: 'players', component: PlayerListComponent, canActivate: [AuthGuard]},
  {path: 'groups', component: GroupListComponent},
  {path: 'groups/:groupId', component: GroupComponent},
  {path: 'groups/:groupId/players', component: PlayersInGroupComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupId/newSession', component: NewSessionComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupId/sessions/:serialNumber', component: SessionComponent},

  {path: 'groups/:groupId/uploadSpreadsheet', component: UploadSpreadsheetComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
