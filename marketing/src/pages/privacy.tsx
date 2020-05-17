import React from "react"

import SEO from "../components/seo"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { Link, graphql } from "gatsby"

import "../styles/terms.css"

const Privacy = ({ data: { contentfulSiteContent } }: Record<string, any>) => (
  <div className="page-wrapper">
    <SEO title="Privacy Policy" />
    <Link to="/">
      <button className="return-button">RETURN HOME</button>
    </Link>
    {documentToReactComponents(contentfulSiteContent.privacyPolicy.json)}
  </div>
)

export const query = graphql`
  query PrivacyQuery {
    contentfulSiteContent {
      privacyPolicy {
        json
      }
    }
  }
`

export default Privacy
