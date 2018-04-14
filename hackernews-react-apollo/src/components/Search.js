import React, { Component } from "react";
import PropTypes from "prop-types";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import Lnk from "./Lnk";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

class Search extends Component {
  constructor() {
    super();
    this.state = {
      links: [],
      filter: ""
    };
  }
  async executeSearch() {
    const { filter } = this.state;
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    });
    const { links } = result.data.feed;
    this.setState({ links });
  }
  render() {
    return (
      <div>
        <div>
          <input
            type="text"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this.executeSearch()}>search</button>
        </div>
        {this.state.links.map((link, index) => (
          <Lnk key={link.id} link={link} index={index} />
        ))}
      </div>
    );
  }
}

Search.propTypes = {
  client: PropTypes.shape({
    query: PropTypes.func.isRequired
  }).isRequired
};
export default withApollo(Search);
