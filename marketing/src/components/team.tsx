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
  })
)

function Team() {
  const classes = useStyles()
  const betweenXsSm = useMediaQuery("(max-width:400px)")
  const data = useStaticQuery(graphql`
    query TeamQuery {
      file(name: { eq: "panda" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `)
  return (
    <Grid container spacing={2}>
      <Grid item xs={betweenXsSm ? 12 : 6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.cardPhoto}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions} disableSpacing={true}>
            <IconButton size="small">
              <MailIcon />
            </IconButton>
            <IconButton size="small">
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={betweenXsSm ? 12 : 6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.cardPhoto}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions} disableSpacing={true}>
            <IconButton size="small">
              <MailIcon />
            </IconButton>
            <IconButton size="small">
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={betweenXsSm ? 12 : 6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.cardPhoto}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions} disableSpacing={true}>
            <IconButton size="small">
              <MailIcon />
            </IconButton>
            <IconButton size="small">
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={betweenXsSm ? 12 : 6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.cardPhoto}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions} disableSpacing={true}>
            <IconButton size="small">
              <MailIcon />
            </IconButton>
            <IconButton size="small">
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={betweenXsSm ? 12 : 6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.cardPhoto}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions} disableSpacing={true}>
            <IconButton size="small">
              <MailIcon />
            </IconButton>
            <IconButton size="small">
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={betweenXsSm ? 12 : 6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            className={classes.cardPhoto}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions} disableSpacing={true}>
            <IconButton size="small">
              <MailIcon />
            </IconButton>
            <IconButton size="small">
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Team
