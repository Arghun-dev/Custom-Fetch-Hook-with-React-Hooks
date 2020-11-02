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

**`delete` and `put` methods are exactly like `post`**

### Using Them inside component


**useFetch.js**

```js
    // get branches
    const branches = useFetch(`${API.USER_ACCESS_OBJECT_LISTS}?UserId=${userId}&ObjectTypeId=4&ObjectAccessType=0`, { isLoading: true, data: null }, reload)
```




To access `branches` inside your component you have to use `optional chaining` `(?.)` because actually you call `web service` outside of it's function. just like below:

```js
{branches?.data?.data?.lists.map(item =>
    <Select.Option value={item.ID}>{item.Title}</Select.Option>
)}
```




**usePost.js**

```js
    // createRoute
    const [res, createRoute] = usePost({ url: API.ROUTE_CREATE, payload: createRoutePayload, Reload })
```

You can access `response` of your action call using `res` which extracted from `usePost` function

and you have to call `createRoute` function extracted from `usePost` just like below:

```js
<button onClick={() => createRoute()}>call function</button>
```
