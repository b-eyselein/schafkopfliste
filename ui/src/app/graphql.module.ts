import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {ApolloClientOptions, ApolloLink, InMemoryCache, NormalizedCacheObject} from '@apollo/client/core';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {setContext} from '@apollo/client/link/context';
import {LoggedInUserFragment} from './_services/apollo_services';
import {getCurrentUser} from './_services/authentication.service';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<NormalizedCacheObject> {
  const auth = setContext(() => {
    const loggedInUser: LoggedInUserFragment | null = getCurrentUser();

    if (loggedInUser === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: loggedInUser.token
        }
      };
    }
  });

  return {
    link: ApolloLink.from([auth, httpLink.create({uri: '/graphql'})]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {fetchPolicy: 'no-cache'},
      watchQuery: {fetchPolicy: 'no-cache'},
      mutate: {fetchPolicy: 'no-cache'}
    }
  };
}

@NgModule({
  imports: [BrowserModule, HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
}
