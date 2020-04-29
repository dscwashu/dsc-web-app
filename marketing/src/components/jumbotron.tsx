import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  MutableRefObject,
} from "react"
import { Container, Box } from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Canvas, useThree, useFrame } from "react-three-fiber"
import {
  PerspectiveCamera,
  InstancedMesh,
  Geometry,
  Material,
  Object3D,
} from "three"

interface JumbotronProps {
  children: React.ReactNode
}

interface CameraProps {
  refProp: MutableRefObject<PerspectiveCamera | undefined>
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "relative",
      zIndex: 1000,
      height: 600,
      display: "flex",
      alignItems: "center",
    },
    canvas: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 600,
      zIndex: 0,
    },
  })
)

function BlockScene() {
  const ref = useRef<InstancedMesh>()
  const minHeight = 1
  const blockSize = 0.5
  const blockSceneWidth = 100
  const blockSceneHeight = 40
  const block = useMemo(() => new Object3D(), [])
  useFrame(state => {
    if (ref.current) {
      const time = state.clock.getElapsedTime()
      for (let i = 0; i < blockSceneWidth; i++) {
        const x =
          -((blockSceneWidth / 2) * blockSize) + blockSize / 2 + i * blockSize
        for (let j = 0; j < blockSceneHeight; j++) {
          const z =
            -((blockSceneHeight / 2) * blockSize) +
            blockSize / 2 +
            j * blockSize
          const blockHeight =
            Math.sin(0.3 * x + time) * Math.sin(0.3 * z + time) + minHeight
          block.position.set(x, blockHeight / 2, z)
          block.scale.y = blockHeight
          block.updateMatrix()
          ref.current.setMatrixAt(i * blockSceneHeight + j, block.matrix)
        }
      }
      ref.current.instanceMatrix.needsUpdate = true
    }
  })
  return (
    <instancedMesh
      ref={ref}
      args={[
        (null as unknown) as Geometry,
        (null as unknown) as Material,
        blockSceneHeight * blockSceneWidth,
      ]}
    >
      <boxBufferGeometry attach="geometry" args={[blockSize, 1, blockSize]} />
      <meshPhongMaterial attach="material" color="white" />
    </instancedMesh>
  )
}

function Camera(props: CameraProps) {
  const { setDefaultCamera } = useThree()
  useEffect(() => {
    if (props.refProp.current) {
      void setDefaultCamera(props.refProp.current), []
      props.refProp.current.position.set(0, 3, 10)
      props.refProp.current.lookAt(0, 0, 0)
    }
  }, [])
  return <perspectiveCamera ref={props.refProp} {...props} />
}

function Jumbotron(props: JumbotronProps) {
  const classes = useStyles()
  const cameraRef = useRef<PerspectiveCamera>()
  const theta = useRef(0)
  const clientX = useRef(0)
  const initClientX = useCallback((e: React.PointerEvent) => {
    clientX.current = e.clientX
  }, [])
  const calculateCameraAngle = useCallback((e: React.PointerEvent) => {
    const delta = e.clientX - clientX.current
    const newTheta = theta.current + delta * 0.0005
    if (newTheta > -(Math.PI / 10) && newTheta < Math.PI / 10) {
      const x = 10 * Math.sin(newTheta)
      const z = 10 * Math.cos(newTheta)
      if (cameraRef.current) {
        cameraRef.current.position.set(x, 3, z)
        cameraRef.current.lookAt(0, 0, 0)
      }
      theta.current = newTheta
    }
    clientX.current = e.clientX
  }, [])
  return (
    <React.Fragment>
      <div className={classes.canvas}>
        <Canvas>
          <Camera refProp={cameraRef} />
          <ambientLight intensity={0.7} />
          <pointLight position={[0, 8, 10]} intensity={0.5} />
          <BlockScene />
        </Canvas>
      </div>
      <Container
        maxWidth="lg"
        className={classes.root}
        touch-action="none"
        onPointerMove={calculateCameraAngle}
        onPointerEnter={initClientX}
      >
        <Box maxWidth={700}>{props.children}</Box>
      </Container>
    </React.Fragment>
  )
}

export default Jumbotron
