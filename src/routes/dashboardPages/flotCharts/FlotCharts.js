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
import BasicMap from '../Map/Map';
import mapDataJson from '../Map/world50m';

const title = 'Flot Charts';

var lineChartData = plotDataHoursData();
var serviceTypeData = plotServiceTypeData();
var protocolChartData = plotProtocolTypeData();
var bytesStatisticChartData = plotBytesStatisticChartData();
var sessionDurationChartData = plotSessionDurationData();
var worldmapIpConutData = plotMapData();
var countriesEntriesAmountData = plotCountriesEntryData();


function plotSessionDurationData() {
  return fetch('/getSessionDurationData')
    .then(response => response.json())
    .then(data => sessionDurationChartData = data);
}

function plotDataHoursData() {
  return fetch('/getLineChartData')
    .then(response => response.json())
    .then(data => lineChartData = data);
}

function plotServiceTypeData() {
  return fetch('/getServiceTypeData')
    .then(response => response.json())
    .then(data => serviceTypeData = data);
}

function plotProtocolTypeData() {
  return fetch('/getProtocolTypeData')
    .then(response => response.json())
    .then(data => protocolChartData = data);
}

function plotBytesStatisticChartData() {
  return fetch('/getBytesStatisticData')
    .then(response => response.json())
    .then(data => bytesStatisticChartData = data);
}

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

function displayFlotCharts(props, context) {

  plotBytesStatisticChartData();
  plotProtocolTypeData();
  plotServiceTypeData();
  plotDataHoursData();
  plotSessionDurationData();
  plotMapData();
  plotCountriesEntryData();

  context.setTitle(title);
  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <PageHeader>Statistics</PageHeader>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <Panel header={<span>Data (Bytes/hour)</span>} >
            <div>
              <ResponsiveContainer width="100%" aspect={2}>
                <LineChart data={lineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis />
                  <YAxis />
                  <Tooltip />
                  <Line type="data" dataKey="data" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <Panel header={<span>Service type</span>} >
            <div>
              <ResponsiveContainer width="100%" aspect={2}>
                <BarChart
                  data={serviceTypeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="data" fill="#88cc00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
        <div className="col-lg-6">
          <Panel header={<span>Protocol (24h)</span>} >
            <div>
              <ResponsiveContainer width="100%" aspect={2}>
                <BarChart
                  data={protocolChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
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

      <div className="row">
        <div className="col-lg-6">
          <Panel header={<span>Bytes statistic (24h)</span>} >
            <div>
              <ResponsiveContainer width="100%" aspect={2}>
                <BarChart
                  data={bytesStatisticChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="data" fill="#E74C3C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="col-lg-6">
          <Panel header={<span>Session duration</span>} >
            <div>
              <ResponsiveContainer width="100%" aspect={2}>
                <PieChart >
                  <Pie isAnimationActive={true} data={sessionDurationChartData} fill=" #007acc" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

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

displayFlotCharts.contextTypes = { setTitle: PropTypes.func.isRequired };

export default displayFlotCharts;

{/* 
/*const lineChartData = [
  { name: '00:00', data: 1200 },
  { name: '01:00', data: 1200 },
  { name: '02:00', data: 1200 },
  { name: '03:00', data: 1200 },
  { name: '04:00', data: 1200 },
  { name: '05:00', data: 1300 },
  { name: '06:00', data: 1350 },
  { name: '07:00', data: 1578 },
  { name: '08:00', data: 1907 },
  { name: '09:00', data: 2657 },
  { name: '10:00', data: 5679 },
  { name: '11:00', data: 6743 },
  { name: '12:00', data: 7532 },
  { name: '13:00', data: 5786 },
  { name: '14:00', data: 8535 },
  { name: '15:00', data: 7535 },
  { name: '16:00', data: 6542 },
  { name: '17:00', data: 4675 },
  { name: '18:00', data: 3242 },
  { name: '19:00', data: 2356 },
  { name: '20:00', data: 1567 },
  { name: '21:00', data: 1200 },
  { name: '22:00', data: 1200 },
  { name: '23:00', data: 1200 },
];//plotData();
*/
/*
const serviceChartData = [
  { name: 'ssl', value: 1123 },
  { name: 'none', value: 346 },
  { name: 'http', value: 9876 },
];
 
/*
const sessionDurationChartData = [
  { name: '0.5-1 sec', value: 1123 },
  { name: '1-1.5 sec', value: 1432 },
  { name: '0-0.5 sec', value: 3654 },
  { name: '1.5-2 sec', value: 653 },
  { name: '>2 sec', value: 94 },
];
/*
const protocolChartData = [
  { name: 'TCP', count: 400 },
  { name: 'UDP', count: 200 },
  { name: 'ICMP', count: 100 },
];
*/
/*const bytesStatisticChartData = [
  { name: 'Originator payload bytes ', value: 9374521 },
  { name: 'Responder payload bytes', value: 5316423 },
  { name: 'Missing bytes', value: 16354 },
];
*/
/*
const ipsByCountrryChartData = [
  { name: 'Viatnam', value: 1123 },
  { name: 'Israel', value: 1432 },
  { name: 'Iran', value: 3654 },
  { name: 'Russia', value: 653 },
  { name: 'Lebanon', value: 94 },
];
*/}