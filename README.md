# MedBlocks

A simple, client-side patient registration system built with React and PGLite. Store and manage patient data entirely in the browser using a PostgreSQL database that runs locally.

## Features

- **Patient Registration Form**: Complete form for capturing patient demographics and contact information
- **Local Database Storage**: Uses PGLite to run PostgreSQL directly in the browser with IndexedDB persistence
- **SQL Editor**: Built-in SQL query interface for direct database interaction
- **Form Validation**: Client-side validation with error handling
- **Auto-save**: Form data persists in localStorage while filling
- **Responsive Design**: Clean, accessible interface

## Tech Stack

- **Frontend**: React 18 with Vite
- **Database**: PGLite (PostgreSQL in the browser)
- **Storage**: IndexedDB for database persistence, localStorage for form auto-save
- **Build Tool**: Vite with ES modules

## Try It Out

You can try MedBlocks without installing anything:

1. **Primary Demo**: [varadkadam.com/medblocks](https://varadkadam.com/medblocks)
   > ⚠️ **Note**: This demo is self-hosted on a Raspberry Pi. Uptime depends on internet connectivity and power conditions.

2. **Backup Demo**: [GitHub Pages](https://varad-kadam.github.io/medblocks/)
   > Use this if the primary demo is unavailable.

Both demos run entirely in your browser - all data stays on your device and nothing is sent to any server.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/varad-kadam/medblocks.git
cd medblocks
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Patient Registration

1. Fill out the patient registration form with required fields:
   - First Name (required)
   - Last Name
   - Date of Birth (required)
   - Gender (required)
   - Phone Number
   - Email
   - Address
   - Emergency Contact Information
   - Medical Record Number (required, 8 characters)
   - Registration Date (required)

2. Click **Submit** to save the patient to the local database
3. Use **Reset** to clear the form
4. Use **View Database** to see all stored patients in the browser console

### SQL Editor

1. Navigate to the SQL Editor section
2. Enter SQL queries to interact with the database
3. Example queries:
   ```sql
   -- View all patients
   SELECT * FROM patients;
   
   -- Search by name
   SELECT * FROM patients WHERE first_name ILIKE '%john%';
   
   -- Count patients by gender
   SELECT gender, COUNT(*) FROM patients GROUP BY gender;
   ```
4. Click **Run Query** to execute
5. Results are displayed in a table format

## Database Schema

The application creates a `patients` table with the following structure:

```sql
CREATE TABLE patients (
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
);
```

## Project Structure

```
medblocks/
├── src/
│   ├── components/
│   │   ├── InputForm/
│   │   │   ├── InputForm.jsx
│   │   │   └── InputForm.css
│   │   └── SQLEditor/
│   │       ├── SQLEditor.jsx
│   │       └── SQLEditor.css
│   ├── hooks/
│   │   └── useDatabase.js
│   ├── workers/
│   │   └── pglite-worker.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── vite.config.js
├── package.json
└── README.md
```

## Key Components

- **InputForm**: Patient registration form with validation and auto-save
- **SQLEditor**: Interactive SQL query interface
- **useDatabase**: Custom hook managing PGLite database operations
- **pglite-worker**: Web worker for running PostgreSQL in the background

## Data Persistence

- **Database**: Patient records are stored in IndexedDB via PGLite
- **Form Auto-save**: Form data is temporarily saved to localStorage while editing
- **Offline First**: Everything runs locally in the browser - no server required

## Browser Compatibility

- Modern browsers with IndexedDB and Web Worker support
- Chrome, Firefox, Safari, Edge (recent versions)

## Development & Deployment

This project uses a streamlined CI/CD workflow:

### Branch Structure
- **`main`**: Production branch - stable, tested code
- **`dev`**: Development branch - active development and feature integration

### Automated Deployment
- **GitHub Actions**: Automatically builds and deploys the application when commits are pushed to the `main` branch
- **GitHub Pages**: Deployment target for the backup demo
- **Self-hosted**: Primary demo is deployed to a personal Raspberry Pi server

### Development Workflow
1. Create feature branches from `dev`
2. Submit pull requests to merge into `dev`
3. Merge `dev` into `main` for production releases
4. GitHub Actions handles the rest automatically

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [PGLite](https://github.com/electric-sql/pglite) for client-side PostgreSQL
- Uses [Vite](https://vitejs.dev/) for fast development and building
- Created with [React](https://reactjs.org/) for the user interface