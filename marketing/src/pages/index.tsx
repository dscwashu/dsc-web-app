import React from "react"

import SEO from "../components/seo"
import Navbar from "../components/navbar"
import Jumbotron from "../components/jumbotron"
import Section from "../components/section"
import FAQ from "../components/faq"
import Team from "../components/team"
import Lottie from "../components/lottie"
import {
  Typography,
  Divider,
  Button,
  Theme,
  Grid,
  Tabs,
  Tab,
  Box,
  IconButton,
  SvgIcon,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import PeopleIcon from "@material-ui/icons/People"
import EditIcon from "@material-ui/icons/Edit"
import ComputerIcon from "@material-ui/icons/Computer"
import InstagramIcon from "@material-ui/icons/Instagram"
import FacebookIcon from "@material-ui/icons/Facebook"
import MailIcon from "@material-ui/icons/Mail"
import LinkedInIcon from "@material-ui/icons/LinkedIn"
import { Link } from "react-scroll"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    jumbotronHeader: {
      fontWeight: 700,
      marginBottom: theme.spacing(1),
    },
    jumbotronSubtitle: {
      marginBottom: theme.spacing(2),
    },
    sectionHeader: {
      fontWeight: 700,
      marginBottom: theme.spacing(2),
    },
    sectionDescription: {
      marginBottom: theme.spacing(4),
    },
    divider: {
      margin: theme.spacing(10, 0),
    },
    swap: {
      [theme.breakpoints.up("md")]: {
        "& > *:nth-child(1)": {
          order: 1,
        },
        "& > *:nth-child(2)": {
          order: 0,
        },
      },
    },
    icons: {
      fontSize: "80px",
      textAlign: "center",
      justifyContent: "center",
    },
    iconWrapper: {
      height: "120px",
      width: "120px",
      borderRadius: "50%",
      backgroundColor: theme.palette.grey[200],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing(3),
    },
    iconContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    socialMedia: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    socialMediaWrapper: {
      fontSize: "50px",
      height: "80px",
      width: "80px",
    },
    aboutContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    anchor: {
      position: "absolute",
      marginTop: -56,
      "@media (min-width:0px) and (orientation: landscape)": {
        marginTop: -48,
      },
      "@media (min-width:600px)": {
        marginTop: -64,
      },
    },
    externalLink: {
      color: "inherit",
      textDecoration: "none",
    },
  })
)

function IndexPage() {
  const [value, setValue] = React.useState(2)
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  const { gilad, jason, antoine } = state
  const error = [gilad, jason, antoine].filter(v => v).length !== 2

  const handleChange2 = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }
  const classes = useStyles()
  return (
    <React.Fragment>
      <SEO title="Home" />
      <div id="home" />
      <Navbar />
      <Jumbotron>
        <Typography variant="h2" className={classes.jumbotronHeader}>
          Bridging the gap between theory and practice.
        </Typography>
        <Typography variant="subtitle1" className={classes.jumbotronSubtitle}>
          Developer Student Club at Washington University in St. Louis is a
          university-based community group powered by Google Developers. By
          joining DSC WashU, students gain experience working in a team
          environment and building solutions for their community.
        </Typography>
        <Link to="about" smooth={true}>
          <Button color="primary" variant="outlined" size="large">
            About Us
          </Button>
        </Link>
      </Jumbotron>
      <div className={classes.anchor} id="about" />
      <Section white>
        <Grid container spacing={8} className={classes.swap}>
          <Grid item xs={12} md={6} className={classes.aboutContainer}>
            <div>
              <Typography variant="overline">About Us</Typography>
              <Typography variant="h3" className={classes.sectionHeader}>
                What is DSC WashU?
              </Typography>
              <Typography
                variant="body1"
                className={classes.sectionDescription}
              >
                Developer Student Clubs are university based community groups
                for students interested in Google developer technologies.
                Students from all undergraduate or graduate programs with an
                interest in growing as a developer are welcome. By joining a
                DSC, students grow their knowledge in a peer-to-peer learning
                environment and build solutions for local businesses and their
                community.
              </Typography>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://developers.google.com/community/dsc"
                className={classes.externalLink}
              >
                <Button color="primary" variant="outlined" size="large">
                  Learn More
                </Button>
              </a>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Lottie />
          </Grid>
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <Grid container spacing={10} className={classes.icons}>
          <Grid item xs={12} sm={6} md={4} className={classes.iconContainer}>
            <div className={classes.iconWrapper}>
              <PeopleIcon fontSize="inherit" />
            </div>
            <Typography variant="h6">Connect</Typography>
            <Typography variant="subtitle1">
              Meet other students on campus interested in developer
              technologies. All are welcome, including those with diverse
              backgrounds and different majors.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.iconContainer}>
            <div className={classes.iconWrapper}>
              <EditIcon fontSize="inherit" />
            </div>
            <Typography variant="h6">Learn</Typography>
            <Typography variant="subtitle1">
              Learn about a wide range of technical topics where new skills are
              gained through hands-on workshops, in-person training and project
              building activities.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.iconContainer}>
            <div className={classes.iconWrapper}>
              <ComputerIcon fontSize="inherit" />
            </div>
            <Typography variant="h6">Build</Typography>
            <Typography variant="subtitle1">
              Apply your new learnings and connections to build great solutions
              for local problems. Advance your skills, career and network. Give
              back to your community by helping others learn as well.
            </Typography>
          </Grid>
        </Grid>
      </Section>
      <div className={classes.anchor} id="projects" />
      <Section>
        <Grid container spacing={8}>
          <Grid item xs={12} md={5}>
            <Typography variant="overline">Our Projects</Typography>
            <Typography variant="h3" className={classes.sectionHeader}>
              Developing for the Community
            </Typography>
            <Typography variant="body1" className={classes.sectionDescription}>
              Check out some of the projects that we have done over the past
              couple semesters. Our projects focus on helping local nonprofits,
              businesses, and NGO&apos;s with Google Developer technologies so
              we can submit it to Google&apos;s Annual Solution Challenge.
            </Typography>
            <FormControl>
              <FormLabel component="legend">Technologies</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={gilad}
                      onChange={handleChange}
                      name="gilad"
                    />
                  }
                  label="Gilad Gray"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={jason}
                      onChange={handleChange}
                      name="jason"
                    />
                  }
                  label="Jason Killian"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={antoine}
                      onChange={handleChange}
                      name="antoine"
                    />
                  }
                  label="Antoine Llorca"
                />
              </FormGroup>
              <FormHelperText>Be careful</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel component="legend">Technologies</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={gilad}
                      onChange={handleChange}
                      name="gilad"
                    />
                  }
                  label="Gilad Gray"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={jason}
                      onChange={handleChange}
                      name="jason"
                    />
                  }
                  label="Jason Killian"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={antoine}
                      onChange={handleChange}
                      name="antoine"
                    />
                  }
                  label="Antoine Llorca"
                />
              </FormGroup>
              <FormHelperText>Be careful</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={7}>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange2}
              aria-label="disabled tabs example"
            >
              <Tab label="Active" />
              <Tab label="Disabled" disabled />
              <Tab label="Active" />
            </Tabs>
          </Grid>
        </Grid>
      </Section>
      <div className={classes.anchor} id="events" />
      <Section white>
        <Grid container spacing={8} className={classes.swap}>
          <Grid item xs={12} md={5}>
            <Typography variant="overline">
              Frequently Asked Questions
            </Typography>
            <Typography variant="h3" className={classes.sectionHeader}>
              Where do I start?
            </Typography>
            <Typography variant="body1" className={classes.sectionDescription}>
              Here&apos;s a list of commonly asked questions to get you started.
              If these don&apos;t answer your questions, feel free to contact
              us!
            </Typography>
            <Button color="primary" variant="outlined" size="large">
              Contact Us
            </Button>
          </Grid>
          <Grid item xs={12} md={7}>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange2}
              aria-label="disabled tabs example"
            >
              <Tab label="Active" />
              <Tab label="Disabled" disabled />
              <Tab label="Active" />
            </Tabs>
          </Grid>
        </Grid>
      </Section>
      <div className={classes.anchor} id="team" />
      <Section>
        <Box maxWidth={700}>
          <Typography variant="overline">The Core Team</Typography>
          <Typography variant="h3" className={classes.sectionHeader}>
            Meet the Developers
          </Typography>
          <Typography variant="body1" className={classes.sectionDescription}>
            The core team works behind the scenes to host all of the events for
            DSC WashU. Our core team is composed of Technical Leads, Event
            Planning Leads, Marketing Leads, and the DSC Lead.
          </Typography>
        </Box>
        <Team />
      </Section>
      <div className={classes.anchor} id="faq" />
      <Section white>
        <Grid container spacing={8} className={classes.swap}>
          <Grid item xs={12} md={5}>
            <Typography variant="overline">
              Frequently Asked Questions
            </Typography>
            <Typography variant="h3" className={classes.sectionHeader}>
              Where do I start?
            </Typography>
            <Typography variant="body1" className={classes.sectionDescription}>
              Here&apos;s a list of commonly asked questions to get you started.
              If these don&apos;t answer your questions, feel free to contact
              us!
            </Typography>
            <Link to="contact" smooth={true}>
              <Button color="primary" variant="outlined" size="large">
                Contact Us
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} md={7}>
            <FAQ />
          </Grid>
        </Grid>
      </Section>
      <div className={classes.anchor} id="contact" />
      <Section>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Typography variant="overline">Contact Us</Typography>
            <Typography variant="h3" className={classes.sectionHeader}>
              Available 24/7
            </Typography>
            <Typography variant="body1" className={classes.sectionDescription}>
              Don&apos;t hesitate to reach out to us via email or social media.
              We&apos;ll try to get back to you as soon as possible.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7} className={classes.socialMedia}>
            <IconButton className={classes.socialMediaWrapper}>
              <MailIcon fontSize="inherit" />
            </IconButton>
            <IconButton className={classes.socialMediaWrapper}>
              <SvgIcon fontSize="inherit" viewBox="0 0 448 512">
                <path
                  fill="currentColor"
                  d="M94.12 315.1c0 25.9-21.16 47.06-47.06 47.06S0 341 0 315.1c0-25.9 21.16-47.06 47.06-47.06h47.06v47.06zm23.72 0c0-25.9 21.16-47.06 47.06-47.06s47.06 21.16 47.06 47.06v117.84c0 25.9-21.16 47.06-47.06 47.06s-47.06-21.16-47.06-47.06V315.1zm47.06-188.98c-25.9 0-47.06-21.16-47.06-47.06S139 32 164.9 32s47.06 21.16 47.06 47.06v47.06H164.9zm0 23.72c25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06H47.06C21.16 243.96 0 222.8 0 196.9s21.16-47.06 47.06-47.06H164.9zm188.98 47.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06h-47.06V196.9zm-23.72 0c0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06V79.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06V196.9zM283.1 385.88c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06v-47.06h47.06zm0-23.72c-25.9 0-47.06-21.16-47.06-47.06 0-25.9 21.16-47.06 47.06-47.06h117.84c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06H283.1z"
                ></path>
              </SvgIcon>
            </IconButton>
            <IconButton className={classes.socialMediaWrapper}>
              <InstagramIcon fontSize="inherit" />
            </IconButton>
            <IconButton className={classes.socialMediaWrapper}>
              <FacebookIcon fontSize="inherit" />
            </IconButton>
            <IconButton className={classes.socialMediaWrapper}>
              <LinkedInIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
      </Section>
    </React.Fragment>
  )
}

export default IndexPage
