import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {Route, Switch} from 'react-router';
import {GroupListQuery, useGroupListQuery} from './graphql';
import {useTranslation} from 'react-i18next';
import {WithQuery} from './WithQuery';
import {createNewUrlFragment, groupsBaseUrl} from './urls';
import {GroupForm} from './GroupForm';
import {GroupBase} from './GroupOverview';

export function GroupsBase(): JSX.Element {

  const {url} = useRouteMatch();

  return (
    <Switch>
      <Route path={`${url}`} exact component={GroupsList}/>
      <Route path={`${url}/${createNewUrlFragment}`} exact component={GroupForm}/>
      <Route path={`${url}/:groupName`} component={GroupBase}/>
    </Switch>
  );
}

function GroupsList(): JSX.Element {

  const {t} = useTranslation('common');
  const groupListQuery = useGroupListQuery();

  function render({groups}: GroupListQuery): JSX.Element {
    if (groups.length === 0) {
      return <div className="notification is-primary has-text-centered">{t('noGroupsFound')}</div>;
    }

    return (
      <div className="columns">
        {groups.map(({name, playerCount}) =>
          <div key={name} className="column is-one-third">
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">{name}</p>
              </header>
              <div className="card-content">
                {playerCount} {t('player_plural')}
              </div>
              <footer className="card-footer">
                <Link to={`${groupsBaseUrl}/${name}`} className="card-footer-item">{t('toGroup')}</Link>
              </footer>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('groups')}</h1>

      <WithQuery query={groupListQuery} render={render}/>

      <div className="my-3">
        <Link to={`${groupsBaseUrl}/${createNewUrlFragment}`} className="button is-link is-fullwidth">{t('createNewGroup')}</Link>
      </div>
    </div>
  );
}
