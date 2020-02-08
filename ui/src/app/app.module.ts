import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IndexComponent} from './index/index.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NewPlayerFormComponent} from './new-player-form/new-player-form.component';
import {SessionComponent} from './session/session.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {PlayerListComponent} from './player-list/player-list.component';
import {LoginFormComponent} from './login-form/login-form.component';
import {JwtInterceptor} from "./_helpers/jwt.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NewPlayerFormComponent,
    SessionComponent,
    PlayerListComponent,
    LoginFormComponent
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
