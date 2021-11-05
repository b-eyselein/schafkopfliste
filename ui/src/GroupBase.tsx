import {Navigate, Routes, useParams} from 'react-router-dom';
import {useGroupBaseQuery} from './graphql';
import {homeUrl, sessionsUrlFragment} from './urls';
import {Route} from 'react-router';
import {Session} from './sessions/Session';
import {WithQuery} from './WithQuery';
import {GroupOverview} from './GroupOverview';
import {WithNullableNavigate} from './WithNullableNavigate';

export function GroupBase(): JSX.Element {

  const params = useParams<'groupId'>();

  if (!params.groupId) {
    return <Navigate to={homeUrl}/>;
  }

  const groupId = parseInt(params.groupId);
  const groupQuery = useGroupBaseQuery({variables: {groupId}});

  return (
    <WithQuery query={groupQuery}>
      {({maybeGroup}) => <WithNullableNavigate t={maybeGroup}>
        {({name}) =>
          <Routes>
            <Route path={'/'} element={<GroupOverview groupId={groupId} groupName={name}/>}/>

            <Route path={`${sessionsUrlFragment}/:sessionId`} element={<Session groupId={groupId} groupName={name}/>}/>
          </Routes>
        }
      </WithNullableNavigate>}
    </WithQuery>
  );
}
