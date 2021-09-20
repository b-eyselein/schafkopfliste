import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';
import {App} from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {ApolloClient, ApolloLink, ApolloProvider, concat, HttpLink, InMemoryCache} from '@apollo/client';
import {serverUrl} from './urls';
import i18next from 'i18next';
import {I18nextProvider, initReactI18next} from 'react-i18next';

import common_de from './locales/de/common.json';
import common_en from './locales/en/common.json';

// noinspection JSIgnoredPromiseFromCall
i18next
  .use(initReactI18next)
  .init({
    resources: {
      de: {common: common_de},
      en: {common: common_en}
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

const apolloAuthMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: store.getState().currentUser?.token || null
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(apolloAuthMiddleware, new HttpLink({uri: `${serverUrl}/graphql`})),
  defaultOptions: {
    query: {fetchPolicy: 'no-cache'},
    watchQuery: {fetchPolicy: 'no-cache'},
    mutate: {fetchPolicy: 'no-cache'}
  }
});


ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </ApolloProvider>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
