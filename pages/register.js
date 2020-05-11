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
  let [firstname, setFirstname] = useState()
  let [lastname, setLastname] = useState()
  let [email, setEmail] = useState()
  let [password, setPassword] = useState()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!firstname)
      return toast('Please enter a firstname', { type: toast.TYPE.INFO })
    if (!lastname)
      return toast('Please enter a lastname', { type: toast.TYPE.INFO })
    if (!email) return toast('Please enter an email', { type: toast.TYPE.INFO })
    if (!password)
      return toast('Please enter a password', { type: toast.TYPE.INFO })

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
        toast('An email has been sent. Please check your mailbox to confirm user account.', { type: toast.TYPE.SUCCESS })
      })
      .catch((err) => {
        if (err instanceof LoginError) {
          const { status, message } = err
          console.log({ status, message })
          if (status === 403 || status === 500)
            toast(message, { type: toast.TYPE.WARNING })
        } else {
          toast('Something went wrong. Please try again', {
            type: toast.TYPE.WARNING,
          })
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
        <div className="block text-gray-800 text-2xl font-bold mb-2">
        <p></p>Fill out all fields to register
        </div>
        
        <div className="m-8"></div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Firstname
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3
            px-4 text-gray-700 leading-tight shadow-outline"
            onChange={(e) => setFirstname(e.target.value)}
          />
          <div className="m-6"></div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Lastname
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3
            px-4 text-gray-700 leading-tight shadow-outline"
            onChange={(e) => setLastname(e.target.value)}
          />
          <div className="m-6"></div>
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
            className="shadow appearance-none border rounded w-full py-3
            px-4 text-gray-700 leading-tight shadow-outline"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="p-2 text-center"></div>
          <FormButton />
        </div>
      </form>
    </div>
  )
}
