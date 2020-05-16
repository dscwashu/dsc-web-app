import React, { useState } from "react"
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Button,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import Image, { FluidObject } from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"

interface ModalProps {
  open: boolean
  onClose: () => void
  data: ModalData | undefined
}

interface ModalData {
  title: string
  subtitle: string
  fluid: FluidObject
}

const useGalleryStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridList: {
      height: 280,
      [theme.breakpoints.up("sm")]: {
        height: 500,
      },
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

const useModalStyles = makeStyles((theme: Theme) =>
  createStyles({
    subtitle: {
      fontWeight: 300,
      lineHeight: "normal",
    },
    image: {
      height: "100%",
    },
    background: {
      height: "100vh",
      backgroundColor: theme.palette.grey["900"],
    },
  })
)

function Modal({ open, onClose, data }: ModalProps) {
  const classes = useModalStyles()
  return (
    <Dialog
      onClose={onClose}
      open={open}
      scroll="paper"
      maxWidth="lg"
      fullWidth={true}
      aria-labelledby="gallery-modal-title"
    >
      <DialogTitle id="gallery-modal-title">
        {data?.title}
        <Typography variant="subtitle1" className={classes.subtitle}>
          {data?.subtitle}
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.background}>
        <Image
          className={classes.image}
          imgStyle={{ objectFit: "contain" }}
          alt={classes.subtitle}
          fluid={data?.fluid}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="outlined" onClick={onClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function Gallery() {
  const classes = useGalleryStyles()
  const theme = useTheme()
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"))
  const data = useStaticQuery(graphql`
    query GalleryQuery {
      allContentfulGallery {
        edges {
          node {
            image {
              fluid {
                ...GatsbyContentfulFluid_withWebp
              }
            }
            title
            subtitle
            order
          }
        }
      }
    }
  `)
  const gallery = data.allContentfulGallery.edges.sort(
    (a: Record<string, any>, b: Record<string, any>) =>
      a.node.order - b.node.order
  )
  const [hover, setHover] = useState<number | null>(null)
  const [open, setOpen] = React.useState(false)
  const [modalData, setModalData] = React.useState<ModalData>()
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <GridList
      cellHeight={isNotMobile ? 250 : 150}
      className={classes.gridList}
      cols={3}
    >
      {gallery.map(
        (
          {
            node: {
              image: { fluid },
              title,
              subtitle,
            },
          }: Record<string, any>,
          index: number
        ) => (
          <GridListTile
            key={index}
            cols={(index + 1) % 4 === 0 || (index + 1) % 4 === 1 ? 2 : 1}
            rows={1}
            className={classes.gridTile}
            onClick={handleOpen}
            role="button"
          >
            <div
              className={classes.gridImageWrapper}
              onPointerEnter={() => {
                setHover(index)
                setModalData({
                  title: title,
                  subtitle: subtitle,
                  fluid: fluid,
                })
              }}
              onPointerLeave={() => setHover(null)}
            >
              <Image fluid={fluid} className={classes.gridImage} />
              {hover === index && (
                <GridListTileBar title={title} subtitle={subtitle} />
              )}
            </div>
          </GridListTile>
        )
      )}
      <Modal open={open} onClose={handleClose} data={modalData} />
    </GridList>
  )
}

export default Gallery
