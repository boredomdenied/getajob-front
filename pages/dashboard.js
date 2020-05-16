import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import dynamic from 'next/dynamic'
import Button from '../components/Button'
import { useRouter } from 'next/router'
import { css } from '@emotion/core'
import RingLoader from 'react-spinners/RingLoader'
import { toast } from 'react-toastify'

// const escRegex = require('escape-string-regexp')

const override = css`
  display: block;
  margin: 0 auto;
  // border-color: red;
`

const MonacoEditor = dynamic(import('react-monaco-editor'), { ssr: false })

const getJson = (url) =>
  fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  }).then((res) => res.json())

export default () => {
  const router = useRouter()
  const [code, setCode] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState()
  const [hasContainer, setHasContainer] = useState(false)

  const api_host =
    process.env.NODE_ENV === 'production'
      ? 'https://api.byreference.engineer'
      : 'http://localhost:5001'

  const getContainer = () => {
    fetch(`${api_host}/api/docker/provision`, {
      method: 'POST',
      headers: {
        Accept: 'application/javascript',
        'Content-Type': 'application/javascript',
      },
      credentials: 'include',
    })
      .then(async (res) => {
        const body = await res.json()
        if (body.error || !res.ok) {
          console.log(body.error || res.ok)
        }
        toast(res, { type: toast.TYPE.SUCCESS })
        setHasContainer(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const submitCode = (e) => {
    e.preventDefault()

    if (!code) toast('Please enter your code first', { type: toast.TYPE.INFO })

    // const escode = escRegex(code)

    fetch(`${api_host}/api/docker/run`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const body = await res.json()
        console.log(body)
        if (!res.ok || body.error) {
          console.log(body.error)
        }
        // toast('User logged in...', { type: toast.TYPE.SUCCESS })
        router.push('/dashboard')
      })
      .catch((err) => {
        console.log({ err })
      })
  }
  const logoutUser = () => {
    fetch(`${api_host}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        console.log(res.json())
        mutate(`${api_host}/api/user/dashboard`, null)
      })
      .then(router.push('/'))
  }
  // Get dashboard information
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
  if (!data)
    return (
      <div className="flex p-24 items-center justify-center">
        <RingLoader
          css={override}
          sizeUnit={'px'}
          size={50}
          color={'#123abc'}
          // loading={loading}
        />
      </div>
    )
  // if (data.error) {
  //   console.log(data)
  //   return (
  //     <div className="flex p-24 items-center justify-center">
  //       It looks like something went wrong on our end. Please try again in a
  //       moment...
  //     </div>
  //   )
  // }
  return (
    <div>
      <div className="p-4 text-center">Hello {data.firstname}!</div>
      <div className="flex items-center justify-center">
        <MonacoEditor
          editorDidMount={() => {
            getContainer()
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
          value={code}
          options={{ minimap: { enabled: false } }}
          onChange={setCode}
        />
      </div>
      <div className="p-2 text-center">
        <Button onClick={hasContainer ? submitCode : undefined} name="run" />
        <Button onClick={logoutUser} name="logout" />
      </div>
    </div>
  )
}
