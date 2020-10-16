import React, { useState } from 'react';
import api from './config/apis'
import './App.css';
import useFetch from './Hooks/useFetch'

function App() {
  const [reloadData, setReloadData] = useState(false)

  const ReloadData = () => {
    setReloadData(!reloadData)
  }

  const fetchJsonPlaceHolderData = useFetch(api, { isLoading: true, data: null }, reloadData)

  if (fetchJsonPlaceHolderData.isLoading || !fetchJsonPlaceHolderData.data) {
    return <div>loading...</div>
  }
  
  return (
    <div>
      <button onClick={ReloadData}>Reload</button>
      {fetchJsonPlaceHolderData.data.map(item => <p>{item.title}</p>)}
    </div>
  )
}

export default App;
