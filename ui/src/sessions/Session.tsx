import React from 'react';
import {Redirect, useRouteMatch} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {SessionQuery, useSessionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {groupsBaseUrl, homeUrl} from '../urls';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../store/store';
import {GameForm} from './GameForm';
import {GamesTable} from './GamesTable';

interface IProps {
  groupId: number;
  groupName: string;
}

export function Session({groupId, groupName}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const sessionId = parseInt(useRouteMatch<{ sessionId: string }>().params.sessionId);
  const sessionQuery = useSessionQuery({variables: {groupId, sessionId}});
  const currentUser = useSelector(currentUserSelector);

  function render({group}: SessionQuery): JSX.Element {
    if (!group) {
      return <Redirect to={homeUrl}/>;
    }

    const session = group.session;

    if (!session) {
      return <Redirect to={`${groupsBaseUrl}/${groupName}`}/>;
    }

    const {/*date, ruleSet,*/ firstPlayer, secondPlayer, thirdPlayer, fourthPlayer, games, hasEnded} = session;

    return (
      <>
        {currentUser && !hasEnded && <div className="box">
          <GameForm groupId={groupId} sessionId={sessionId} session={session} onNewGame={sessionQuery.refetch}/>
        </div>}

        <div className="column">
          <GamesTable players={[firstPlayer, secondPlayer, thirdPlayer, fourthPlayer]} games={games}/>
        </div>
      </>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('group')} {groupName}: {t('session')} {sessionId}</h1>

      <WithQuery query={sessionQuery} render={render}/>
    </div>
  );
}
