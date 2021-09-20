import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {Route, Switch} from 'react-router';
import {RuleSetFragment, RuleSetListQuery, useRuleSetListQuery} from './graphql';
import {useTranslation} from 'react-i18next';
import {WithQuery} from './WithQuery';
import {createNewUrlFragment, ruleSetsBaseUrl} from './urls';
import {RuleSetForm} from './RuleSetForm';
import {useSelector} from 'react-redux';
import {currentUserSelector} from './store/store';

export function RuleSetsBase(): JSX.Element {

  const {url} = useRouteMatch();

  return (
    <Switch>
      <Route path={`${url}/`} exact component={RuleSetList}/>
      <Route path={`${url}/${createNewUrlFragment}`} component={RuleSetForm}/>
    </Switch>
  );
}

function RuleSetCard({ruleSet}: { ruleSet: RuleSetFragment }): JSX.Element {

  const {t} = useTranslation('common');
  const {
    name,
    basePrice, soloPrice,
    laufendePrice, countLaufende, minLaufendeIncl, maxLaufendeIncl,
    hochzeitAllowed, ramschAllowed, bettelAllowed, geierAllowed, farbWenzAllowed, farbGeierAllowed,
  } = ruleSet;

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{name}</p>
      </header>
      <div className="card-content">

        <table className="table is-fullwidth">
          <tbody>
            <tr>
              <td>{t('price_plural')}</td>
              <td>{basePrice} ct / {soloPrice} ct</td>
            </tr>
            <tr>
              <td>{t('countLaufende')}</td>
              <td>{laufendePrice} ct, {countLaufende}, {minLaufendeIncl} - {maxLaufendeIncl}</td>
            </tr>
            <tr>
              <td>{t('hochzeitAllowed')}</td>
              <td>{hochzeitAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
            </tr>
            <tr>
              <td>{t('ramschAllowed')}</td>
              <td>{ramschAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
            </tr>
            <tr>
              <td>{t('bettelAllowed')}</td>
              <td>{bettelAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
            </tr>
            <tr>
              <td>{t('geierAllowed')}</td>
              <td>{geierAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
            </tr>
            <tr>
              <td>{t('farbWenzAllowed')}</td>
              <td>{farbWenzAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
            </tr>
            <tr>
              <td>{t('farbGeierAllowed')}</td>
              <td>{farbGeierAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RuleSetList(): JSX.Element {

  const {t} = useTranslation('common');
  const currentUser = useSelector(currentUserSelector);
  const ruleSetListQuery = useRuleSetListQuery();

  function render({ruleSets}: RuleSetListQuery): JSX.Element {
    if (ruleSets.length === 0) {
      return <div className="notification is-primary has-text-centered">{t('noRuleSetsFound')}</div>;
    }

    return (
      <div className="columns">
        {ruleSets.map((ruleSet) => <div key={ruleSet.name} className="column is-one-third">
          <RuleSetCard ruleSet={ruleSet}/>
        </div>)}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('ruleSet_plural')}</h1>

      <WithQuery query={ruleSetListQuery} render={render}/>

      {currentUser && <div className="my-3">
        <Link to={`${ruleSetsBaseUrl}/${createNewUrlFragment}`} className="button is-link is-fullwidth">{t('createNewRuleSet')}</Link>
      </div>}
    </div>
  );
}
