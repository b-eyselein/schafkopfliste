import React from 'react';
import {PlayersInGroupQuery, useAddPlayerToGroupMutation, usePlayersInGroupQuery} from './graphql';
import classNames from 'classnames';
import {WithQuery} from './WithQuery';
import {useTranslation} from 'react-i18next';

interface IPlayer {
  nickname: string;
  firstName: string;
  lastName: string;
  isMemberInGroup: boolean;
}

function PlayerToggleButton({groupName, player, onChange}: { groupName: string, player: IPlayer, onChange: () => void }): JSX.Element {

  const {firstName, lastName, isMemberInGroup} = player;
  const [addPlayerToGroup] = useAddPlayerToGroupMutation();

  function toggleGroupMembership(): void {
    addPlayerToGroup({variables: {groupName, playerName: player.nickname, newState: !isMemberInGroup}})
      .then(({data}) => data && onChange())
      .catch((error) => console.info(error));
  }

  return (
    <button className={classNames('button', 'is-fullwidth', {'is-link': isMemberInGroup})} onClick={toggleGroupMembership}>
      {isMemberInGroup ? <span>&#10004;</span> : <span>&#10008;</span>} {firstName} {lastName}
    </button>
  );
}

interface IProps {
  groupName: string;
}

export function PlayersInGroup({groupName}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const playersInGroupQuery = usePlayersInGroupQuery({variables: {groupName}});

  function render({players}: PlayersInGroupQuery): JSX.Element {
    if (players.length === 0) {
      return <div className="notification is-warning has-text-centered">{t('noPlayersFound')}</div>;
    }

    return (
      <div className="columns is-multiline">
        {players.map((player) =>
          <div className="column is-2" key={player.nickname}>
            <PlayerToggleButton groupName={groupName} player={player} onChange={playersInGroupQuery.refetch}/>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('group')} {groupName}: {t('players')}</h1>

      <WithQuery query={playersInGroupQuery} render={render}/>
    </div>
  );
}
