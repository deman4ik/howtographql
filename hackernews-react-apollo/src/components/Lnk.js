import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";

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

const Lnk = ({ link, index, updateStoreAfterVote }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: link.id }}
            update={(cache, { data: { vote } }) =>
              updateStoreAfterVote(cache, vote, link.id)
            }
          >
            {voteMutation => (
              <button className="ml1 gray f11" onClick={voteMutation}>
                ▲
              </button>
            )}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description}({link.url})
        </div>
        <div className="f6 lh-cpo gray">
          {link.votes.length} votes | by{" "}
          {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};
Lnk.defaultProps = {
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
  updateStoreAfterVote: PropTypes.func
};

export default Lnk;
