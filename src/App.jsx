import { useState, useEffect } from 'react'
import './App.css'
import InputForm from './components/InputForm/InputForm'

function App() {

  return (
    <div className="App">
      <h1>Patient Registration Form</h1>
      
      <div >
        <InputForm />
      </div>
      
    </div>
  )
}

export default App
