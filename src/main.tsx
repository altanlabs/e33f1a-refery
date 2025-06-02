import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './App.css'
import App from './App'

// Remove StrictMode to avoid potential React hook issues with altan-auth
ReactDOM.render(<App />, document.getElementById('root'))