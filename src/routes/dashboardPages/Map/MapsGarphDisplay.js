import React, { PropTypes } from 'react';
import fetch from 'isomorphic-fetch'
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import {
  LineChart, Tooltip, PieChart, Pie,
  Line, XAxis, YAxis, Legend,
  CartesianGrid, Bar, BarChart,
  ResponsiveContainer
} from '../../../vendor/recharts';
import BasicMap from './Map';
import mapDataJson from './world50m';

const title = 'Maps Charts';

var worldmapIpConutData = plotMapData();
var countriesEntriesAmountData = plotCountriesEntryData();

function plotMapData() {
  return fetch('/getMapData')
    .then(response => response.json())
    .then(data => worldmapIpConutData = data);
}

function plotCountriesEntryData() {
  return fetch('/getCountriesEntriesAmount')
    .then(response => response.json())
    .then(data => countriesEntriesAmountData = data);
}

function displayMapsCharts(props, context) {

  plotMapData();
  plotCountriesEntryData();

  context.setTitle(title);
  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <PageHeader>Countries Enteries</PageHeader>
        </div>
      </div>

      <div className="row">
        <div className="row">
          <div className="col-lg-12">
            <Panel header={<span>Map Enteries</span>} >
              <div>
                <ResponsiveContainer width="100%" aspect={2}>
                  <BasicMap mapData={worldmapIpConutData} />
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <Panel header={<span>Countries graph </span>} >
            <div>
              <ResponsiveContainer width="100%" aspect={2}>
                <BarChart
                  data={countriesEntriesAmountData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="data" fill="#8884d8" />
                  {/*   <Bar dataKey="uv" fill="#82ca9d" />*/}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          </div>
        </div>

      </div>
    </div>
  );
}

displayMapsCharts.contextTypes = { setTitle: PropTypes.func.isRequired };

export default displayMapsCharts;
