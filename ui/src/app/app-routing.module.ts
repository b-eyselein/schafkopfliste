import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {NewPlayerFormComponent} from './new-player-form/new-player-form.component';
import {SessionComponent} from './session/session.component';
import {PlayerListComponent} from "./player-list/player-list.component";


const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'players', component: PlayerListComponent},
  {path: 'newPlayerForm', component: NewPlayerFormComponent},
  {path: 'sessions/:sessionUuid', component: SessionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
