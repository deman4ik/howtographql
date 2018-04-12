import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client"; // eslint-disable-line
import { HttpLink } from "apollo-link-http"; // eslint-disable-line
import { InMemoryCache } from "apollo-cache-inmemory"; // eslint-disable-line
import { ApolloLink } from "apollo-client-preset";
import { AUTH_TOKEN } from "./constants";
import "./styles/index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

const httpLink = new HttpLink({ uri: "http://localhost:4000" });

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  });
  return forward(operation);
});

const httpLinkWuthAuthToken = middlewareAuthLink.concat(httpLink);

const client = new ApolloClient({
  link: httpLinkWuthAuthToken,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
