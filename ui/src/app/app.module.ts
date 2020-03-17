import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreatePlayerComponent} from './_forms/create-player/create-player.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {CreateGroupComponent} from './_forms/create-group/create-group.component';
import {GamesTableComponent} from './games-table/games-table.component';
import {RuleSetComponent} from './rule-set/rule-set.component';
import {NewGameComponent} from './_forms/new-game/new-game.component';
import {PlayerAbbreviationsComponent} from './_components/player-abbreviations/player-abbreviations.component';
import { CircleBufferComponent } from './_components/circle-buffer/circle-buffer.component';
import { RegisterFormComponent } from './_forms/register-form/register-form.component';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    ...routingComponents,
    CreatePlayerComponent,
    CreateGroupComponent,
    GamesTableComponent,
    RuleSetComponent,
    NewGameComponent,
    PlayerAbbreviationsComponent,
    CircleBufferComponent,
    RegisterFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
