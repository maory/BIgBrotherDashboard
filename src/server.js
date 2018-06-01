import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import React from 'react';
import groupBy from 'group-by';
import moment from 'moment'
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import * as Papa from 'papaparse';
import virustotal from 'virustotal.js';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import { port, auth, connLogParseConfig, isoCountries } from './config';
import mapData from './routes/dashboardPages/Map/world50m.json';

const app = express();
const fs = require('fs');
// Naamani
const userAgents = ['chrome', 'mozilla', 'explorer', 'safari', 'opera'];

var vtReport;

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));

function uploadIpToVT(IpAdress) {
  virustotal.setKey('db8bdbc2dcc403fa7ee090eb9305b1a0ffb5bdb95c4cec58323316672efb0d65');
  return virustotal.getIpReport(IpAdress, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }

    vtReport = res;
  });
}

//#region Get Methods

app.get('/getConn', (req, res) => {
  res.send(getConnData());
});

app.get('/getHttpData', (req, res) => {
  res.send(getHttpData());
});

app.get('/getLineChartData', (req, res) => {
  let data = getConnData();
  let groupedByData = groupByValueFunc(data.map(mapToTimeAndBytes), sum);
  res.send(keyValueToGraph(groupedByData));
});

app.get('/uploadIpToVT', (req, res) => {
  res.send(uploadIpToVT('8.8.8.8'));
});

app.get('/uploadDomainToVT', (req, res) => {
  res.send(uploadDomainToVT('www.fashionstune.com'));
});

app.get('/reportVT', (req, res) => {
  console.log(vtReport);
  res.send(vtReport);
});

// Naamani
app.get('/scanUserAgents', (req, res) => {
  let maliciousUserAgentslag = CheckUserAgent();
  if (maliciousUserAgentslag.length === 0) {
    res.send("User agent is valid");
  }
  else {
    res.send(maliciousUserAgentslag);
  }
}); 

// Naamani
app.get('/CheckSslValidPorts', (req, res) => {
  let badSslPorts = checkValidPortsToProtocolsSsl();
  if (badSslPorts.length === 0) {
    res.send("Legit Ssl trafic");
  }
  else {
    res.send(badSslPorts);
  }
});

// Naamani
app.get('/CheckHttpValidPorts', (req, res) => {
  let badHttpPorts = checkValidPortsToProtocolsHttp();
  if (badHttpPorts.length === 0) {
    res.send("Legit http trafic");
  }
  else {
    res.send(badHttpPorts);
  }
});

app.get('/getSessionDurationData', (req, res) => {
  let data = getConnData();
  
  // TODO : Should Come from config file or from client side ??
  let durationRanges = [0, , 0.1, 0.25, 0.5, 1, 1.5, 2, 5, 7, 12, 9999];

  let mappedData = data.map(log => log.duration);
  let groupedByDurations = {};
  data.forEach(log => {
    for (var i = 0; i < durationRanges.length - 1; i++) {
      if (durationRanges[i] < log.duration && log.duration <= durationRanges[i + 1]) {
        const range = durationRanges[i] + '-' + durationRanges[i + 1];

        if (!(range in groupedByDurations)) {
          groupedByDurations[range] = 0;
        }
        
        groupedByDurations[range]++;
      }
    }
  });
  
  res.send(keyValueToPieChart(groupedByDurations));
});


// gil
app.get('/getServiceTypeData', (req, res) => {
  let data = getConnData();
  let specificData = data.map(function (logData) {
    return {
      key: logData.service,
      value: 1
    };
  });
  
  var groupedByData = {};
  
  specificData.forEach(function (obj) {
    if (groupedByData[obj.key] === undefined) {
      groupedByData[obj.key] = 0;
    }
    groupedByData[obj.key] += 1;
  });
  
  res.send(keyValueToGraph(groupedByData));
});

// gil
app.get('/getProtocolTypeData', (req, res) => {
  let data = getConnData();
  let specificData = data.map(function (logData) {
    return {
      key: logData.proto,
      value: 1
    };
  });
  
  var groupedByData = {};
  
  specificData.forEach(function (obj) {
    if (groupedByData[obj.key] === undefined) {
      groupedByData[obj.key] = 0;
    }
    
    groupedByData[obj.key] += 1;
  });
  
  res.send(keyValueToGraph(groupedByData));
});

// gil
app.get('/getBytesStatisticData', (req, res) => {
  let data = getConnData();
  let specificData = data.map(function (logData) {
    return [{
      key: 'Originator payload',
      value: logData.orig_bytes,
    }, {
      key: 'Responder payload',
      value: logData.resp_bytes
    }, {
      key: 'Missing',
      value: logData.missed_bytes
    }];
  });
  
  var groupedByData = {};
  
  specificData.forEach(function (obj) {
    obj.forEach(function (obj) {
      if (groupedByData[obj.key] === undefined) {
        groupedByData[obj.key] = 0;
      }
      
      if (!isNaN(obj.value))
      groupedByData[obj.key] += parseInt(obj.value);
    });
  });
  
  res.send(keyValueToGraph(groupedByData));
});


app.get('/getMapData', (req, res) => {
  let countryEntriesAmount = getCountriesEntriesAmount();
  let flag;
  
  var clonedMapData = JSON.parse(JSON.stringify(mapData));
  
  // Build map data
  clonedMapData.objects.units.geometries.forEach(function (obj) {
    flag = false;
    for (var key in countryEntriesAmount) {
      if (obj.properties.name.includes(key)) {
        obj.properties.name = key + ': ' + countryEntriesAmount[key] + ' Visits';
        flag = true;
        break;
      }
    }
    
    if (!flag) {
      obj.properties.name += ': None visits'
    }
  }
);

res.send(clonedMapData);
});

app.get('/getCountriesEntriesAmount', (req, res) => {
  res.send(keyValueToGraph(getCountriesEntriesAmount()));
});

function mapToTimeAndBytes(logData) {
  let dateTime = moment.unix(parseInt(logData.ts));
  
  return {
    key: dateTime.format('hh:mm:ss'),
    value: logData.orig_bytes
  };
}


//#endregion 

//#region Graphs Methods
function groupByValueFunc(data, groupByFunc) {
  var groupedByData = {};
  
  data.forEach(function (obj) {
    if (groupedByData[obj.key] === undefined) {
      groupedByData[obj.key] = 0;
    }
    
    groupByFunc(groupedByData, obj);
  });
  
  return groupedByData;
}

function sum(groupedByData, obj) {
  groupedByData[obj.key] += parseInt(obj.value);
}

function count(groupedByData, obj) {
  groupedByData[obj.key]++;
}

function getCountriesEntriesAmount() {
  let data = getConnData();
  let specificData = data.map(function (logData) {
    return {
      key: logData.resp_cc,
      value: 0,
    }
  });
  
  var groupedByData = {};
  
  specificData.forEach(function (obj) {
    obj.key = getCountryName(obj.key);
    if (groupedByData[obj.key] === undefined) {
      groupedByData[obj.key] = 0;
    }
    
    groupedByData[obj.key] += 1;
  });
  
  return groupedByData;
}

function keyValueToGraph(dictionary) {
  var array = [];
  for (var key in dictionary) {
    array.push({ name: key, data: dictionary[key] });
  }
  
  return array;
}

function getCountryName(countryCode) {
  if (isoCountries.hasOwnProperty(countryCode)) {
    return isoCountries[countryCode];
  } else {
    return countryCode;
  }
}

function keyValueToPieChart(dictionary) {
  var array = [];
  for (var key in dictionary) {
    array.push({ name: key, value: dictionary[key] });
  }
  
  return array;
}
//#endregion

// Naamani
function checkValidPortsToProtocolsSsl() {
  let sslData = getSslData();
  let badSslPorts = [];
  sslData.forEach(log => {
    if ((log['id.resp_p'] == 443) || (log['id.resp_p'] == 8443) || (log['id.resp_p'] == 5443)) {
      console.log("Legit Ssl trafic");
    }
    else {
      badSslPorts.push(log['id.resp_p']);
      console.log("Bad port for http trafic");
    }
  });
  return badSslPorts;
}

// Check if the user agent is malicious 
// Naamani
function CheckUserAgent() {
  let httpData = getHttpData();
  let maliciousUserAgents = [];
  let lowerCase;
  httpData.forEach(log => {
    if (log.user_agent === '-') {
      return;
    }
    lowerCase = log.user_agent.toLowerCase();
    for (var i = 0; i < userAgents.length; i++) {
      if (lowerCase.includes(userAgents[i])) {
        return;
      }
    }
    
    maliciousUserAgents.push(log.user_agent);
  });
  
  return maliciousUserAgents;
}

function uploadDomainToVT(domainAddress) {
  virustotal.setKey('db8bdbc2dcc403fa7ee090eb9305b1a0ffb5bdb95c4cec58323316672efb0d65');
  return virustotal.getDomainReport(domainAddress, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }
    
    vtReport = res;
  });
}
//#region GetDataFunctions
function getConnData() {
  var data = getJsonFromLogFile('./json/conn2.log');
  
  data.forEach(element => {
    element.dateTime = moment.unix(parseInt(element.ts)).format('DD:MM:YYYY hh:mm:ss');
  });
  
  return data;
}

function getHttpData() {
  return getJsonFromLogFile('./json/http.log');
}

function getJsonFromLogFile(path) {
  let data = fs.readFileSync(path, 'utf-8');
  let seperatedString = data.split('#fields')[1].split('#close')[0].substr(1);
  let parsed = Papa.parse(seperatedString.replace(/(\r)/gm, ""), connLogParseConfig);
  return parsed.data;
}

// Naamani
function getSslData() {
  return getJsonFromLogFile('./json/ssl.log');
}

//#endregion

// Check if there is "fake" http trafic.
// Consider to return something else then the port (maybe the ip or something else...)
// Naamani
function checkValidPortsToProtocolsHttp() {
  let httpData = getHttpData();
  let bedHttpPorts = [];
  httpData.forEach(log => {
    if ((log['id.resp_p'] == 80) || (log['id.resp_p'] == 8080)) {
      console.log("Legit http trafic");
    }
    else {
      bedHttpPorts.push(log['id.resp_p']);
      console.log("Bad port for http trafic");
    }
  });
  return bedHttpPorts;
}

app.get('*', async (req, res, next) => {
  try {
    let css = new Set();
    let statusCode = 200;
    const data = { title: '', description: '', style: '', script: assets.main.js, children: '' };

    await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
      context: {
        insertCss: (...styles) => {
          styles.forEach(style => css.add(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
        },
        setTitle: value => (data.title = value),
        setMeta: (key, value) => (data[key] = value),
      },
      render(component, status = 200) {
        // console.log('inside render of UniversalRouter', component);
        css = new Set();
        statusCode = status;
        data.children = ReactDOM.renderToString(component);
        data.style = [...css].join('');
        return true;
      },
    });

    // console.log('outside render func of UniversalRouter with statusCode', statusCode);
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);

    res.status(statusCode);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    // console.log('some error occured', err);
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const statusCode = err.status || 500;
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>
  );
  res.status(statusCode);
  res.send(`<!doctype html>${html}`);
});

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
