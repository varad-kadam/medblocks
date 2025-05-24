import { useState, useEffect } from 'react';
import { PGlite } from '@electric-sql/pglite';

export const useDatabase = () => {
  const [db, setDb] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = new PGlite();
        
        // Create patients table
        await database.exec(`
          CREATE TABLE IF NOT EXISTS patients (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            date_of_birth DATE NOT NULL,
            gender VARCHAR(10) NOT NULL,
            phone VARCHAR(12) NOT NULL,
            email VARCHAR(100) NOT NULL,
            address TEXT,
            emergency_contact_name VARCHAR(100),
            emergency_contact_phone VARCHAR(15),
            medical_record_number VARCHAR(20) UNIQUE NOT NULL,
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        setDb(database);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDatabase();
  }, []);

  const savePatient = async (patientData) => {
    if (!db || !isReady) {
      throw new Error('Database not ready');
    }

    try {
      const result = await db.query(
        `INSERT INTO patients (
          first_name, last_name, date_of_birth, gender, phone, email, 
          address, emergency_contact_name, emergency_contact_phone, medical_record_number
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          patientData.firstName,
          patientData.lastName,
          patientData.dateOfBirth,
          patientData.gender,
          patientData.phone,
          patientData.email,
          patientData.address,
          patientData.emergencyContactName,
          patientData.emergencyContactPhone,
          patientData.medicalRecordNumber
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Failed to save patient:', error);
      throw error;
    }
  };

  const getAllPatients = async () => {
    if (!db || !isReady) {
      throw new Error('Database not ready');
    }

    try {
      const result = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      throw error;
    }
  };

  return {
    isReady,
    savePatient,
    getAllPatients
  };
};