import React from "react";
import PropTypes from "prop-types";

const Lnk = props => {
  const { description, url } = props.link;
  return (
    <div>
      <div>
        {description} ({url})
      </div>
    </div>
  );
};

Lnk.propTypes = {
  link: PropTypes.shape({
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default Lnk;
