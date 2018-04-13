import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Lnk from "./Lnk";

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
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

const LinkList = props => {
  const updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY });
    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  };
  if (props.feedQuery && props.feedQuery.loading) {
    return <div>Loading</div>;
  }
  if (props.feedQuery && props.feedQuery.error) {
    return <div>Error</div>;
  }
  const linksToRender = props.feedQuery.feed.links;
  return (
    <div>
      {linksToRender.map((link, index) => (
        <Lnk
          key={link.id}
          updateStoreAfterVote={updateCacheAfterVote}
          index={index}
          link={link}
        />
      ))}
    </div>
  );
};

LinkList.propTypes = {
  feedQuery: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    feed: PropTypes.shape({
      links: PropTypes.array.isRequired
    })
  }).isRequired
};

export default graphql(FEED_QUERY, { name: "feedQuery" })(LinkList);
