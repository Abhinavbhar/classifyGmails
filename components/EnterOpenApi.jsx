'use client'
import React, { useState } from 'react';
function EnterOpenApi() {
  const [inputValue, setInputValue] = useState('');
  const [storedValue, setStoredValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSubmit = () => {
    localStorage.setItem('apiKey',inputValue)
    alert(`Stored Value: ${localStorage.getItem('apiKey')}`);
  };
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-green-600">Enter OpenAI API Key</h2>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        placeholder="Enter API key"
      />
      <button
        onClick={handleSubmit}
        className="w-32 px-4 py-2 bg-green-500 text-white text-lg font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Submit
      </button>
      {storedValue && <p>Stored Value: {storedValue}</p>}
    </div>
  );
}
export default EnterOpenApi;
