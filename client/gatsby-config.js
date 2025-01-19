const path = require('path');
const envData = require('./config/env.json');
const {
  buildChallenges,
  replaceChallengeNode,
  localeChallengesRootDir
} = require('./utils/build-challenges');

const { clientLocale, curriculumLocale, homeLocation } = envData;

const curriculumIntroRoot = path.resolve(__dirname, './src/pages');
const pathPrefix = clientLocale === 'english' ? '' : '/' + clientLocale;

module.exports = {
  flags: {
    DEV_SSR: false
  },
  siteMetadata: {
    title: 'freeCodeCamp',
    siteUrl: homeLocation
  },
  pathPrefix: pathPrefix,
  plugins: [
    'gatsby-plugin-pnpm',
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
      options: {
        analyzerMode: 'disabled',
        generateStatsFile: process.env.CI
      }
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postcssOptions: {
          config: path.resolve(__dirname, 'postcss.config.js')
        }
      }
    },
    {
      resolve: require.resolve(
        '../tools/client-plugins/gatsby-source-challenges'
      ),
      options: {
        name: 'challenges',
        source: buildChallenges,
        onSourceChange: replaceChallengeNode(curriculumLocale),
        curriculumPath: localeChallengesRootDir
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'introductions',
        path: curriculumIntroRoot
      }
    },
    {
      resolve: 'gatsby-transformer-remark'
    },
    {
      resolve: require.resolve(
        '../tools/client-plugins/gatsby-remark-node-identity'
      ),
      options: {
        identity: 'blockIntroMarkdown',
        predicate: ({ frontmatter }) => {
          if (!frontmatter) {
            return false;
          }
          const { title, block, superBlock } = frontmatter;
          return title && block && superBlock;
        }
      }
    },
    {
      resolve: require.resolve(
        '../tools/client-plugins/gatsby-remark-node-identity'
      ),
      options: {
        identity: 'superBlockIntroMarkdown',
        predicate: ({ frontmatter }) => {
          if (!frontmatter) {
            return false;
          }
          const { title, block, superBlock } = frontmatter;
          return title && !block && superBlock;
        }
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'freeCodeCamp',
        short_name: 'fCC',
        start_url: '/',
        theme_color: '#0a0a23',
        background_color: '#fff',
        display: 'minimal-ui',
        icon: 'src/assets/images/square_puck.png'
      }
    },
    'gatsby-plugin-remove-serviceworker'
  ]
};
