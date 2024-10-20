import React from 'react'
import LoginForm from '../components/LoginForm'

function Login({onLogin}) {
  return (
    <div>
      <LoginForm onLogin={onLogin}/>
    </div>
  )
}

export default Login