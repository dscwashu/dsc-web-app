import React from "react"

import { Link } from "gatsby"
import SEO from "../components/seo"

import "../styles/404.css"

const NotFoundPage = () => (
  <div className="page-wrapper">
    <SEO title="404: Not found" />
    <h1 className="error-code">404.</h1>
    <p className="error-desc">
      The page you were looking for could not be found.
    </p>
    <Link to="/">
      <button className="return-button">RETURN HOME</button>
    </Link>
  </div>
)

export default NotFoundPage
