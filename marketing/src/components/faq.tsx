import React from "react"
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { useStaticQuery, graphql } from "gatsby"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
)
function FAQ() {
  const data = useStaticQuery(graphql`
    query FAQQuery {
      allContentfulFaq {
        edges {
          node {
            question
            answer {
              json
            }
          }
        }
      }
    }
  `)
  const faq = data.allContentfulFaq.edges.sort(
    (a: Record<string, any>, b: Record<string, any>) =>
      a.node.order - b.node.order
  )
  const classes = useStyles()
  const options = {
    renderNode: {
      // eslint-disable-next-line react/display-name
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
        <Typography>{children}</Typography>
      ),
    },
  }
  return (
    <React.Fragment>
      {faq.map(
        (
          {
            node: {
              question,
              answer: { json },
            },
          }: Record<string, any>,
          index: number
        ) => {
          return (
            <ExpansionPanel key={index}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panel" + index + "-content"}
                id={"panel" + index + "-header"}
              >
                <Typography className={classes.heading}>{question}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {documentToReactComponents(json, options)}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        }
      )}
    </React.Fragment>
  )
}
export default FAQ
