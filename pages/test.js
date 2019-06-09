import React from 'react'
import Link from 'next/link'
import Layout from "../components/layouts/Layout"
import Header from '../components/Header.js'
import {FhirResource, Patient, Resources} from 'fhir-react'
import dstu2Encounter from '../tests/fixtures/dstu2/Encounter.json'
import dstu2Patient from '../tests/fixtures/dstu2/Patient.json'
//          <Resources.TestComponent data={["....haha"]}/>

export default class Home extends React.Component {
  render () {
    return (
      <Layout>
        <Header user={this.props.user} />
        <div className='container'>
          <h1 className="text-center">Patient</h1>
          <FhirResource fhirResource={dstu2Patient.entry[0].resource} thorough={false}/>

          <h1 className="text-center">Encounter</h1>
          {dstu2Encounter.entry.map(function(eachEncounter){
            return <Resources.Encounter fhirResource={eachEncounter.resource} thorough={false}/>
          })}

        </div>
      </Layout>
    )
  }
}
