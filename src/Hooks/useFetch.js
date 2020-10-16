import React, { useEffect, useState } from 'react'

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
                    data: data
                })
            } catch (err) {
                console.log(err)
            }
        }

        loadData()

        return () => {
            controller.abort()
        }
    }, [reloadData])

    return data
}