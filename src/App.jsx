import { useState, useEffect } from 'react'
import './App.css'

const STORAGE_KEY = 'patientFormData'
const defaultValues = {
  firstName: '',
  lastName: '',
  dob: '',
  sex: '',
  phone: '',
  email: '',
  address: "",
  emerConName: '',
  emerConPhone: '',
  emerConEmail: '',
  mrn: '',
  registerDate: ''
}

function App() {
  
  // Initialize from localStorage if available
  const [values, setValues] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultValues
  })

  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
  }, [values])
  
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValues(prev => ({
      ...prev,
      [name]: type === 'radio' ? (checked ? value : prev[name]) : value
    }))
  }

  // Reset form to default values
  const handleReset = () => {
    setValues(defaultValues)
    // localStorage.removeItem(STORAGE_KEY)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted:', values)
  }

  return (
    <div className="App">
      <h1>Patient Registration Form</h1>
      
      <div className="inputForm">
        <form>
          <label htmlFor="firstName"> First Name: </label>
          <input type="text" placeholder="Patient's First Name" name='firstName' 
            value={values.firstName} 
            onChange={handleChange}
          />

          <label htmlFor="lastName"> Last Name: </label>
          <input type="text" placeholder="Patient's Last Name" name='lastName'
            value={values.lastName}
            onChange={handleChange}
          />

          <label htmlFor="dob"> Date of Birth: </label>
          <input type="date" name='dob'
            value={values.dob}
            onChange={handleChange}
          />

          <label>Sex:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="sex"
                value="Male"
                checked={values.sex === 'Male'}
                onChange={handleChange}
              /> Male
            </label>
            <label>
              <input
                type="radio"
                name="sex"
                value="Female"
                checked={values.sex === 'Female'}
                onChange={handleChange}
              /> Female
            </label>
            <label>
              <input
                type="radio"
                name="sex"
                value="Other"
                checked={values.sex === 'Other'}
                onChange={handleChange}
              /> Other
            </label>
          </div>

          <label htmlFor="phone"> Phone (+91) : </label>
          <input type="text" placeholder="Patient's Phone Number" name='phone'
            value={values.phone}
            onChange={handleChange}
          />

          <label htmlFor="email"> Email: </label>
          <input type="email" placeholder="Patient's Email" name='email'
            value={values.email}
            onChange={handleChange}
          />

          <label htmlFor="address"> Address: </label>
          <input type="text" placeholder="Patient's Address" name='address'
            value={values.address}
            onChange={handleChange}
          />

          <label htmlFor="emerConName"> Emergency Contact Name: </label>
          <input type="text" placeholder="Emergency Contact's Name" name='emerConName'
            value={values.emerConName}
            onChange={handleChange}
          />

          <label htmlFor="emerConPhone"> Emergency Contact Phone: </label>
          <input type="text" placeholder="Emergency Contact's Phone" name='emerConPhone'
            value={values.emerConPhone}
            onChange={handleChange}
          />

          <label htmlFor="emerConEmail"> Emergency Contact Email: </label>
          <input type="text" placeholder="Emergency Contact's Email" name='emerConEmail'
            value={values.emerConEmail}
            onChange={handleChange}
          />

          <label htmlFor="mrn"> Medical Record Number: </label>
          <input type="text" placeholder="Patient's MRN" name='mrn'
            value={values.mrn}
            onChange={handleChange}
          />

          <label htmlFor="registerDate"> Registration Date: </label>
          <input type="date" placeholder="Patient's Registration Date" name='registerDate'
            value={values.registerDate}
            onChange={handleChange}
          />

          <button type='button' onClick={handleReset}>Reset</button>
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default App
