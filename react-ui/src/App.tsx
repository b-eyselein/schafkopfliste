import React, {Dispatch, useState} from 'react';
import {Home} from './Home';
import {Route, Switch} from 'react-router';
import classNames from 'classnames';
import {Link, useHistory} from 'react-router-dom';
import {RegisterForm} from './RegisterForm';
import {LoginForm} from './LoginForm';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector} from './store/store';
import {StoreAction, userLogoutAction} from './store/actions';
import {homeUrl, loginUrl, playersBaseUrl, registerUrl, ruleSetsBaseUrl} from './urls';
import {RuleSetsBase} from './RuleSets';
import {PlayersBase} from './Players';

export function App(): JSX.Element {

  const [navbarToggled, setNavbarToggled] = useState(false);
  const dispatch = useDispatch<Dispatch<StoreAction>>();
  const currentUser = useSelector(currentUserSelector);
  const history = useHistory();

  function logout(): void {
    dispatch(userLogoutAction);
    // FIXME: redirect!
    history.push('/loginForm');
  }

  return (
    <>

      <nav className="navbar is-danger" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item has-text-weight-bold" to={homeUrl}>SchafkopfListe</Link>

          <a role="button" className={classNames('navbar-burger', 'burger', {'is-active': navbarToggled})} aria-label="menu" aria-expanded="false"
             onClick={() => setNavbarToggled((navbarToggled) => !navbarToggled)}>
            <span aria-hidden="true"/>
            <span aria-hidden="true"/>
            <span aria-hidden="true"/>
          </a>
        </div>

        <div id="navbarBasicExample" className={classNames('navbar-menu', {'is-active': navbarToggled})}>
          <div className="navbar-start">
            <Link className="navbar-item" to="/ruleSets">Regelsätze</Link>
            {currentUser && <Link className="navbar-item" to="/players">Spieler</Link>}
            <Link className="navbar-item" to="/groups">Gruppen</Link>
          </div>

          <div className="navbar-end">
            {currentUser
              ? <div className="navbar-item">
                <button className="button" onClick={logout}>Logout {currentUser.username}</button>
              </div>
              : <>
                <Link className="navbar-item" to={registerUrl}>Registrieren</Link>
                <Link className="navbar-item" to={loginUrl}>Login</Link>
              </>}
          </div>

        </div>
      </nav>


      <Switch>
        <Route path={homeUrl} exact component={Home}/>
        <Route path={loginUrl} component={LoginForm}/>
        <Route path={registerUrl} component={RegisterForm}/>
        <Route path={ruleSetsBaseUrl} component={RuleSetsBase}/>
        <Route path={playersBaseUrl} component={PlayersBase}/>
      </Switch>
    </>
  );
}
