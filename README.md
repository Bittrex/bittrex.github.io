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

### Update v1
1. Make changes directly to the JSON file at `_data/api-spec-v1-1.json`
1. Rebuild the v1 docs page `npm run build:spectacle:v1`

**Note**: _We do not generate an API spec file for v1, so the spec file was built manually_

### Update v3
**Note**: _The API spec file for v3 is automatically generated, and we have a few changes that we make manually, so a build step is required to get the final spec JSON used to generate the static site_
1. Place the generated API spec JSON file at `src/_data/api-spec-v3.json` (overwrite the current file)
1. Build the v3 spec file `npm run build:json:v3`
1. Rebuild the v3 docs site `npm run build:spectacle:v3`
