(async () => {
  const PR_TERMS = 9;
  const PR_GQL = 9;
  const HOSTED_URL = "https://redbubble-trends.vercel.app/api";

  // UTILS
  const twoDigi = (a) => (a < 10 ? "0" + a : a);
  const getDate = (ms = Date.now()) => {
    const d = new Date(ms);
    return `${d.getFullYear()}-${twoDigi(d.getMonth() + 1)}-${twoDigi(
      d.getDate()
    )}`;
  };
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const apiService = async ({ url }) => {
    const obj = {
      headers: {
        accept: "*/*",
      },
      method: "GET",
    };
    const res = await fetch(url, obj);
    return res.json();
  };

  const gqlData = (key) => {
    return fetch("https://www.redbubble.com/boom/graphql", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer: `https://www.redbubble.com/shop/?query=${key}&ref=search_box`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"operationName":"withSearchResults","variables":{"query":"${key}","queryParams":{"queryParamItems":[{"name":"query","values":"${key}"},{"name":"ref","values":"search_box"}],"searchType":"find"},"locale":"en","country":"LK","currency":"USD","previewTypeIds":["product_close","alternate_product_close","artwork"],"experience":"srp"},"query":"query withSearchResults($query: String!, $queryParams: QueryParams, $locale: String!, $country: String!, $currency: String!, $previewTypeIds: [String!], $experience: String) {\\n  searchResults(query: $query, queryParams: $queryParams, locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds, experience: $experience) {\\n    ...Results\\n    ...TrendingResults\\n    ...Metadata\\n    ...Filters\\n    ...Pagination\\n    ...LandingPage\\n    __typename\\n  }\\n}\\n\\nfragment Results on SearchResults {\\n  results {\\n    inventoryItem(locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds) {\\n      id\\n      marketingProductTypeId\\n      description\\n      productTypeId\\n      productPageUrl\\n      blankItemId\\n      prominentMessage\\n      price {\\n        id\\n        amount\\n        currency\\n        discount {\\n          amount\\n          percent\\n          __typename\\n        }\\n        __typename\\n      }\\n      previewSet {\\n        id\\n        previews {\\n          previewTypeId\\n          url\\n          __typename\\n        }\\n        __typename\\n      }\\n      gaCode\\n      gaCategory\\n      attributes {\\n        name\\n        value\\n        attributes {\\n          name\\n          value\\n          __typename\\n        }\\n        __typename\\n      }\\n      volumeDiscount {\\n        id\\n        thresholds {\\n          percentOff\\n          quantity\\n          __typename\\n        }\\n        __typename\\n      }\\n      experiencesProductCard {\\n        name\\n        value\\n        __typename\\n      }\\n      __typename\\n    }\\n    work(locale: $locale) {\\n      id\\n      title\\n      artistName\\n      isMatureContent\\n      tags\\n      __typename\\n    }\\n    defaultPreviewTypeId\\n    groupId\\n    rank\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment TrendingResults on SearchResults {\\n  trendingResults {\\n    inventoryItem(locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds) {\\n      id\\n      marketingProductTypeId\\n      description\\n      productPageUrl\\n      productTypeId\\n      price {\\n        id\\n        amount\\n        currency\\n        __typename\\n      }\\n      previewSet {\\n        id\\n        previews {\\n          previewTypeId\\n          url\\n          __typename\\n        }\\n        __typename\\n      }\\n      volumeDiscount {\\n        id\\n        thresholds {\\n          percentOff\\n          quantity\\n          __typename\\n        }\\n        __typename\\n      }\\n      gaCode\\n      gaCategory\\n      attributes {\\n        name\\n        value\\n        attributes {\\n          name\\n          value\\n          __typename\\n        }\\n        __typename\\n      }\\n      experiencesProductCard {\\n        name\\n        value\\n        __typename\\n      }\\n      __typename\\n    }\\n    work(locale: $locale) {\\n      id\\n      title\\n      artistName\\n      isMatureContent\\n      tags\\n      __typename\\n    }\\n    defaultPreviewTypeId\\n    groupId\\n    rank\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Metadata on SearchResults {\\n  metadata {\\n    title\\n    searchContext {\\n      category\\n      __typename\\n    }\\n    resultCount\\n    topic\\n    searchBar {\\n      iaCode\\n      pillLabel\\n      keywords\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Filters on SearchResults {\\n  filters {\\n    resetUrl\\n    staticFilters {\\n      type\\n      label\\n      options {\\n        name\\n        label\\n        applied\\n        url\\n        options {\\n          name\\n          label\\n          applied\\n          url\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    filters {\\n      type\\n      label\\n      experiences {\\n        name\\n        value\\n        __typename\\n      }\\n      options {\\n        name\\n        label\\n        applied\\n        disabled\\n        url\\n        hexColor\\n        imageUrl\\n        __typename\\n      }\\n      __typename\\n    }\\n    appliedCount\\n    appliedPath\\n    resets {\\n      label\\n      url\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Pagination on SearchResults {\\n  pagination {\\n    currentPage\\n    perPage\\n    showPreviousPageLink\\n    showNextPageLink\\n    paginationLinks {\\n      namedLinks {\\n        previousPage {\\n          rel\\n          url\\n          __typename\\n        }\\n        nextPage {\\n          rel\\n          url\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    fromNumber\\n    toNumber\\n    total\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment LandingPage on SearchResults {\\n  metadata {\\n    formattedQuery\\n    landingPage {\\n      hero {\\n        pitch\\n        title\\n        image\\n        color\\n        __typename\\n      }\\n      bubbles {\\n        title\\n        items {\\n          title\\n          image\\n          realisticImage\\n          url\\n          isExternal\\n          __typename\\n        }\\n        hasImages\\n        __typename\\n      }\\n      seoMetadata {\\n        pageDescription\\n        robots\\n        canonicalURL\\n        searchTitle\\n        seoImage\\n        alternatePageVersions {\\n          href\\n          locale\\n          __typename\\n        }\\n        relatedTagLinks {\\n          title\\n          href\\n          text\\n          __typename\\n        }\\n        faq {\\n          title\\n          items {\\n            question\\n            answer\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      footer {\\n        text\\n        readMoreText\\n        breadcrumbs {\\n          name\\n          url\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    relatedTopics {\\n      title\\n      url\\n      __typename\\n    }\\n    relatedProducts {\\n      id\\n      url\\n      productTitle\\n      fullTitle\\n      __typename\\n    }\\n    searchPageType\\n    resultCount\\n    searchUUID\\n    __typename\\n  }\\n  __typename\\n}\\n"}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then((a) => a.json());
  };

  // END UTILS

  const letters = "abcd".split("");

  const combines = letters.reduce(
    (x, y) => [...x, ...letters.map((b) => b + y)],
    letters
  );
  let searchKeys = {};
  let searchKeysArray = [];

  // api utils
  const getTrendingSearches = (letters) => {
    return Promise.all(
      letters.map((l) =>
        apiService({
          url: `https://www.redbubble.com/typeahead/?term=${l}&locale=en`,
        })
      )
    );
  };

  const getResultsCount = (keywords) => {
    return Promise.all(keywords.map(gqlData));
  };

  const saveKeywords = (searchKeys) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchKeys),
      redirect: "follow",
    };

    return fetch(
      `${HOSTED_URL}/results?date=${getDate()}`,
      requestOptions
    ).then(() => {
      console.log("Updating... and Finished Job");
    });
  };

  const getGQLResults = async (i, len, cb) => {
    if (i < len) {
      const results = await getResultsCount(
        searchKeysArray.slice(i, i + PR_GQL)
      );
      results.forEach((response, j) => {
        searchKeys[searchKeysArray[i + j]] =
          response.data.searchResults.metadata.resultCount;
      });
      if (i % (PR_GQL * 5) === 0) {
        saveKeywords(searchKeys).then(() => {
          console.log("Updated My Service");
        });
      }
      console.log(`[GQL] from ${len} finished ${i + PR_GQL}`);
      await wait(400);
      await getGQLResults(i + PR_GQL, len, cb);
    } else {
      cb();
    }
  };

  const getSearchKeys = async (i, len, cb) => {
    if (i < len) {
      const trendingSearches = await getTrendingSearches(
        combines.slice(i, i + PR_TERMS)
      );
      trendingSearches.forEach(({ data: { trending_searches } }) => {
        trending_searches.forEach((x) => (searchKeys[x.keywords] = "not-set"));
      });
      console.log(`[Terms] from ${len} finished ${i + PR_TERMS}`);
      await wait(400);
      await getSearchKeys(i + PR_TERMS, len, cb);
    } else {
      cb();
    }
  };

  const getKeywordItemCounts = () => {
    saveKeywords(searchKeys);
    getGQLResults(0, searchKeysArray.length, () => {
      saveKeywords(searchKeys);
    });
  };

  // check the existing data on our server
  const existingData = await apiService({
    url: `${HOSTED_URL}/results?date=${getDate()}`,
  });
  if (existingData && existingData.length) {
    searchKeys = existingData[0].data;
    searchKeysArray = Object.keys(searchKeys).filter(
      (x) => searchKeys[x] === "not-set"
    );
    console.log(`Already saved on DB: ${searchKeysArray.length}`);
    getKeywordItemCounts();
  } else {
    getSearchKeys(0, combines.length, () => {
      searchKeysArray = Object.keys(searchKeys);
      console.log(`Total keys found: ${searchKeysArray.length}`);
      console.log("Finished Query");
      getKeywordItemCounts();
    });
  }
})();
