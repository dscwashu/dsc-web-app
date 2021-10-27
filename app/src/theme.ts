import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  responsiveFontSizes,
} from "@material-ui/core/styles";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

export default theme;
