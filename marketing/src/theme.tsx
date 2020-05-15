import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"

// A custom theme for this app

declare module "@material-ui/core/styles/createBreakpoints" {
  interface BreakpointOverrides {
    xsMid: true
  }
}

let theme = createMuiTheme({
  palette: {
    background: {
      default: "#f3f3f3",
    },
  },
})
theme = responsiveFontSizes(theme)

export default theme
