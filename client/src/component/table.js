import React, { useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import {XYPlot, VerticalBarSeries} from 'react-vis';
import { Input, Select } from 'antd';

const {Option} = Select;

const Row = (rows, checkedList, selected, setSelected) => ({index, style}) => {
  const row = rows[index];

  return <div style={style}
              className={`row-container ${selected && row.key === selected.key ? 'selected' : ''} ${checkedList[row.key] ? 'checked' : ''} `}>
    <div className="row" onClick={() => setSelected(row)}>
      <div className="number">{row.count === 'not-set' ? 'N/A' : row.count}</div>
      <div className="name">{row.key}</div>
      {row.previous.length && <div>
        <XYPlot height={70} width={70}>
          <VerticalBarSeries data={row.previous.map((key, index) => ({x: index, y: key || 0}))} />
        </XYPlot>
      </div>}
    </div>
  </div>
}

const ResultList = ({arr, checkList, selected, setSelected, chooseDate, dates, selectedDate}) => {
  const [filter, setFilter] = useState({text: '', min: '', max: ''});

  let filteredArr = [...arr];
  if (filter.text) {
    filteredArr = filteredArr.filter(r => r.key.indexOf(filter.text) > -1);
  }
  if (filter.max) {
    try {
      filteredArr = filteredArr.filter(r => r.count <= parseInt(filter.max))
    } catch (e) {
      console.log('error');
    }
  }
  if (filter.min) {
    try {
      filteredArr = filteredArr.filter(r => r.count >= parseInt(filter.min))
    } catch (e) {
      console.log('error');
    }
  }

  return <div style={{height: '100%'}}>
    <Select style={{ width: '100%' }} onChange={v => chooseDate(v)} value={selectedDate}>
      {dates.map(x => <Option value={x} key={x}>{x}</Option>)}
    </Select>
    <Input.Group compact>
      <Select defaultValue="1">
        <Option value="1">Between</Option>
      </Select>
      <Input style={{ width: 80, textAlign: 'center' }} placeholder="Min" onBlur={(e) => setFilter({...filter, min: e.target.value})} />
      <Input style={{width: 80, textAlign: 'center' }} placeholder="Max" onBlur={(e) => setFilter({...filter, max: e.target.value})} />
    </Input.Group>
    <Input placeholder="search..." onChange={(e) => setFilter({...filter, text: e.target.value})} />

    <AutoSizer>
      {({height, width}) => (
        <List
          height={height - 100}
          itemCount={filteredArr.length}
          itemSize={70}
          width={width}
        >
          {Row(filteredArr, checkList, selected, setSelected)}
        </List>
      )}
    </AutoSizer>
  </div>
}


export default ResultList;
