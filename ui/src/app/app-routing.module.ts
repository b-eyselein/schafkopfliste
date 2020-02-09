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


export const routingComponents = [
  IndexComponent, LoginFormComponent, GroupComponent, GroupListComponent, PlayerListComponent, SessionComponent
];

const routes: Routes = [
  {path: '', component: IndexComponent, canActivate: [AuthGuard]},
  {path: 'loginForm', component: LoginFormComponent},
  {path: 'groups', component: GroupListComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupId', component: GroupComponent, canActivate: [AuthGuard]},
  {path: 'ruleSets', component: RuleSetListComponent, canActivate: [AuthGuard]},
  {path: 'players', component: PlayerListComponent, canActivate: [AuthGuard]},
  {path: 'sessions/:sessionUuid', component: SessionComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
