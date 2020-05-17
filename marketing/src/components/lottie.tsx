import React, { useRef, useEffect } from "react"
import { createStyles, makeStyles } from "@material-ui/core"
import lottie from "lottie-web"
import animation from "../animation.json"

const useStyles = makeStyles(() =>
  createStyles({
    lottie: {
      width: "100%",
      height: "100%",
    },
  })
)

function Lottie() {
  const classes = useStyles()
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
  return <div className={classes.lottie} ref={lottieRef} />
}

export default Lottie
