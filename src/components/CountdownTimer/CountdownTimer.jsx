import { useState, useEffect } from 'react'
import PropTypes from "prop-types";
import { Text } from "@chakra-ui/react";
import { textOneLineStyle } from "../../utils";

function CountdownTimer({ endTime }) {
  const { hours = 0, minutes = 0, seconds = 60 } = endTime;
  const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);
  const tick = () => {
    if (hrs === 0 && mins === 0 && secs === 0)
      reset()
    else if (mins === 0 && secs === 0) {
      setTime([hrs - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([hrs, mins - 1, 59]);
    } else {
      setTime([hrs, mins, secs - 1]);
    }
  };

  const reset = () => setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);
  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return (
    <Text fontSize='lg' noOfLines={1}>
      {`${hrs.toString().padStart(2, '0')} hours
      ${mins.toString().padStart(2, '0')} minutes
      ${secs.toString().padStart(2, '0')} seconds`}
    </Text>
  );
}

CountdownTimer.propTypes = {
  endTime: PropTypes.shape({
    hours: PropTypes.number,
    minutes: PropTypes.number,
    seconds: PropTypes.number,
  }).isRequired
}

export default CountdownTimer;