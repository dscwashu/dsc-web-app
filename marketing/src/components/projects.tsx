import React, { useState } from "react"
import {
  Theme,
  useMediaQuery,
  useTheme,
  Typography,
  Card,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Input,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Chip,
} from "@material-ui/core"
import DateFnsUtils from "@date-io/date-fns"
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import Pagination from "@material-ui/lab/Pagination"
import InfoIcon from "@material-ui/icons/Info"
import GithubIcon from "@material-ui/icons/GitHub"
import ClampLines from "react-clamp-lines"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date"
import FilterListIcon from "@material-ui/icons/FilterList"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

interface FilterModalProps {
  open: boolean
  onClose: () => void
}

interface ProjectModalProps {
  open: boolean
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    project: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
    },
    projectDetailsHeader: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
    },
    subtitle: {
      fontWeight: 300,
      marginBottom: theme.spacing(1),
    },
    projectButtons: {
      display: "flex",
      alignItems: "flex-start",
    },
    pagination: {
      alignSelf: "center",
    },
    search: {
      width: "100%",
    },
    searchWrapper: {
      flexGrow: 1,
    },
    [theme.breakpoints.up("sm")]: {
      filterWrapper: {
        order: 3,
      },
      tagsWrapper: {
        order: 2,
      },
    },
    inputs: {
      marginBottom: theme.spacing(2),
      alignItems: "flex-end",
    },
  })
)

const useFilterModalStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterInputs: {
      display: "flex",
      flexDirection: "column",
    },
    inputDates: {
      display: "flex",
      marginTop: theme.spacing(2),
    },
    startDate: {
      marginRight: theme.spacing(2),
    },
  })
)

const useProjectModalStyles = makeStyles((theme: Theme) =>
  createStyles({
    subtitle: {
      fontWeight: 300,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5),
      },
      marginBottom: theme.spacing(2),
    },
    projectInfo: {
      marginBottom: theme.spacing(1),
    },
  })
)

function FilterModal(props: FilterModalProps) {
  const classes = useFilterModalStyles()
  const industries = ["Education", "Tech", "Finance"]
  const [activeIndustry, setIndustry] = React.useState<string[]>([])
  const handleIndustryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setIndustry(event.target.value as string[])
  }
  const [selectedDate, handleDateChange] = useState<MaterialUiPickersDate>(null)

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      scroll="paper"
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle>Filter</DialogTitle>
      <DialogContent>
        <div className={classes.filterInputs}>
          <FormControl>
            <InputLabel>Industry</InputLabel>
            <Select
              multiple
              value={activeIndustry}
              onChange={handleIndustryChange}
              input={<Input />}
              renderValue={selected => (selected as string[]).join(", ")}
              MenuProps={MenuProps}
            >
              {industries.map(name => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={activeIndustry.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Organization</InputLabel>
            <Select
              multiple
              value={activeIndustry}
              onChange={handleIndustryChange}
              input={<Input />}
              renderValue={selected => (selected as string[]).join(", ")}
              MenuProps={MenuProps}
            >
              {industries.map(name => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={activeIndustry.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Platform</InputLabel>
            <Select
              multiple
              value={activeIndustry}
              onChange={handleIndustryChange}
              input={<Input />}
              renderValue={selected => (selected as string[]).join(", ")}
              MenuProps={MenuProps}
            >
              {industries.map(name => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={activeIndustry.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={classes.inputDates}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.startDate}
                clearable
                value={selectedDate}
                placeholder="10/10/2018"
                onChange={(date: MaterialUiPickersDate) =>
                  handleDateChange(date)
                }
                format="MM/dd/yyyy"
              />
              <KeyboardDatePicker
                clearable
                value={selectedDate}
                placeholder="10/10/2018"
                onChange={(date: MaterialUiPickersDate) =>
                  handleDateChange(date)
                }
                format="MM/dd/yyyy"
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={props.onClose}>
          Apply
        </Button>
        <Button color="primary" variant="outlined" onClick={props.onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ProjectModal(props: ProjectModalProps) {
  const classes = useProjectModalStyles()
  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      scroll="paper"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        DSC Website
        <Typography variant="subtitle1" className={classes.subtitle}>
          Zachary Young, Olly Cohen
        </Typography>
      </DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.chips}>
          <Chip label="React.js" />
          <Chip label="Gatsby.js" />
          <Chip label="Three.js" />
          <Chip label="Community" />
          <Chip label="Material UI" />
          <Chip label="Lottie" />
          <Chip label="Firebase" />
          <Chip label="Contentful" />
        </div>
        <Typography variant="body1" className={classes.projectInfo}>
          Tech &middot; Student Club &middot; Web
        </Typography>
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
        <Button color="primary" variant="contained">
          See Code
        </Button>
        <Button color="primary" variant="outlined" onClick={props.onClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function Projects() {
  const classes = useStyles()
  const theme = useTheme()
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"))
  const [filterModalOpen, setFilterModalOpen] = React.useState(false)
  const [projectModalOpen, setProjectModalOpen] = React.useState(false)
  const handleFilterModalOpen = () => {
    setFilterModalOpen(true)
  }
  const handleFilterModalClose = () => {
    setFilterModalOpen(false)
  }
  const handleProjectModalOpen = () => {
    setProjectModalOpen(true)
  }
  const handleProjectModalClose = () => {
    setProjectModalOpen(false)
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.inputs}>
        <Grid item className={classes.searchWrapper}>
          <TextField
            label="Search Project Titles"
            type="search"
            className={classes.search}
          />
        </Grid>
        <Grid item className={classes.filterWrapper}>
          <Button
            endIcon={<FilterListIcon />}
            variant="contained"
            onClick={handleFilterModalOpen}
          >
            Filter
          </Button>
          <FilterModal
            open={filterModalOpen}
            onClose={handleFilterModalClose}
          />
        </Grid>
        <Grid item xs={12} sm={5} className={classes.tagsWrapper}>
          <Autocomplete
            multiple
            options={[
              "React.js",
              "Node.js",
              "Django",
              "option1",
              "option12",
              "option13",
              "option14",
              "option15",
              "option16",
              "Featured",
            ]}
            defaultValue={["Featured"]}
            renderInput={(params: any) => (
              <TextField
                {...params}
                variant="standard"
                label="Filter by Tag"
                placeholder="React.js, AI/ML, etc..."
              />
            )}
          />
        </Grid>
      </Grid>
      <Card className={classes.project}>
        <div className={classes.projectDetailsHeader}>
          <div>
            <Typography variant="h6">DSC Website</Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>
              Zachary Young, Olly Cohen
            </Typography>
          </div>
          <div className={classes.projectButtons}>
            <IconButton size="small">
              <GithubIcon />
            </IconButton>
            <IconButton size="small" onClick={handleProjectModalOpen}>
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
      </Card>
      <Card className={classes.project}>
        <div className={classes.projectDetailsHeader}>
          <div>
            <Typography variant="h6">DSC Website</Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>
              Zachary Young, Olly Cohen
            </Typography>
          </div>
          <div className={classes.projectButtons}>
            <IconButton size="small">
              <GithubIcon />
            </IconButton>
            <IconButton size="small" onClick={handleProjectModalOpen}>
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
      </Card>
      <Card className={classes.project}>
        <div className={classes.projectDetailsHeader}>
          <div>
            <Typography variant="h6">DSC Website</Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>
              Zachary Young, Olly Cohen
            </Typography>
          </div>
          <div className={classes.projectButtons}>
            <IconButton size="small">
              <GithubIcon />
            </IconButton>
            <IconButton size="small" onClick={handleProjectModalOpen}>
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
      </Card>
      <Pagination
        className={classes.pagination}
        size={isNotMobile ? "medium" : "small"}
        count={10}
      />
      <ProjectModal open={projectModalOpen} onClose={handleProjectModalClose} />
    </div>
  )
}

export default Projects
