import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {Route, Switch} from 'react-router';
import {useTranslation} from 'react-i18next';
import {PlayerListQuery, usePlayerListQuery} from './graphql';
import {WithQuery} from './WithQuery';
import {createNewUrlFragment, playersBaseUrl} from './urls';
import {PlayerForm} from './PlayerForm';

export function PlayersBase(): JSX.Element {

  const {url} = useRouteMatch();

  return (
    <Switch>
      <Route path={`${url}/`} exact component={PlayersList}/>
      <Route path={`${url}/${createNewUrlFragment}`} component={PlayerForm}/>
    </Switch>
  );
}

function PlayersList(): JSX.Element {
  const {t} = useTranslation('common');

  const playerListQuery = usePlayerListQuery();

  function render({players}: PlayerListQuery): JSX.Element {
    if (players.length === 0) {
      return <div className="notification is-primary has-text-centered">{t('noPlayersFound')}</div>;
    }

    return (
      <table className="table is-fullwidth my-3">
        <thead>
          <tr>
            <th>{t('nickname')}</th>
            <th>{t('firstName')}</th>
            <th>{t('lastName')}</th>
          </tr>
        </thead>
        <tbody>
          {players.map(({nickname, firstName, lastName}) =>
            <tr key={nickname}>
              <td>{nickname}</td>
              <td>{firstName}</td>
              <td>{lastName}</td>
            </tr>)}
        </tbody>
      </table>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('players')}</h1>

      <WithQuery query={playerListQuery} render={render}/>

      <Link to={`${playersBaseUrl}/${createNewUrlFragment}`} className="button is-link is-fullwidth">{t('createNewPlayer')}</Link>
    </div>
  );
}
