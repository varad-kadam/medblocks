import { worker } from '@electric-sql/pglite/worker'
import { PGlite } from '@electric-sql/pglite'

worker({
  async init() {
    const db = new PGlite({ dataDir: 'idb://patient-db' });

    await db.exec(`
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

    return db;
  },
});
