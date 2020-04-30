import React, { useRef, useEffect } from "react"
import lottie from "lottie-web"
import animation from "../animation.json"

function Lottie() {
  const lottieRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieRef.current as Element,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animation,
    })
    return () => anim.destroy()
  }, [])
  return <div ref={lottieRef} />
}

export default Lottie
