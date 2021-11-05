import {useTranslation} from 'react-i18next';
import {useSessionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../store/store';
import {GameForm} from './GameForm';
import {GamesTable} from './GamesTable';
import {WithNullableNavigate} from '../WithNullableNavigate';
import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';

interface IProps {
  groupId: number;
  groupName: string;
}

export function Session({groupId, groupName}: IProps): JSX.Element {

  const params = useParams<'sessionId'>();

  if (!params.sessionId) {
    return <Navigate to={homeUrl}/>;
  }

  const sessionId = parseInt(params.sessionId);

  const {t} = useTranslation('common');
  const sessionQuery = useSessionQuery({variables: {groupId, sessionId}});
  const currentUser = useSelector(currentUserSelector);

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('group')} {groupName}: {t('session')} {sessionId}</h1>

      <WithQuery query={sessionQuery}>
        {({group: maybeGroup}) => <WithNullableNavigate t={maybeGroup}>
          {({session: maybeSession}) => <WithNullableNavigate t={maybeSession}>
            {(session) => <>
              {currentUser && !session.hasEnded && <div className="box">
                <GameForm groupId={groupId} sessionId={sessionId} session={session} onNewGame={sessionQuery.refetch}/>
              </div>}

              <div className="column">
                <GamesTable players={[session.firstPlayer, session.secondPlayer, session.thirdPlayer, session.fourthPlayer]} games={session.games}/>
              </div>
            </>}
          </WithNullableNavigate>}
        </WithNullableNavigate>}
      </WithQuery>
    </div>
  );
}
