import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"

// A custom theme for this app

let theme = createMuiTheme({})
theme = responsiveFontSizes(theme)

export default theme
