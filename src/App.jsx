import { useEffect, useState } from 'react'
import { Route, Routes } from "react-router-dom"
import Admin from './component/Admin'
import AdminPortal from './component/AdminPortal'
import firebase from 'firebase/compat/app';
import {firebaseConfig} from './config';
import HomePage from './component/HomePage';

function App() {
  useEffect(() => {
    console.log(firebaseConfig);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path='/admin/dashboard' element={<AdminPortal />}/>
      </Routes>
    </>
  )
}

export default App
