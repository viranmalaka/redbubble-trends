"use strict";

// const BACKEND = 'http://localhost:3000/';
const BACKEND = 'https://redbubble-trends.herokuapp.com/';


const twoDigi = (a) => (a < 10) ? '0' + a : a;
const getDate = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${twoDigi(d.getMonth() + 1)}-${twoDigi(d.getDate())}`;
}


chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    console.log("declarative content runing");
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "www.redbubble.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });

  chrome.runtime.onMessage.addListener(function(arg, sender, sendResponse) {
    switch (arg.type) {
      case 'startProcess':
        startProcess(arg);
        break;
      case 'getUpdate':
        getUpdate(sender, sendResponse);
        break;
    }
  });
});

const getPayload = (key) => JSON.stringify({
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
  "query": "query withSearchResults($query: String!, $queryParams: QueryParams, $locale: String!, $country: String!, $currency: String!, $previewTypeIds: [String!], $experience: String) {\n  searchResults(query: $query, queryParams: $queryParams, locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds, experience: $experience) {\n    ...Results\n    ...TrendingResults\n    ...Metadata\n    ...Filters\n    ...Pagination\n    ...LandingPage\n    __typename\n  }\n}\n\nfragment Results on SearchResults {\n  results {\n    inventoryItem(locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds) {\n      id\n      marketingProductTypeId\n      description\n      productTypeId\n      productPageUrl\n      blankItemId\n      prominentMessage\n      price {\n        id\n        amount\n        currency\n        __typename\n      }\n      previewSet {\n        id\n        previews {\n          previewTypeId\n          url\n          __typename\n        }\n        __typename\n      }\n      gaCode\n      gaCategory\n      attributes {\n        name\n        value\n        attributes {\n          name\n          value\n          __typename\n        }\n        __typename\n      }\n      volumeDiscount {\n        id\n        thresholds {\n          percentOff\n          quantity\n          __typename\n        }\n        __typename\n      }\n      experiencesProductCard {\n        name\n        value\n        __typename\n      }\n      __typename\n    }\n    work(locale: $locale) {\n      id\n      title\n      artistName\n      isMatureContent\n      tags\n      __typename\n    }\n    defaultPreviewTypeId\n    groupId\n    rank\n    __typename\n  }\n  __typename\n}\n\nfragment TrendingResults on SearchResults {\n  trendingResults {\n    inventoryItem(locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds) {\n      id\n      marketingProductTypeId\n      description\n      productPageUrl\n      productTypeId\n      price {\n        id\n        amount\n        currency\n        __typename\n      }\n      previewSet {\n        id\n        previews {\n          previewTypeId\n          url\n          __typename\n        }\n        __typename\n      }\n      volumeDiscount {\n        id\n        thresholds {\n          percentOff\n          quantity\n          __typename\n        }\n        __typename\n      }\n      gaCode\n      gaCategory\n      attributes {\n        name\n        value\n        attributes {\n          name\n          value\n          __typename\n        }\n        __typename\n      }\n      experiencesProductCard {\n        name\n        value\n        __typename\n      }\n      __typename\n    }\n    work(locale: $locale) {\n      id\n      title\n      artistName\n      isMatureContent\n      tags\n      __typename\n    }\n    defaultPreviewTypeId\n    groupId\n    rank\n    __typename\n  }\n  __typename\n}\n\nfragment Metadata on SearchResults {\n  metadata {\n    title\n    searchContext {\n      category\n      __typename\n    }\n    resultCount\n    topic\n    searchBar {\n      iaCode\n      pillLabel\n      keywords\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment Filters on SearchResults {\n  filters {\n    resetUrl\n    staticFilters {\n      type\n      label\n      options {\n        name\n        label\n        applied\n        url\n        options {\n          name\n          label\n          applied\n          url\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    filters {\n      type\n      label\n      experiences {\n        name\n        value\n        __typename\n      }\n      options {\n        name\n        label\n        applied\n        disabled\n        url\n        hexColor\n        imageUrl\n        __typename\n      }\n      __typename\n    }\n    appliedCount\n    appliedPath\n    resets {\n      label\n      url\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment Pagination on SearchResults {\n  pagination {\n    currentPage\n    perPage\n    showPreviousPageLink\n    showNextPageLink\n    paginationLinks {\n      namedLinks {\n        previousPage {\n          rel\n          url\n          __typename\n        }\n        nextPage {\n          rel\n          url\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    fromNumber\n    toNumber\n    total\n    __typename\n  }\n  __typename\n}\n\nfragment LandingPage on SearchResults {\n  metadata {\n    formattedQuery\n    landingPage {\n      hero {\n        pitch\n        title\n        image\n        color\n        __typename\n      }\n      bubbles {\n        title\n        items {\n          title\n          image\n          realisticImage\n          url\n          isExternal\n          __typename\n        }\n        hasImages\n        __typename\n      }\n      seoMetadata {\n        pageDescription\n        robots\n        canonicalURL\n        searchTitle\n        seoImage\n        alternatePageVersions {\n          href\n          locale\n          __typename\n        }\n        relatedTagLinks {\n          title\n          href\n          text\n          __typename\n        }\n        __typename\n      }\n      footer {\n        text\n        readMoreText\n        breadcrumbs {\n          name\n          url\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    relatedTopics {\n      title\n      url\n      __typename\n    }\n    relatedProducts {\n      id\n      url\n      productTitle\n      fullTitle\n      __typename\n    }\n    searchPageType\n    resultCount\n    searchUUID\n    __typename\n  }\n  __typename\n}\n"
});

const graphQL = (keyword) => $.ajax({ 
  url: `https://www.redbubble.com/boom/graphql`, 
  type: 'POST',
  beforeSend: (request) => {
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  },
  processData: false,
  data: getPayload(keyword) 
});

let searchKeys = {};
let searchKeyArr = [];
let status = 'null';
const metadata = {};

const readBackendData = (query, cb) => {
  $.ajax({ url: `${BACKEND}results?${query}` }).done(cb);
}

const setBackendData = (cb) => {
  $.ajax({ 
    url: `${BACKEND}results/${getDate(Date.now())}`, 
    type: 'POST',
    data: JSON.stringify(searchKeys), 
    beforeSend: (request) => {
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    },
    contentType: 'application/json',
    processData: false,
    success: cb
  });
}

function startProcess() {
  if (status !== 'null') {
    return;
  }
  status = 'generatingKeys';

  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  // const letters = 'ab'.split('');
  const combines = letters.reduce((x, y) => ([...x, ...letters.map(b => b + y)]), letters);

  metadata.terms = combines.length;

  const getSearchKeys = (i, len, cb) => {
    metadata.currentTerm = i;
    if (i < len) {
      $.ajax({ url: `https://www.redbubble.com/typeahead/?term=${combines[i]}&locale=en` })
        .done(function( response ) {
          response.data.trending_searches.forEach(x => {
            searchKeys[x.keywords] = 'not-set';
          });
          setTimeout(() => {
            getSearchKeys(i + 1, len, cb);
          }, 50);
        });
    } else {
      cb();
    }
  }

  let backendSentOn = 0;

  const getCounts = (i, len, cb) => {
    metadata.currentCount = i;

    if (i < len) {
      Promise.allSettled(
        Array(2).fill(0).map((x, j) => graphQL(searchKeyArr[j + i]))
      ).then(function( response ) {
        response.forEach((res, j) => {
          if (res.status !== 'rejected') {
            searchKeys[searchKeyArr[i + j]] = res.value.data.searchResults.metadata.resultCount;
          } else {
            if (searchKeyArr[i + j]) {
              searchKeys[searchKeyArr[i + j]] = 'error';
            }
          }
        });

        if (backendSentOn + 10 < i) {
          setBackendData();
          backendSentOn = i;
        }

        setTimeout(() => {
          getCounts(i + 2 <= len ? i + 2 : len - 2, len, cb);
        }, 2000);
      })
    } else {
      cb();
      setBackendData();
    }
  }

  readBackendData('date=' + getDate(Date.now()), (response) => {
    if (response.length === 0) {
      getSearchKeys(0, combines.length, () => {
        status = 'counting';
        searchKeyArr = Object.keys(searchKeys);
    
        metadata.totalCount = searchKeyArr.length;

        setBackendData(() => {
          console.log('data saved on db 1');
        })
        getCounts(0, searchKeyArr.length, () => {
          status = 'done';
        })
      });
    } else {
      searchKeys = response[0].data;
      searchKeyArr = Object.keys(searchKeys).filter(key => searchKeys[key] === 'not-set');
      metadata.totalCount = searchKeyArr.length;
      status = 'counting';

      getCounts(0, searchKeyArr.length, () => {
        status = 'done';
      })
    }
  });
}

function getUpdate (sender, sendResponse) {
  sendResponse({metadata, searchKeys, status})
}