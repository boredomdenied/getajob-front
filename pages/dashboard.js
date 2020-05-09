import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import dynamic from 'next/dynamic'
import Button from '../components/Button'
import { useRouter } from 'next/router'

const MonacoEditor = dynamic(import('react-monaco-editor'), { ssr: false })

const getJson = (url) =>
  fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  }).then((res) => res.json())

export default () => {
  const router = useRouter()
  const [postBody, setPostBody] = useState()

  const api_host =
    process.env.NODE_ENV === 'production'
      ? 'https://api.byreference.engineer'
      : 'http://localhost:5001'

  const submitCode = () =>
    getJson(`${api_host}/api/container/run`).then((json) => {
      console.log(json)
    })

  const logoutUser = () => {
    fetch(`${api_host}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        console.log(res.json())
        mutate(`${api_host}/api/user/dashboard`, null)
      })
      .then(router.push('/'))
  }

  const { data, error } = useSWR(`${api_host}/api/user/dashboard`, getJson)

  if (error) {
    console.error(error)
    return (
      <div className="flex p-24 items-center justify-center">
        It looks like something went wrong on our end. Please try again in a
        moment...
      </div>
    )
  }
  if (!data) return <div>still loading from network...</div>
  if (data.error) {
    console.log(data)
    return (
      <div className="flex p-24 items-center justify-center">
        It looks like something went wrong on our end. Please try again in a
        moment...
      </div>
    )
  }
  return (
    <div>
      <div className="p-4 text-center">Hello {data.firstname}!</div>
      <div className="flex items-center justify-center">
        <MonacoEditor
          editorDidMount={() => {
            window.MonacoEnvironment.getWorkerUrl = (_moduleId, label) => {
              if (label === 'json') return '_next/static/json.worker.js'
              if (label === 'css') return '_next/static/css.worker.js'
              if (label === 'html') return '_next/static/html.worker.js'
              if (label === 'typescript' || label === 'javascript')
                return '_next/static/ts.worker.js'
              return '_next/static/editor.worker.js'
            }
          }}
          width="720"
          height="300"
          language="typescript"
          theme="vs"
          value={postBody}
          options={{ minimap: { enabled: false } }}
          onChange={setPostBody}
        />
      </div>
      <div className="p-2 text-center">
        <Button onClick={submitCode} name="run" />
        <Button onClick={logoutUser} name="logout" />
      </div>
    </div>
  )
}
