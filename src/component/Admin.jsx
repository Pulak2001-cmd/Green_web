import React, { useState } from 'react'
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigate();
  const login = ()=> {
    console.log(email);
    if(email === 'admin@indiagreen.co.in' && password === 'admin@0987'){
        localStorage.setItem('admin', true);
        navigation('/admin/dashboard');        
    } else {
        alert("You are not allowed to admin portal");
    }
  }
  return (
    <MDBContainer fluid className="p-3 mt-5 h-custom">

      <MDBRow>

        <MDBCol col='10' md='6'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid" alt="Sample image" />
        </MDBCol>

        <MDBCol col='4' md='6'>

          <div className="d-flex flex-row align-items-center justify-content-center m-3">

            <p className="lead fw-bold mb-0 me-3 text-success">INDIAGREEN</p>


          </div>


          <MDBInput wrapperClass='mb-4' value={email} onChange={(e)=> setEmail(e.target.value)} label='Email address' id='formControlLg' type='email' size="lg"/>
          <MDBInput wrapperClass='mb-4' label='Password' value={password} onChange={(e)=> setPassword(e.target.value)} id='formControlLg1' type='password' size="lg"/>


          <div className='text-center text-md-start mt-4 pt-2' onClick={login}>
            <MDBBtn className="mb-0 px-5" size='lg'>Login</MDBBtn>
          </div>

        </MDBCol>

      </MDBRow>

      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">

        <div className="text-white mb-3 mb-md-0">
          Copyright © 2020. All rights reserved.
        </div>

        <div>

          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
            <MDBIcon fab icon='facebook-f' size="md"/>
          </MDBBtn>

          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='twitter' size="md"/>
          </MDBBtn>

          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='google' size="md"/>
          </MDBBtn>

          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='linkedin-in' size="md"/>
          </MDBBtn>

        </div>

      </div>

    </MDBContainer>
  )
}
