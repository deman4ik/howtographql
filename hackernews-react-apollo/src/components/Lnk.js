import React from "react";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";

const Lnk = props => {
  const voteForLink = async () => {
    const linkId = props.link.id;
    await props.voteMutation({
      variables: {
        linkId
      },
      update: (store, { data: { vote } }) => {
        props.updateStoreAfterVote(store, vote, linkId);
      }
    });
  };
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <button className="ml1 gray f11" onClick={() => voteForLink()}>
            ▲
          </button>
        )}
      </div>
      <div className="ml1">
        <div>
          {props.link.description}({props.link.url})
        </div>
        <div className="f6 lh-cpo gray">
          {props.link.votes.length} votes | by{" "}
          {props.link.postedBy ? props.link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(props.link.createdAt)}
        </div>
      </div>
    </div>
  );
};
Lnk.defaultProps = {
  voteMutation: null,
  updateStoreAfterVote: null
};
Lnk.propTypes = {
  index: PropTypes.number.isRequired,
  link: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    postedBy: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.string,
    votes: PropTypes.array
  }).isRequired,
  voteMutation: PropTypes.func,
  updateStoreAfterVote: PropTypes.func
};

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
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
`;

export default graphql(VOTE_MUTATION, { name: "voteMutation" })(Lnk);
