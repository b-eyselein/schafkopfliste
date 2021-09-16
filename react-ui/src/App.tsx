import React, {useState} from 'react';
import {Home} from './Home';
import {Route, Switch} from 'react-router';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {RegisterForm} from './RegisterForm';

interface User {
  username: string;
}

function getCurrentUser(): User | undefined {
  return undefined;
}

export function App() {

  const [navbarToggled, setNavbarToggled] = useState(false);

  // TODO!
  const currentUser = getCurrentUser();

  function logout(): void {
    console.error('TODO: logout!');
  }

  return (
    <>

      <nav className="navbar is-danger" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item has-text-weight-bold" to="/">SchafkopfListe</Link>

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
              ? <button className="navbar-item" onClick={logout}>Logout {currentUser.username}</button>
              : <>
                <Link className="navbar-item" to="/registerForm">Registrieren</Link>
                <Link className="navbar-item" to="/loginForm">Login</Link>
              </>}
          </div>

        </div>
      </nav>


      <Switch>
        <Route path={'/'} exact component={Home}/>
        <Route path={'/registerForm'} component={RegisterForm}/>
      </Switch>
    </>
  );
}
