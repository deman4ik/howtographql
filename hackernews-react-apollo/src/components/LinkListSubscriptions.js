import { Component } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      node {
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

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      node {
        id
        link {
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
        user {
          id
        }
      }
    }
  }
`;

class LinkListSubscriptions extends Component {
  componentDidMount() {
    this.subscribeToNewLinks();
    this.subscribeToNewVotes();
  }

  subscribeToNewLinks() {
    this.props.subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newLink = subscriptionData.data.newLink.node;
        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename //eslint-disable-line
          }
        });
      }
    });
  }

  subscribeToNewVotes() {
    this.props.subscribeToMore({ document: NEW_VOTES_SUBSCRIPTION });
  }

  render() {
    return this.props.children;
  }
}
LinkListSubscriptions.propTypes = {
  subscribeToMore: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default LinkListSubscriptions;
