import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {NewPlayerFormComponent} from './new-player-form/new-player-form.component';
import {SessionComponent} from './session/session.component';
import {PlayerListComponent} from "./player-list/player-list.component";
import {LoginFormComponent} from "./login-form/login-form.component";
import {AuthGuard} from "./_helpers/auth-guard";


const routes: Routes = [
  {path: '', component: IndexComponent, canActivate: [AuthGuard]},
  {path: 'loginForm', component: LoginFormComponent},
  {path: 'players', component: PlayerListComponent, canActivate: [AuthGuard]},
  {path: 'newPlayerForm', component: NewPlayerFormComponent, canActivate: [AuthGuard]},
  {path: 'sessions/:sessionUuid', component: SessionComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
