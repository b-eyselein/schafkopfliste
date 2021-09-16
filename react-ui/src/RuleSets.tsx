import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {Route, Switch} from 'react-router';
import {RuleSetListQuery, useRuleSetListQuery} from './graphql';
import {useTranslation} from 'react-i18next';
import {WithQuery} from './WithQuery';
import {createNewUrlFragment, ruleSetsBaseUrl} from './urls';
import {RuleSetForm} from './RuleSetForm';

export function RuleSetsBase(): JSX.Element {

  const {url} = useRouteMatch();

  return (
    <Switch>
      <Route path={`${url}/`} exact component={RuleSetList}/>
      <Route path={`${url}/${createNewUrlFragment}`} component={RuleSetForm}/>
    </Switch>
  );
}

function RuleSetList(): JSX.Element {

  const {t} = useTranslation('common');

  const ruleSetListQuery = useRuleSetListQuery();

  function render({ruleSets}: RuleSetListQuery): JSX.Element {
    if (ruleSets.length === 0) {
      return <div className="notification is-primary has-text-centered">{t('noRuleSetsFound')}</div>;
    }

    return (
      <div className="columns">
        {ruleSets.map(({name, __typename, ...rest}) => <div key={name} className="column is-one-third">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">{name}</p>
            </header>
            <div className="card-content">
              <pre>{JSON.stringify(rest, null, 2)}</pre>
            </div>
          </div>
        </div>)}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('ruleSet_plural')}</h1>

      <WithQuery query={ruleSetListQuery} render={render}/>

      <div className="my-3">
        <Link to={`${ruleSetsBaseUrl}/${createNewUrlFragment}`} className="button is-link is-fullwidth">{t('createNewRuleSet')}</Link>
      </div>
    </div>
  );
}
