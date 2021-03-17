# getting-started

Adapted from: https://github.com/algolia/doc-code-samples

_This project was generated with [create-instantsearch-app](https://github.com/algolia/create-instantsearch-app) by [Algolia](https://algolia.com)._

## Get started

To run this project locally, install the dependencies and run the local server:

```sh
npm install
npm start
```

For Blaze checkout to function in demo,  [Blaze](https://github.com/flowcommerce/blaze) must be installed and running locally.

This demo is connected to the [marksandspencerdemo-sandbox](https://console.flow.io/marksandspencer-demo-sandbox/experience)

To run this locally go to this URL: [http://localhost:3000/?flow_country=can&blaze=](http://localhost:3000/?flow_country=can&blaze=) Demo is best used in a *Private Window*.

The `Add to Bag` button will start a checkout with that product in it.  If in `Canada` then you will see Blaze Checkout Overlay, otherwise a standard Flow Checkout UI will trigger.

There currently are no US prices set.  If you set USA or do not init Flow with a country, no products will show.

Alternatively, you may use [Yarn](https://http://yarnpkg.com/):

```sh
yarn
yarn start
```
