import { useState, useEffect } from 'react';
import { PGliteWorker } from '@electric-sql/pglite/worker';

let dbInstance = null;
let isDbReady = false;

export const useDatabase = () => {
  const [isReady, setIsReady] = useState(isDbReady);

  useEffect(() => {
    const initDatabase = async () => {
      if (dbInstance) {
        setIsReady(true);
        return;
      }

      try {
        const workerThread = new Worker(new URL('../workers/pglite-worker.js', import.meta.url), {
          type: 'module',
        });

        dbInstance = new PGliteWorker(workerThread);

        // Wait for readiness (optional — some ops may fail if run too early)
        await dbInstance.query('SELECT 1');

        isDbReady = true;
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize database worker:', error);
      }
    };

    initDatabase();
  }, []);

  const savePatient = async (patientData) => {
    if (!isDbReady) throw new Error('Database not ready');

    try {
      const result = await dbInstance.query(
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
    if (!isDbReady) throw new Error('Database not ready');

    try {
      const result = await dbInstance.query('SELECT * FROM patients ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      throw error;
    }
  };

  const runQuery = async (query) => {
    if (!isDbReady) throw new Error('Database not ready');

    try {
      const result = await dbInstance.query(query);
      return {
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields
      };
    } catch (error) {
      console.error('Failed to run query:', error);
      throw error;
    }
  };

  return {
    isReady,
    savePatient,
    getAllPatients,
    runQuery
  };
};
