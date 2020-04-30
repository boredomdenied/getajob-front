import React from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(import('react-monaco-editor'), { ssr: false })

const getJson = (url) => fetch(url, { credentials: 'include', headers: { Accept: 'application/json' }}).then((res) => res.json())

export default () => {
  const [postBody, setPostBody] = React.useState();

  const submitButton = () => getJson('http://localhost:5000/api/container/run').then((res) => {
    console.log(res)
  })

  const { data, error } = useSWR('http://localhost:5000/user/dashboard', getJson)

  if (error) {
    console.log(error)
    return <div>failed to load</div>
  }
  if (!data) return <div>loading...</div>
  console.log(data)
  return (
    <div>
      Hello {data.firstname}!
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
          width="800"
          height="600"
          language="typescript"
          theme="vs-dark"
          value={postBody}
          options={{
            minimap: {
              enabled: false,
            },
          }}
          onChange={setPostBody}
        />
        <button onClick={submitButton}>Submit</button>
      </div>
    </div>
  )
}
