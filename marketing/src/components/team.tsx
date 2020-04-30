import React from "react"
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@material-ui/core"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import MailIcon from "@material-ui/icons/Mail"
import LinkedInIcon from "@material-ui/icons/LinkedIn"

function Team() {
  const data = useStaticQuery(graphql`
    query TeamQuery {
      file(name: { eq: "dsc-icon" }) {
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
      <Grid item xs={6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            imgStyle={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton>
              <MailIcon />
            </IconButton>
            <IconButton>
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            imgStyle={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton>
              <MailIcon />
            </IconButton>
            <IconButton>
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            imgStyle={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton>
              <MailIcon />
            </IconButton>
            <IconButton>
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            imgStyle={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton>
              <MailIcon />
            </IconButton>
            <IconButton>
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            imgStyle={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton>
              <MailIcon />
            </IconButton>
            <IconButton>
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            imgStyle={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton>
              <MailIcon />
            </IconButton>
            <IconButton>
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <Card>
          <Image
            fluid={data.file.childImageSharp.fluid}
            imgStyle={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              Zach Young
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Technical Lead
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton>
              <MailIcon />
            </IconButton>
            <IconButton>
              <LinkedInIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Team
