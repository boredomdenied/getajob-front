import Head from 'next/head'
import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import Link from 'next/link'
import Button from '../components/Button'


export default () => {

  let [existsCookie, setExistsCookie] = useState()

  if (typeof window !== 'undefined') {
  setExistsCookie = (document.cookie.match(
    /^(?:.*;)?\s*token\s*=\s*([^;]+)(?:.*)?$/
  ) || [, null])[1]
  }

  if (existsCookie) {
    return <div>Found cookie</div>
  }
  return (
    // <body className="bg-gray-400">
    <div className="login-form">
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/login" passHref>
        <Button name="login"></Button>
      </Link>
      <Link href="/register" passHref>
        <Button name="register"></Button>
      </Link>
    </div>
    // </body>
  )
}
