import React from "react"
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  makeStyles,
  createStyles,
  useMediaQuery,
} from "@material-ui/core"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import MailIcon from "@material-ui/icons/Mail"
import LinkedInIcon from "@material-ui/icons/LinkedIn"

const useStyles = makeStyles(() =>
  createStyles({
    cardContent: {
      paddingBottom: 0,
    },
    cardActions: {
      paddingTop: 0,
      justifyContent: "flex-end",
    },
    cardPhoto: {
      width: "100%",
      height: 0,
      paddingTop: "120%",
    },
    externalLink: {
      color: "inherit",
      textDecoration: "none",
    },
  })
)

function Team() {
  const classes = useStyles()
  const betweenXsSm = useMediaQuery("(max-width:400px)")
  const data = useStaticQuery(graphql`
    query TeamQuery {
      allContentfulCoreTeam {
        edges {
          node {
            email
            linkedIn
            name
            title
            order
            headshot {
              fluid {
                ...GatsbyContentfulFluid_withWebp
              }
            }
          }
        }
      }
    }
  `)
  const team = data.allContentfulCoreTeam.edges.sort(
    (a: Record<string, any>, b: Record<string, any>) =>
      a.node.order - b.node.order
  )
  return (
    <Grid container spacing={2}>
      {team.map(
        (
          {
            node: {
              email,
              linkedIn,
              name,
              title,
              headshot: { fluid },
            },
          }: Record<string, any>,
          index: number
        ) => (
          <Grid key={index} item xs={betweenXsSm ? 12 : 6} sm={4} md={3}>
            <Card>
              <Image fluid={fluid} className={classes.cardPhoto} />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5">
                  {name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {title}
                </Typography>
              </CardContent>
              <CardActions
                className={classes.cardActions}
                disableSpacing={true}
              >
                <a href={"mailto: " + email} className={classes.externalLink}>
                  <IconButton size="small" aria-label="email">
                    <MailIcon />
                  </IconButton>
                </a>
                {linkedIn && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={linkedIn}
                    className={classes.externalLink}
                  >
                    <IconButton size="small" aria-label="linkedin">
                      <LinkedInIcon />
                    </IconButton>
                  </a>
                )}
              </CardActions>
            </Card>
          </Grid>
        )
      )}
    </Grid>
  )
}

export default Team
