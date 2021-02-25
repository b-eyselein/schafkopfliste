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
import {RegisterFormComponent} from './_forms/register-form/register-form.component';
import {RuleSetComponent} from './rule-set/rule-set.component';
import {CreateRuleSetComponent} from './rule-set-form/create-rule-set.component';
import {CreateGroupComponent} from './_forms/create-group/create-group.component';
import {CreatePlayerComponent} from './_forms/create-player/create-player.component';

export const routingComponents = [
  IndexComponent,

  RegisterFormComponent,
  LoginFormComponent,

  RuleSetListComponent,
  CreateRuleSetComponent,
  RuleSetComponent,

  PlayerListComponent,
  CreatePlayerComponent,

  GroupListComponent,
  CreateGroupComponent,

  GroupComponent,
  PlayersInGroupComponent,
  NewSessionComponent,
  SessionComponent,
];

const routes: Routes = [
  {path: '', component: IndexComponent},

  {path: 'registerForm', component: RegisterFormComponent},
  {path: 'loginForm', component: LoginFormComponent},

  {path: 'ruleSets', component: RuleSetListComponent},
  {path: 'ruleSets/new', component: CreateRuleSetComponent},
  {path: 'ruleSets/:id', component: RuleSetComponent},

  {path: 'players', component: PlayerListComponent, canActivate: [AuthGuard]},
  {path: 'players/new', component: CreatePlayerComponent, canActivate: [AuthGuard]},

  {path: 'groups', component: GroupListComponent},
  {path: 'groups/new', component: CreateGroupComponent},

  {path: 'groups/:groupName', component: GroupComponent},
  {path: 'groups/:groupName/players', component: PlayersInGroupComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupName/newSession', component: NewSessionComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupName/sessions/:sessionId', component: SessionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
