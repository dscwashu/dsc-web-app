import React from "react"

import SEO from "../components/seo"
import Navbar from "../components/navbar"
import Jumbotron from "../components/jumbotron"
import Section from "../components/section"
import Gallery from "../components/gallery"
import Events from "../components/events"
import Projects from "../components/projects"
import FAQ from "../components/faq"
import Team from "../components/team"
import Lottie from "../components/lottie"
import {
  Typography,
  Divider,
  Button,
  Theme,
  Grid,
  Box,
  IconButton,
  SvgIcon,
  useMediaQuery,
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
import { graphql } from "gatsby"

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
      [theme.breakpoints.up("sm")]: {
        fontSize: "50px",
      },
      fontSize: "35px",
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

function IndexPage({ data: { contentfulSiteContent } }: Record<string, any>) {
  const betweenSmMd = useMediaQuery("(max-width:749px)")
  const classes = useStyles()
  const content = contentfulSiteContent
  return (
    <React.Fragment>
      <SEO title="Home" />
      <div id="home" />
      <Navbar />
      <Jumbotron>
        <Typography variant="h2" className={classes.jumbotronHeader}>
          {content.jumbotronTitle}
        </Typography>
        <Typography variant="subtitle1" className={classes.jumbotronSubtitle}>
          {content.jumbotronSubtitle.jumbotronSubtitle}
        </Typography>
        <Link to="about" smooth={true}>
          <Button color="primary" variant="outlined" size="large">
            About Us
          </Button>
        </Link>
      </Jumbotron>
      <div className={classes.anchor} id="about" />
      <Section white>
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            sm={betweenSmMd ? 12 : 6}
            className={classes.aboutContainer}
          >
            <div>
              <Typography variant="overline">
                {content.aboutOverline}
              </Typography>
              <Typography variant="h3" className={classes.sectionHeader}>
                {content.aboutTitle}
              </Typography>
              <Typography
                variant="body1"
                className={classes.sectionDescription}
              >
                {content.aboutText.aboutText}
              </Typography>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={content.aboutLink}
                className={classes.externalLink}
              >
                <Button color="primary" variant="outlined" size="large">
                  Learn More
                </Button>
              </a>
            </div>
          </Grid>
          <Grid item xs={12} sm={betweenSmMd ? 12 : 6}>
            <Lottie />
          </Grid>
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <Grid container spacing={8} className={classes.icons}>
          <Grid item xs={12} sm={6} md={4} className={classes.iconContainer}>
            <div className={classes.iconWrapper}>
              <PeopleIcon fontSize="inherit" />
            </div>
            <Typography variant="h6">{content.firstPillarTitle}</Typography>
            <Typography variant="subtitle1">
              {content.firstPillarText.firstPillarText}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.iconContainer}>
            <div className={classes.iconWrapper}>
              <EditIcon fontSize="inherit" />
            </div>
            <Typography variant="h6">{content.secondPillarTitle}</Typography>
            <Typography variant="subtitle1">
              {content.thirdPillarText.thirdPillarText}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.iconContainer}>
            <div className={classes.iconWrapper}>
              <ComputerIcon fontSize="inherit" />
            </div>
            <Typography variant="h6">{content.thirdPillarTitle}</Typography>
            <Typography variant="subtitle1">
              {content.secondPillarText.secondPillarText}
            </Typography>
          </Grid>
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <Grid container spacing={4} className={classes.swap}>
          <Grid item xs={12} md={4} className={classes.aboutContainer}>
            <div>
              <Typography variant="overline">
                {content.galleryOverline}
              </Typography>
              <Typography variant="h3" className={classes.sectionHeader}>
                {content.galleryTitle}
              </Typography>
              <Typography
                variant="body1"
                className={classes.sectionDescription}
              >
                {content.galleryText.galleryText}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={8}>
            <Gallery />
          </Grid>
        </Grid>
      </Section>
      <div className={classes.anchor} id="projects" />
      <Section>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography variant="overline">
              {content.projectsOverline}
            </Typography>
            <Typography variant="h3" className={classes.sectionHeader}>
              {content.projectsTitle}
            </Typography>
            <Typography variant="body1" className={classes.sectionDescription}>
              {content.projectsText.projectsText}
            </Typography>
            <Button color="primary" variant="outlined" size="large">
              Get Started
            </Button>
          </Grid>
          <Grid item xs={12} md={7}>
            <Projects />
          </Grid>
        </Grid>
      </Section>
      <div className={classes.anchor} id="events" />
      <Section white>
        <Grid container spacing={4} className={classes.swap}>
          <Grid item xs={12} md={5}>
            <Typography variant="overline">{content.eventsOverline}</Typography>
            <Typography variant="h3" className={classes.sectionHeader}>
              {content.eventsTitle}
            </Typography>
            <Typography variant="body1" className={classes.sectionDescription}>
              {content.eventsText.eventsText}
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Events />
          </Grid>
        </Grid>
      </Section>
      <div className={classes.anchor} id="team" />
      <Section>
        <Box maxWidth={700}>
          <Typography variant="overline"> {content.teamOverline}</Typography>
          <Typography variant="h3" className={classes.sectionHeader}>
            {content.teamTitle}
          </Typography>
          <Typography variant="body1" className={classes.sectionDescription}>
            {content.teamText.teamText}
          </Typography>
        </Box>
        <Team />
      </Section>
      <div className={classes.anchor} id="faq" />
      <Section white>
        <Grid container spacing={4} className={classes.swap}>
          <Grid item xs={12} md={5}>
            <Typography variant="overline">{content.faqOverline}</Typography>
            <Typography variant="h3" className={classes.sectionHeader}>
              {content.faqTitle}
            </Typography>
            <Typography variant="body1" className={classes.sectionDescription}>
              {content.faqText.faqText}
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
          <Grid item xs={12} md={6}>
            <Typography variant="overline">
              {content.contactOverline}
            </Typography>
            <Typography variant="h3" className={classes.sectionHeader}>
              {content.contactTitle}
            </Typography>
            <Typography variant="body1" className={classes.sectionDescription}>
              {content.contactText.contactText}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.socialMedia}>
            <a
              href={"mailto: " + content.mail}
              className={classes.externalLink}
            >
              <IconButton
                className={classes.socialMediaWrapper}
                aria-label="mail"
              >
                <MailIcon fontSize="inherit" />
              </IconButton>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={content.slack}
              className={classes.externalLink}
            >
              <IconButton
                className={classes.socialMediaWrapper}
                aria-label="slack"
              >
                <SvgIcon fontSize="inherit" viewBox="0 0 448 512">
                  <path
                    fill="currentColor"
                    d="M94.12 315.1c0 25.9-21.16 47.06-47.06 47.06S0 341 0 315.1c0-25.9 21.16-47.06 47.06-47.06h47.06v47.06zm23.72 0c0-25.9 21.16-47.06 47.06-47.06s47.06 21.16 47.06 47.06v117.84c0 25.9-21.16 47.06-47.06 47.06s-47.06-21.16-47.06-47.06V315.1zm47.06-188.98c-25.9 0-47.06-21.16-47.06-47.06S139 32 164.9 32s47.06 21.16 47.06 47.06v47.06H164.9zm0 23.72c25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06H47.06C21.16 243.96 0 222.8 0 196.9s21.16-47.06 47.06-47.06H164.9zm188.98 47.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06h-47.06V196.9zm-23.72 0c0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06V79.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06V196.9zM283.1 385.88c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06v-47.06h47.06zm0-23.72c-25.9 0-47.06-21.16-47.06-47.06 0-25.9 21.16-47.06 47.06-47.06h117.84c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06H283.1z"
                  ></path>
                </SvgIcon>
              </IconButton>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={content.instagram}
              className={classes.externalLink}
            >
              <IconButton
                className={classes.socialMediaWrapper}
                aria-label="instagram"
              >
                <InstagramIcon fontSize="inherit" />
              </IconButton>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={content.facebook}
              className={classes.externalLink}
            >
              <IconButton
                className={classes.socialMediaWrapper}
                aria-label="facebook"
              >
                <FacebookIcon fontSize="inherit" />
              </IconButton>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={content.linkedIn}
              className={classes.externalLink}
            >
              <IconButton
                className={classes.socialMediaWrapper}
                aria-label="linkedin"
              >
                <LinkedInIcon fontSize="inherit" />
              </IconButton>
            </a>
          </Grid>
        </Grid>
      </Section>
    </React.Fragment>
  )
}

export const query = graphql`
  query IndexPageQuery {
    contentfulSiteContent {
      jumbotronTitle
      jumbotronSubtitle {
        jumbotronSubtitle
      }
      aboutOverline
      aboutTitle
      aboutText {
        aboutText
      }
      aboutLink
      firstPillarTitle
      firstPillarText {
        firstPillarText
      }
      secondPillarTitle
      secondPillarText {
        secondPillarText
      }
      thirdPillarTitle
      thirdPillarText {
        thirdPillarText
      }
      galleryOverline
      galleryText {
        galleryText
      }
      galleryTitle
      projectsOverline
      projectsTitle
      projectsText {
        projectsText
      }
      eventsOverline
      eventsTitle
      eventsText {
        eventsText
      }
      teamOverline
      teamTitle
      teamText {
        teamText
      }
      faqOverline
      faqTitle
      faqText {
        faqText
      }
      contactTitle
      contactOverline
      contactText {
        contactText
      }
      email
      slack
      instagram
      facebook
      linkedIn
    }
  }
`

export default IndexPage
