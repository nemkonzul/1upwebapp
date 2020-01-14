import React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-fetch';
import { authenticate } from '../utils';
import Header from '../components/Header.js';
import Layout from '../components/layouts/Layout';
import { FhirResource } from 'fhir-react';

export default class Dashboard extends React.Component {
  static async getInitialProps({ req, res }) {
    const user = await authenticate(req, res);
    if (typeof req === 'undefined') {
      let dashboard = await fetch(`http://localhost:3000/api/dashboard`, {
        credentials: 'include',
      }).then(r => r.json());
      return { dashboard, user };
    } else {
      let authHeader = {
        Authorization: 'Bearer ' + req.session.oneup_access_token,
      };
      let dashboard = await fetch(`http://localhost:3000/api/dashboard`, {
        headers: authHeader,
      }).then(r => r.json());
      return { dashboard, user };
    }
  }

  componentDidMount() {
    if (this.props.user) {
      try {
        window.localStorage.setItem('email', this.props.user.email);
        window.localStorage.setItem(
          'oneup_access_token',
          this.props.user.oneup_access_token,
        );
      } catch (err) {}
    } else {
      window.localStorage.remove('email');
      window.localStorage.remove('oneup_access_token');
    }
  }

  components = [
    'Condition',
    'Coverage',
    'Encounter',
    'ExplanationOfBenefit',
    'MedicationDispense',
    'MedicationRequest',
    'Organization',
    'Patient',
    'Practitioner',
    'Procedure',
    'ReferralRequest',
    'AllergyIntolerance',
    'CarePlan',
    'CareTeam',
    'Device',
    'DiagnosticReport',
    'DocumentReference',
    'Goal',
    'Immunization',
    'MedicationAdministration',
    'MedicationStatement',
    'Observation',
  ];

  renderSummary = data => {
    return this.components.map(item => {
      const item2 = data[item] || { total: 0 };
      return `${item}: ${item2.total}` + '\n';
    });
  };

  render() {
    console.log(JSON.stringify(this.props.dashboard.resources, null, 2));
    return (
      <Layout>
        <Header user={this.props.user} />
        <pre>{this.renderSummary(this.props.dashboard.resources)}</pre>
        <div className="container">
          <br />
          <h1>Your medical dashboard </h1>
          <br />
          <div>
            {typeof this.props.dashboard.resources.Patient !== 'undefined' &&
            this.props.dashboard.resources.Patient.entry.length > 0 ? (
              ''
            ) : (
              <div>
                <br />
                <br />
                <br />
                Looks like you have no patient data
                <br />
                <Link>
                  <a href="/">Connect some health systems</a>
                </Link>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'left' }}>
            {// [
            //   'Patient',
            //   'Practitioner',
            //   'AllergyIntolerance',
            //   'MedicationOrder',
            //   'MedicationStatement',
            //   'Condition',
            //   'Observation',
            //   'FamilyMemberHistory',
            //   'DiagnosticReport',
            //   'Immunization',
            //   'Encounter',
            //   'CarePlan',
            //   'Goal',
            //   'Procedure',
            //   'Device',
            //   'DocumentReference',
            //   'Binary',
            //   'Explanationofbenefit',
            //   'MedicationDispense',
            // ]
            this.components.map(resourceType => {
              return (
                <div>
                  {typeof this.props.dashboard.resources[resourceType] !=
                    'undefined' &&
                  this.props.dashboard.resources[resourceType].entry.length >
                    0 ? (
                    <h1>{resourceType}</h1>
                  ) : (
                    ''
                  )}
                  {typeof this.props.dashboard.resources[resourceType] !=
                  'undefined'
                    ? this.props.dashboard.resources[resourceType].entry.map(
                        (resourceContainer, idx) => {
                          return (
                            <div style={{ marginBottom: '1rem' }} key={idx}>
                              <FhirResource
                                fhirVersion="stu3"
                                fhirResource={resourceContainer.resource}
                              />
                            </div>
                          );
                        },
                      )
                    : ''}
                  <br />
                </div>
              );
            })}
          </div>
        </div>
      </Layout>
    );
  }
}
