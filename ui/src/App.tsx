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
import {groupsUrlFragment, homeUrl, loginUrl, registerUrl} from './urls';
import {GroupBase} from './GroupBase';
import {useTranslation} from 'react-i18next';

export function App(): JSX.Element {

  const [navbarToggled, setNavbarToggled] = useState(false);
  const dispatch = useDispatch<Dispatch<StoreAction>>();
  const currentUser = useSelector(currentUserSelector);
  const history = useHistory();
  const {t} = useTranslation('common');

  function logout(): void {
    dispatch(userLogoutAction);
    history.push('/loginForm');
  }

  return (
    <>
      <nav className="navbar is-danger" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item has-text-weight-bold" to={homeUrl}>SchafkopfListe</Link>

          <a role="button" className={classNames('navbar-burger', 'burger', {'is-active': navbarToggled})} aria-label="menu" aria-expanded="false"
             onClick={() => setNavbarToggled((navbarToggled) => !navbarToggled)}>
            <span aria-hidden="true"/><span aria-hidden="true"/><span aria-hidden="true"/>
          </a>
        </div>

        <div id="navbarBasicExample" className={classNames('navbar-menu', {'is-active': navbarToggled})}>
          <div className="navbar-end">
            {currentUser
              ? <div className="navbar-item">
                <button className="button" onClick={logout}>{t('logout')} {currentUser.username}</button>
              </div>
              : <>
                <Link className="navbar-item" to={registerUrl}>{t('register')}</Link>
                <Link className="navbar-item" to={loginUrl}>{t('login')}</Link>
              </>}
          </div>
        </div>
      </nav>

      <Switch>
        <Route path={homeUrl} exact component={Home}/>
        <Route path={loginUrl} component={LoginForm}/>
        <Route path={registerUrl} component={RegisterForm}/>
        <Route path={`/${groupsUrlFragment}/:groupId`} component={GroupBase}/>
      </Switch>
    </>
  );
}
