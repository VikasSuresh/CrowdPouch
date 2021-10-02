import {default as axios} from "axios";
import React, { useEffect, useState } from "react";
import "./index.css";


function MaxPop() {
  const [data,setData] = useState({})

  useEffect(()=>{
    fetch();
  },[])

  const fetch = async ()=>{
    try {
      const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/?sort=pop:desc`,{
        withCredentials:true
      })

      setData(data)
    } catch (error) {
      if(error.message.indexOf('401')) window.location.href='/auth'
    }
  }

  const page = async (v)=>{
    const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/?page=${v}&sort=pop:desc`,{
      withCredentials:true
    })
    setData(data)
  }


  if(Object.keys(data).length === 0)return(<div>Loading</div>)
  
  return (
    <div className="container m-5 p-2 rounded mx-auto bg-light shadow">
      <div className="row m-1 p-3 px-5 justify-content-end"></div>
      <div className="row mx-1 px-5 pb-3 w-80" >
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th id="city">City
               </th>
              <th id="pop">Population
              </th>
              <th id="state">State
              </th>
              <th id="lat">Lat
              </th>
              <th id="long">Long
              </th>
            </tr>
          </thead>
          <tbody>
          {data.data.map((d,i)=>(
              <tr key={i}>
              <td> {(i+1)+(data.pageInfo.page*data.pageInfo.count)}</td><td>{d.city}</td>
              <td>{d.pop}</td><td>{d.state}</td>
              <td>{d.loc[0]}</td><td>{d.loc[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <nav aria-label="Page navigation example" style={{ width: '20%', margin: '0 auto'}}>
          <ul className="pagination">
            <li className="page-item"><button className="page-link" type='button' 
            onClick={()=>page(data.pageInfo.page-1<0?0:data.pageInfo.page-1)}>
              Previous</button></li>
            <li className="page-item"><button className="page-link">{data.pageInfo.page+1}</button></li>
            <li className="page-item"><button className="page-link" type='button' 
            onClick={()=>page(data.pageInfo.page+1>=data.pageInfo.total?data.pageInfo.page:data.pageInfo.page+1)}>Next</button></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default MaxPop;
