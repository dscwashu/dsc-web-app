import React from "react"
import {
  Tabs,
  Tab,
  Theme,
  useMediaQuery,
  useTheme,
  Typography,
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import SwipeableViews from "react-swipeable-views"
import Pagination from "@material-ui/lab/Pagination"
import EventIcon from "@material-ui/icons/Event"
import InfoIcon from "@material-ui/icons/Info"
import ClampLines from "react-clamp-lines"

interface EventModalProps {
  open: boolean
  onClose: () => void
  rsvpOnOpen: () => void
}

interface RSVPModalProps {
  open: boolean
  onClose: () => void
}

const useEventStyles = makeStyles((theme: Theme) =>
  createStyles({
    event: {
      marginBottom: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      "@media (min-width: 500px)": {
        flexDirection: "row",
      },
    },
    tabPanel: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      margin: theme.spacing(0, 0.5),
    },
    pagination: {
      alignSelf: "center",
    },
    eventDate: {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.grey[`A700`],
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    eventDetails: {
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    eventDetailsHeader: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
    },
    overline: {
      lineHeight: "normal",
    },
    subtitle: {
      fontWeight: 300,
      marginBottom: theme.spacing(1),
    },
    eventButtons: {
      display: "flex",
      alignItems: "flex-start",
    },
    tabs: {
      marginBottom: theme.spacing(2),
    },
  })
)

const useEventModalStyles = makeStyles(() =>
  createStyles({
    subtitle: {
      fontWeight: 300,
      lineHeight: "normal",
    },
  })
)

function EventModal(props: EventModalProps) {
  const classes = useEventModalStyles()
  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      scroll="paper"
      maxWidth="sm"
      fullWidth={true}
      aria-labelledby="event-modal-title"
    >
      <DialogTitle id="event-modal-title">
        GCP Essentials
        <Typography variant="subtitle1" className={classes.subtitle}>
          January 16, 2019, 7:00 PM - 9:00 PM, Hillman Hall 70
        </Typography>
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          Learn the basics of the Google Cloud Computing platform at this
          workshop. There will be free food and prizes!Learn the basics of the
          Google Cloud Computing platform at this workshop. There will be free
          food and prizes! Learn the basics of the Google Cloud Computing
          platform at this workshop. There will be free food and prizes!Learn
          the basics of the Google Cloud Computing platform at this workshop.
          There will be free food and prizes!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={props.rsvpOnOpen}>
          RSVP
        </Button>
        <Button color="primary" variant="outlined" onClick={props.onClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function RSVPModal(props: RSVPModalProps) {
  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      scroll="paper"
      maxWidth="sm"
      fullWidth={true}
      aria-labelledby="rsvp-modal-title"
    >
      <DialogTitle id="rsvp-modal-title">Add to Calendar</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please login to RSVP to this Event
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained">
          Login
        </Button>
        <Button color="primary" variant="outlined" onClick={props.onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function Events() {
  const classes = useEventStyles()
  const theme = useTheme()
  const isNotXs = useMediaQuery(theme.breakpoints.up("sm"))
  const [index, setIndex] = React.useState(0)
  const [eventModalOpen, setEventModalOpen] = React.useState(false)
  const [rsvpModalOpen, setRSVPModalOpen] = React.useState(false)
  const handleTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setIndex(newValue)
  }
  const handleSwipe = (index: number) => {
    setIndex(index)
  }
  const handleRSVPModalOpen = () => {
    setRSVPModalOpen(true)
  }
  const handleRSVPModalClose = () => {
    setRSVPModalOpen(false)
  }
  const handleEventModalOpen = () => {
    setEventModalOpen(true)
  }
  const handleEventModalClose = () => {
    setEventModalOpen(false)
  }
  return (
    <React.Fragment>
      <Tabs
        value={index}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleTab}
        variant={isNotXs ? "standard" : "fullWidth"}
        centered
        className={classes.tabs}
        aria-label="events tabs"
      >
        <Tab
          disableRipple={true}
          label="Future"
          id="tab-future"
          aria-controls="tabpanel-future"
        />
        <Tab
          disableRipple={true}
          label="Past"
          id="tab-past"
          aria-controls="tabpanel-past"
        />
      </Tabs>
      <SwipeableViews index={index} onChangeIndex={handleSwipe}>
        <div
          className={classes.tabPanel}
          role="tabpanel"
          aria-labelledby="tab-past"
          id="tabpanel-past"
        >
          <Card className={classes.event}>
            <div className={classes.eventDate}>
              <Typography variant="overline" className={classes.overline}>
                January
              </Typography>
              <Typography variant="h2">16</Typography>
            </div>
            <div className={classes.eventDetails}>
              <div className={classes.eventDetailsHeader}>
                <div>
                  <Typography variant="h6">GCP Essentials</Typography>
                  <Typography variant="subtitle2" className={classes.subtitle}>
                    7:00 PM - 9:00 PM, Hillman Hall 70
                  </Typography>
                </div>
                <div className={classes.eventButtons}>
                  <IconButton size="small" onClick={handleRSVPModalOpen}>
                    <EventIcon />
                  </IconButton>
                  <IconButton size="small" onClick={handleEventModalOpen}>
                    <InfoIcon />
                  </IconButton>
                </div>
              </div>
              <ClampLines
                text="Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes! Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!"
                id="really-unique-id"
                buttons={false}
                innerElement="div"
                className="MuiTypography-body2 MuiTypography-root"
              />
            </div>
          </Card>
          <Card className={classes.event}>
            <div className={classes.eventDate}>
              <Typography variant="overline" className={classes.overline}>
                January
              </Typography>
              <Typography variant="h2">16</Typography>
            </div>
            <div className={classes.eventDetails}>
              <div className={classes.eventDetailsHeader}>
                <div>
                  <Typography variant="h6">GCP Essentials</Typography>
                  <Typography variant="subtitle2" className={classes.subtitle}>
                    7:00 PM - 9:00 PM, Hillman Hall 70
                  </Typography>
                </div>
                <div className={classes.eventButtons}>
                  <IconButton size="small" onClick={handleRSVPModalOpen}>
                    <EventIcon />
                  </IconButton>
                  <IconButton size="small" onClick={handleEventModalOpen}>
                    <InfoIcon />
                  </IconButton>
                </div>
              </div>
              <ClampLines
                text="Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes! Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!"
                id="really-unique-id"
                buttons={false}
                innerElement="div"
                className="MuiTypography-body2 MuiTypography-root"
              />
            </div>
          </Card>
          <Card className={classes.event}>
            <div className={classes.eventDate}>
              <Typography variant="overline" className={classes.overline}>
                January
              </Typography>
              <Typography variant="h2">16</Typography>
            </div>
            <div className={classes.eventDetails}>
              <div className={classes.eventDetailsHeader}>
                <div>
                  <Typography variant="h6">GCP Essentials</Typography>
                  <Typography variant="subtitle2" className={classes.subtitle}>
                    7:00 PM - 9:00 PM, Hillman Hall 70
                  </Typography>
                </div>
                <div className={classes.eventButtons}>
                  <IconButton size="small" onClick={handleRSVPModalOpen}>
                    <EventIcon />
                  </IconButton>
                  <IconButton size="small" onClick={handleEventModalOpen}>
                    <InfoIcon />
                  </IconButton>
                </div>
              </div>
              <ClampLines
                text="Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes! Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!"
                id="really-unique-id"
                buttons={false}
                innerElement="div"
                className="MuiTypography-body2 MuiTypography-root"
              />
            </div>
          </Card>
          <Pagination
            className={classes.pagination}
            size={isNotXs ? "medium" : "small"}
            count={10}
          />
        </div>
        <div
          className={classes.tabPanel}
          role="tabpanel"
          aria-labelledby="tab-future"
          id="tabpanel-future"
        >
          <Card className={classes.event}>
            <div className={classes.eventDate}>
              <Typography variant="overline" className={classes.overline}>
                January
              </Typography>
              <Typography variant="h2">16</Typography>
            </div>
            <div className={classes.eventDetails}>
              <div className={classes.eventDetailsHeader}>
                <div>
                  <Typography variant="h6">GCP Essentials</Typography>
                  <Typography variant="subtitle2" className={classes.subtitle}>
                    7:00 PM - 9:00 PM, Hillman Hall 70
                  </Typography>
                </div>
                <div className={classes.eventButtons}>
                  <IconButton
                    size="small"
                    onClick={handleRSVPModalOpen}
                    aria-label="rsvp"
                  >
                    <EventIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleEventModalOpen}
                    aria-label="info"
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
              </div>
              <ClampLines
                text="Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes! Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!Learn the basics of the Google Cloud Computing platform at this workshop. There will be free food and prizes!"
                id="really-unique-id"
                buttons={false}
                innerElement="div"
                className="MuiTypography-body2 MuiTypography-root"
              />
            </div>
          </Card>
          <Pagination
            className={classes.pagination}
            size={isNotXs ? "medium" : "small"}
            count={10}
          />
        </div>
      </SwipeableViews>
      <EventModal
        open={eventModalOpen}
        onClose={handleEventModalClose}
        rsvpOnOpen={handleRSVPModalOpen}
      />
      <RSVPModal open={rsvpModalOpen} onClose={handleRSVPModalClose} />
    </React.Fragment>
  )
}

export default Events
