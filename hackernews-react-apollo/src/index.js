import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client"; // eslint-disable-line
import { HttpLink } from "apollo-link-http"; // eslint-disable-line
import { InMemoryCache } from "apollo-cache-inmemory"; // eslint-disable-line
import "./styles/index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

const httpLink = new HttpLink({ uri: "http://localhost:4000" });

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();
