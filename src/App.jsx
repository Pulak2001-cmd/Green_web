import { useEffect, useState } from 'react'
import { Route, Routes } from "react-router-dom"
import Admin from './component/Admin'
import AdminPortal from './component/AdminPortal'
import firebase from 'firebase/compat/app';
import {firebaseConfig} from './config';
import HomePage from './component/HomePage';
import Privacy from './component/Privacy';
import Terms from './component/Terms';
import Refund from './component/Refund';

function App() {
  useEffect(() => {
    //console.log(firebaseConfig);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/admin" element={<Admin />} />
        <Route path='/admin/dashboard' element={<AdminPortal />}/>
      </Routes>
    </>
  )
}

export default App
