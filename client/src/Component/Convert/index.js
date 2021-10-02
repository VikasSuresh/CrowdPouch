import {default as axios} from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";


function Convert() {
  const socket = io(`${process.env.REACT_APP_SERVER_API}`,{
    withCredentials: true,
  });

  const [file, setFile] = useState('')
  const [downloads, setDownloads] = useState([])
  const [failed, setFailed] = useState(false)

  useEffect(()=>{
    fetch();
  },[])

  socket.on('videoDone',(data)=>{
    fetch();
  })

  const fetch = async ()=>{
    try {
      const {data:op,status} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/job`,{
        withCredentials:true
      })
  
      setDownloads(op.downloads)
    } catch (error) {
      if(error.message.indexOf('401')) window.location.href='/auth'
    }
   
  }

  const handleChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  }

  const uploadFile = async () => {
    const formData = new FormData();        
    formData.append('file', file);

    const {data} = await axios.post(`${process.env.REACT_APP_SERVER_API}/job`, formData,{withCredentials:true})
    
    if(data!=='No File Uploaded') {
      const {data:op} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/job`,{withCredentials:true});
      setDownloads(op.downloads)
    }else{
      setFailed(true)
    }
    
  }

  const down = async (id) => {
    window.location.href = `${process.env.REACT_APP_SERVER_API}/job/${id}`; 
  }

  return (
    <div className="container m-5 p-2 rounded mx-auto bg-light shadow">
    <div className="row m-1 p-4">
        <div className="col">
            <div className="p-1 h1 text-primary text-center mx-auto display-inline-block">
                <u>Converter</u>
            </div>
        </div>
    </div>
    <div className="row m-1 p-3">
        <div className="col col-11 mx-auto">
            <div className="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center">
                <div className="col">
                    <input id = "file" 
                    className={failed
                    ?"form-control form-control-lg border-0 add-todo-input bg-transparent rounded is-invalid" 
                    :"form-control form-control-lg border-0 add-todo-input bg-transparent rounded" }
                    type="file" onChange={handleChange}/>
                </div>
                <div className="col-auto px-0 mx-0 mr-2">
                    <button type="button" className="btn btn-primary" onClick={uploadFile}>Convert</button>
                </div>
            </div>
        </div>
    </div>
    <div className="p-2 mx-4 border-black-25 border-bottom"></div>
    <div className="row m-1 p-3 px-5 justify-content-end"></div>
    <div className="row mx-1 px-5 pb-3 w-80" >
        <div className="col mx-auto" id ="downloads">
              {
                downloads.map(download=>(
                  <div key={download._id} className="row px-3 align-items-center todo-item rounded">
                  <div className="col px-1 m-1 d-flex align-items-center">
                      <input type="text"
                      className="form-control form-control-lg border-0  bg-transparent rounded px-3" 
                      readOnly value={download.name}/>
                      <button className={download.status==='Completed'?'btn btn-success': 
                      download.status==='Errored' ?'btn btn-danger':'btn btn-warning'}
                      id ={download._id}
                      onClick={()=>down(download._id)}> <i className="bi bi-download"></i> </button>
                  </div>
                  </div>
                ))
              }
        </div>
    </div>
  </div>
  );
}

export default Convert;
