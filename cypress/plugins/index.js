/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

const axios = require('axios');
const PromiseRetry = require('promise-retry');

const getPayload = (key) => ({
  "operationName": "withSearchResults",
  "variables": {
    "query": key,
    "queryParams": {
      "queryParamItems": [
        {
          "name": "query",
          "values": key,
        },
        {
          "name": "ref",
          "values": "search_box"
        }
      ],
      "searchType": "find"
    },
    "locale": "en",
    "country": "LK",
    "currency": "USD",
    "previewTypeIds": [
      "product_close",
      "alternate_product_close",
      "artwork"
    ],
    "experience": "srp"
  },
  "query": `query withSearchResults(
    $query: String!
    $queryParams: QueryParams
    $locale: String!
    $country: String!
    $currency: String!
    $previewTypeIds: [String!]
    $experience: String
  ) {
    searchResults(
      query: $query
      queryParams: $queryParams
      locale: $locale
      country: $country
      currency: $currency
      previewTypeIds: $previewTypeIds
      experience: $experience
    ) {
      ...Metadata
    }
  }
  fragment Metadata on SearchResults {
    metadata {
      resultCount
    }
  }`
});

const PROptions = {
  
};

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    log (message) {
      console.log(message)
      return null
    },
    getTrendingSearch (letters) {
      return new Promise(((resolve, reject) => {
        const promises = letters.map(l => PromiseRetry((retry) => axios.get(`https://www.redbubble.com/typeahead/?term=${l}&locale=en`).catch(retry)));
        Promise.all(promises).then(result => {
          resolve(result.map(x => x.data));
        });
      }))
    },
    getResultsCount (keywords) {
      return new Promise(((resolve, reject) => {
        const promises = keywords.map(k => PromiseRetry((retry) => axios.post("https://www.redbubble.com/boom/graphql", getPayload(k)).catch(retry)));
        Promise.all(promises).then(result => {
          resolve(result.map(response => response.data));
        });
      }))
    }
  });
}

