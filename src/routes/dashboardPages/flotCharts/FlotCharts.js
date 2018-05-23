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
import BasicMap from '../../../components/Map/Map'

const title = 'Flot Charts';
var lineChartData = getLineChartData();
var sessionDurationChartData = getSessionDurationData();

function getSessionDurationData() {
    return fetch('/getSessionDurationData')
      .then(response => response.json()).then(data=> sessionDurationChartData = data);
}
function getLineChartData() {
  return fetch('/getLineChartData')
    .then(response => response.json()).then(data => lineChartData = data);
}

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
*/  
const protocolChartData = [
  { name: 'TCP', count: 400 },
  { name: 'UDP', count: 200 },
  { name: 'ICMP', count: 100 },
];

const bytesStatisticChartData = [
  { name: 'Originator payload bytes ', value: 9374521 },
  { name: 'Responder payload bytes', value: 5316423 },
  { name: 'Missing bytes', value: 16354 },
];

const ipsByCountrryChartData = [
  { name: 'Viatnam', value: 1123 },
  { name: 'Israel', value: 1432 },
  { name: 'Iran', value: 3654 },
  { name: 'Russia', value: 653 },
  { name: 'Lebanon', value: 94 },
];

function displayFlotCharts(props, context) {
  getLineChartData();
  getSessionDurationData();

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
                  data={serviceChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#88cc00" />
                  {/*   <Bar dataKey="uv" fill="#82ca9d" />*/}
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
                  <Bar dataKey="count" fill="#8884d8" />
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
                  <Bar dataKey="value" fill="#E74C3C" />
                  {/*   <Bar dataKey="uv" fill="#82ca9d" />*/}
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
            <Panel header={<span>Ips by country</span>} >
              <div>
                <ResponsiveContainer width="100%" aspect={2}>
                  <BasicMap />
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
