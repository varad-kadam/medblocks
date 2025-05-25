import React, { useState } from 'react';
import './SQLEditor.css';
import { useDatabase } from '../../hooks/useDatabase';

function SQLEditor() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { isReady, runQuery } = useDatabase();

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const handleRunQuery = async () => {
        if (!isReady) {
            setError('Database not ready yet');
            return;
        }

        if (!query.trim()) {
            setError('Please enter a query');
            return;
        }

        setIsLoading(true);
        setError('');
        setResults(null);

        try {
            const result = await runQuery(query);
            setResults(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setResults(null);
        setError('');
    };

    const renderResults = () => {
        if (!results) return null;

        if (results.rows.length === 0) {
            return <p>Query executed successfully. No rows returned.</p>;
        }

        return (
            <div>
                <p>Rows returned: {results.rowCount}</p>
                <table>
                    <thead>
                        <tr>
                            {results.fields.map((field, index) => (
                                <th key={index}>{field.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {results.fields.map((field, colIndex) => (
                                    <td key={colIndex}>
                                        {row[field.name] !== null ? String(row[field.name]) : 'NULL'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="sqlEditor">
            <div className="query-input-section">
                <label htmlFor="sqlQuery">SQL Query:</label>
                <textarea
                    id="sqlQuery"
                    placeholder="Enter your SQL query here... (e.g., SELECT * FROM patients)"
                    value={query}
                    onChange={handleQueryChange}
                    rows="6"
                />
                <div className="button-group">
                    <button type="button" onClick={handleRunQuery} disabled={isLoading || !isReady}>
                        {isLoading ? 'Running...' : 'Run Query'}
                    </button>
                    <button type="button" onClick={handleClear}>
                        Clear
                    </button>
                </div>
            </div>

            <div className="results-section">
                {error && (
                    <div className="error-display">
                        <h4>Error:</h4>
                        <p>{error}</p>
                    </div>
                )}

                {results && (
                    <div className="results-display">
                        <h4>Results:</h4>
                        <div className="results-content">
                            {renderResults()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SQLEditor;