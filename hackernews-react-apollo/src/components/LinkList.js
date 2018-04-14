import React, { Component } from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Lnk from "./Lnk";
import { LINKS_PER_PAGE } from "../constants";

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
      links {
        id
        createdAt
        url
        description
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

class LinkList extends Component {
  componentDidMount() {
    this.subscribeToNewLinks();
    this.subscribeToNewVotes();
  }
  getLinksToRender(isNewPage) {
    if (isNewPage) {
      return this.props.feedQuery.feed.links;
    }
    const rankedLinks = this.props.feedQuery.feed.links.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedLinks;
  }
  nextPage() {
    const page = parseInt(this.props.match.params.page, 10);
    if (page <= this.props.feedQuery.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      this.props.history.push(`/new/${nextPage}`);
    }
  }
  previousPage() {
    const page = parseInt(this.props.match.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      this.props.history.push(`/new/${previousPage}`);
    }
  }
  updateCacheAfterVote(store, createVote, linkId) {
    const isNewPage = this.props.location.pathname.includes("new");
    const page = parseInt(this.props.match.params.page, 10);
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? "createdAt_DESC" : null;
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    });
    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  }
  subscribeToNewLinks() {
    this.props.feedQuery.subscribeToMore({
      document: gql`
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
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [
          subscriptionData.data.newLink.node,
          ...previous.feed.links
        ];
        const result = {
          ...previous,
          feed: {
            ...previous.feed,
            count: previous.feed.count + 1,
            links: newAllLinks
          }
        };
        return result;
      }
    });
  }
  subscribeToNewVotes() {
    this.props.feedQuery.subscribeToMore({
      document: gql`
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
      `
    });
  }
  render() {
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading</div>;
    }
    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>;
    }
    const isNewPage = this.props.location.pathname.includes("new");
    const linksToRender = this.getLinksToRender(isNewPage);
    const page = parseInt(this.props.match.params.page, 10);

    return (
      <div>
        <div>
          {linksToRender.map((link, index) => (
            <Lnk
              key={link.id}
              updateStoreAfterVote={this.updateCacheAfterVote}
              index={page ? (page - 1) * LINKS_PER_PAGE + index : index}
              link={link}
            />
          ))}
        </div>
        {isNewPage && (
          <div className="flex ml4 mv3 gray">
            <button className="pointer mr2" onClick={() => this.previousPage()}>
              Previous
            </button>
            <button className="pointer" onClick={() => this.nextPage()}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  }
}

LinkList.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      page: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.object.isRequired,
  feedQuery: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    feed: PropTypes.shape({
      count: PropTypes.number,
      links: PropTypes.array.isRequired
    }),
    subscribeToMore: PropTypes.func
  }).isRequired
};

export default graphql(FEED_QUERY, {
  name: "feedQuery",
  options: ownProps => {
    const page = parseInt(ownProps.match.params.page, 10);
    const isNewPage = ownProps.location.pathname.includes("new");
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? "createdAt_DESC" : null;
    return {
      variables: { first, skip, orderBy }
    };
  }
})(LinkList);
