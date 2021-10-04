import React, {useState} from 'react';
import {NewSessionValuesGroupFragment, NewSessionValuesQuery, SessionInput, useNewSessionMutation, useNewSessionValuesQuery} from '../graphql';
import {useTranslation} from 'react-i18next';
import {WithQuery} from '../WithQuery';
import classNames from 'classnames';
import update from 'immutability-helper';

interface IState {
  datetime: Date;
  ruleSetName?: string | undefined;
  firstPlayerNickname?: string | undefined;
  secondPlayerNickname?: string | undefined;
  thirdPlayerNickname?: string | undefined;
  fourthPlayerNickname?: string | undefined;
  sent?: boolean;
}

const today = new Date();

interface NewSessionFormIProps {
  groupId: number;
  group: NewSessionValuesGroupFragment;
  onCreation: () => void;
  onCancel: () => void;
}

export function NewSessionForm({groupId, group, onCreation, onCancel}: NewSessionFormIProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({datetime: today});
  const [createSession, {data, loading, error}] = useNewSessionMutation();

  const {players, ruleSets} = group;

  function onSubmit(): void {
    console.info(state.ruleSetName);

    const {datetime, ruleSetName, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname} = state;

    if (ruleSetName && firstPlayerNickname && secondPlayerNickname && thirdPlayerNickname && fourthPlayerNickname) {
      const sessionInput: SessionInput = {
        date: datetime.toISOString().substring(0, 10),
        time: datetime.toISOString().substring(12, 16) + ':00',
        ruleSetName, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname
      };

      createSession({variables: {groupId, sessionInput}})
        .then(onCreation)
        .catch((error) => console.error(error.message));
      // FIXME: react on session creation?!
    } else {
      setState((state) => ({...state, sent: true}));
    }
  }

  function selectPlayer(nickname: string): void {
    setState(({firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname, ...rest}) => {
      if (!firstPlayerNickname) {
        return {...rest, firstPlayerNickname: nickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname};
      } else if (!secondPlayerNickname) {
        return {...rest, firstPlayerNickname, secondPlayerNickname: nickname, thirdPlayerNickname, fourthPlayerNickname};
      } else if (!thirdPlayerNickname) {
        return {...rest, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname: nickname, fourthPlayerNickname};
      } else if (!fourthPlayerNickname) {
        return {...rest, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname: nickname};
      } else {
        return {...rest, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname};
      }
    });
  }

  function deselectFirstPlayer(): void {
    setState((state) => update(state, {firstPlayerNickname: {$set: undefined}}));
  }

  function deselectSecondPlayer(): void {
    setState((state) => update(state, {secondPlayerNickname: {$set: undefined}}));
  }

  function deselectThirdPlayer(): void {
    setState((state) => update(state, {thirdPlayerNickname: {$set: undefined}}));
  }

  function deselectFourthPlayer(): void {
    setState((state) => update(state, {fourthPlayerNickname: {$set: undefined}}));
  }

  const notChosenPlayers = players.filter(({nickname}) =>
    nickname !== state.firstPlayerNickname && nickname !== state.secondPlayerNickname
    && nickname !== state.thirdPlayerNickname && nickname !== state.fourthPlayerNickname
  );

  return (
    <>
      <div className="field">
        <label htmlFor="date" className="label">{t('date')}:</label>
        <div className="control">
          <input type="datetime-local" name="date" className="input" defaultValue={state.datetime.toISOString().substring(0, 16)}/>
        </div>
      </div>

      <div className="field">
        <label htmlFor="ruleSetName" className="label">{t('ruleSet')}:</label>
        <div className="control">
          <div className={classNames('select', 'is-fullwidth', {'is-danger': state.sent && !state.ruleSetName})}>
            <select name="ruleSetName" id="ruleSetName" required defaultValue={state.ruleSetName}
                    onChange={(event) => setState((state) => update(state, {ruleSetName: {$set: event.target.value}}))}>
              <option value="">{t('pleaseSelect')}</option>
              {ruleSets.map(({name}) => <option key={name}>{name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <p className="has-text-weight-bold has-text-centered">{t('dealer')}:</p>
          <button className={classNames('button', 'is-fullwidth', 'my-3', {'is-danger': state.sent && !state.firstPlayerNickname})}
                  onClick={deselectFirstPlayer}>{state.firstPlayerNickname || '--'}</button>
        </div>
        <div className="column">
          <p className="has-text-weight-bold has-text-centered">{t('firstPreHand')}:</p>
          <button className={classNames('button', 'is-fullwidth', 'my-3', {'is-danger': state.sent && !state.secondPlayerNickname})}
                  onClick={deselectSecondPlayer}>{state.secondPlayerNickname || '--'}</button>
        </div>
        <div className="column">
          <p className="has-text-weight-bold has-text-centered">{t('firstMiddleHand')}:</p>
          <button className={classNames('button', 'is-fullwidth', 'my-3', {'is-danger': state.sent && !state.thirdPlayerNickname})}
                  onClick={deselectThirdPlayer}>{state.thirdPlayerNickname || '--'}</button>
        </div>
        <div className="column">
          <p className="has-text-weight-bold has-text-centered">{t('firstRearHand')}:</p>
          <button className={classNames('button', 'is-fullwidth', 'my-3', {'is-danger': state.sent && !state.fourthPlayerNickname})}
                  onClick={deselectFourthPlayer}>{state.fourthPlayerNickname || '--'}</button>
        </div>
      </div>

      <div className="columns">
        {notChosenPlayers.map(({nickname, firstName, lastName}) =>
          <div className="column is-1" key={nickname}>
            <button type="button" onClick={() => selectPlayer(nickname)} title={`${firstName} ${lastName}`} className="button is-fullwidth">{nickname}</button>
          </div>
        )}
      </div>

      {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

      {data && <div className="notification is-success has-text-centered">{t('sessionSuccessfullyCreated_{{id}}', {id: data.group.newSession})}</div>}

      <div className="columns">
        <div className="column">
          <button type="button" className="button is-warning is-fullwidth" onClick={onCancel}>{t('cancel')}</button>
        </div>
        <div className="column">
          <button type="button" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} onClick={onSubmit} disabled={loading}>
            {t('createNewSession')}
          </button>
        </div>
      </div>
    </>
  );
}

interface IProps {
  groupId: number;
  onCreation: () => void;
  onCancel: () => void;
}

export function NewSessionFormContainer({groupId, onCreation, onCancel}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const newSessionValuesQuery = useNewSessionValuesQuery({variables: {groupId}});

  function render({group}: NewSessionValuesQuery): JSX.Element {
    return <NewSessionForm groupId={groupId} group={group} onCreation={onCreation} onCancel={onCancel}/>;
  }

  return (
    <div className="box">
      <h1 className="subtitle is-4 has-text-centered">{t('createNewSession')}</h1>

      <WithQuery query={newSessionValuesQuery} render={render}/>
    </div>
  );
}
