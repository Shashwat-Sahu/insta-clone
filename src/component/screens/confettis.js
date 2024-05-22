import React from 'react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export default () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      width={width}
      height={height+10000}
      gravity={0.4}
    />
  )
}