/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { thArray } from "variables/Variables.jsx";
import UpdateForm from '../components/UpdateForm/UpdateForm';

import { Button } from 'react-bootstrap';
import LoadSpinner from '../components/LoadSpinner/LoadSpinner'

class TableList extends Component {
  constructor() {
    super();
    this.state = {
      candidates: [],
      updateDetails: {},
      modal: false
    }
  }

  // When user updates the candidates data fetching new updated data
  settingBackCandidates = () => {
    this.setState({candidates: []}) // clearing old data
    fetch('http://18.188.185.178:3002/get/candidate')
      .then(resp => resp.json())
      .then(data => {
        if(data.data) {
          this.setState({candidates: data.data}) // setting new data
        }   
    })
    .catch(err => console.log)
  }

  // toggling between updateForm component
  toggle = () => {
    this.setState({modal: !this.state.modal})
  };
  
  componentDidMount() {
    fetch('http://18.188.185.178:3002/get/candidate') 
      .then(resp => resp.json())
      .then(data => {
        this.setState({candidates: data.data}) // storing all candidates
      })
      .catch(err => console.log)
  }

  // Storing the object of individual candidate data while they click update
  LoadCandidateData = (details) => { 
    this.setState({updateDetails: {
      id: details._id,
      firstName: details.firstName,
      email: details.email,
      verified: details.verified
    }})
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.toggle()
  }

  // displaying Candidates information to the screen
  showCandidatesData = () => { 
    return this.state.candidates.map((cur, i )=> {
        return ( 
          <tr>
              <td>{cur._id}</td>
              <td>{cur.firstName}</td>
              <td>{cur.email}</td>
              <td>{cur.dob.substring(0,10)}</td>
              <td>{cur.verified ? 'Yes': 'No'}</td>
              {
                // if user clicks the update btn. Hides rest of the update btn
                !this.state.modal ? <td><Button onClick={() => this.LoadCandidateData(cur)} >update</Button></td>: null
              }   
          </tr>
       
        )        
    })
}

  render() {
    const { modal, candidates, updateDetails } = this.state;
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Striped Table with Hover"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                          {this.showCandidatesData()}
                    </tbody>
                  </Table>
                }
              />
              { candidates.length === 0 ? <LoadSpinner />:
                modal ?
                <UpdateForm
                  toggle={this.toggle} 
                  candidates={updateDetails} 
                  LoadCandidateData={this.LoadCandidateData} 
                  settingBackCandidates={this.settingBackCandidates}/>
                : null
              }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default TableList;
