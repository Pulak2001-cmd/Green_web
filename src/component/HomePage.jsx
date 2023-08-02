import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function HomePage() {
  const [basic, setBasic] = useState([]);
  const [vip, setVip] = useState([]);
  const [premium, setPremium] = useState([]);
  const [premiumPlus, setPremiumPlus] = useState([]);
  useEffect(()=> {
    async function getData(){
      const url = "https://script.google.com/macros/s/AKfycbziBnRXZ1rUHmhj2435jjYhGyOdbjGE4HErI6MtYi5cJ7ZpOLfhlYX7RSc49gBm7ISl/exec";
      const response = await axios.get(url);
      var plans = response.data.data;
      // console.log(data);
      var basic = [];
      var vip = [];
      var premium = [];
      var premium_plus = [];
      for(let i=1;i<plans.length;i++) {
        if (plans[i].Plan_Name.includes('Upcoming')){
          continue;
        }
        var amount = parseInt(plans[i].Amount.replace(' INR', ''));
        var time = parseInt(plans[i].Validity.replace(' Month', ''));
        var return_ = plans[i].Return*100;
        var per_day = parseFloat((amount + amount*return_/100)/(time*30)).toFixed(2)
        var t = {
          name: plans[i].Plan_Name,
          amount: `₹ ${amount}`,
          purchase_limit: plans[i].Limit,
          validity: plans[i].Validity,
          return: `${plans[i].Return*100}%`,
          original_url: plans[i].Imageurl,
          daily_return: `₹ ${per_day}`,
        }
        if(plans[i].PlanType === 'Basic'){
          basic.push(t);
        } else if(plans[i].PlanType === 'VIP'){
          vip.push(t);
        } else if(plans[i].PlanType === 'Premium'){
          premium.push(t);
        } else {
          premium_plus.push(t)
        }
      }
      setBasic(basic);
      setVip(vip);
      setPremium(premium);
      setPremiumPlus(premium_plus);
    }
    getData()
  }, [])
  const [email,setEmail] = useState();
  const [phone, setPhone] = useState();
  return (
    <div>
      <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
      <nav class="navbar navbar-expand-lg bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 ml-3">
              <li class="nav-item ml-3">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">About Us</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Our Goal</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      </nav>
      <section id="home" style={{backgroundImage: `url('/background.avif')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', width: '100%', minHeight: '90vh'}} className='d-flex flex-column flex-lg-row align-items-center justify-content-around'>
          <div className="d-flex flex-column">
            <h1 className="text-light">INDIAGREEN</h1>
            <p className="text-light">Welcome to new edge technology</p>
            <div className="mt-5 d-flex flex-column flex-lg-row" >
              <div className="d-flex flex-row align-items-center justify-content-center border-1 border-light border p-1 rounded-3 m-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-google-play" viewBox="0 0 16 16">
                <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96 2.694-1.586Zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055l7.294-4.295ZM1 13.396V2.603L6.846 8 1 13.396ZM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27Z"/>
              </svg>
              <div className="d-flex flex-column">
                <p className="text-light ms-3 fs-5 mb-0 mt-2">Get it on</p>
                <p className="text-light ms-3 fs-5 fw-bold"> Google Play</p>
              </div>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-center border-1 border-light border p-1 rounded-3 m-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-apple" viewBox="0 0 16 16">
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"/>
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"/>
              </svg>
              <div className="d-flex flex-column">
                <p className="text-light ms-3 fs-5 mb-0 mt-2">Get it on</p>
                <p className="text-light ms-3 fs-5 fw-bold"> Apple Store</p>
              </div>
              </div>
            </div>
          </div>
          <img src='/app.jpg' style={{height: '80vh', minWidth: '20vw', borderRadius: 10}}/>
      </section>
      <section id='about' style={{backgroundColor: '#000', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center" style={{ margin: 10}}>
          <div className='d-flex flex-column m-2 p-4 align-items-start justify-content-start col-lg-3' style={{backgroundColor: '#000', borderRadius: 12, minHeight: '400px'}}>
              <p className="text-light">Our story, our future</p>
              <h6 className="text-light">India Green</h6>
              <div className="d-flex flex-row align-items-center justify-content-center">
                {[1,2,3].map((i, index)=> {
                  return <svg key={index} className='ms-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-star-fill" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                })}
              </div>
              <p className="text-light text-justify mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur ducimus vero delectus, similique laudantium recusandae iste rem eaque excepturi blanditiis, dignissimos odit ipsam aut possimus </p>
          </div>
          <div className='d-flex col-lg-3'>
                <img src='/about.jpeg' style={{height: '400px', width: '300px', borderRadius: 10}}/>
          </div>
        </div>
      </section>
      <section id='plans' style={{backgroundColor: '#000', minHeight: '120vh', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
          <div className="col-lg-9 p-5 d-flex flex-column align-items-center justify-content-center" style={{backgroundColor: '#081206', borderRadius: 12}}>
              <h2 className="text-light">Plans</h2>
              <div className="d-flex flex-column flex-lg-row m-2">
                <div className="d-flex flex-column align-items-center justify-content-center m-4">
                <h3 className="text-light">Basic Plans</h3>
                {basic.map((i, index) =>{
                  return <div key={index}  className="d-flex flex-column m-2">
                    <p className="text-light">{i.name}</p>
                    <p className="text-light">{i.amount}</p>
                  </div>
                })}
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center m-4">
                <h3 className="text-light">VIP Plans</h3>
                {vip.map((i, index) =>{
                  return <div key={index} className="d-flex flex-column m-2">
                    <p className="text-light">{i.name}</p>
                    <p className="text-light">{i.amount}</p>
                  </div>
                })}
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center m-4">
                <h3 className="text-light">Premium Plans</h3>
                {premium.map((i, index) =>{
                  return <div key={index} className="d-flex flex-column m-2">
                    <p className="text-light">{i.name}</p>
                    <p className="text-light">{i.amount}</p>
                  </div>
                })}
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center m-4">
                <h3 className="text-light">Premium Plus Plans</h3>
                {premiumPlus.map((i, index) =>{
                  return <div key={index} className="d-flex flex-column m-2">
                    <p className="text-light">{i.name}</p>
                    <p className="text-light">{i.amount}</p>
                  </div>
                })}
                </div>
              </div>
          </div>
      </section>
      <section id="upcoming" style={{minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <h4>Upcoming Plans</h4>
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-around">
            <div className="d-flex flex-column m-4 align-items-center">
                  <h5>Basic Upcoming Planning</h5>
                  <img src="https://firebasestorage.googleapis.com/v0/b/indiagreen-b1d80.appspot.com/o/comming.jpg?alt=media&token=519eb431-1e74-455c-b13d-7dd1d4e69b94" style={{height: 200, width: 200}} />
                  <p style={{marginTop: 10, color: 'gray', fontSize: 20}}>Price: 3300</p>
            </div>
            <div className="d-flex flex-column m-4 align-items-center">
                  <h5>VIP Upcoming Planning</h5>
                  <img src="https://firebasestorage.googleapis.com/v0/b/indiagreen-b1d80.appspot.com/o/comming.jpg?alt=media&token=519eb431-1e74-455c-b13d-7dd1d4e69b94" style={{height: 200, width: 200}} />
                  <p style={{marginTop: 10, color: 'gray', fontSize: 20}}>Price: 20000</p>
            </div>
            <div className="d-flex flex-column m-4 align-items-center">
                  <h5>Premium Upcoming Planning</h5>
                  <img src="https://firebasestorage.googleapis.com/v0/b/indiagreen-b1d80.appspot.com/o/comming.jpg?alt=media&token=519eb431-1e74-455c-b13d-7dd1d4e69b94" style={{height: 200, width: 200}} />
                  <p style={{marginTop: 10, color: 'gray', fontSize: 20, alignItems: 'flex-start', justifyContent: 'start'}}>Price: 100000</p>
            </div>
            <div className="d-flex flex-column m-4 align-items-center">
                  <h5>Premium Plus Upcoming Planning</h5>
                  <img src="https://firebasestorage.googleapis.com/v0/b/indiagreen-b1d80.appspot.com/o/comming.jpg?alt=media&token=519eb431-1e74-455c-b13d-7dd1d4e69b94" style={{height: 200, width: 200}} />
                  <p style={{marginTop: 10, color: 'gray', fontSize: 20}}>Price: 300000</p>
            </div>
          </div>
      </section>
      <section id="contact" style={{backgroundColor: '#000', minHeight: '60vh'}}>
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center pt-5">
                <div className="d-flex flex-column col-lg-5 align-items-center justify-content-center">
                  {/* <div className="d-flex flex-column">
                    <label className="text-light mt-3 mb-3 fs-4">Email Address</label>
                    <input type="email" placeholder="Type your email address" style={{ padding: 10, backgroundColor: 'transparent', color: '#FFFF', border: '1px solid #FFFF', borderRadius: 8}}/>
                  </div> */}
                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label text-light">Email address</label>
                    <input type="email" class="form-control" id="exampleFormControlInput1" value={email} onChange={(e)=> setEmail(e.target.value)} style={{backgroundColor: 'transparent', color: '#FFFF'}} placeholder="name@example.com" />
                  </div>
                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label text-light">Phone Number</label>
                    <input type="number" class="form-control" id="exampleFormControlInput1" value={phone} onChange={(e)=> setPhone(e.target.value)} style={{backgroundColor: 'transparent', color: '#FFFF'}} placeholder="9876543210" />
                  </div>
                  <div class="mb-3">
                    <label for="exampleFormControlTextarea1" class="form-label text-light">Enter Your Message</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" style={{backgroundColor: 'transparent', color: '#FFFF'}} rows="3"></textarea>
                  </div>
                  <div class="mb-3 d-flex align-items-start justify-content-start">
                    <button className='btn btn-outline-primary'>Send</button>
                  </div>
                </div>
                <div className="d-flex flex-column col-lg-5 align-items-center justify-content-center">
                  <img src="/contact.jpg" style={{height: '250px', width: '250px'}}/>
                </div>
          </div>
      </section>
    </div>
  )
}