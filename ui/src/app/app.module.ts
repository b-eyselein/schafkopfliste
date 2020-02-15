import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreatePlayerComponent} from './_forms/create-player/create-player.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {CreateGroupComponent} from './_forms/create-group/create-group.component';
import {AddPlayerToGroupComponent} from './_forms/add-player-to-group/add-player-to-group.component';
import {ButtonListSelectComponent} from './_components/button-list-select/button-list-select.component';
import {GamesTableComponent} from './_components/games-table/games-table.component';

@NgModule({
  declarations: [
    AppComponent,
    ...routingComponents,
    CreatePlayerComponent,
    CreateGroupComponent,
    AddPlayerToGroupComponent,
    ButtonListSelectComponent,
    GamesTableComponent,
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
