import { useState, useEffect } from 'react'
import './App.css'
import InputForm from './components/InputForm/InputForm'
import SQLEditor from './components/SQLEditor/SQLEditor'

function App() {

  return (
    <div className="App">
      <h1>Patient Registration Form</h1>
      <div >
        <InputForm />
      </div>

      <br />
      <br />
      <hr />
      <br />

      <h1>SQL Editor</h1>
      <div>
        <SQLEditor />
      </div>

    </div>
  )
}

export default App
