import Head from 'next/head'
import React, { useState } from 'react'
import FormButton from '../components/FormButton'
import { toast } from 'react-toastify'
import { css } from '@emotion/core'

class LoginError extends Error {
  constructor({ message, status }) {
    super(message)
    this.status = status
  }
}

export default () => {
  let [email, setEmail] = useState()

  const api_host =
    process.env.NODE_ENV === 'production'
      ? 'https://api.byreference.engineer'
      : 'http://localhost:5001'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) toast('Please enter your email', { type: toast.TYPE.INFO })
    fetch(`${api_host}/api/user/reset`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    })
      .then(async (res) => {
        const body = await res.json()
        console.log(body)
        if (!res.ok || body.error) {
          throw new LoginError({ status: res.status, message: body.message })
        }
        toast('A verification email has been sent. Check your inbox or spam', {
          type: toast.TYPE.SUCCESS,
        })
      })
      .catch((err) => {
        if (err instanceof LoginError) {
          const { status, message } = err
          console.log({ status, message })
          if (status === 403) toast(message, { type: toast.TYPE.WARNING })
        } else {
          toast(err, { type: toast.TYPE.WARNING })
        }
      })
  }

  return (
    <div className="p-12 flex justify-center w-full">
      <Head>
        <title>Login Test Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form onSubmit={handleSubmit}>
        <div>
          <div className="block text-gray-800 text-2xl font-bold mb-2">
            Please enter your email
          </div>
          <div className="block text-gray-800 text-lg font-bold mb-2">
            <div className="m-8"></div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="m-6"></div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full
              py-3 px-4 text-gray-700 leading-tight shadow-outline"
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <div className="p-2 text-center"></div>
              <FormButton />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
