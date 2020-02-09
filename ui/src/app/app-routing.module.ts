import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {CreatePlayerComponent} from './_forms/create-player/create-player.component';
import {SessionComponent} from './session/session.component';
import {PlayerListComponent} from "./player-list/player-list.component";
import {LoginFormComponent} from "./_forms/login-form/login-form.component";
import {AuthGuard} from "./_helpers/auth-guard";
import {GroupsComponent} from "./groups/groups.component";
import {CreateGroupComponent} from "./_forms/create-group/create-group.component";
import {GroupComponent} from "./group/group.component";


const routes: Routes = [
  {path: '', component: IndexComponent, canActivate: [AuthGuard]},
  {path: 'loginForm', component: LoginFormComponent},
  {path: 'groups', component: GroupsComponent, canActivate: [AuthGuard]},
  {path: 'groups/createForm', component: CreateGroupComponent, canActivate: [AuthGuard]},
  {path: 'groups/:groupId', component: GroupComponent, canActivate: [AuthGuard]},
  {path: 'players', component: PlayerListComponent, canActivate: [AuthGuard]},
  {path: 'newPlayerForm', component: CreatePlayerComponent, canActivate: [AuthGuard]},
  {path: 'sessions/:sessionUuid', component: SessionComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
