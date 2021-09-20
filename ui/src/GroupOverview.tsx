import React from 'react';
import {GroupQuery, useGroupQuery} from './graphql';
import {Link, Redirect, useRouteMatch} from 'react-router-dom';
import {WithQuery} from './WithQuery';
import {useTranslation} from 'react-i18next';
import {createNewUrlFragment, groupsBaseUrl, playersUrlFragment, sessionsUrlFragment} from './urls';
import {useSelector} from 'react-redux';
import {currentUserSelector} from './store/store';
import classNames from 'classnames';
import {Route, Switch} from 'react-router';
import {PlayersInGroup} from './PlayersInGroup';
import {NewSessionFormContainer} from './sessions/NewSessionForm';
import {Session} from './sessions/Session';

export function GroupBase(): JSX.Element {

  const {url, params: {groupName}} = useRouteMatch<{ groupName: string }>();

  return (
    <Switch>
      <Route path={`${url}/`} exact render={() => <GroupOverview name={groupName}/>}/>
      <Route path={`${url}/${playersUrlFragment}`} exact render={() => <PlayersInGroup groupName={groupName}/>}/>
      <Route path={`${url}/${sessionsUrlFragment}/${createNewUrlFragment}`} exact render={() => <NewSessionFormContainer groupName={groupName}/>}/>
      <Route path={`${url}/${sessionsUrlFragment}/:sessionId`} exact render={() => <Session groupName={groupName}/>}/>
    </Switch>
  );

}

interface IProps {
  name: string;
}

function GroupOverview({name}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const currentUser = useSelector(currentUserSelector);

  const groupQuery = useGroupQuery({variables: {name}});

  function render({group}: GroupQuery): JSX.Element {
    if (!group) {
      return <Redirect to={groupsBaseUrl}/>;
    }

    const {players, sessions} = group;

    function recalculateStatistics(): void {
      console.info('TODO!');
    }

    return (
      <>
        <div className="columns is-multiline">
          <div className="column is-three-fifths-desktop is-full-tablet">
            <h2 className="subtitle is-3 has-text-centered">Mitglieder</h2>

            {players.length === 0
              ? <div className="notification is-danger has-text-centered">{t('noPlayersFound')}</div>
              : <div className="table-container">
                <table className="table is-striped is-bordered is-fullwidth">
                  <thead>
                    <tr>
                      <th className="has-text-centered">Spieler</th>
                      <th className="has-text-centered">Saldo</th>
                      <th className="has-text-centered"># Spiele <br/> (gesamt)</th>
                      <th className="has-text-centered">Saldo / Spiele</th>
                      <th className="has-text-centered"># Leger</th>
                      <th className="has-text-centered"># Anzahl <br/> (gespielt)</th>
                      <th className="has-text-centered"># Siege</th>
                      <th className="has-text-centered">% Siege</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) /* *ngFor="let player of getPlayersOrderedByBalance()" */ =>
                      <tr key={player.nickname}>
                        <td className="has-text-centered">{player.name}</td>
                        <td className={classNames('has-text-centered', player.balance < 0 ? 'has-text-danger' : 'has-text-success')}>
                          {player.balance}
                        </td>
                        <td className="has-text-centered">{player.gameCount}</td>
                        <td className="has-text-centered">{player.gameCount > 0 ? player.balance / player.gameCount : '--' /*| number:'1.2-2'*/}</td>
                        <td className="has-text-centered">{player.putCount}</td>
                        <td className="has-text-centered">{player.playedGames}</td>
                        <td className="has-text-centered">{player.winCount}</td>
                        <td className="has-text-centered">{player.gameCount > 0 ? (player.winCount / player.gameCount) : '--' /*| percent*/}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>}

            {currentUser && <div className="buttons">
              <Link className="button is-link is-fullwidth has-text-centered" to={`${groupsBaseUrl}/${name}/${playersUrlFragment}`}>+</Link>
              {currentUser.isAdmin &&
              <button className="button is-danger is-fullwidth has-text-centered" onClick={recalculateStatistics}>Statistiken neu berechnen</button>}
            </div>}
          </div>

          <div className="column">
            <h2 className="subtitle is-3 has-text-centered">Sitzungen</h2>

            <div className="columns is-multiline">
              {sessions && sessions.map(({id, hasEnded}) =>
                <div className="column is-one-fifth-desktop" key={id}>
                  <Link className={classNames('button', 'is-fullwidth', {'is-primary': !hasEnded})}
                        to={`${groupsBaseUrl}/${name}/${sessionsUrlFragment}/${id}`}>{id}</Link>
                </div>
              )}
              {currentUser && <div className="column is-one-fifth-desktop">
                <Link className="button is-link is-fullwidth" to={`${groupsBaseUrl}/${name}/${sessionsUrlFragment}/${createNewUrlFragment}`}>+</Link>
              </div>}
            </div>
          </div>
        </div>

      </>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('group')} {name}</h1>

      <WithQuery query={groupQuery} render={render}/>
    </div>
  );
}
