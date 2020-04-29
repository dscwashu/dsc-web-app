import React from "react"

import SEO from "../components/seo"
import Navbar from "../components/navbar"
import Jumbotron from "../components/jumbotron"
import Section from "../components/section"
import FAQ from "../components/faq"
import { Typography, Divider, Button, Theme } from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"

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
      marginBottom: theme.spacing(5),
    },
    divider: {
      margin: theme.spacing(5, 0),
    },
  })
)

function IndexPage() {
  const classes = useStyles()
  return (
    <React.Fragment>
      <SEO title="Home" />
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
        <Button color="primary" variant="outlined" size="large">
          Learn More
        </Button>
      </Jumbotron>
      <Section white>
        <Typography variant="h3" className={classes.sectionHeader}>
          About
        </Typography>
        <Divider variant="middle" className={classes.divider} />
      </Section>
      <Section>
        <Typography variant="h3" className={classes.sectionHeader}>
          About
        </Typography>
        <Divider variant="middle" className={classes.divider} />
      </Section>
      <Section white>
        <Typography variant="h3" className={classes.sectionHeader}>
          About
        </Typography>
        <Divider variant="middle" className={classes.divider} />
      </Section>
      <Section>
        <Typography variant="h3" className={classes.sectionHeader}>
          Frequently Asked Questions
        </Typography>
        <FAQ />
      </Section>
      <Section white>
        <Typography variant="h3" className={classes.sectionHeader}>
          About
        </Typography>
        <Divider variant="middle" className={classes.divider} />
      </Section>
    </React.Fragment>
  )
}

export default IndexPage
