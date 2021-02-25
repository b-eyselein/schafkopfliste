import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {GamesTableComponent} from './games-table/games-table.component';
import {NewGameComponent} from './_forms/new-game/new-game.component';
import {PlayerAbbreviationsComponent} from './_components/player-abbreviations/player-abbreviations.component';
import {CircleBufferComponent} from './_components/circle-buffer/circle-buffer.component';
import {RegisterFormComponent} from './_forms/register-form/register-form.component';
import {GraphQLModule} from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    ...routingComponents,

    GamesTableComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
