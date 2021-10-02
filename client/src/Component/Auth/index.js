import {default as axios} from "axios";
import React, { useEffect } from "react";
import "./index.css";

function Auth() {
  useEffect(()=>{
    fetch()
  },[])

  const fetch = async() =>{
    const {status} = await axios.post(`${process.env.REACT_APP_SERVER_API}/auth/verify`,{},{
      withCredentials:true,   
    })
    console.log(status)
    if(status===200){
      window.location.href='/'
    }
  }

  const auth = async() =>{
    await axios.post(`${process.env.REACT_APP_SERVER_API}/auth/`,{},{
        withCredentials:true,
    })

    window.location.href='/'
  }

  return (
    <div className="container">
    <div className="row">
      <div className="col text-center">
        <button className="btn btn-primary" onClick={auth}>Authenticate</button>
      </div>
    </div>
  </div>
  );
}

export default Auth;
