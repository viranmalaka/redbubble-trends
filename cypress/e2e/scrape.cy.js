const twoDigi = (a) => (a < 10) ? '0' + a : a;
const getDate = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${twoDigi(d.getMonth() + 1)}-${twoDigi(d.getDate())}`;
}

const PR_TERMS = 9;
const PR_GQL = 9;

describe('test', () => {

  const metadata = {};

  it('scrape', () => {
    cy.visit('https://www.redbubble.com/', {timeout: 600000, onBeforeLoad(win) {
        console.log('here on beforeload');
      }});

    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    // const letters = 'ab'.split('');

    const combines = letters.reduce((x, y) => [...x, ...letters.map((b) => b + y)], letters);
    let searchKeys = {};
    let searchKeysArray = [];

    const getSearchKeys = (i, len, cb) => {
      if (i < len) {
        cy.task('getTrendingSearch', combines.slice(i, i + PR_TERMS)).then(result => {
          result.forEach(({data: {trending_searches}}) => {
            trending_searches.forEach(x => {
              searchKeys[x.keywords] = 'not-set';
            })
          });
          cy.task('log', `[Params] from ${len} finished ${i + PR_TERMS}`);
          cy.wait(400);
          getSearchKeys(i + PR_TERMS, len, cb);
        });
      } else {
        cb();
      }
    };

    const getGQLResults = (i, len, cb) => {
      if (i < len) {

        cy.task('getResultsCount', searchKeysArray.slice(i, i + PR_GQL)).then(result => {
          cy.task('log', `[GraphQL] from ${len} finished ${i + PR_GQL}`);
          result.forEach((response, j) => {
            searchKeys[searchKeysArray[i + j]] = response.data.searchResults.metadata.resultCount;
          });
          if (i % (PR_GQL * 5) === 0) {
            cy.request('POST', `https://redbubble-trends.herokuapp.com/results/${getDate(Date.now())}`, searchKeys).then(() => {
              cy.task('log', 'updated...');
            });
          }
          cy.wait(400);
          getGQLResults(i+PR_GQL, len, cb);
        })
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
        searchKeysArray = Object.keys(searchKeys).filter(x => searchKeys[x] === 'not-set');
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
