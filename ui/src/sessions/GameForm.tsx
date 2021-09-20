import React, {useState} from 'react';
import classNames from 'classnames';
import {BavarianSuit, GameInput, GameType, KontraType, SchneiderSchwarz, SessionFragment, useCreateGameMutation, useEndSessionMutation} from '../graphql';
import {getAllowedGameTypes} from './gameTypes';
import {useTranslation} from 'react-i18next';
import BayAcorns from './bay_eichel.png';
import BayLeaves from './bay_blatt.png';
import BayHearts from './bay_herz.png';
import BayBells from './bay_schellen.png';

interface IProps {
  groupName: string;
  sessionId: number;
  session: SessionFragment;
  onNewGame: () => void;
}

interface IState {
  currentGameIndex: number;
  isDoubled: boolean;
  remainingDoubledGames: number;
  playersHavingPutNicknames: string[];
  actingPlayerNickname: string | undefined;
  gameType: GameType | undefined;
  suit: BavarianSuit | undefined;
  tout: boolean;
  kontra: KontraType | undefined;
  playersHavingWonNicknames: string[];
  schneiderSchwarz: SchneiderSchwarz | undefined;
  laufendeCount: number;
  submitted: boolean;
}

const initialState: IState = {
  currentGameIndex: 1,
  isDoubled: false,
  remainingDoubledGames: 0,
  playersHavingPutNicknames: [],
  actingPlayerNickname: undefined,
  gameType: undefined,
  suit: undefined,
  tout: false,
  kontra: undefined,
  playersHavingWonNicknames: [],
  schneiderSchwarz: undefined,
  laufendeCount: 0,
  submitted: false,
};

function toggleStringValueInArray(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((s) => s !== value)
    : [...values, value];
}

function needsSuit(gameType: GameType): boolean {
  return ![GameType.Hochzeit, GameType.Bettel, GameType.Geier, GameType.Wenz, GameType.Ramsch].includes(gameType);
}

const contraValues: KontraType[] = [KontraType.Kontra, KontraType.Re, KontraType.Supra, KontraType.Resupra];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const suitValues: [BavarianSuit, any][] = [
  [BavarianSuit.Acorns, BayAcorns],
  [BavarianSuit.Leaves, BayLeaves],
  [BavarianSuit.Hearts, BayHearts],
  [BavarianSuit.Bells, BayBells]
];

export function GameForm({groupName, sessionId, session, onNewGame}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>(initialState);
  const [createGame, {loading, error}] = useCreateGameMutation();
  const [endSession, {loading: sessionEndLoading, error: sessionEndError}] = useEndSessionMutation();

  const {
    currentGameIndex,
    isDoubled,
    remainingDoubledGames,
    playersHavingPutNicknames,
    actingPlayerNickname,
    kontra,
    gameType,
    suit,
    tout,
    playersHavingWonNicknames,
    schneiderSchwarz,
    laufendeCount,
    submitted
  } = state;

  const players = [session.firstPlayer, session.secondPlayer, session.thirdPlayer, session.fourthPlayer];

  const dealer = players[(state.currentGameIndex + 1) % 4];

  const allowedGameTypes = getAllowedGameTypes(session.ruleSet);

  function togglePlayerPut(nickname: string): void {
    setState(({playersHavingPutNicknames, ...rest}) => ({
      ...rest,
      playersHavingPutNicknames: toggleStringValueInArray(playersHavingPutNicknames, nickname)
    }));
  }

  function toggleActingPlayer(nickname: string): void {
    setState(({actingPlayerNickname, ...rest}) => ({...rest, actingPlayerNickname: actingPlayerNickname === nickname ? undefined : nickname}));
  }

  function toggleGameType(newGameType: GameType): void {
    setState(({gameType, ...rest}) => ({...rest, gameType: gameType === newGameType ? undefined : newGameType}));
  }

  function toggleSuit(newSuit: BavarianSuit) {
    setState(({suit, ...rest}) => ({...rest, suit: suit === newSuit ? undefined : newSuit}));
  }

  function toggleTout(): void {
    setState(({tout, ...rest}) => ({...rest, tout: !tout}));
  }

  function toggleKontra(kontraType: KontraType): void {
    setState(({kontra, ...rest}) => ({...rest, kontra: kontra === kontraType ? undefined : kontraType}));
  }

  function toggleWinningPlayer(nickname: string): void {
    setState(({playersHavingWonNicknames, ...rest}) => ({
      ...rest,
      playersHavingWonNicknames: toggleStringValueInArray(playersHavingWonNicknames, nickname)
    }));
  }

  function toggleSchneiderSchwarz(value: SchneiderSchwarz): void {
    setState(({schneiderSchwarz, ...rest}) => ({...rest, schneiderSchwarz: schneiderSchwarz === value ? undefined : value}));
  }

  function updateLaufendeCount(laufendeCount: number): void {
    setState((state) => ({...state, laufendeCount}));
  }

  function throwIn(): void {
    setState((state) => ({...initialState, isDoubled: true, remainingDoubledGames: state.remainingDoubledGames + 1}));
  }

  function saveGame(): void {
    if (!gameType || !actingPlayerNickname || playersHavingWonNicknames.length === 0) {
      return;
    }

    const gameInput: GameInput = {
      isDoubled,
      actingPlayerNickname,
      gameType,
      tout,
      suit,
      kontra,
      playersHavingPutNicknames,
      playersHavingWonNicknames,
      schneiderSchwarz,
      laufendeCount
    };

    createGame({variables: {groupName, sessionId, gameInput}})
      .then(() => {
        onNewGame();
        setState((state) => ({
          ...initialState,
          isDoubled: state.remainingDoubledGames > 1,
          remainingDoubledGames: Math.max(0, state.remainingDoubledGames - 1)
        }));
      })
      .catch((error) => console.error(error));
  }

  function onEndSession(): void {
    if (confirm('Wollen Sie die Sitzung wirklich beenden?\nAchtung: Sie können danach keine weiteren Spiele mehr eintragen!')) {
      endSession({variables: {groupName, sessionId}})
        .then(onNewGame)
        .catch((error) => console.error(error));
    }
  }

  return (
    <>
      <div className="columns">
        <div className="column is-one-fifth has-text-centered">
          <label htmlFor="currentGameIndex" className="label">Nummer, Geber:</label>
        </div>

        <div className="column is-one-fifths">
          <div className="field">
            <div className="control">
              <input type="number" className="input" min={1} id="currentGameIndex" defaultValue={currentGameIndex}
                     onChange={(event) => setState((state) => ({...state, currentGameIndex: parseInt(event.target.value)}))}/>
            </div>
          </div>
        </div>

        <div className="column">
          <button className="button is-fullwidth is-static">{dealer.nickname}</button>
        </div>
      </div>

      <div className="columns">
        <div className="column is-one-fifth has-text-centered">
          <label htmlFor="doubled" className="label">{t('doubled')}</label>
        </div>

        <div className="column">
          <button className={classNames('button', 'is-fullwidth', {'is-link': isDoubled})}
                  onClick={() => setState((state) => ({...state, isDoubled: !isDoubled}))}>
            {isDoubled ? <span>&#10004;</span> : <span>&#10008; nicht</span>} 2x ({remainingDoubledGames})
          </button>
        </div>
      </div>

      <div className="columns">
        <div className="column has-text-centered">
          <label className="label">Leger:</label>
        </div>
        {players.map(({nickname, firstName, lastName}) => <div className="column" key={nickname}>
            <button className={classNames('button', 'is-fullwidth', {'is-link': playersHavingPutNicknames.includes(nickname)})}
                    onClick={() => togglePlayerPut(nickname)} title={`${firstName} ${lastName}`}>
              {nickname}
            </button>

          </div>
        )}
      </div>

      <div className="columns">
        <div className="column has-text-centered">
          <label className={classNames('label', {'has-text-danger': submitted && !actingPlayerNickname})}>Spieler:</label>
        </div>
        {players.map(({nickname}) => <div className="column" key={nickname}>
            <button className={classNames('button', 'is-fullwidth', {'is-link': actingPlayerNickname === nickname})} onClick={() => toggleActingPlayer(nickname)}>
              {nickname}
            </button>
          </div>
        )}
      </div>


      <div className="columns">
        <div className="column is-one-fifth has-text-centered">
          <label className={classNames('label', {'has-text-danger': submitted && !gameType})}>
            Spiel:
          </label>
        </div>

        <div className="column">
          <div className="columns">
            {allowedGameTypes.map(({name}) =>
              <div className="column is-3" key={name}>
                <button className={classNames('button', 'is-fullwidth', {'is-link': gameType === name})} onClick={() => toggleGameType(name)}>
                  {name}
                </button>
              </div>
            )}

            <div className="column is-3">
              <button className={classNames('button', 'is-fullwidth', {'is-link': tout})} onClick={toggleTout}>
                {tout ? <span>&#10004;</span> : <span>&#10008; kein</span>} Tout
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="columns">
        <div className="column has-text-centered">
          <label className={classNames('label', {'has-text-danger': submitted && gameType && needsSuit(gameType) && !suit})}>{t('suit')}:</label>
        </div>
        {suitValues.map(([bavarianSuit, picture]) =>
          <div className="column" key={bavarianSuit}>
            <button className={classNames('button', 'is-fullwidth', {'is-link': suit === bavarianSuit})}
                    disabled={!gameType || !needsSuit(gameType)}
                    onClick={() => toggleSuit(bavarianSuit)}>
              <div className="icon is-small">
                <img src={picture} alt={bavarianSuit}/>
              </div>
            </button>
          </div>
        )}
      </div>


      <div className="columns">
        <div className="column is-one-fifth has-text-centered">
          <label className="label">Kontra/Re:</label>
        </div>
        {contraValues.map((kontraType) => <div className="column" key={kontraType}>
          <button className={classNames('button', 'is-fullwidth', {'is-link': kontra === kontraType})}
                  onClick={() => toggleKontra(kontraType)}>{kontraType}</button>
        </div>)}
      </div>


      <div className="columns">
        <div className="column has-text-centered">
          <label className={classNames('label', {'has-text-danger': submitted && playersHavingWonNicknames.length === 0})}>Gewonnen:</label>
        </div>
        {players.map(({nickname}) => <div className="column" key={nickname}>
          <button className={classNames('button', 'is-fullwidth', {'is-link': playersHavingWonNicknames.includes(nickname)})}
                  onClick={() => toggleWinningPlayer(nickname)}>
            {nickname}
          </button>
        </div>)}
      </div>

      <div className="columns">
        <div className="column is-one-fifth has-text-centered">
              <span className="label">
                <label title="Schneider">SN</label> /
                <label title="Schwarz">SW</label>
              </span>
        </div>
        {[SchneiderSchwarz.Schneider, SchneiderSchwarz.Schwarz].map((snsw) =>
          <div className="column" key={snsw}>
            <button className={classNames('button', 'is-fullwidth', {'is-link': schneiderSchwarz === snsw})} onClick={() => toggleSchneiderSchwarz(snsw)}>
              {snsw}
            </button>
          </div>
        )}
      </div>

      <div className="columns">
        <div className="column is-one-fifth has-text-centered">
          <label className="label" htmlFor="laufendeCount" title="Anzahl Laufende">{t('laufendeCount')}:</label>
        </div>
        <div className="column">
          <div className="field has-addons">
            <p className="control">
              <button className="button" onClick={() => updateLaufendeCount(laufendeCount - 1)}>-</button>
            </p>
            <p className="control is-expanded">
              <input type="number" className="input" id="laufendeCount" defaultValue={laufendeCount}
                     onChange={(event) => updateLaufendeCount(parseInt(event.target.value))}/>
            </p>
            <p className="control">
              <button className="button is-static">Lauf.</button>
            </p>
            <p className="control">
              <button className="button" onClick={() => updateLaufendeCount(laufendeCount + 1)}>+</button>
            </p>
          </div>
        </div>
      </div>

      {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

      {sessionEndError && <div className="notification is-danger has-text-centered">{sessionEndError.message}</div>}

      <div className="columns">
        <div className="column">
          <button className="button is-warning is-fullwidth" onClick={throwIn} disabled={loading || sessionEndLoading}>Zusammenschmiss</button>
        </div>
        <div className="column">
          <button className="button is-link is-fullwidth" onClick={saveGame} disabled={loading || sessionEndLoading}>Spiel eintragen</button>
        </div>
      </div>

      <div className="buttons">
        <button className="button is-danger is-fullwidth" onClick={onEndSession} disabled={loading || sessionEndLoading}>Sitzung abschließen</button>
      </div>

    </>
  );
}
