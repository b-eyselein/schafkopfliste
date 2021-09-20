import {Action} from 'redux';
import {LoggedInUserFragment} from '../graphql';

// User login

export const USER_LOGIN = 'USER_LOGIN';

interface UserLoginAction extends Action<typeof USER_LOGIN> {
  user: LoggedInUserFragment;
}

export function userLoginAction(user: LoggedInUserFragment): UserLoginAction {
  return {type: USER_LOGIN, user};
}

// User logout

export const USER_LOGOUT = 'USER_LOGOUT';

type UserLogoutAction = Action<typeof USER_LOGOUT>;

export const userLogoutAction: UserLogoutAction = {type: USER_LOGOUT};

// Actions

export type StoreAction = UserLoginAction | UserLogoutAction;
