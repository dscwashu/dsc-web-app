import React, { useState, Dispatch, SetStateAction } from "react"
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Button,
  Theme,
  useMediaQuery,
  useTheme,
  MobileStepper,
} from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import Image from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"

interface ModalProps {
  open: boolean
  onClose: () => void
  data: Record<string, any>
  active: number
  setActive: Dispatch<SetStateAction<number>>
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
    header: {
      backgroundColor: theme.palette.grey["A400"],
      color: "#fff",
    },
    subtitle: {
      fontWeight: 300,
      lineHeight: "normal",
    },
    image: {
      flexGrow: 1,
      backgroundColor: theme.palette.grey["900"],
    },
    stepper: {
      backgroundColor: theme.palette.grey["A400"],
      color: "#fff",
    },
    button: {
      color: "#fff",
      "&:disabled": {
        color: theme.palette.grey["600"],
      },
    },
  })
)

function Modal({ open, onClose, data, active, setActive }: ModalProps) {
  const classes = useModalStyles()
  const maxSteps = data.allContentfulGallery.edges.length
  const handleNext = () => {
    setActive((prevActive: number) => prevActive + 1)
  }

  const handleBack = () => {
    setActive((prevActive: number) => prevActive - 1)
  }
  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="lg"
      fullWidth={true}
      aria-labelledby="gallery-modal-title"
    >
      <DialogTitle id="gallery-modal-title" className={classes.header}>
        {data.allContentfulGallery.edges[active].node.title}
        <Typography variant="subtitle1" className={classes.subtitle}>
          {data.allContentfulGallery.edges[active].node.subtitle}
        </Typography>
      </DialogTitle>
      <Image
        className={classes.image}
        imgStyle={{ objectFit: "contain" }}
        alt={classes.subtitle}
        fluid={data.allContentfulGallery.edges[active].node.image.fluid}
      />
      <MobileStepper
        className={classes.stepper}
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={active}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={active === maxSteps - 1}
            className={classes.button}
          >
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={active === 0}
            className={classes.button}
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
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
  const [active, setActive] = React.useState<number>(0)
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
                if (!open) {
                  setActive(index)
                }
              }}
              onPointerLeave={() => setHover(null)}
            >
              <Image
                fluid={fluid}
                className={classes.gridImage}
                alt={subtitle}
              />
              {hover === index && (
                <GridListTileBar title={title} subtitle={subtitle} />
              )}
            </div>
          </GridListTile>
        )
      )}
      <Modal
        open={open}
        onClose={handleClose}
        data={data}
        active={active}
        setActive={setActive}
      />
    </GridList>
  )
}

export default Gallery
