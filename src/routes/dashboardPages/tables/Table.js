import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Pagination from 'react-bootstrap/lib/Pagination';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Well from 'react-bootstrap/lib/Well';
import data from './conn.log.js'


const title = 'Table';
let connData;

function getConnDataFromServer() {
  return fetch('/getConn')
    .then(response => response.json())
    .then(data => {
      connData = data;
      connData.forEach(log => log.dateTime = moment.unix(parseInt(log.ts)))
    });
}

function displayTable(props, context) {
  context.setTitle(title);
  getConnDataFromServer();
  return (
    <BootstrapTable data={connData} pagination>
      <TableHeaderColumn dataField='uid' filter={{ type: 'TextFilter' }} isKey>ID</TableHeaderColumn>
      <TableHeaderColumn dataField='dateTime' dataFormat={dateFormatter} filter={{ type: 'DateFilter' }} isKey>ID</TableHeaderColumn>
      <TableHeaderColumn dataField='id.orig_h' filter={{ type: 'TextFilter' }} >OriginIP</TableHeaderColumn>
      <TableHeaderColumn dataField='id.orig_p' filter={{ type: 'TextFilter' }} >Origin Port</TableHeaderColumn>
      <TableHeaderColumn dataField='id.resp_h' filter={{ type: 'TextFilter' }} >Destination Ip</TableHeaderColumn>
      <TableHeaderColumn dataField='id.resp_h' filter={{ type: 'TextFilter' }} >Destination Port</TableHeaderColumn>
      <TableHeaderColumn dataField='proto' filter={{ type: 'TextFilter' }} >Protocol</TableHeaderColumn>
      <TableHeaderColumn dataField='service' filter={{ type: 'TextFilter' }} >Service</TableHeaderColumn>
    </BootstrapTable>
  );
}

displayTable.contextTypes = { setTitle: PropTypes.func.isRequired };

export default displayTable;

{/* <BootstrapTable data={connData} pagination>
      <TableHeaderColumn dataField='uid' filter={{ type: 'TextFilter' }} isKey>ID</TableHeaderColumn>
      <TableHeaderColumn dataField='id.orig_h' filter={{ type: 'TextFilter' }} >OriginIP</TableHeaderColumn>
      <TableHeaderColumn dataField='id.orig_p' filter={{ type: 'TextFilter' }} >Origin Port</TableHeaderColumn>
      <TableHeaderColumn dataField='id.resp_h' filter={{ type: 'TextFilter' }} >Destination Ip</TableHeaderColumn>
      <TableHeaderColumn dataField='id.resp_h' filter={{ type: 'TextFilter' }} >Destination Port</TableHeaderColumn>
      <TableHeaderColumn dataField='proto' filter={{ type: 'TextFilter' }} >Protocol</TableHeaderColumn>
      <TableHeaderColumn dataField='service' filter={{ type: 'TextFilter' }} >Service</TableHeaderColumn>
    </BootstrapTable> */}