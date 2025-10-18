import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Test connection
    const testConnection = async () => {
      const { data, error } = await supabase.from('test').select('*');
      
      if (error) {
        console.log('Supabase connected! (table not found is expected)');
        setConnected(true);
      } else {
        setConnected(true);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="App">
      <h1>JobPost App</h1>
      <p>Status: {connected ? '✅ Connected to Supabase' : '⏳ Connecting...'}</p>
    </div>
  );
}

export default App;