import Head from 'next/head'
import React from 'react'
import Link from 'next/link'
import Button from '../components/Button'

export default function Home() {
  return (
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
  )
}
