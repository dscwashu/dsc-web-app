/* eslint-disable @typescript-eslint/camelcase */

require("dotenv").config()

module.exports = {
  siteMetadata: {
    title: `DSC WashU`,
    description: `Developer Student Club at Washington University in St. Louis is a community group for both undergraduate and graduate students to learn more about google developer technologies. By joining DSC WashU, students gain valuable experience working in a team environment and building solutions for local businesses and their community.`,
    author: `Zach Young`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Developer Student Club at WashU`,
        short_name: `DSC WashU`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/dsc-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
    `gatsby-plugin-material-ui`,
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `im1fxa9kl994`,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
    `gatsby-transformer-remark`,
  ],
}
