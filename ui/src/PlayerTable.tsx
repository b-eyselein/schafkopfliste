import classNames from 'classnames';
import {PlayerFragment} from './graphql';
import {useTranslation} from 'react-i18next';

interface IProps {
  players: PlayerFragment[];
}

export function PlayerTable({players}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const orderedPlayers = players.sort((p1, p2) => p1.balance - p2.balance);

  return (
    <div className="table-container">
      <table className="table is-striped is-bordered is-fullwidth">
        <thead>
          <tr>
            <th className="has-text-centered">{t('nickname')}</th>
            <th className="has-text-centered">{t('player')}</th>
            <th className="has-text-centered">{t('balance')}</th>
            <th className="has-text-centered">{t('gameCount')}</th>
            <th className="has-text-centered">{t('averageBalancePerGame')}</th>
            <th className="has-text-centered">{t('putCount')}</th>
            <th className="has-text-centered">{t('playedGamesCount')}</th>
            <th className="has-text-centered">{t('winCount')}</th>
            <th className="has-text-centered">{t('winPercentage')}</th>
          </tr>
        </thead>
        <tbody>
          {orderedPlayers.map(({nickname, name, balance, gameCount, putCount, playedGames, winCount}) => <tr key={nickname}>
            <td className="has-text-centered">{nickname}</td>
            <td className="has-text-centered">{name}</td>
            <td className={classNames('has-text-centered', balance < 0 ? 'has-text-danger' : 'has-text-success')}>
              {balance}
            </td>
            <td className="has-text-centered">{gameCount}</td>
            <td className="has-text-centered">{gameCount > 0 ? balance / gameCount : '--' /*| number:'1.2-2'*/}</td>
            <td className="has-text-centered">{putCount}</td>
            <td className="has-text-centered">{playedGames}</td>
            <td className="has-text-centered">{winCount}</td>
            <td className="has-text-centered">{gameCount > 0 ? (winCount / gameCount) : '--' /*| percent*/}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}
