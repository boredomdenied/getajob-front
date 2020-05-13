import Head from 'next/head'
import React, { useState, useRef, createRef, Component } from 'react'
import ReactDOM from 'react-dom'
import Link from 'next/link'
import Button from '../components/Button'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

const api_host =
  process.env.NODE_ENV === 'production'
    ? 'https://api.byreference.engineer'
    : 'http://localhost:5001'

export default () => {
  return (
    <div>
      <div className="p-4"></div>
      <div className="p-4 block text-gray-800 text-2xl text-center font-bold mb-2">
        Please login or register to continue
      </div>
      <div className="text-center">
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
      </div>
    </div>
  )
}
