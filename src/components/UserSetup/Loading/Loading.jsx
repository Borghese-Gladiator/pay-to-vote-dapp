/**
 * Loading component - displays loading for "wait ms" and then checks condition
 *  if condition - displays done
 *  else - displays children
 */
import { useEffect } from "react";
import useAsync from "../../../hooks/useAsync";
import PropTypes from 'prop-types';
import Lottie from "react-lottie";
import * as loadingData from "./4397-loading-blocks.json";
import * as doneData from "./92460-checkmark-animation.json";
import * as errorData from "./14651-error-animation.json";
import {
  Flex,
  Heading,
  SlideFade
} from '@chakra-ui/react';

const loadingOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
const doneOptions = {
  loop: false,
  autoplay: true,
  animationData: doneData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
const errorOptions = {
  loop: false,
  autoplay: true,
  animationData: errorData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
}

function Loading({ wait, loadingText, condition, children }) {
  const { execute, status, value, error } = useAsync(loadPage, false);

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function loadPage() {
    await timeout(wait);
    if (condition) {
      throw new Error(errorText)
    }
  }
  useEffect(() => {
    execute()
  }, [])

  return (
    <>
      <Flex direction="column" justify="center" alignItems="center">
        <Heading as="xl">{loadingText}</Heading>
        {status === "idle" || status === "pending" && <Lottie options={loadingOptions} height={120} width={120} />}
        {status === "error" && <Lottie options={errorOptions} height={120} width={120} />}
        {status === "success" && <Lottie options={doneOptions} height={120} width={120} />}
      </Flex>
      {status === "error" && <SlideFade in={true} offsetY='20px'>{children}</SlideFade>}
    </>
  )
}

Loading.propTypes = {
  wait: PropTypes.number,
  loadingText: PropTypes.string,
  condition: PropTypes.bool,
}

export default Loading;