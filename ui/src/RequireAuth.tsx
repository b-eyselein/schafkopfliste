import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {currentUserSelector} from './store/store';
import {loginUrl} from './urls';
import {LoggedInUserFragment} from './graphql';

interface IProps {
  to?: string,
  children: (user: LoggedInUserFragment) => JSX.Element
}

export function RequireAuth({to = loginUrl, children}: IProps): JSX.Element {

  const currentUser = useSelector(currentUserSelector);

  return currentUser
    ? children(currentUser)
    : <Navigate to={to}/>;
}
