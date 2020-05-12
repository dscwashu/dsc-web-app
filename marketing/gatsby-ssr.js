/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import React from "react"
import TopLayout from "./src/components/toplayout"
import "./src/styles/global.css"

// Import firebase modules
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions"

export const wrapRootElement = ({ element }) => {
  return <TopLayout>{element}</TopLayout>
}
