import React, { useState } from "react"
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Button,
} from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import Image from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"

interface ModalProps {
  open: boolean
  onClose: () => void
  data: Record<string, any>
}

const useGalleryStyles = makeStyles(() =>
  createStyles({
    gridList: {
      height: 500,
    },
    gridImage: {
      height: "100%",
    },
    gridImageWrapper: {
      height: "100%",
    },
    gridTile: {
      cursor: "pointer",
      "&:hover": {
        "& $gridImage::after": {
          content: '""',
          position: "absolute",
          zIndex: 1000,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, .15)",
        },
      },
    },
  })
)

const useModalStyles = makeStyles(() =>
  createStyles({
    subtitle: {
      fontWeight: 300,
    },
    image: {
      height: "100vh",
    },
  })
)

function Modal(props: ModalProps) {
  const classes = useModalStyles()
  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      scroll="paper"
      maxWidth="lg"
      fullWidth={true}
    >
      <DialogTitle>
        GCP Essentials Workshop
        <Typography variant="subtitle1" className={classes.subtitle}>
          Workshop hosted to teach basic Google Cloud Computing
        </Typography>
      </DialogTitle>
      <Image
        className={classes.image}
        fluid={props.data.file.childImageSharp.fluid}
        imgStyle={{ objectFit: "contain" }}
      />
      <DialogActions>
        <Button color="primary" variant="outlined" onClick={props.onClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function Gallery() {
  const classes = useGalleryStyles()
  const data = useStaticQuery(graphql`
    query GalleryQuery {
      file(name: { eq: "panda" }) {
        childImageSharp {
          fluid {
            aspectRatio
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `)
  const [hover, setHover] = useState<number | null>(null)
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <GridList cellHeight={200} className={classes.gridList} cols={3}>
      <GridListTile
        cols={1}
        rows={1}
        className={classes.gridTile}
        onClick={handleOpen}
      >
        <div
          className={classes.gridImageWrapper}
          onPointerEnter={() => setHover(1)}
          onPointerLeave={() => setHover(null)}
        >
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.gridImage}
          />
          {hover === 1 && (
            <GridListTileBar
              title="GCP Essentials Workshop"
              subtitle="Workshop hosted to teach basic Google Cloud Computing"
            />
          )}
        </div>
      </GridListTile>
      <GridListTile
        cols={2}
        rows={1}
        className={classes.gridTile}
        onClick={handleOpen}
      >
        <div
          className={classes.gridImageWrapper}
          onPointerEnter={() => setHover(2)}
          onPointerLeave={() => setHover(null)}
        >
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.gridImage}
          />
          {hover === 2 && (
            <GridListTileBar
              title="GCP Essentials Workshop"
              subtitle="Workshop hosted to teach basic Google Cloud Computing"
            />
          )}
        </div>
      </GridListTile>
      <GridListTile
        cols={2}
        rows={2}
        className={classes.gridTile}
        onClick={handleOpen}
      >
        <div
          className={classes.gridImageWrapper}
          onPointerEnter={() => setHover(3)}
          onPointerLeave={() => setHover(null)}
        >
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.gridImage}
          />
          {hover === 3 && (
            <GridListTileBar
              title="GCP Essentials Workshop"
              subtitle="Workshop hosted to teach basic Google Cloud Computing"
            />
          )}
        </div>
      </GridListTile>
      <GridListTile
        cols={1}
        rows={2}
        className={classes.gridTile}
        onClick={handleOpen}
      >
        <div
          className={classes.gridImageWrapper}
          onPointerEnter={() => setHover(4)}
          onPointerLeave={() => setHover(null)}
        >
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.gridImage}
          />
          {hover === 4 && (
            <GridListTileBar
              title="GCP Essentials Workshop"
              subtitle="Workshop hosted to teach basic Google Cloud Computing"
            />
          )}
        </div>
      </GridListTile>
      <Modal open={open} onClose={handleClose} data={data} />
    </GridList>
  )
}

export default Gallery
