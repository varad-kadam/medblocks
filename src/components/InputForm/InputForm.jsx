import React from "react";
import { useState, useEffect } from 'react'
import './InputForm.css'
import { useDatabase } from '../../hooks/useDatabase';

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

function InputForm() {

    const [formErrors, setformErrors] = useState({})
    const [isSubmit, setisSubmit] = useState(false)

    const { isReady, savePatient, getAllPatients } = useDatabase();


    // Initialize from localStorage if available
    const [values, setValues] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : defaultValues
    })

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    }, [values])

    // Update localStorage when values change
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
        localStorage.removeItem(STORAGE_KEY)

        setformErrors({})
        setisSubmit(false)
    }

    // Form submit actions
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Submitted:', values)

        setformErrors(validateForm(values))
        setisSubmit(true)
    }

    // Form validation actions
    const validateForm = (values) => {
        const errors = {}
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const today = new Date()
        const dob = new Date(values.dob)

        if (values.email && !emailRegex.test(values.email)) {
            errors.email = "This is not a valid email."
        }

        if (values.mrn.length != 8) {
            errors.mrn = "MRN must be 8 charaters long."
        }

        if (values.dob) {
            if (dob > today) {
                errors.dob = "Date of Birth cannot be in the future."
            }
            else {
                const yearsAgo = today.getFullYear() - dob.getFullYear()
                if (yearsAgo > 150) {
                    errors.dob = "Date of Birth cannot be greater than 150 years"
                }
            }

        }

        // Similarly for Register Date, Phone, etc.
        return errors
    }

    useEffect(() => {
        console.log(formErrors)
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(values)
            saveToDatabase()
        }
    }, [formErrors, isReady, values, isSubmit])

    const saveToDatabase = async () => {
        if (!isReady) {
            alert('Database not ready yet');
            return;
        }

        try {
            const dbData = {
                firstName: values.firstName,
                lastName: values.lastName,
                dateOfBirth: values.dob,
                gender: values.sex,
                phone: values.phone,
                email: values.email,
                address: values.address,
                emergencyContactName: values.emerConName,
                emergencyContactPhone: values.emerConPhone,
                medicalRecordNumber: values.mrn
            };

            await savePatient(dbData);
            alert('Patient saved successfully!');
            handleReset(); // Reset form after successful save
        } catch (error) {
            alert('Error saving patient: ' + error.message);
        }
    };

    const viewDatabase = async () => {
        try {
            const patients = await getAllPatients();
            console.table(patients); 
            alert(`Found ${patients.length} patients. Check browser console for details.`);
        } catch (error) {
            alert('Error fetching patients: ' + error.message);
        }
    };

    return (
        <div className="inputForm">
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName"> First Name *: </label>
                <input type="text" placeholder="Patient's First Name" name='firstName' required
                    value={values.firstName}
                    onChange={handleChange}
                />

                <label htmlFor="lastName"> Last Name: </label>
                <input type="text" placeholder="Patient's Last Name" name='lastName'
                    value={values.lastName}
                    onChange={handleChange}
                />

                <label htmlFor="dob"> Date of Birth *: </label>
                <input type="date" name='dob' required
                    value={values.dob}
                    onChange={handleChange}
                />
                <p style={{ marginTop: '0', marginBottom: '1rem', color: 'red', fontSize: '0.875rem' }}>
                    {formErrors.dob}
                </p>

                <label>Sex *:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="sex"
                            value="Male"
                            required
                            checked={values.sex === 'Male'}
                            onChange={handleChange}
                        /> Male
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="sex"
                            value="Female"
                            required
                            checked={values.sex === 'Female'}
                            onChange={handleChange}
                        /> Female
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="sex"
                            value="Other"
                            required
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
                <p style={{ marginTop: '0', marginBottom: '1rem', color: 'red', fontSize: '0.875rem' }}>
                    {formErrors.email}
                </p>

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

                <label htmlFor="mrn"> Medical Record Number *: </label>
                <input type="text" placeholder="Patient's MRN" name='mrn' required
                    value={values.mrn}
                    onChange={handleChange}
                />
                <p style={{ marginTop: '0', marginBottom: '1rem', color: 'red', fontSize: '0.875rem' }}>
                    {formErrors.mrn}
                </p>


                <label htmlFor="registerDate"> Registration Date *: </label>
                <input type="date" placeholder="Patient's Registration Date" name='registerDate' required
                    value={values.registerDate}
                    onChange={handleChange}
                />

                <p>
                    * Indicates a required value.
                </p>

                <button type='button' onClick={handleReset}>Reset</button>
                <button type='submit'>Submit</button>
                <button type='button' onClick={viewDatabase}>View Database</button>
            </form>
        </div>
    )
}

export default InputForm