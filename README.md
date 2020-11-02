# Custom-Fetch-Hook-with-React-Hooks

**You can handle all of your requests and services of your application, with just `4` functions which I introduce them to you here, and I'll show you how to call and use them in your components**


### useFetch.js

```js
import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { LoginDetailsContext } from '../contexts/LoginDataContext'

export default function useFetch(url, defaultResponse, reload) {
    const { token } = useContext(LoginDetailsContext)
    const [data, setData] = useState(defaultResponse)
    const config = {
        headers: {
            Authorization: `bearer ${token}`
        }
    }

    useEffect(() => {
        const source = axios.CancelToken.source()
        const loadData = async () => {
            try {
                const { data } = await axios.get(url, config, { cancelToken: source.token })
                setData({
                    isLoading: false,
                    data
                })
            } catch (err) {
                console.log(err)
            }
        }

        loadData()
        return source.cancel()
    }, [url, reload])

    return data
}
```


### usePost.js

```js
import { useContext, useState, useCallback } from 'react'
import axios from 'axios'
import { LoginDetailsContext } from '../contexts/LoginDataContext'
import { HandleEventContextDispatch } from '../contexts/HandleEventContext'
import { SUCCESS, ERROR } from '../constants/ActionTypes'

export const usePost = ({ url, payload, Reload }) => {
    const { token } = useContext(LoginDetailsContext)
    const EventDispatch = useContext(HandleEventContextDispatch)
    const [res, setRes] = useState({ data: null, error: null, isLoading: false })
    const config = {
        headers: {
            Authorization: `bearer ${token}`
        }
    }
    // You POST method here
    const callAPI = useCallback(() => {
        setRes(prevState => ({ ...prevState, isLoading: true }))
        axios.post(url, payload, config)
            .then(res => {
                setRes({ data: res.data, isLoading: false, error: null })
                EventDispatch({ type: SUCCESS, message: res.data.message })
                Reload()
            }).catch((err) => {
                setRes({ data: null, isLoading: false })
                EventDispatch({ type: ERROR, message: err.response.data.errors[0].error })
            })
    }, [url, payload])
    return [res, callAPI];
}
```
