import React from 'react'

function useConstant<T>(init: () => T): T {
  const ref = React.useRef<T>()
  if (!ref.current) {
    ref.current = init()
  }
  return ref.current
}

export default useConstant
