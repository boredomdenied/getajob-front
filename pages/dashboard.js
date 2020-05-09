import React from 'react'
import useSWR from 'swr'
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
  const [postBody, setPostBody] = React.useState()

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
      .then((res) => console.log(res.json()))
      .then(router.push('/'))
  }

  const { data, error } = useSWR(`${api_host}/api/user/dashboard`, getJson)

  if (error) {
    console.error(error)
    return <div>failed to load</div>
  }
  if (!data) return <div>loading...</div>
  if (data.error) {
    console.log(data)
    return <div>{data.error}</div>
  }
  return (
    <div className="relative h-32 p-12 absolute inset-0 sm:bottom-0 sm:left-0 md:top-0 md:inset-x-0 lg:right-0 lg:inset-y-0 xl:bottom-0 xl:inset-x-0">
      Hello {data.firstname}!<br></br>
      <div>
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
          height="600"
          language="typescript"
          theme="vs"
          value={postBody}
          options={{ minimap: { enabled: false } }}
          onChange={setPostBody}
        />
        <Button onClick={submitCode} name="run" />
        <Button onClick={logoutUser} name="logout" />
      </div>
    </div>
  )
}
