import React, { Component } from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { FEED_QUERY } from "./LinkList";
import { LINKS_PER_PAGE } from "../constants";

class CreateLink extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
      url: ""
    };
  }

  async createLink() {
    const { description, url } = this.state;
    await this.props.postMutation({
      variables: {
        description,
        url
      },
      update: (store, { data: { post } }) => {
        const first = LINKS_PER_PAGE;
        const skip = 0;
        const orderBy = "createdAt_DESC";
        const data = store.readQuery({
          query: FEED_QUERY,
          variables: { first, skip, orderBy }
        });
        data.feed.links.splice(0, 0, post);
        data.feed.links.pop();
        store.writeQuery({
          query: FEED_QUERY,
          data,
          variables: { first, skip, orderBy }
        });
      }
    });
    this.props.history.push("/");
  }

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={() => this.createLink()}>Submit</button>
      </div>
    );
  }
}

CreateLink.propTypes = {
  postMutation: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;
export default graphql(POST_MUTATION, { name: "postMutation" })(CreateLink);
