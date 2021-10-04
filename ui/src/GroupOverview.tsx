import React, {useState} from 'react';
import {GroupQuery, useGroupQuery} from './graphql';
import {Link} from 'react-router-dom';
import {WithQuery} from './WithQuery';
import {useTranslation} from 'react-i18next';
import {groupsBaseUrl, sessionsUrlFragment} from './urls';
import {PlayerTable} from './PlayerTable';
import classNames from 'classnames';
import {RuleSetCard} from './RuleSetCard';
import update from 'immutability-helper';
import {RuleSetForm} from './RuleSetForm';
import {PlayerForm} from './PlayerForm';
import {NewSessionFormContainer} from './sessions/NewSessionForm';

interface IProps {
  groupId: number;
  groupName: string;
}

interface IState {
  addRuleSet: boolean;
  addPlayer: boolean;
  addSession: boolean;
}

export function GroupOverview({groupId, groupName}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const groupQuery = useGroupQuery({variables: {groupId}});
  const [state, setState] = useState<IState>({addRuleSet: false, addPlayer: false, addSession: false});

  function render({group}: GroupQuery): JSX.Element {
    const {ruleSets, players, sessions} = group;

    /*
    function recalculateStatistics(): void {
      console.info('TODO!');
    }
     */

    function onRuleSetCreationCancel(): void {
      setState((state) => update(state, {addRuleSet: {$set: false}}));
    }

    function onRuleSetCreated(): void {
      onRuleSetCreationCancel();
      groupQuery.refetch();
    }

    function onPlayerCreationCancel(): void {
      setState((state) => update(state, {addPlayer: {$set: false}}));
    }

    function onPlayerCreated(): void {
      groupQuery.refetch();
    }

    function onSessionCreationCancel(): void {
      setState((state) => update((state), {addSession: {$set: false}}));
    }

    function onSessionCreation(): void {
      onSessionCreationCancel();
      groupQuery.refetch();
    }

    return (
      <>
        <section className="my-4">
          <h2 className="subtitle is-3">{t('ruleSet_plural')}</h2>

          {ruleSets.length === 0
            ? <div className="notification is-primary has-text-centered">{t('noRuleSetsFound')}</div>
            : <div className="columns is-multiline">
              {ruleSets.map((ruleSet) => <div className="column is-one-third" key={ruleSet.name}>
                <RuleSetCard ruleSet={ruleSet}/>
              </div>)}
            </div>}

          {state.addRuleSet
            ? <RuleSetForm groupId={groupId} onCreation={onRuleSetCreated} onCancel={onRuleSetCreationCancel}/>
            : <button type="button" className="button is-link is-fullwidth" onClick={() => setState((state) => update(state, {addRuleSet: {$set: true}}))}>
              {t('addRuleSet')}
            </button>}
        </section>

        <section className="my-4">
          <h2 className="subtitle is-3">{t('player_plural')}</h2>

          {players.length === 0
            ? <div className="notification is-primary has-text-centered">{t('noPlayersFound')}</div>
            : <PlayerTable players={players}/>}

          {state.addPlayer
            ? <PlayerForm groupId={groupId} onCreation={onPlayerCreated} onCancel={onPlayerCreationCancel}/>
            : <button type="button" className="button is-link is-fullwidth" onClick={() => setState((state) => update(state, {addPlayer: {$set: true}}))}>
              {t('addPlayer')}
            </button>}

          {/*players.length > 0 && <div className="my-3">
            <button className="button is-warning is-fullwidth has-text-centered" onClick={recalculateStatistics}>
              {t('recalculateStatistics')}
            </button>
          </div>*/}
        </section>

        <section className="my-4">
          <h2 className="subtitle is-3">{t('session_plural')}</h2>

          {sessions.length === 0
            ? <div className="notification is-primary has-text-centered">{t('noSessionsFound')}</div>
            : <div className="columns is-multiline">
              {sessions.map(({id, hasEnded}) => <div className="column is-one-fifth-desktop" key={id}>
                <Link className={classNames('button', 'is-fullwidth', {'is-primary': !hasEnded})}
                      to={`${groupsBaseUrl}/${groupId}/${sessionsUrlFragment}/${id}`}>{id}</Link>
              </div>)}
            </div>}

          {state.addSession
            ? <NewSessionFormContainer groupId={groupId} onCreation={onSessionCreation} onCancel={onSessionCreationCancel}/>
            : <button type="button" className="button is-link is-fullwidth" onClick={() => setState((state) => update(state, {addSession: {$set: true}}))}>
              {t('addSession')}
            </button>}
        </section>
      </>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('group')} {groupName}</h1>

      <WithQuery query={groupQuery} render={render}/>
    </div>
  );
}
