import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Button } from '@/components/ui/button.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Smart Village Admin Dashboard</h1>
      <div>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p>
          Smart Village Management System - Admin Dashboard
        </p>
      </div>
      <p className="read-the-docs">
        Welcome to Smart Village Admin Dashboard
      </p>
    </>
  )
}

export default App
