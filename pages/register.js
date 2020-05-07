import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import FormButton from '../components/FormButton'
import { toast } from 'react-toastify'

class LoginError extends Error {
  constructor({ message, status }) {
    super(message)
    this.status = status
  }
}

export default () => {
  const [firstname, setFirstname] = useState()
  const [lastname, setLastname] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!firstname) return toast('Please enter a firstname', { type: toast.TYPE.WARNING })
    if (!lastname) return toast('Please enter a lastname', { type: toast.TYPE.WARNING })
    if (!email) return toast('Please enter an email', { type: toast.TYPE.WARNING })
    if (!password) return toast('Please enter a password', { type: toast.TYPE.WARNING })

    const api_host =
      process.env.NODE_ENV === 'production'
        ? 'https://api.byreference.engineer'
        : 'http://localhost:5001'

    fetch(`${api_host}/api/auth/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ firstname, lastname, email, password }),
    })
      .then(async (res) => {
        const body = await res.json()
        console.log(body)
        if (!res.ok) {
          throw new LoginError({ status: res.status, message: body.message })
        }
        router.push('/dashboard')
      })
      .catch((err) => {
        if (err instanceof LoginError) {
          const { status, message } = err
          console.log({ status, message })
          if (status === 403 || status === 500) toast(message, { type: toast.TYPE.ERROR })
        } else {
          toast('Something went wrong. Please try again', { type: toast.TYPE.ERROR })
        }
      })
  }

  return (
    <div className="login-form">
      <Head>
        <title>Login Test Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSubmit}>
        <label>
          Firstname:
          <input type="text" onChange={(e) => setFirstname(e.target.value)} />
        </label>
        <br />
        <label>
          Lastname:
          <input type="text" onChange={(e) => setLastname(e.target.value)} />
        </label>
        <br />
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
        <FormButton />
      </form>
    </div>
  )
}
