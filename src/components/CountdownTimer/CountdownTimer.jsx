import { useState, useEffect } from 'react'
import PropTypes from "prop-types";

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
    <div>
      <p>{`${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}</p>
    </div>
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
/*
import React, { useEffect, useState } from "react";
import { convertDateToStr } from "../../utils";

function CountdownTimer({ endTime }) {
  const [timeStr, setTimeStr] = useState();
  function calculateTimeLeft(endTime) {
    const difference = endTime - new Date();
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0}
    }
    const hours = Math.floor(difference / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
    return convertDateToStr(difference);
  };

  useEffect(() => {
    setTimeout(() => {
      setTimeStr(calculateTimeLeft())
    }, 1000);
  });
  
  return (
    <Heading as={"h3"}>{timeStr}</Heading>
  );
}

CountdownTimer.propTypes = {
  date: PropTypes.instanceOf(Date)
}

export default CountdownTimer;
*/