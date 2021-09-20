import {createStore} from 'redux';
import {StoreAction, USER_LOGIN, USER_LOGOUT} from './actions';
import {LoggedInUserFragment} from '../graphql';

const userField = 'user';

interface StoreState {
  currentUser?: LoggedInUserFragment;
}

function rootReducer(store: StoreState = {}, action: StoreAction): StoreState {
  switch (action.type) {
    case USER_LOGIN:
      localStorage.setItem(userField, JSON.stringify(action.user));
      return {...store, currentUser: action.user};
    case USER_LOGOUT:
      localStorage.removeItem(userField);
      return {...store, currentUser: undefined};
    default:
      return store;
  }
}

function initialState(): StoreState {
  const currentUserString = localStorage.getItem(userField);

  return {
    currentUser: currentUserString ? JSON.parse(currentUserString) : undefined,
  };
}

export const store = createStore(rootReducer, initialState());

export const currentUserSelector: (store: StoreState) => LoggedInUserFragment | undefined = (store) => store.currentUser;

