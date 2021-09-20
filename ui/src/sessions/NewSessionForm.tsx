import React, {useState} from 'react';
import {NewSessionValuesGroupFragment, NewSessionValuesQuery, SessionInput, useNewSessionMutation, useNewSessionValuesQuery} from '../graphql';
import {useTranslation} from 'react-i18next';
import {WithQuery} from '../WithQuery';
import {Redirect} from 'react-router-dom';
import {homeUrl} from '../urls';
import classNames from 'classnames';

interface IProps {
  groupName: string;
}

interface IState {
  date: string;
  time: string;
  firstPlayerNickname?: string | undefined;
  secondPlayerNickname?: string | undefined;
  thirdPlayerNickname?: string | undefined;
  fourthPlayerNickname?: string | undefined;
  sent?: boolean;
}

const today = new Date();

export function NewSessionForm({groupName, group}: { groupName: string, group: NewSessionValuesGroupFragment }): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({date: today.toISOString().slice(0, 10), time: today.toISOString().slice(11, 16)});
  const [createSession, {data, loading, error}] = useNewSessionMutation();

  const {players/*, ruleSet*/} = group;

  function onSubmit(): void {
    const {date, time, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname} = state;

    if (firstPlayerNickname && secondPlayerNickname && thirdPlayerNickname && fourthPlayerNickname) {
      const sessionInput: SessionInput = {
        dateYear: parseInt(date.substring(0, 4)), dateMonth: parseInt(date.substring(5, 7)), dateDayOfMonth: parseInt(date.substring(8, 10)),
        timeHours: parseInt(time.substring(0, 2)), timeMinutes: parseInt(time.substring(3, 4)),
        firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname
      };

      createSession({variables: {groupName, sessionInput}})
        .catch((error) => console.error(error.message));
      // FIXME: react on session creation?!
    } else {
      setState((state) => ({...state, sent: true}));
    }
  }

  function selectPlayer(nickname: string): void {
    setState(({date, time, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname, sent}) => {
      if (!firstPlayerNickname) {
        return {date, time, firstPlayerNickname: nickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname, sent};
      } else if (!secondPlayerNickname) {
        return {date, time, firstPlayerNickname, secondPlayerNickname: nickname, thirdPlayerNickname, fourthPlayerNickname, sent};
      } else if (!thirdPlayerNickname) {
        return {date, time, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname: nickname, fourthPlayerNickname, sent};
      } else if (!fourthPlayerNickname) {
        return {date, time, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname: nickname, sent};
      } else {
        return {date, time, firstPlayerNickname, secondPlayerNickname, thirdPlayerNickname, fourthPlayerNickname, sent};
      }
    });
  }

  function deselectFirstPlayer(): void {
    setState((state) => ({...state, firstPlayerNickname: undefined}));
  }

  function deselectSecondPlayer(): void {
    setState((state) => ({...state, secondPlayerNickname: undefined}));
  }

  function deselectThirdPlayer(): void {
    setState((state) => ({...state, thirdPlayerNickname: undefined}));
  }

  function deselectFourthPlayer(): void {
    setState((state) => ({...state, fourthPlayerNickname: undefined}));
  }

  function updateDate(date: string): void {
    setState((state) => ({...state, date}));
  }

  function updateTime(time: string): void {
    setState((state) => ({...state, time}));
  }

  const notChosenPlayers = players.filter(({nickname}) =>
    nickname !== state.firstPlayerNickname && nickname !== state.secondPlayerNickname
    && nickname !== state.thirdPlayerNickname && nickname !== state.fourthPlayerNickname
  );

  return (
    <>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label htmlFor="date" className="label">{t('day')}:</label>
            <div className="control">
              <input type="date" name="date" id="date" defaultValue={state.date} className="input"
                     onChange={(event) => updateDate(event.target.value)}/>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="field">
            <label htmlFor="time" className="label">{t('time')}:</label>
            <div className="control">
              <input type="time" name="time" id="time" defaultValue={state.time} className="input"
                     onChange={(event) => updateTime(event.target.value)}/>
            </div>
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
        {notChosenPlayers.map(({nickname, name}) =>
          <div className="column is-1" key={nickname}>
            <button type="button" onClick={() => selectPlayer(nickname)} title={name} className="button is-fullwidth">{nickname}</button>
          </div>
        )}
      </div>

      {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

      {data && <div className="notification is-success has-text-centered">{t('sessionSuccessfullyCreated_{{id}}', {id: data.newSession})}</div>}

      <div className="my-3">
        <button type="button" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} onClick={onSubmit} disabled={loading}>
          {t('createNewSession')}
        </button>
      </div>
    </>
  );
}

export function NewSessionFormContainer({groupName}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const newSessionValuesQuery = useNewSessionValuesQuery({variables: {groupName}});

  function render({group}: NewSessionValuesQuery): JSX.Element {
    return group
      ? <NewSessionForm groupName={groupName} group={group}/>
      : <Redirect to={homeUrl}/>;
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('group')} {groupName}: {t('createNewSession')}</h1>

      <WithQuery query={newSessionValuesQuery} render={render}/>
    </div>
  );
}
