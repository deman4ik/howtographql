import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Lnk from "./Lnk";
import LinkListSubscriptions from "./LinkListSubscriptions";
import { LINKS_PER_PAGE } from "../constants";

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
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
      count
    }
  }
`;

const updateCacheAfterVote = (props, cache, createVote, linkId) => {
  const isNewPage = props.location.pathname.includes("new");
  const page = parseInt(props.match.params.page, 10);
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? "createdAt_DESC" : null;
  const data = cache.readQuery({
    query: FEED_QUERY,
    variables: { first, skip, orderBy }
  });
  const votedLink = data.feed.links.find(link => link.id === linkId);
  votedLink.votes = createVote.link.votes;

  cache.writeQuery({ query: FEED_QUERY, data });
};

const getQueryVariables = props => {
  const isNewPage = props.location.pathname.includes("new");
  const page = parseInt(props.match.params.page, 10);
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? "createdAt_DESC" : null;
  return { first, skip, orderBy };
};

const getLinksToRender = (props, data) => {
  const isNewPage = props.location.pathname.includes("new");
  if (isNewPage) {
    return data.feed.links;
  }
  const rankedLinks = data.feed.links.slice();
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
  return rankedLinks;
};

const nextPage = (props, data) => {
  const page = parseInt(props.match.params.page, 10);
  if (page <= data.feed.count / LINKS_PER_PAGE) {
    const nextPageNumb = page + 1;
    props.history.push(`/new/${nextPageNumb}`);
  }
};

const previousPage = props => {
  const page = parseInt(props.match.params.page, 10);
  if (page > 1) {
    const previousPageNumb = page - 1;
    props.history.push(`/new/${previousPageNumb}`);
  }
};
const LinkList = props => (
  <Query query={FEED_QUERY} variables={getQueryVariables(props)}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) return <div>Fetching</div>;
      if (error) return <div>Error</div>;

      const linksToRender = getLinksToRender(props, data);

      const isNewPage = props.location.pathname.includes("new");

      return (
        <LinkListSubscriptions subscribeToMore={subscribeToMore}>
          {linksToRender.map((link, index) => (
            <Lnk
              key={link.id}
              link={link}
              index={index}
              updateStoreAfterVote={updateCacheAfterVote.bind(this, props)} //eslint-disable-line
            />
          ))}
          {isNewPage && (
            <div className="flex ml4 mv3 gray">
              <button
                className="pointer mr2"
                onClick={previousPage.bind(this, props)} //eslint-disable-line
              >
                Previous
              </button>
              <button
                className="pointer"
                onClick={nextPage.bind(this, props, data)} //eslint-disable-line
              >
                Next
              </button>
            </div>
          )}
        </LinkListSubscriptions>
      );
    }}
  </Query>
);

LinkList.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default LinkList;
