# Bittrex Developers
URL: [https://bittrex.github.io](https://bittrex.github.io)


## Installation
1. Install Jekyll
    - For windows users, follow the instructions [here](https://jekyllrb.com/docs/installation/windows/#installing-jekyll)
1. Ensure you have [Node.js](https://nodejs.org/en/download/) installed. Aim for these versions:
    - `node >= 8`
    - `npm >= 5`
1. Install dependencies by running the following:
    - `bundle install`
    - `npm install`
1. You should be ready to go!

## Development
The docs are built using Jekyll, which serves the generated HTML. We use spectacle to generate the more sophisticated HTML, CSS and JS for the API reference pages.

To get started, first try building the API reference pages and then serve them, like so:
1. `npm run build` - builds necessary assets
1. `npm run serve` - starts server
1. Navigate your browser to `http://localhost:4000/` 

In active development, we use npm-watch to watch for changes. Either:
- Run `npm run dev` to serve and watch in one process
or:
1. In one process: `npm run watch` - watch the build directories
1. In a _separate_ process: `npm run serve`

**Note**: _Errors like `Liquid Exception: Could not locate the included file 'assets/index.html'` in the jekyll process as the spectacle docs get rebuilt are normal._

**Note**: _You can also just watch specific builds by specifying which build step to watch like: `npm run watch [watch script]`_

## Updating the Docs with a new API Spec
In order to update the docs site with a new version of the API spec, all you have to do is build spectacle with the new spec file.
For example, to rebuild the v3 docs:
1. Place the new API spec JSON file at `_data/api-spec-v3.json` (overwrite the current file)
1. Rebuild the docs `npm run build`

**Note**: _You can test the changes by starting jekyll: `npm run serve`_
