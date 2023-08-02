import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminPortal() {
  const db = firebase.firestore().collection('plans');
  const userDb = firebase.firestore().collection('newData');
  const transactionDb = firebase.firestore().collection('transactions');
  const updateDb = firebase.firestore().collection('Update');
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewradDetails, setRewradDetails] = useState('');
  const navigation = useNavigate();
  const logout = () =>{ 
    localStorage.removeItem('admin');
    navigation('/');
  }
  useEffect(()=> {
    async function getData(){
        var today = new Date();
        var tt = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
        updateDb.where('id', '==', 7412).get().then((querySnapshot)=> {
            const data = querySnapshot.docs[0];
            let time = (today - new Date(data.data().date));
            time = time/(60*60*1000);
            console.log(time);
            if (time < 24){
                setDisable(true);
            }
        })
    }
    getData();
  }, [])
  const setDatas1 = ()=> {
    userDb.get().then((query)=> {
        const list = query.docs;
        for(let i=0; i<list.length; i++){
            list[i].ref.update({
                blocked: 0
            })
        }
    })
  }
  const [disable, setDisable] = useState(false);
  const sendReturn = async()=> {
    var today = new Date();
    var tt = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    updateDb.where('id', '==', 7412).get().then((querySnapshot)=> {
        const data = querySnapshot.docs[0];
        data.ref.update({
            date: tt,
        })
    })
    await db.get().then(async (querySnapshot)=>{
        console.log(querySnapshot.docs.length);
        const docs = querySnapshot.docs;
        var returns = {};
        var today = new Date();
        var tt = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
        for(let i=0;i<docs.length;i++){
            console.log(docs[i].id);
            let data = docs[i].data();
            let endDate =new Date(data.endDate);
            if (today > endDate){
                console.log('expired');
            } else {
                console.log(data.phone);
                if (data.phone in returns){
                    returns[data.phone] += parseFloat(data.daily_return.replace('₹ ', ''));
                } else {
                    returns[data.phone] = parseFloat(data.daily_return.replace('₹ ', ''));
                }
            }
        }
        console.table(returns)
        for(const phone in returns){
            await userDb.where('phone', '==', phone).get().then((q1)=> {
                const dc = q1.docs;
                for(let j=0;j<dc.length;j++){
                    console.log(j);
                    if(j>0){
                        break;
                    }
                    const userData = dc[j].data();
                    console.log(userData.balance, returns[phone]);
                    const data = dc[j].data();
                    dc[j].ref.update({
                        balance: userData.balance+returns[phone],
                        yesterdayEarning: returns[phone],
                        totalEarning: data.totalEarning + returns[phone]
                    })
                    transactionDb.add({
                        id: dc[j].id,
                        phone: phone,
                        amount: returns[phone],
                        time: tt,
                        message: 'Success ! Daily return for investment'
                    })
                }
            }).catch((err)=> {
                console.error(err);
            })
        }
    }).catch((error)=>{
        console.log(error)
    })
  }
  const searchUser = async(str)=> {
    await userDb.where('phone', '==', str).get().then((querySnapshot)=> {
        console.log(querySnapshot.docs.length);
        const dt = querySnapshot.docs[0].data();
        dt.id = querySnapshot.docs[0].id;
        setData(dt);
    }).catch((err)=> {
        console.error(err);
        setData({});
    })
  }
  const search = async(e)=> {
    console.log('nnjn');
    setSearchPhone(e);
    await searchUser(e);
  }
  const sendReward = ()=> {
    if(rewardAmount === 0 || rewardAmount === ''){
        alert("Please enter the amount to be rewarded");
        return;
    }
    else if(rewradDetails === ''){
        alert('Please Enter the reward details');
        return;
    }
    var today = new Date();
    var tt = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    userDb.where('phone', '==', searchPhone).get().then(async (query)=> {
        const dt = query.docs[0].data().balance;
        await query.docs[0].ref.update({
            balance: dt+ parseInt(rewardAmount),
        })
        await transactionDb.add({
            id: query.docs[0].id,
            phone: searchPhone,
            amount: rewardAmount,
            time: tt,
            message: "Success! "+rewradDetails
        })
        alert("Bonus Sent")
    })
  }
  const [searchPhone, setSearchPhone] = useState('');
  const [data, setData] = useState({});
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const getActivePlans = (activePlans)=> {
    console.log(activePlans)
    if (activePlans === undefined){
        return ''
    }
    let ans = '';
    activePlans.map((i, index)=> {
        if(index == activePlans.length-1){
            ans += i
        } else {
            ans += i+' , '
        }
    })
    return ans;
  }
  const setDatas = async()=> {
    var obj = {}
    await db.get().then(async(query)=> {
        const list = query.docs;
        for(let i=0; i<list.length; i++) {
            const dt = list[i].data();
            if (Object.keys(obj).includes(dt.phone)){
                obj[dt.phone] += parseInt(dt.amount.replace('₹ ', ''));
            } else {
                obj[dt.phone] = parseInt(dt.amount.replace('₹ ', ''));
            }
        }
        console.table(obj);
        for(const phone in obj) {
            await userDb.where('phone', '==', phone).get().then((q)=> {
                q.docs[0].ref.update({ 
                    totalInvestment: obj[phone]
                })
            }).catch((err)=> {console.error(err);})
        }
    }).catch((err)=> {console.error(err)})
  }
  const send = async()=> {
    const url = "https://app.nativenotify.com/api/notification";
    const data =  {
        appId: 9921,
        appToken: "3BuZeO7tWKbBsI4kDbFBeU",
        title: title,
        body: body,
        dateSent: new Date().toDateString(),
    }
    const response = await axios.post(url, data);
    alert('Notification sent successfully')
  }
  const blockUser = async() => {
    await userDb.where('phone', '==', searchPhone).get().then(async(query) => {
        const data = query.docs[0].data();
        let blockStatus = data.blocked 
        let blockTo = 0
        if (blockStatus === 0){
            blockTo = 1;
        }
        await query.docs[0].ref.update({ blocked : blockTo})
        setSearchPhone('')
        setData({});
        let str = `${blockTo === 1 ? 'Blocked':'Unblocked'} Successfully`
        alert(str)

    }).catch(err => console.log(err.message))
  }
  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">IndiaGreen Admin</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">My Action</a>
                </li>
            </ul>
            </div>
        </div>
        <div className="d-flex">
            <ul className='navbar-nav me-2 mb-2 mb-lg-0'>
                <li className="nav-item" style={{cursor: 'pointer'}} onClick={logout}>
                    <a className="nav-link active" aria-current="page">Logout</a>
                </li>
            </ul>
        </div>
        </nav>
        <div className="m-5">
            <button className={`btn btn-outline-${disable ? 'secondary': 'primary'}`} onClick={sendReturn} disabled={disable}>{disable ? 'Daily Return Sent' : 'Send Daily Return'}</button>
        </div>
        <div className="m-5 align-items-center justify-content-center d-flex flex-column">
            <h2>Send Notification</h2>
            <input type="text" className="form-control m-3" placeholder="Enter Title" value={title} onChange={(e)=> setTitle(e.target.value)}/>
            <textarea type="text" className="form-control m-3" placeholder="Enter body" value={body} onChange={(e)=> setBody(e.target.value)}/>
            <button className="btn btn-primary" onClick={send}>Send Notification</button>
        </div>
        {/* <button className="btn btn-primary" onClick={setDatas1}>Send data</button> */}
        <div className="m-5">
            
            <input type="text" value={searchPhone} onChange={(e)=> {search(e.target.value)}} className="form-control" placeholder="Search Phone Number" width='200px'/>
            <div className='d-flex m-4 align-items-center justify-content-center'>
            <h1>User Data</h1>
            </div>
            { Object.keys(data).length === 0 ?
                <div className="d-flex m-5 align-items-center justify-content-center">
                <h2>No records found</h2>
                </div>
            :

            <div className="d-flex flex-column flex-lg-row align-items-start justify-content-around">
                <div className="d-flex flex-row flex-lg-column align-items-center justify-content-center mt-3">
                    <h5>ID</h5>
                    <p className="ms-5 m-lg-0">{data.id}</p>
                </div>
                <div className="d-flex flex-row flex-lg-column align-items-center justify-content-center mt-3">
                    <h5>Balace</h5>
                    <p className="ms-5 m-lg-0">{parseFloat(data.balance).toFixed(2)}</p>
                </div>
                <div className="d-flex flex-row flex-lg-column align-items-center justify-content-center mt-3">
                    <h5>Yesterday Earning</h5>
                    <p className="ms-5 m-lg-0">{data.yesterdayEarning}</p>
                </div>
                <div className="d-flex flex-row flex-lg-column align-items-center justify-content-center mt-3">
                    <h5>Block / Unblock</h5>
                    <div className="d-flex flex-column mt-lg-1 ms-lg-0 ms-5">
                        <button className={`btn btn-${data.blocked === 0 ? 'danger':'success'}`} onClick={blockUser}> {data.blocked === 0 ? 'Block' : 'Unblock'} </button>
                    </div>
                </div>
                <div className="d-flex flex-row flex-lg-column align-items-center justify-content-center mt-3">
                    <h5>Send Reward</h5>
                    <div className="d-flex flex-column mt-lg-1 ms-lg-0 ms-5">
                        <input type="number" value={rewardAmount} onChange={(e)=> setRewardAmount(e.target.value)} className="form-control mt-2" placeholder="Enter Amount here" />
                        <input type="text" value={rewradDetails} onChange={(e)=> setRewradDetails(e.target.value)}className="form-control mt-2" placeholder="Enter Message here" />
                        <button className="btn btn-primary mt-2" onClick={sendReward}>Send</button>
                    </div>
                </div>
                <div className="d-flex flex-row flex-lg-column align-items-start align-items-lg-center justify-content-center mt-3">
                    <h5>Plans</h5>
                    <div className="d-flex flex-column align-items-start align-items-lg-center ms-5 m-lg-0">
                        {data.active_plan.map((i, index)=> {
                            return <p key={index}>{i}</p>
                        })}
                    </div>
                </div>
            </div>
            // <table class="table mt-5">
            // <thead>
            //     <tr>
            //     <th scope="col">id</th>
            //     <th scope="col">Balance</th>
            //     <th scope="col">Plans</th>
            //     <th scope="col">Yesterday Earning</th>
            //     </tr>
            // </thead>
            // <tbody>
            //     <tr>
            //         <th scope="row">{data.id}</th>
            //         <td>{data.balance}</td>
            //         <td>{getActivePlans(data.active_plan)}</td>
            //         <td>{data.yesterdayEarning}</td>
            //     </tr>
            // </tbody>
            // </table>
            }
        </div>
    </div>
  )
}

export default AdminPortal
