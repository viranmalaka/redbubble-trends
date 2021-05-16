const twoDigi = (a) => (a < 10) ? '0' + a : a;
const getDate = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${twoDigi(d.getMonth() + 1)}-${twoDigi(d.getDate())}`;
}


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

describe('test', () => {

  const metadata = {};

  it('scrape', () => {
    cy.visit('https://www.redbubble.com/');

    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    // const letters = 'ab'.split('');

    const combines = letters.reduce((x, y) => [...x, ...letters.map((b) => b + y)], letters);
    let searchKeys = {};
    let searchKeysArray = [];

    const getSearchKeys = (i, len, cb) => {
      if (i < len) {
        cy.request(`https://www.redbubble.com/typeahead/?term=${combines[i]}&locale=en`).then(function (response) {
          response.body.data.trending_searches.forEach((x) => {
            searchKeys[x.keywords] = 'not-set';
          });
          cy.task('log', `[Params] from ${len} finished ${i + 1}`);
          cy.wait(50);
          getSearchKeys(i + 1, len, cb);
        });
      } else {
        cb();
      }
    };

    const getGQLResults = (i, len, cb) => {
      if (i < len) {

        if (searchKeys[searchKeysArray[i]] === 'not-set') {
          cy.request('POST', 'https://www.redbubble.com/boom/graphql', getPayload(searchKeysArray[i])).then(response => {
            cy.task('log', `[GraphQL] from ${len} finished ${i + 1}`);
  
            searchKeys[searchKeysArray[i]] = response.body.data.searchResults.metadata.resultCount;
  
            if (i % 10 === 0) {
              cy.request('POST', `https://redbubble-trends.herokuapp.com/results/${getDate(Date.now())}`, searchKeys).then(() => {
                cy.task('log', 'updated...');
              });
            }
  
            getGQLResults(i+1, len, cb);
          })
        } else {
          cy.task('log', `[GraphQL] from ${len} finished ${i + 1} (already exist)`);
          getGQLResults(i+1, len, cb);
        }
      } else {
        cb();
      }
    }


    cy.request(`https://redbubble-trends.herokuapp.com/results?date=${getDate(Date.now())}`).then(function(response) {

      const fn = () => {
        getGQLResults(0, searchKeysArray.length, () => {
          cy.request('POST', `https://redbubble-trends.herokuapp.com/results/${getDate(Date.now())}`, searchKeys).then(() => {
            cy.task('log', `finished job...`);
            cy.task('log', 'updated...');
          });
        });
      }

      if(response && response.body.length) {
        searchKeys = response.body[0].data;
        searchKeysArray = Object.keys(searchKeys);
        cy.task('log', `already saved on DB: ${searchKeysArray.length}`)
        fn();
      } else {
        getSearchKeys(0, combines.length, () => {
          searchKeysArray = Object.keys(searchKeys);
          cy.task('log', `total keys found: ${searchKeysArray.length}`)
          cy.task('log', 'finished query');
          fn();
        });
      }
    })
  });
});