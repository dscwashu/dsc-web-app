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
import { Link } from "react-scroll"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
    logoWrapper: {
      marginRight: "auto",
    },
    logoButton: {
      ...theme.mixins.toolbar,
      width: "50px",
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
    query NavbarQuery {
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
    // "Projects",
    // "Events",
    "Team",
    "FAQ",
    "Community",
    "Contact",
  ]
  return (
    <React.Fragment>
      <AppBar position="sticky" color="transparent" className={classes.root}>
        <Toolbar>
          <Link to="home" smooth={true} className={classes.logoWrapper}>
            <Button
              disableRipple={true}
              className={classes.logoButton}
              aria-label="home"
            >
              <Image
                className={classes.logo}
                fluid={data.file.childImageSharp.fluid}
                imgStyle={{ objectFit: "contain" }}
                alt="DSC Logo"
              />
            </Button>
          </Link>
          {/* <Hidden smDown>
            {sections.map((section, index) => (
              <Link key={index} to={section.toLowerCase()} smooth={true}>
                <Button disableRipple={true} className={classes.tabButton}>
                  {section}
                </Button>
              </Link>
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
          </Hidden> */}
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
                <Link key={index} to={section.toLowerCase()} smooth={true}>
                  <ListItem button onClick={toggleDrawer}>
                    <ListItemText primary={section} />
                  </ListItem>
                </Link>
              ))}
              {/* <Divider />
              <ListItem button>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Register" />
              </ListItem> */}
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  )
}

export default Navbar
