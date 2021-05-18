import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import './App.css';
import {Layout, Col, Row, message, Button, Spin} from 'antd';

import ResultList from './component/table';
import axios from "axios";
import {getDate} from "./utils";

const { Header, Content } = Layout;

function App(props) {
  const [result, setResult] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, chooseDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [checked, setChecked] = useState(() => {
    try {
      let ls = localStorage.getItem('rt_checked');
      ls = JSON.parse(ls);
      return ls || {};
    } catch (e) {
      return {};
    }
  })

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    localStorage.setItem('rt_checked', JSON.stringify(checked));
  }, [checked]);

  const checkItem = (key, state) => {
    if (state) {
      setChecked({...checked, [key]: '1'});
    } else {
      const {[key]: a, ...rest} = checked;
      setChecked(rest);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await axios.get('https://redbubble-trends.herokuapp.com/trends/' + (selectedDate || getDate(Date.now())));
        setResult(data.data.data);
        if (!dates.length) {
          const dates = await axios.get('https://redbubble-trends.herokuapp.com/dates');
          // const dates = await axios.get('http://localhost:4000/dates');
          const r = dates.data.map(x => x.date);
          r.reverse();
          setDates(r);
        }
      } catch (e) {
        message.error('Cannot find data');
      }
      setLoading(false);
    })();
  }, [selectedDate])

  useEffect(() => {
    const gt = document.getElementById('gt');
    if (selected && gt) {
      gt.innerHTML = '';
      window.trends.embed.renderExploreWidgetTo(
        gt,
        "TIMESERIES",
        {
          "comparisonItem":[{"keyword":selected.key,"geo":"","time":"today 12-m"}],
          "category":0,
          "property":""
        }, {
          "exploreQuery":`q=${selected.key}&date=today 12-m`,
          "guestPath":"https://trends.google.com:443/trends/embed/"
        });
    }
  }, [selected]);

  return (
    <div className="App">
      <header className="App-header">

      <Layout>
      <Header style={{display: 'flex', justifyContent: 'space-between'}}><h1 className="header">Redbubble Trends</h1>
      </Header>
      <Content>
        <Row style={{height: "100%"}}>
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
            {selected ? <>
              <div>
                <Button onClick={() => {
                  checkItem(selected.key, !checked[selected.key])
                }}>{checked[selected.key] ? 'Remove from' : 'Add to'} list</Button>
                <Button onClick={() => {
                    window.open(`https://www.redbubble.com/shop/?query=${selected.key}&ref=search_box`)
                }}>Visit redbubble</Button>
              </div>
              <div id="gt" style={{width: '100%', height: '45vh'}}>
              </div>
              <div>
                <iframe
                  id="google-search"
                  src={`https://www.google.com/search?igu=1&q=${selected.key}`}
                  frameBorder="0"
                  style={{width: "100%", height: "44vh"}}
                />
              </div>
            </> : <div style={{textAlign: 'center'}}>
              <h2 style={{marginTop: 50}}>Select a keyword to see the google trend and google search results</h2>
            </div>}
          </Col>
        </Row>
      </Content>
    </Layout>
      </header>
    </div>
  );
}

export default App;
