import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Lnk from "./Lnk";

const LinkList = props => {
  if (props.feedQuery && props.feedQuery.loading) {
    return <div>Loading</div>;
  }
  if (props.feedQuery && props.feedQuery.error) {
    return <div>Error</div>;
  }
  const linksToRender = props.feedQuery.feed.links;
  return (
    <div>{linksToRender.map(link => <Lnk key={link.id} link={link} />)}</div>
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

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

export default graphql(FEED_QUERY, { name: "feedQuery" })(LinkList);
