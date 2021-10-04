import React from 'react';
import {Redirect, useRouteMatch} from 'react-router-dom';
import {GroupBaseQuery, useGroupBaseQuery} from './graphql';
import {homeUrl, sessionsUrlFragment} from './urls';
import {Route, Switch} from 'react-router';
import {Session} from './sessions/Session';
import {WithQuery} from './WithQuery';
import {GroupOverview} from './GroupOverview';

export function GroupBase(): JSX.Element {

  const {url, params} = useRouteMatch<{ groupId: string }>();

  const groupId = parseInt(params.groupId);

  const groupQuery = useGroupBaseQuery({variables: {groupId}});

  function render({maybeGroup}: GroupBaseQuery): JSX.Element {
    if (!maybeGroup) {
      return <Redirect to={homeUrl}/>;
    }

    const {name} = maybeGroup;

    return (
      <Switch>
        <Route path={`${url}/`} exact render={() => <GroupOverview groupId={groupId} groupName={name}/>}/>

        <Route path={`${url}/${sessionsUrlFragment}/:sessionId`} exact render={() => <Session groupId={groupId} groupName={name}/>}/>
      </Switch>
    );
  }

  return <WithQuery query={groupQuery} render={render}/>;
}
