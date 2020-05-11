import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import FormButton from '../components/FormButton'
import { toast } from 'react-toastify'
import useSWR, { mutate } from 'swr'

class LoginError extends Error {
  constructor({ message, status }) {
    super(message)
    this.status = status
  }
}

export default () => {
  let [email, setEmail] = useState()
  let [password, setPassword] = useState()
  const router = useRouter()

  const api_host =
    process.env.NODE_ENV === 'production'
      ? 'https://api.byreference.engineer'
      : 'http://localhost:5001'

  const getJson = (url) =>
    fetch(url, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    }).then((res) => res.json())

  const { data, error } = useSWR(`${api_host}/dashboard`, getJson)
  if (error) {
    console.error(error)
  }
  if (!data) return <div>still loading from network...</div>
  if (!data.error) {
    console.log(data)
    router.push('/dashboard')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email) toast('Please enter an email', { type: toast.TYPE.INFO })
    if (!password) toast('Please enter a password', { type: toast.TYPE.INFO })

    fetch(`${api_host}/api/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const body = await res.json()
        console.log(body)
        if (!res.ok || body.error) {
          throw new LoginError({ status: res.status, message: body.message })
        }
        toast('User logged in...', { type: toast.TYPE.SUCCESS })
        router.push('/dashboard')
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
            Fill out all fields to register
          </div>
          <div className="block text-gray-800 text-lg font-bold mb-2">
            <div className="m-8"></div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 
              px-4 text-gray-700 leading-tight shadow-outline"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="m-6"></div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full
              py-3 px-4 text-gray-700 leading-tight shadow-outline"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <div className="p-2 text-center"></div>
              <FormButton />
              <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
      </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
