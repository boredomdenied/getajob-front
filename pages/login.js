import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../components/Button.module.css'

export default () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) alert('fuck you put an email')
    if (!password) alert('fuck you put an password')

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    router.push('/dashboard')

    console.log(await res.json())
  }

  return (
    <div className="login-form">
      <Head>
        <title>Login Test Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" className={styles.button} />
      </form>
    </div>
  )
}
