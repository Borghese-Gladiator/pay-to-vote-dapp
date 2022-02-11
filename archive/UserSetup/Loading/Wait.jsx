import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

function Wait({ wait, show, children }) {
  const [waitTimeOver, setWaitTimeOver] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setWaitTimeOver(true)
    }, wait)
  }, [])

  if (waitTimeOver && show) {
    return <>{children}</>
  }
  return <></>
}

Wait.propTypes = {
  wait: PropTypes.number,
  show: PropTypes.bool
}

export default Wait;