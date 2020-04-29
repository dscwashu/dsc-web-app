import React from "react"
import Image from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"
import {
  AppBar,
  Button,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Hidden,
} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import MenuIcon from "@material-ui/icons/Menu"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
    logoButton: {
      ...theme.mixins.toolbar,
      width: "50px",
      marginRight: "auto",
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    logo: {
      width: "100%",
    },
    loginButton: {
      marginLeft: theme.spacing(2),
    },
    registerButton: {
      marginLeft: theme.spacing(2),
    },
    tabButton: {
      ...theme.mixins.toolbar,
      borderRadius: 0,
      border: "2px solid transparent",
      padding: "6px 20px",
      "&:hover": {
        backgroundColor: "transparent",
        borderBottom: "2px solid" + theme.palette.primary.main,
      },
    },
    list: {
      width: "250px",
    },
  })
)
function Navbar() {
  const classes = useStyles()
  const [state, setState] = React.useState({ open: false })
  const data = useStaticQuery(graphql`
    query MyQuery {
      file(name: { eq: "dsc-icon" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `)
  const toggleDrawer = () => {
    setState({ open: !state.open })
  }
  const sections: string[] = [
    "About",
    "Projects",
    "Events",
    "Team",
    "FAQ",
    "Contact",
    "FAQ",
  ]
  return (
    <React.Fragment>
      <AppBar position="sticky" color="transparent" className={classes.root}>
        <Toolbar>
          <Button disableRipple={true} className={classes.logoButton}>
            <Image
              className={classes.logo}
              fluid={data.file.childImageSharp.fluid}
              imgStyle={{ objectFit: "contain" }}
            />
          </Button>
          <Hidden smDown>
            {sections.map((section, index) => (
              <Button
                disableRipple={true}
                className={classes.tabButton}
                key={index}
              >
                {section}
              </Button>
            ))}
            <Button
              color="primary"
              variant="outlined"
              className={classes.loginButton}
            >
              Login
            </Button>
            <Button
              color="primary"
              variant="contained"
              className={classes.registerButton}
            >
              Register
            </Button>
          </Hidden>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Drawer anchor="right" open={state.open} onClose={toggleDrawer}>
            <List className={classes.list}>
              {sections.map((section, index) => (
                <ListItem button key={index}>
                  <ListItemText primary={section} />
                </ListItem>
              ))}
              <Divider />
              <ListItem button>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Register" />
              </ListItem>
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

export default Navbar
