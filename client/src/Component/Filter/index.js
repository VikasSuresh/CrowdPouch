import {default as axios} from "axios";
import React, { useEffect,useState } from "react";
import "./index.css"


function urlParser(api,field,value){
  const urlSearchParams = new URLSearchParams(api);
  const params = Object.fromEntries(urlSearchParams.entries());
  if(!value || value.length===0){delete params[field]}
  else params[field]=value.toString()
  return new URLSearchParams(params).toString();
}

function Filter(props) {
  let api = ``

  const [options,setOptions] = useState({
    cities:[],
    states:[],
    populations:[]
  })

  const [city,setCity] = useState(false);
  const [pop,setPop] = useState(false);
  const [state,setState] = useState(false);

  const [filters,setFilters] = useState({
    city:[],
    state:[],
    pop:[]
  });

  const fetch = async ()=>{
    try {
      const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/filter`,{
        withCredentials:true
      })

      setOptions(data)

    } catch (error) {
      if(error.message.indexOf('401')) window.location.href='/auth'
    }
  }

  useEffect(()=>{
    fetch();
  },[])

  const handleCity = async (e) =>{
    api = urlParser(api,'city',e.target.value);
    
    const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/filter/?${api}`,{
      withCredentials:true
    })
    setOptions(data)
  }

  const handleState = async (e) =>{
    api = urlParser(api,'state',e.target.value);
    const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/filter/?${api}`,{
      withCredentials:true
    })

    setOptions(data)
  }

  const handlePop = async (e) =>{
    api = urlParser(api,'pop',e.target.value);
    const {data} =  await axios.get(`${process.env.REACT_APP_SERVER_API}/filter/?${api}`,{
      withCredentials:true
    })

    setOptions(data)
  }

  const submit = async (e) =>{
    e.preventDefault()
    if(filters.city) api = api = urlParser(api,'city',filters.city);
    if(filters.state)api = api = urlParser(api,'state',filters.state);
    if(filters.pop)api = api = urlParser(api,'pop',filters.pop);
    
    props.submit(api.replaceAll('%2C',','))
  }

  const changeFilters = async (e,str) =>{
    if(filters[str].includes(e.target.value)) setFilters((state)=>({...state,[str]:state[str].filter(el=>el!==e.target.value)}))
    else{
      setFilters(state=>({...state,[str]:[...state[str],e.target.value]}))
    }    
  }
  
  return (
   <div style={{float:"right",paddingTop:'35px'}}>
    <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
      Filter
    </button>

    <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
      <div className="offcanvas-body">
        <form onSubmit={submit}>
        <div style={{paddingLeft:'40%'}}><button type="submit">Apply</button> </div>
        <div className="filter">
          <h6>City</h6>
          <div >
            <input className='form-control'  onChange={handleCity}  style={{width:'75%'}} type='text'/>
          </div>
          <div style={{paddingTop:"15px"}}>
          <div className="multiselect">
          <div className="selectBox" onClick={()=>setCity((state)=>!state)} >
            <select >
              <option>Select an option</option>
            </select>
            <div className="overSelect"></div>
          </div>
          <div id="city_check" className = "checkboxes" style={{display:city?"block":"none"}}>
            {
              options.cities.map((el)=>(
                 <label key={el._id} htmlFor="one"><input type="checkbox" 
                 onClick={(e)=>changeFilters(e,'city')} 
                 value={el._id} id="one" />{el._id}</label>
              ))
            }
          </div>
          </div>
          </div>
        </div>
        <div className="filter">
          <h6>State</h6>
          <div >
            <input className='form-control' onChange={handleState} style={{width:'75%'}} type='text'/>
          </div>
          <div style={{paddingTop:"15px"}}>
          <div className="multiselect">
          <div className="selectBox" onClick={()=>setState((state)=>!state)} >
            <select >
              <option>Select an option</option>
            </select>
            <div className="overSelect"></div>
          </div>
          <div id="state_check" className="checkboxes" style={{display:state?"block":"none"}}>
            {
              options.states.map((el)=>(
                 <label key={el._id} htmlFor="one"><input type="checkbox" 
                 onClick={(e)=>changeFilters(e,'state')} 
                 value={el._id} id="one" />{el._id}</label>
              ))
            }
          </div>
        </div>
        </div>
        </div>
        <div className="filter">
          <h6>Population</h6>
          <div >
            <input className='form-control'  onChange={handlePop} style={{width:'75%'}} type='text'/>
          </div>
          <div style={{paddingTop:"15px"}}>
          <div className="multiselect">
          <div className="selectBox" onClick={()=>setPop((state)=>!state)} >
            <select >
              <option>Select an option</option>
            </select>
            <div className="overSelect"></div>
          </div>
          <div id="population_check" className="checkboxes" style={{display:pop?"block":"none"}}>
            {
              options.populations.map((el)=>(
                 <label key={el._id} htmlFor="one"><input type="checkbox" value={el._id} id="one" 
                 onClick={(e)=>changeFilters(e,'pop')} />{el._id}</label>
              ))
            }
          </div>
          </div>
          </div>
        </div>
      </form>
      </div>
    </div>
   </div>
  );
}

export default Filter;
