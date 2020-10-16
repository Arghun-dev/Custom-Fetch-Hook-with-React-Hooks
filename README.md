# Codes

useFetch.js

```js
import React, { useState, useEffect } from 'react'

export default function useFetch(url, defaultResponse, reloadData) {
  const [data, setData] = useState(defaultResponse)
  
  useEffect(() => {
    let controller = new AbortController()
  
    const loadData = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal })
        const data = await res.json()
        setData({
          isLoading: false,
          data
        })
      } catch (err) {
        console.log(err)
      }
    }
    
    loadData()
    
    return () => signal.abort()
  }, [reloadData])
  
  return data
}
```

api.js

```js
const api = 'https://jsonplaceholder.typicode.com/posts'

export default api
```

App.js

```js
import React, { useState } from 'react'
import useFetch  from './Hooks/useFetch'
import api from './api.js

export default function App() {
  const [reloadData, setReloadData] = useState(false)
  
  const ReloadData = () => {
    setReloadData(!reloadData)
  }
  
  const FetchJsonPlaceHolder = useFetch(api, { isLoading: true, data: null })
  
  if (FetchJsonPlaceHolder.isLoading || !FetchJsonPlaceHolder.data) {
    return <div>loading...</div>
  }
  
  return (
    <div>
      <button>reload</button>
      {FetchJsonPlaceHolder.data.map(item => <p>{item.title}</p>)}
    </div>
  )
}
```
