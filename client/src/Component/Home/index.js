import {default as axios} from "axios";
import React, { useEffect, useState } from "react";
import "./index.css";
import { Up, Down } from "../Arrow";
import Filter from "../Filter";

function urlParser(api,field,value){
  const urlSearchParams = new URLSearchParams(api);
  const params = Object.fromEntries(urlSearchParams.entries());
  if(params[field] && value==='')delete params[field]
  else params[field]=value.toString()
  return new URLSearchParams(params).toString().replace('%3A',':');
}

let api = ``

function Home() {
  const [data,setData] = useState({})
  const [filters,setFilters] = useState({})

  useEffect(()=>{
    fetch();
  },[])

  const fetch = async ()=>{
    try {
      const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}`,{
        withCredentials:true
      })

      setData(data)

    } catch (error) {
      if(error.message.indexOf('401')) window.location.href='/auth'
    }
  }

  const search = async ()=>{
    api = urlParser(api,'search',filters.search);
    const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/?${api}`,{
      withCredentials:true
    })
    setData(data)
  }

  const page = async (v)=>{
    api = urlParser(api,'page',v);
    const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/?${api}`,{
      withCredentials:true
    })
    setData(data)
  }

  const filter = async (url)=>{
    const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/?${url}`,{
      withCredentials:true
    })
    setData(data)
  }

  const sort = async (e)=>{
     api = urlParser(api,'sort',`${e.target.offsetParent.id}:${e.target.id}`);
    
    const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/?${api}`,{
      withCredentials:true
    })
    setData(data)
  }

  if(Object.keys(data).length === 0)return(<div>Loading</div>)
  
  return (
    <div className="container m-5 p-2 rounded mx-auto bg-light shadow">
      <Filter submit = {filter}/>
      <div className="row m-1 p-3">
          <div className="col col-11 mx-auto">
              <div className="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center">
                  <div className="col">
                      <input id = "url" 
                      onChange={(e)=>setFilters((state)=>({...state,search:e.target.value}))}
                      className="form-control form-control-lg border-0 add-todo-input bg-transparent rounded" 
                      type="text" 
                      placeholder="Search for City or State"/>
                  </div>
                  <div className="col-auto px-0 mx-0 mr-2">
                      <button type="button" className="btn btn-primary" onClick={search}>Search</button>
                  </div>
              </div>
          </div>
      </div>
      <div className="p-2 mx-4 border-black-25 border-bottom"></div>
      <div className="row m-1 p-3 px-5 justify-content-end"></div>
      <div className="row mx-1 px-5 pb-3 w-80" >
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th id="city">City
                <span className='sort'>
                  <button type='button'className='button' onClick={sort} ><Up/></button>
                  <button type='button'className='button' onClick={sort} ><Down/></button>
                </span>
               </th>
              <th id="pop">Population
              <span className='sort'>
                  <button type='button'className='button' onClick={sort} ><Up/></button>
                  <button type='button'className='button' onClick={sort} ><Down/></button>
                </span>
              </th>
              <th id="state">State
              <span className='sort'>
                  <button type='button'className='button' onClick={sort} ><Up/></button>
                  <button type='button'className='button' onClick={sort} ><Down/></button>
                </span>
              </th>
              <th id="lat">Lat
              {/* <span className='sort'>
                  <button type='button'className='button' onClick={sort} ><Up/></button>
                  <button type='button'className='button' onClick={sort} ><Down/></button>
                </span> */}
              </th>
              <th id="long">Long
                {/* <span className='sort'>
                  <button type='button'className='button' onClick={sort} ><Up/></button>
                  <button type='button'className='button' onClick={sort} ><Down/></button>
                </span> */}
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

export default Home;
