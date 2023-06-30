"use client";

import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "../styles/app.css";
import { Layout, Col, Row, message, Button } from "antd";
import { getDate } from "../utils/utils";

import ResultList from "../components/table";
import ScrapeModal from "../components/screape-modal";
import axios from "axios";

const { Header, Content } = Layout;

function App() {
  const [result, setResult] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, chooseDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [checked, setChecked] = useState(() => {
    try {
      let ls = localStorage.getItem("rt_checked");
      ls = JSON.parse(ls);
      return ls || {};
    } catch (e) {
      return {};
    }
  });

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    localStorage.setItem("rt_checked", JSON.stringify(checked));
  }, [checked]);

  const checkItem = (key, state) => {
    if (state) {
      setChecked({ ...checked, [key]: "1" });
    } else {
      const { [key]: a, ...rest } = checked;
      setChecked(rest);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await axios.get(
          "/api/trends/" + (selectedDate || getDate(Date.now()))
        );
        setResult(data.data.data);
        if (!dates.length) {
          const dates = await axios.get("/api/dates");
          const r = dates.data.map((x) => x.date);
          r.reverse();
          setDates(r);
        }
      } catch (e) {
        message.error("Cannot find data");
      }
      setLoading(false);
    })();
  }, [selectedDate, dates.length]);

  useEffect(() => {
    const gt = document.getElementById("gt");
    const gtMap = document.getElementById("gt-map");
    if (selected && gt) {
      gt.innerHTML = "";
      window.trends.embed.renderExploreWidgetTo(
        gt,
        "TIMESERIES",
        {
          comparisonItem: [
            { keyword: selected.key, geo: "", time: "today 12-m" },
          ],
          category: 0,
          property: "",
        },
        {
          exploreQuery: `q=${selected.key}&date=today 12-m`,
          guestPath: "https://trends.google.com:443/trends/embed/",
        }
      );
    }
    if (selected && gtMap) {
      gtMap.innerHTML = "";
      window.trends.embed.renderExploreWidgetTo(
        gtMap,
        "GEO_MAP",
        {
          comparisonItem: [
            { keyword: selected.key, geo: "", time: "2004-01-01 2021-05-20" },
          ],
          category: 0,
          property: "",
        },
        {
          exploreQuery: `q=${selected.key}&date=all`,
          guestPath: "https://trends.google.com:443/trends/embed/",
        }
      );
    }
  }, [selected]);

  return (
    <div className="App">
      <header className="App-header">
        <Layout>
          <Header style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 className="header">Redbubble Trends</h1>
            <ScrapeModal />
          </Header>
          <Content>
            <Row style={{ height: "100%" }}>
              <Col span={5}>
                <ResultList
                  arr={result}
                  checkList={checked}
                  selected={selected}
                  setSelected={setSelected}
                  dates={dates}
                  chooseDate={chooseDate}
                  selectedDate={selectedDate}
                />
              </Col>
              <Col span={19}>
                {selected ? (
                  <>
                    <div>
                      <Button
                        onClick={() => {
                          checkItem(selected.key, !checked[selected.key]);
                        }}
                      >
                        {checked[selected.key] ? "Remove from" : "Add to"} list
                      </Button>
                      <Button
                        onClick={() => {
                          window.open(
                            `https://www.redbubble.com/shop/?query=${selected.key}&ref=search_box`
                          );
                        }}
                      >
                        Visit redbubble
                      </Button>

                      <span style={{ float: "right" }}>
                        {selected.previous.filter((a) => !!a).join("-")}
                      </span>
                    </div>
                    <div>
                      <iframe
                        id="google-search"
                        src={`https://www.google.com/search?igu=1&q=${selected.key}`}
                        frameBorder="0"
                        style={{ width: "100%", height: "44vh" }}
                      />
                    </div>
                    <div
                      style={{ width: "100%", height: "47vh", display: "flex" }}
                    >
                      <div id="gt" style={{ width: "50%" }} />
                      <div id="gt-map" style={{ width: "50%" }} />
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <h2 style={{ marginTop: 50 }}>
                      Select a keyword to see the google trend and google search
                      results
                    </h2>
                  </div>
                )}
              </Col>
            </Row>
          </Content>
        </Layout>
      </header>
    </div>
  );
}

export default App;
