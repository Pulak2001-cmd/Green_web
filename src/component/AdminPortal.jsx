import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminPortal() {
  const db = firebase.firestore().collection('plans');
  const userDb = firebase.firestore().collection('newData');
  const transactionDb = firebase.firestore().collection('transactions');
  const updateDb = firebase.firestore().collection('Update');
  const withdrawDb = firebase.firestore().collection('withdraw');
  const rechargeDb = firebase.firestore().collection('recharge');
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewradDetails, setRewradDetails] = useState('');
  const [withdrawData, setWithdrawData] = useState([]);
  const [rechargeRequest, setRechargeRequest] = useState([]);
  const [reject, setReject] = useState(false);
  const navigation = useNavigate();
  const logout = () =>{ 
    localStorage.removeItem('admin');
    navigation('/');
  }
  useEffect(()=> {
    const admin = localStorage.getItem('admin');
    if(!admin) {
        navigation('/admin');
    }
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
        let datas = [];
        await withdrawDb.get('status', '==', 'Pending').then(async(result)=> {
            const list = result.docs;
            for(let i = 0; i < list.length; i++) {
                let singleData = list[i].data();
                singleData['id'] = list[i].id;
                datas.push(singleData);
            }
        })
        setWithdrawData(datas);

        let arr = [];
        await rechargeDb.get().then(async(query)=> {
            const list = query.docs;
            for (let i = 0; i < list.length; i++) {
                let singleData = list[i].data();
                singleData['id'] = list[i].id;
                arr.push(singleData);
            }
        })
        setRechargeRequest(arr);
    }
    getData();
  }, [])
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
            await userDb.where('phone', '==', phone).get().then(async(q1)=> {
                const dc = q1.docs;
                for(let j=0;j<dc.length;j++){
                    if (j>0){
                       break;
                    }
                    const userData = dc[j].data();
                    const data = dc[j].data();
                    await dc[j].ref.update({
                        balance: userData.balance+returns[phone],
                        yesterdayEarning: returns[phone],
                        totalEarning: data.totalEarning + returns[phone]
                    })
                    await transactionDb.add({
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
    await userDb.where('phone', '==', str).get().then(async (querySnapshot)=> {
        console.log(querySnapshot.docs.length);
        const dt = querySnapshot.docs[0].data();
        let id = querySnapshot.docs[0].id;
        dt.id = querySnapshot.docs[0].id;
        setData(dt);
        let data = [];
        if(id){
            await userDb.where('referral', '==', id).get().then(async(query)=> {
                const docs = query.docs;
                for(let i=0;i<docs.length;i++) {
                    data.push(docs[i].data().phone);
                }
                setRefers(data);
            })
        }
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
  const [refers, setRefers] = useState([]);
  const [rejectMessage, setRejectMessage] = useState('');
  const [withdrawView, setWithdrawView] = useState(false);
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
    await db.get().then(async (query)=> {
        let data = query.docs;
        console.log(data.length);
        for(let i=0; i<data.length; i++) {
            let amount = data[i].data().amount.replace('₹ ', '');
            let phone = data[i].data().phone;
            await userDb.where('phone', '==', phone).get().then(async(query1)=> {
                let data = query1.docs[0].data();
                let highestInvestment = data.highestInvestment;
                console.log(amount, phone, highestInvestment);
                query1.docs[0].ref.update({
                    highestInvestment: amount > highestInvestment ? amount : highestInvestment
                })
            })
        }
    })
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
  const [withStatus, setWithStatus] = useState('Pending')
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
  const deleteUser = async() => {
    await userDb.where('phone', '==', searchPhone).get().then(async (query)=> {
        await query.docs[0].ref.delete();
        let str = `${searchPhone} Deleted Successfully`
        setSearchPhone('');
        setData({})
        alert(str)
    }).catch(error => {
        console.log(error.message)
    })
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
                        <button className={`btn btn-${ data.blocked === undefined || data.blocked === 0 ? 'danger':'success'}`} onClick={blockUser}> { data.blocked === undefined  || data.blocked === 0 ? 'Block' : 'Unblock'} </button>
                    </div>
                </div>
                <div className="d-flex flex-row flex-lg-column align-items-center justify-content-center mt-3">
                    <h5>Delete Account</h5>
                    <div className="d-flex flex-column mt-lg-1 ms-lg-0 ms-5">
                        <button className="btn btn-danger" onClick={deleteUser}>Delete</button>
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
                <div className="d-flex flex-row flex-lg-column align-items-start align-items-lg-center justify-content-center mt-3">
                    <h5>Referrals</h5>
                    <div className="d-flex flex-column align-items-start align-items-lg-center ms-5 m-lg-0">
                        {refers.map((i, index)=> {
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
        <div className="m-5 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-center">
            <h3 className="m-4">Withdraw Requests</h3>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center">
                <div onClick={()=> setWithStatus("Pending")} className="col-4 m-4 align-items-center d-flex justify-content-center p-3" style={{border: '1px solid black', borderRadius: '10px', backgroundColor: withStatus === 'Pending' ? 'red': 'white', color: withStatus === 'Pending' ? 'white': 'black', cursor: 'pointer'}}>Pending</div>
                <div onClick={()=> setWithStatus("Confirm")} className="col-4 m-4 align-items-center d-flex justify-content-center p-3" style={{border: '1px solid black', borderRadius: '10px', backgroundColor: withStatus === 'Confirm' ? 'red': 'white', color: withStatus === 'Confirm' ? 'white': 'black', cursor: 'pointer'}}>Confirm</div>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-around">
                <h5>Bank Account Details</h5>
                <h5 className="d-flex align-items-center justify-content-center">Phone Number</h5>
                <h5 className="d-flex align-items-center justify-content-center">Amount</h5>
                <h5 className="d-flex align-items-center justify-content-center">Status</h5>
            </div>
            {withdrawData.map((i, index) =>(
                withStatus === 'Pending' && i.status === 'Pending' && <div key={index} className="d-flex flex-row align-items-center justify-content-around mt-5">
                    <div className="d-flex flex-column">
                        <span className="fw-bold">Account No. - </span> {i.bank_details.account_number}
                        <span className="fw-bold">Account Holder - </span> {i.bank_details.account_holder}
                        <span className="fw-bold">IFSC - </span> {i.bank_details.ifsc_code}
                        {i.bank_details.upi !== undefined && i.bank_details.upi !== '' && <><span className="fw-bold">UPI -</span> {i.bank_details.upi}</>}
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        {i.phone}
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        {parseFloat(i.amount)*0.9}
                    </div>
                    <div className='align-items-center justify-content-center d-flex flex-column'>
                        {reject !== index && <button onClick={async()=> {
                            await withdrawDb.doc(i.id).get().then(async(query)=> {
                                await query.ref.update({
                                    status: 'Success'
                                })
                            })
                            var today = new Date();
                            var tt = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
                            await transactionDb.add({
                                id: i.id,
                                phone: i.phone,
                                amount: i.amount,
                                time: tt,
                                message: "Success! Sent to your bank account"
                            })
                            window.location.reload();
                        }} className={`btn btn-${i.status === 'Success' ? 'success': 'danger'}`} disabled={i.status === 'Success'|| i.status === 'Rejected'}>{i.status}</button>}
                        {i.status === 'Pending' && reject !== index && <button className='btn btn-danger mt-1' onClick={()=> setReject(index)}>Reject</button>}
                        {reject === index && 
                            <input type='text' value={rejectMessage} className="form-control m-3" onChange={(e)=> setRejectMessage(e.target.value)} placeholder='Enter Reason for Rejection'/>
                        }
                        {reject === index && <button className='btn btn-danger mt-1' onClick={async()=> {
                            await withdrawDb.doc(i.id).get().then(async (query)=> {
                                await query.ref.update({
                                    status:'Rejected',
                                    message: rejectMessage
                                })
                            })
                            console.log("phone", i.phone)
                            await userDb.where('phone', '==', i.phone).get().then(async (query)=> {
                                var docRef=query.docs[0].ref;
                                const data = query.docs[0].data();
                                await docRef.update({
                                    balance: data.balance + parseFloat(i.amount)
                                })
                            })
                            window.location.reload();
                        }}>Submit</button>}
                    </div>
                </div>
            ))}
            {withdrawData.map((i, index) =>(
                withStatus !== 'Pending' && i.status !== 'Pending' && <div key={index} className="d-flex flex-row align-items-center justify-content-around mt-5">
                    <div className="d-flex flex-column">
                        <span className="fw-bold">Account No. - </span> {i.bank_details.account_number}
                        <span className="fw-bold">Account Holder - </span> {i.bank_details.account_holder}
                        <span className="fw-bold">IFSC - </span> {i.bank_details.ifsc_code}
                        {i.bank_details.upi !== undefined && i.bank_details.upi !== '' && <><span className="fw-bold">UPI -</span> {i.bank_details.upi}</>}
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        {i.phone}
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        {parseFloat(i.amount)*0.9}
                    </div>
                    <div className='align-items-center justify-content-center d-flex flex-column'>
                        {reject !== index && <button onClick={async()=> {
                            await withdrawDb.doc(i.id).get().then(async(query)=> {
                                await query.ref.update({
                                    status: 'Success'
                                })
                            })
                            var today = new Date();
                            var tt = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
                            await transactionDb.add({
                                id: i.id,
                                phone: i.phone,
                                amount: i.amount,
                                time: tt,
                                message: "Success! Sent to your bank account"
                            })
                            window.location.reload();
                        }} className={`btn btn-${i.status === 'Success' ? 'success': 'danger'}`} disabled={i.status === 'Success'|| i.status === 'Rejected'}>{i.status}</button>}
                        {i.status === 'Pending' && reject !== index && <button className='btn btn-danger mt-1' onClick={()=> setReject(index)}>Reject</button>}
                        {reject === index && 
                            <input type='text' value={rejectMessage} className="form-control m-3" onChange={(e)=> setRejectMessage(e.target.value)} placeholder='Enter Reason for Rejection'/>
                        }
                        {reject === index && <button className='btn btn-danger mt-1' onClick={async()=> {
                            await withdrawDb.doc(i.id).get().then(async (query)=> {
                                await query.ref.update({
                                    status:'Rejected',
                                    message: rejectMessage
                                })
                            })
                            console.log("phone", i.phone)
                            await userDb.where('phone', '==', i.phone).get().then(async (query)=> {
                                var docRef=query.docs[0].ref;
                                const data = query.docs[0].data();
                                await docRef.update({
                                    balance: data.balance + parseFloat(i.amount)
                                })
                            })
                            window.location.reload();
                        }}>Submit</button>}
                    </div>
                </div>
            ))}
        </div>
        <div className='m-5 d-flex flex-column'>
            <div className='d-flex align-items-center justify-content-center'>
                <h3>Recharge Requests</h3>
            </div>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">UPI ID</th>
                <th scope="col">Amount</th>
                <th scope="col">Phone</th>
                <th scope="col">Transaction ID</th>
                <th scope="col">Action Center / Status</th>
                </tr>
            </thead>
            <tbody>
            {rechargeRequest.map((i, index)=> (
                <tr key={index}>
                    <th scope='row'>{i.id}</th>
                    <td>{i.UPI}</td>
                    <td>{i.amount}</td>
                    <td>{i.phone}</td>
                    <td>{i.transaction_id}</td>
                    {i.status === 'pending' ? <td>
                        <button className='btn btn-success ms-2' onClick={async()=> {
                            await rechargeDb.doc(i.id).get().then(async (query)=> {
                                const data = query.data();
                                await query.ref.update({
                                    status: 'Success'
                                })
                                const phone = data.phone;
                                const amount = data.amount;
                                await userDb.where('phone', '==', phone).get().then(async (query1)=> {
                                    const data = query1.docs[0].data();
                                    console.log(data.balance, amount);
                                    await query1.docs[0].ref.update({
                                        balance: data.balance + amount,
                                    })
                                    var today = new Date();
                                    var tt = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
                                    await transactionDb.add({
                                        id: query1.docs[0].id,
                                        phone: phone,
                                        amount: amount,
                                        time: tt,
                                        message: 'Success!, Credited to account',
                                        type: 'recharge'
                                    })
                                })
                            })
                            window.location.reload();
                        }}>Approve</button>
                        <button className='btn btn-danger ms-2' onClick={async()=> {
                            await rechargeDb.doc(i.id).get().then(async (query)=> {
                                await query.ref.update({
                                    'status': 'Rejected'
                                })
                                window.location.reload();
                            })
                        }}>Reject</button>
                    </td> : 
                    <td style={{color: i.status === 'Rejected' ? 'red' : 'green', fontWeight: 'bold'}}>
                        {i.status}
                    </td>}
                </tr>
            ))}
            </tbody>
            </table>
        </div>
        {/* <button className="btn btn-primary" onClick={setDatas}>Send data</button> */}
        
    </div>
  )
}

export default AdminPortal
