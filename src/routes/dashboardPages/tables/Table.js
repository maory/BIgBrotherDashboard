
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Pagination from 'react-bootstrap/lib/Pagination';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Well from 'react-bootstrap/lib/Well';
import data from './conn.log.js'


const title = 'Table';

const columns = ["Origin IP", "Origin Port", "Destination IP", "Destination port", ];
const options = {
  filterType: 'checkbox',
};

const config = {
  style: 'pure',
  cols: [
      { property: "idOrig_h" , header: "Origin IP"  },
      { property: "idOrig_p" , header: "Origin Port"  },
      { property: "idResp_h" , header: "Destination IP"  },
      { property: "idResp_p" , header: "Destination Port"  },
      { property: "proto" , header: "Protocol"  },
      { property: "service" , header: "service"  },
      
  ]
}
function displayTable(props, context) {

  var items = data.map(function(item){return (<tr> 
    <td>{item.idOrig_h}</td>
    <td>{item.idOrig_p}</td>
    <td>{item.idResp_h}</td>
    <td>{item.idResp_p}</td>
    <td>{item.proto}</td>
    <td>{item.service}</td>
  </tr>)})

  context.setTitle(title);

  
  return (
    <div>
      <div className="col-lg-12">
        <PageHeader>Tables</PageHeader>
      </div>

      <div className="col-lg-12">
        <Panel header={<span>DataTables Advanced Tables</span>} >
          <div>
            <div className="dataTable_wrapper">
              <div
                id="dataTables-example_wrapper"
                className="dataTables_wrapper form-inline dt-bootstrap no-footer"
              >

                <div className="row">
                  <div className="col-sm-9">
                    <div className="dataTables_length" id="dataTables-example_length">
                      <label htmlFor={'show'}> Show
                        <select
                          name="dataTables-example_length"
                          aria-controls="dataTables-example"
                          className="form-control input-sm"
                          id="show"
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        entries
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div id="dataTables-example_filter" className="dataTables_filter">
                      <label htmlFor={'search'}>Search:
                        <input
                          type="search"
                          className="form-control input-sm"
                          placeholder=""
                          aria-controls="dataTables-example"
                          id="search"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <table
                      className="table table-striped table-bordered table-hover dataTable no-footer"
                      id="dataTables-example"
                      role="grid"
                      aria-describedby="dataTables-example_info"
                    >
                      <thead>
                        <tr role="row">
                          <th
                            className="sorting_asc"
                            tabIndex="0"
                            aria-controls="dataTables-example"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Rendering engine: activate to sort column descending"
                            aria-sort="ascending"
                            style={{ width: 265 }}
                          >
                          Origin Ip
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="dataTables-example"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                            style={{ width: 321 }}
                          >
                          Origin Port
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="dataTables-example"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Platform(s): activate to sort column ascending"
                            style={{ width: 299 }}
                          >
                          Destination IP
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="dataTables-example"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Engine version: activate to sort column ascending"
                            style={{ width: 231 }}
                          >
                          Destination Port
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="dataTables-example"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="CSS grade: activate to sort column ascending"
                            style={{ width: 180 }}
                          >Protocol
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="dataTables-example"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="CSS grade: activate to sort column ascending"
                            style={{ width: 180 }}
                          >Service
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div
                      className="dataTables_info"
                      id="dataTables-example_info"
                      role="status"
                      aria-live="polite"
                    >
                      Showing 1 to 10 of 57 entries
                    </div>
                  </div>
                  <div className="col-sm-6 pullRight " >
                    <Pagination
                      activePage={1}
                      items={6}
                      first
                      last
                      prev
                      next
                      onSelect={() => {
                        // function for Pagination
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Well>
              <h4>DataTables Usage Information</h4>
              <p>DataTables is a very flexible, advanced tables plugin for jQuery.
                In SB Admin, we are using a specialized version of DataTables built for Bootstrap 3.
                We have also customized the table headings to use Font Awesome icons in
                place of images. For complete documentation on DataTables, visit their website
                at <a target="_blank" rel="noopener noreferrer" href="https://datatables.net/">'https://datatables.net/'</a>.
              </p>
              <Button bsSize="large" block href="https://datatables.net/">View DataTables Documentation</Button>
            </Well>

          </div>
        </Panel>
      </div>

      <div className="row ng-scope">
        <div className="col-lg-6">
          <Panel header={<span>Kitchen Sink </span>} >
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th># </th>
                    <th>First Name </th>
                    <th>Last Name </th>
                    <th>Username </th>
                    <th>Username </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1 </td>
                    <td>Mark </td>
                    <td>Otto </td>
                    <td>@mdo </td>
                  </tr>
                  <tr>
                    <td>2 </td>
                    <td>Jacob </td>
                    <td>Thornton </td>
                    <td>@fat </td>
                  </tr>
                  <tr>
                    <td>3 </td>
                    <td>Larry </td>
                    <td>the Bird </td>
                    <td>@twitter </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="col-lg-6">
          <Panel header={<span>Basic Table</span>} >
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th># </th><th>First Name </th><th>Last Name </th><th>Username </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1 </td><td>Mark </td><td>Otto </td><td>@mdo </td>
                  </tr>
                  <tr>
                    <td>2 </td><td>Jacob </td><td>Thornton </td><td>@fat</td>
                  </tr>
                  <tr>
                    <td>3 </td><td>Larry </td><td>the Bird </td><td>@twitter</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>

      <div className="row ng-scope">
        <div className="col-lg-6">
          <Panel header={<span>Striped Rows </span>} >
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th># </th>
                    <th>First Name </th>
                    <th>Last Name </th>
                    <th>Username </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1 </td>
                    <td>Mark </td>
                    <td>Otto </td>
                    <td>@mdo </td>
                  </tr>
                  <tr>
                    <td>2 </td>
                    <td>Jacob </td>
                    <td>Thornton </td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>3 </td>
                    <td>Larry </td>
                    <td>the Bird </td>
                    <td>@twitter </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
        <div className="col-lg-6">
          <Panel header={<span>Bordered Table </span>} >
            <div className="table-responsive table-bordered">
              <table className="table">
                <thead>
                  <tr>
                    <th># </th>
                    <th>First Name </th>
                    <th>Last Name </th>
                    <th>Username </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1 </td>
                    <td>Mark </td>
                    <td>Otto </td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>2 </td>
                    <td>Jacob </td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>3 </td>
                    <td>Larry </td>
                    <td>the Bird </td>
                    <td>@twitter </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>

      <div className="row ng-scope">
        <div className="col-lg-6">
          <Panel header={<span>Hover Rows </span>} >
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr><th># </th><th>First Name </th><th>Last Name </th><th>Username</th></tr>
                </thead>
                <tbody>
                  <tr><td>1 </td><td>Mark </td><td>Otto </td><td>@mdo</td></tr>
                  <tr><td>2 </td><td>Jacob </td><td>Thornton </td><td>@fat</td></tr>
                  <tr><td>3 </td><td>Larry </td><td>the Bird </td><td>@twitter </td></tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
        <div className="col-lg-6">
          <Panel header={<span>Context Classes </span>} >
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th># </th><th>First Name </th><th>Last Name </th><th>Username </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="success">
                    <td>1 </td><td>Mark </td><td>Otto </td><td>@mdo</td>
                  </tr>
                  <tr className="info">
                    <td>2 </td><td>Jacob </td><td>Thornton </td><td>@fat</td>
                  </tr>
                  <tr className="warning">
                    <td>3 </td><td>Larry </td><td>the Bird </td><td>@twitter</td>
                  </tr>
                  <tr className="danger">
                    <td>4 </td><td>John </td><td>Smith </td><td>@jsmith </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>

    </div>

  );
}


displayTable.contextTypes = { setTitle: PropTypes.func.isRequired };

export default displayTable;
