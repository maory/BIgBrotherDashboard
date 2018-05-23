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
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import { port, auth, connLogParseConfig } from './config';

const app = express();
const fs = require('fs');

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

function getConnData() {
  let data = fs.readFileSync('./json/conn.log', 'utf-8');
  let seperatedString = data.split('#fields')[1].split('#close')[0].substr(1);
  let parsed = Papa.parse(seperatedString, connLogParseConfig);
  return parsed.data;
}

app.get('/getConn', (req, res) => {
  res.send(getConnData());
});


app.get('/getLineChartData', (req, res) => {
  let data = getConnData();
  let groupedByData = groupByValueFunc(data.map(mapToTimeAndBytes), sum);

  res.send(keyValueToGraph(groupedByData));
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

function mapToTimeAndBytes(logData) {
  let dateTime = moment.unix(parseInt(logData.ts));

  return {
    key: dateTime.format('hh:mm:ss'),
    value: logData.orig_bytes
  };
}

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

// gil
app.get('/getServiceTypeData', (req, res) => {
  let data = getConnData();
  let specificData = data.map(function (logData) {
    return {
      key:logData.service,
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
      key:logData.proto,
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
      key:'Originator payload',
      value: logData.orig_bytes,
    },{
      key:'Responder payload',
      value: logData.resp_bytes
    },{
      key:'Missing',
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
      groupedByData[obj.key] +=  parseInt(obj.value);
    });
   });

  res.send(keyValueToGraph(groupedByData));
});






function keyValueToGraph(dictionary) {
  var array = [];
  for (var key in dictionary) {
    array.push({ name: key, data: dictionary[key] });
  }

  return array;
}

function keyValueToPieChart(dictionary) {
  var array = [];
  for (var key in dictionary) {
    array.push({ name: key, value: dictionary[key] });
  }

  return array;
}

// app.use(passport.initialize());
//
// app.get('/login/facebook',
//   passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
// );
// app.get('/login/facebook/return',
//   passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
//   (req, res) => {
//     const expiresIn = 60 * 60 * 24 * 180; // 180 days
//     const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
//     res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
//     res.redirect('/');
//   }
// );

//
// Register API middleware
// -----------------------------------------------------------------------------
// app.use('/graphql', expressGraphQL(req => ({
//   schema,
//   graphiql: true,
//   rootValue: { request: req },
//   pretty: process.env.NODE_ENV !== 'production',
// })));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
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

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
// models.sync().catch(err => console.error(err.stack)).then(() => {
//   app.listen(port, () => {
//     console.log(`The server is running at http://localhost:${port}/`);
//   });
// });
/* eslint-enable no-console */
