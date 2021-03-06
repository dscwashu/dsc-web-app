import React from "react"
import { Container, Theme } from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"

interface SectionProps {
  children: React.ReactNode
  white?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: (props: SectionProps) => ({
      backgroundColor: props.white
        ? theme.palette.background.paper
        : theme.palette.background.default,
    }),
    wrapper: {
      overflowX: "hidden",
      padding: theme.spacing(5, 0.5),
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(10, 0.5),
      },
      [theme.breakpoints.up("md")]: {
        padding: theme.spacing(15, 0.5),
      },
    },
  })
)

function Section(props: SectionProps) {
  const classes = useStyles(props)
  return (
    <section className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.wrapper}>{props.children}</div>
      </Container>
    </section>
  )
}

export default Section
