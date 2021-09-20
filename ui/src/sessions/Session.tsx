import React from 'react';
import {Redirect, useRouteMatch} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {SessionQuery, useEndSessionMutation, useSessionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {groupsBaseUrl} from '../urls';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../store/store';
import {GameForm} from './GameForm';
import {GamesTable} from './GamesTable';

interface IProps {
  groupName: string;
}

export function Session({groupName}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const sessionId = parseInt(useRouteMatch<{ sessionId: string }>().params.sessionId);
  const sessionQuery = useSessionQuery({variables: {groupName, sessionId}});
  const currentUser = useSelector(currentUserSelector);
  const [endSession, {data, loading, error}] = useEndSessionMutation();

  function render({session}: SessionQuery): JSX.Element {

    if (!session) {
      return <Redirect to={`${groupsBaseUrl}/${groupName}`}/>;
    }

    const {/*date, ruleSet,*/ firstPlayer, secondPlayer, thirdPlayer, fourthPlayer, games, hasEnded} = session;

    function onEndSession(): void {
      if (confirm('Wollen Sie die Sitzung wirklich beenden?\nAchtung: Sie können danach keine weiteren Spiele mehr eintragen!')) {
        endSession({variables: {groupName, sessionId}})
          .then(() => sessionQuery.refetch())
          .catch((error) => console.info(error));
      }
    }

    return (
      <div>
        <div className="columns is-widescreen is-multiline">
          {currentUser && !hasEnded && <div className="column is-two-fifths-widescreen">
            <div className="box">
              <GameForm groupName={groupName} sessionId={sessionId} session={session} onNewGame={sessionQuery.refetch} endSession={onEndSession}/>
              {/*
              <skl-new-game session="session" sessionId="sessionId" groupName="groupName"
                            gameChanged="updateGame($event)" gameAdded="addGame($event)" endSession="endSession()">
              </skl-new-game>
              */}
            </div>
          </div>}

          <div className="column">
            <GamesTable players={[firstPlayer, secondPlayer, thirdPlayer, fourthPlayer]} games={games}/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('group')} {groupName}: {t('session')} {sessionId}</h1>

      <WithQuery query={sessionQuery} render={render}/>
    </div>
  );
}
