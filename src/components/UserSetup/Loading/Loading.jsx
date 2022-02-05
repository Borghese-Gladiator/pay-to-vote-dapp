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
  Text,
  SlideFade
} from '@chakra-ui/react';
const textOneLineStyle = { whiteSpace: "nowrap" }

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

function Loading({ wait, loadingText, condition, errorText, children }) {
  const { execute, status, value, error } = useAsync(loadPage, false);

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function loadPage() {
    console.log("LOADING HERE");
    await timeout(wait);
    if (await condition()) {
      console.log("Throwing error")
      throw new Error(errorText)
    }
  }
  useEffect(() => {
    console.log(error)
    execute()
  }, [])

  return (
    <>
      <Flex direction="row" justify="center" alignItems="center">
        <Heading as='h3' size='lg'>{loadingText}</Heading>
        {status === "idle" || status === "pending" && <Lottie options={loadingOptions} height={120} width={120} />}
        {status === "error" && <Flex alignItems="center">
          <Lottie options={errorOptions} height={120} width={120} />
          <Text style={textOneLineStyle}>{errorText}</Text>
        </Flex>}
        {status === "success" && <Lottie options={doneOptions} height={120} width={120} />}
      </Flex>
      {status === "error" && <SlideFade in={true} offsetY='20px'>{children}</SlideFade>}
    </>
  )
}

Loading.propTypes = {
  wait: PropTypes.number,
  loadingText: PropTypes.string,
  condition: PropTypes.func,
}

export default Loading;