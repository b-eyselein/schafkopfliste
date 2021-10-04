import React from 'react';
import {MyGroupsQuery, useMyGroupsQuery} from './graphql';
import {useTranslation} from 'react-i18next';
import {WithQuery} from './WithQuery';
import {BulmaCard} from './BulmaCard';
import {useSelector} from 'react-redux';
import {currentUserSelector} from './store/store';
import {GroupForm} from './GroupForm';
import {groupsBaseUrl} from './urls';

export function Home(): JSX.Element {

  const {t} = useTranslation('common');
  const myGroupsQuery = useMyGroupsQuery();
  const currentUser = useSelector(currentUserSelector);

  function render({myGroups}: MyGroupsQuery): JSX.Element {
    if (myGroups.length === 0) {
      return <div className="notification is-primary has-text-centered">{t('noGroupsFound')}</div>;
    }

    return (
      <div className="columns">
        {myGroups.map(({id, name, playerCount}) => <div className="column is-one-third" key={id}>
          <BulmaCard title={name} links={[{text: t('toGroup'), to: `${groupsBaseUrl}/${id}`}]}>
            <span>{playerCount} {t('player_plural')}</span>
          </BulmaCard>
        </div>)}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered"> {t('myGroups')}</h1>

      <WithQuery query={myGroupsQuery} render={render}/>

      {currentUser && <GroupForm onGroupCreated={myGroupsQuery.refetch}/>}
    </div>
  );
}
