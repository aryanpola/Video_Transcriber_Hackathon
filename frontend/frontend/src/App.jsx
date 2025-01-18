import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Default from './components/Default'
import VideoUploader from './components/UploadVideo'
// ... existing code ...

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Default />
        } />
        {/* Add more routes here as needed */}
        <Route path="/upload-video" element={<VideoUploader />} />
      </Routes>
    </Router>
  )
}

export default App