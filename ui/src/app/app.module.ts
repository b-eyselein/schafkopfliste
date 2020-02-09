import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IndexComponent} from './index/index.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreatePlayerComponent} from './_forms/create-player/create-player.component';
import {SessionComponent} from './session/session.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {PlayerListComponent} from './player-list/player-list.component';
import {LoginFormComponent} from './_forms/login-form/login-form.component';
import {JwtInterceptor} from "./_helpers/jwt.interceptor";
import { GroupsComponent } from './groups/groups.component';
import { CreateGroupComponent } from './_forms/create-group/create-group.component';
import { GroupComponent } from './group/group.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    CreatePlayerComponent,
    SessionComponent,
    PlayerListComponent,
    LoginFormComponent,
    GroupsComponent,
    CreateGroupComponent,
    GroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
