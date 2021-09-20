import React from 'react';
import {GameType, SessionGameFragment, SessionPlayerFragment} from '../graphql';

interface IProps {
  players: SessionPlayerFragment[];
  games: SessionGameFragment[];
}

export function GamesTable({players, games}: IProps): JSX.Element {

  const sessionResults = new Map(
    players.map((p) => {
      let saldo = 0;
      let wonGames = 0;
      let playedGames = 0;
      let putCount = 0;

      games.forEach((game) => {
        const hasWon = game.playersHavingWonNicknames.includes(p.nickname);
        const isPlayer = game.actingPlayerNickname === p.nickname;
        const priceIsTripled = game.gameType !== GameType.Ruf && isPlayer;

        saldo += (hasWon ? 1 : -1) * (priceIsTripled ? 3 : 1) * game.price;

        if (hasWon) {
          wonGames++;
        }
        if (isPlayer) {
          playedGames++;
        }
        if (game.playersHavingPutNicknames.includes(p.nickname)) {
          putCount++;
        }
      });

      return [p.nickname, {saldo, wonGames, playedGames, putCount}];
    })
  );

  function getDealer(gameId: number): SessionPlayerFragment {
    return players[(gameId - 1) % 4];
  }

  return (
    <>
      <div className="box">
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th/>
              {players.map(({nickname}) => <th key={nickname}>{nickname}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Saldo</th>
              {players.map((player) =>
                <td className={sessionResults.get(player.nickname)!.saldo < 0 ? 'has-text-danger' : 'has-text-success'} key={player.nickname}>
                  {sessionResults.get(player.nickname)!.saldo}
                </td>)}
            </tr>
            <tr>
              <th># Leger / Spiele / Gewonnen</th>
              {players.map((player) =>
                <td key={player.nickname}>
                  {sessionResults.get(player.nickname)!.putCount}
                  /
                  {sessionResults.get(player.nickname)!.playedGames}
                  /
                  {sessionResults.get(player.nickname)!.wonGames}
                </td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="box">
        <div className="table-container">
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th title="Nummer">#</th>
                <th>Geber</th>
                <th title="Gedoppelt">2x</th>
                <th>Leger</th>
                <th>Spiel</th>
                <th>Farbe</th>
                <th>Spieler</th>
                <th>Kontra</th>
                <th>Gewinner</th>
                <th>Laufende</th>
                <th title="Schneider / Schwarz">SN / SW</th>
                <th>Preis</th>
              </tr>
            </thead>
            <tbody>
              {games.map((playedGame) =>
                <tr key={playedGame.id}>
                  <td>{playedGame.id}</td>
                  <td>{getDealer(playedGame.id).nickname}</td>
                  <td>{playedGame.isDoubled && <span>&#10004;</span> }</td>
                  <td>{playedGame.playersHavingPutNicknames.join(', ')}</td>
                  <td>{playedGame.gameType}</td>
                  <td>{/*getSuitGermanName(*/playedGame.suit/*)*/}</td>
                  <td>{playedGame.actingPlayerNickname}</td>
                  <td>{playedGame.kontra}</td>
                  <td>{playedGame.playersHavingWonNicknames.join(', ')}</td>
                  <td>{playedGame.laufendeCount}</td>
                  <td>{playedGame.schneiderSchwarz}</td>
                  <td>{playedGame.price}</td>
                </tr>)}
              {/*
    <tr *ngIf="runningGame" className="is-selected">
    <td></td>
    <td>{{getDealer(nextGameId()).nickname}}</td>
    <td>{{runningGame.isDoubled ? '&#10004;' : ''}}</td>
    <td>
      <skl-player-abbreviations
      [players]="playersHavingPut(runningGame.playersHavingPutNicknames)"></skl-player-abbreviations>
  </td>
  <td>{{runningGame.gameType}}</td>
  <td>{{getSuitGermanName(runningGame.suit)}}</td>
  <td>{{currentActingPlayer ? currentActingPlayer.nickname : ''}}</td>
  <td>{{runningGame.kontra}}</td>
  <td>
    <skl-player-abbreviations
    [players]="playersHavingWon(runningGame.playersHavingWonNicknames)"></skl-player-abbreviations>
</td>
  <td>{{runningGame.laufendeCount}}</td>
  <td>{{runningGame.schneiderSchwarz}}</td>
  <td></td>
</tr>
*/}
            </tbody>
          </table>
        </div>
      </div>
    </>

  );

}
