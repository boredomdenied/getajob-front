import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import FormButton from '../components/FormButton'
import { ToastContainer, toast } from 'react-toastify'
 
class LoginError extends Error {
  constructor({ message, status }) {
    super(message)
    this.status = status
  }
}

export default () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const router = useRouter()

  const api_host = process.env.NODE_ENV === 'production' ?
    'https://api.byreference.engineer' :
    'http://localhost:5001'

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email) toast('Please enter an email')
    if (!password) toast('Please enter a password')

    fetch(`${api_host}/api/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    .then(async res => {
      const body = await res.json()
      console.log(body)
      if (!res.ok || body.error) {
        throw new LoginError({ status: res.status, message: body.message })
      }
      router.push('/dashboard')
    })
    .catch((err) => {
      if (err instanceof LoginError) {
        const { status, message } = err
        console.log({ status, message })
        if (status === 403) toast(message)
      } else {
        toast(err)
      }
    })
  }

  return (
    <div className="login-form">
      <Head>
        <title>Login Test Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={ handleSubmit }>
        <label>
          Email:
          <input type="text" onChange={ (e) => setEmail(e.target.value) } />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            onChange={ (e) => setPassword(e.target.value) }
          />
        </label>
        <br />
        <FormButton/>
      </form>
      <ToastContainer position="bottom-center" hideProgressBar={true}/>
    </div>
  )
}
