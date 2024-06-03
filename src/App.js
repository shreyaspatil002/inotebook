import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import About from './components/About';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import NoteState from './contex/notes/NoteState';


function App () {
const [alert,setAlert]=useState(null)
const showAlert=(message, type)=>{
  setAlert({
    msg: message,
    type: type
  })
  setTimeout(()=>{
    setAlert(null);
  },1500);
}
  return (
    <NoteState>
      <Router>
        <div>
          <Navbar />
          <Alert alert={alert}/>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home showAlert={showAlert} />} />
            <Route path="/login" element={<Login  showAlert={showAlert}/>} />
            <Route path="/signup" element={<Signup  showAlert={showAlert}/>} />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
};

export default App;
