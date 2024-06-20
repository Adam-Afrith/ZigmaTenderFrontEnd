import React, { useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle';
import Select from "react-select";
import CallReportTable from './CallReportTable';
import axios from 'axios';
import { useBaseUrl } from '../../hooks/useBaseUrl';

const inputState = {
    from : '',
    to : '',
    country : '',
    state : '',
    district : '',
    customername : '',
    executivename : ''
}

const CallReport = () => {
    usePageTitle("Call Reports");
    const {server1 : baseUrl} = useBaseUrl();

    const [input, setInput] = useState(inputState);

    const [customerName, setCustomerName] = useState([]);
    const [executiveName, setExecutiveName] = useState([]);
    const [countryName, setCountryName] = useState([]);
    const [stateName, setStateName] = useState([]);
    const [districtName, setDistrictName] = useState([]);

    const [change, setChange] = useState([]);   


    useEffect(()=> {

        let data = {
            tokenid : localStorage.getItem('token')
          }
        axios.post(`${baseUrl}/api/customerOptions`,data).then((res)=> {           
           setCustomerName(res.data.customerList);
        })                         
         axios.post(`${baseUrl}/api/country/list`,data).then((res)=> {            
            setCountryName(res.data.countryList);
         }) 
         axios.post(`${baseUrl}/api/bdmlist`,data).then((res)=> {            
            setExecutiveName(res.data.bdmlist);
         })           
    },[]);

    useEffect(()=> {
        let data = {
            tokenid : localStorage.getItem('token')
          }
        if (input.country?.value || input.country !==  null) {
            axios.post(`${baseUrl}/api/state/list/${input.country?.value}`,data).then((res)=> {         // Example***{id} - 105***            
                setStateName(res.data.stateList);
            })            
            console.log('success');
        }
        else {
            setStateName([]);           
            setInput({...input, state: null, district: null});
            console.log('fail', input.state);
        }              

        setInput({...input, state: null, district: null});
    },[input.country?.value])

    useEffect(()=> {
        let data = {
            tokenid : localStorage.getItem('token')
          }
        if ((input.country?.value && input.state?.value) || (input.state !== null)) {
            axios.post(`${baseUrl}/api/district/list/${input.country?.value}/${input.state?.value}`,data).then((res)=> {     // Example***{countryid} - 105 & {stateid} - 31 ***            
                setDistrictName(res.data.districtList);
            })
        }
        else {
            setInput({...input, district: null});
            setDistrictName([]);
        }
        setInput({...input, district: null});
    },[input.country?.value && input.state?.value])


    const inputHandlerForSelect = (value, action) => {
        // console.log("Value", value);
        // console.log("Action", action);

        setInput({
            ...input,
            [action.name]: value,
        });                 
     }  
     
     const inputHandlerForInput = (e) => {
        setInput({...input, [e.target.name]: e.target.value});       
     }


     const handleSubmit = (e) => {
        e.preventDefault();       
        
        let data = {
            from_date: input.from,
            to_date: input.to,
            customer_id: input.customername?.value,
            country_id: input.country?.value ?? '',
            state_id: input.state?.value ?? '',
            district_id: input.district?.value ?? '',
            executive_id: input.executivename?.value ?? '',
        };         
        setChange(data);                 
     }   
     console.log('change',change);
    //  const postData = (data) => {
    //     axios.post(`${baseUrl}/api/getdaywisereport/list`,data).then((res)=> {
    //         if(res.status === 200) {
    //             console.log('res.data',res.data);
    //         }
    //     })
    //  }

    console.log('input', input);
    return (
        <>
            <div className='callReport'>
                <p className='mb-3'>List Day Report</p>
                <div className='section-1'>
                    <div className='card shadow mb-3'>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit}>
                                <div className='row layer-1'>
                                    <div className='col-lg-3'>
                                        <div className='form-group'>
                                            <label htmlFor='from'>From</label>
                                            <input id='from' className='form-control' type='date' name='from' value={input.from} onChange={(e)=>inputHandlerForInput(e)} />
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className='form-group'>
                                            <label htmlFor='to'>To</label>
                                            <input id='to' className='form-control' type='date' name='to' value={input.to} onChange={(e)=>inputHandlerForInput(e)} />
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className='form-group'>
                                            <label htmlFor='country'>Country</label>
                                            <Select
                                                name="country"
                                                id="country"
                                                isSearchable="true"
                                                isClearable="true"
                                                // isLoading={isFetching.customer}
                                                options={countryName}
                                                value={input.country}
                                                onChange={inputHandlerForSelect}
                                                // isDisabled={mode == 'nxtFlw' ? true : false}
                                            ></Select>
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className='form-group'>
                                            <label htmlFor='state'>State</label>
                                            <Select
                                                name="state"
                                                id="state"
                                                isSearchable="true"
                                                isClearable="true"
                                                // isLoading={isFetching.customer}
                                                options={stateName}
                                                value={input.state}
                                                onChange={inputHandlerForSelect}
                                                // isDisabled={mode == 'nxtFlw' ? true : false}
                                            ></Select>
                                        </div>
                                    </div>
                                </div>
                                <div className='row layer-2'>
                                    <div className='col-lg-3'>
                                        <div className='form-group'>
                                            <label htmlFor='district'>District</label>
                                            <Select
                                                name="district"
                                                id="district"
                                                isSearchable="true"
                                                isClearable="true"
                                                // isLoading={isFetching.customer}
                                                options={districtName}
                                                value={input.district}
                                                onChange={inputHandlerForSelect}
                                                // isDisabled={mode == 'nxtFlw' ? true : false}
                                            ></Select>
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className='form-group'>
                                            <label htmlFor='customername'>Customer Name</label>
                                            <Select
                                                name="customername"
                                                id="customername"
                                                isSearchable="true"
                                                isClearable="true"
                                                // isLoading={isFetching.customer}
                                                options={customerName}
                                                value={input.customername}
                                                onChange={inputHandlerForSelect}
                                                // isDisabled={mode == 'nxtFlw' ? true : false}
                                            ></Select>
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className='form-group'>
                                            <label htmlFor='executivename'>Executive Name</label>
                                            <Select
                                                name="executivename"
                                                id="executivename"
                                                isSearchable="true"
                                                isClearable="true"
                                                // isLoading={isFetching.customer}
                                                options={executiveName}
                                                value={input.executivename}
                                                onChange={inputHandlerForSelect}
                                                // isDisabled={mode == 'nxtFlw' ? true : false}
                                            ></Select>
                                        </div>
                                    </div>  
                                    <div className='col-lg-3'>
                                        <div className='srchBtn'>
                                            <button className='btn-tender-block mt-2' type='submit'>Search</button>
                                        </div>
                                    </div>                                  
                                </div>                                
                            </form>
                        </div>
                    </div>
                </div>

                <div className='section-2'>
                    <div className='card shadow mb-3'>
                        <div className='card-body'>
                            <CallReportTable change={change} input={input} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CallReport




{/* <div className='card-body'>
    <form>
        <div className='row layer-1'>
            <div className='col-lg-3'>
                <div className='form-group'>
                    <label htmlFor='from'>From</label>
                    <input id='from' className='form-control' type='date' />
                </div>
            </div>
            <div className='col-lg-3'>
                <div className='form-group'>
                    <label htmlFor='to'>To</label>
                    <input id='to' className='form-control' type='date' />
                </div>
            </div>
            <div className='col-lg-3'>
                <div className='form-group'>
                    <label htmlFor='state'>Country</label>
                    <Select
                        name="country"
                        id="country"
                        isSearchable="true"
                        isClearable="true"
                        // isLoading={isFetching.customer}
                        options={countryName}
                        value={input.country}
                        onChange={inputHandlerForSelect}
                        // isDisabled={mode == 'nxtFlw' ? true : false}
                    ></Select>
                </div>
            </div>
            <div className='col-lg-3'>
                <div className='form-group'>
                    <label htmlFor='state'>State</label>
                    <Select
                        name="state"
                        id="state"
                        isSearchable="true"
                        isClearable="true"
                        // isLoading={isFetching.customer}
                        options={stateName}
                        value={input.state}
                        onChange={inputHandlerForSelect}
                        // isDisabled={mode == 'nxtFlw' ? true : false}
                    ></Select>
                </div>
            </div>
        </div>
        <div className='row layer-2'>
            <div className='col-lg-3'>
                <div className='form-group'>
                    <label htmlFor='to'>District</label>
                    <Select
                        name="district"
                        id="district"
                        isSearchable="true"
                        isClearable="true"
                        // isLoading={isFetching.customer}
                        options={districtName}
                        value={input.district}
                        onChange={inputHandlerForSelect}
                        // isDisabled={mode == 'nxtFlw' ? true : false}
                    ></Select>
                </div>
            </div>
            <div className='col-lg-3'>
                <div className='form-group'>
                    <label htmlFor='to'>Customer Name</label>
                    <Select
                        name="customerName"
                        id="customerName"
                        isSearchable="true"
                        isClearable="true"
                        // isLoading={isFetching.customer}
                        options={customerName}
                        value={input.customername}
                        onChange={inputHandlerForSelect}
                        // isDisabled={mode == 'nxtFlw' ? true : false}
                    ></Select>
                </div>
            </div>
            <div className='col-lg-3'>
                <div className='form-group'>
                    <label htmlFor='executiveName'>Executive Name</label>
                    <Select
                        name="executiveName"
                        id="executiveName"
                        isSearchable="true"
                        isClearable="true"
                        // isLoading={isFetching.customer}
                        options={executiveName}
                        value={input.executivename}
                        onChange={inputHandlerForSelect}
                        // isDisabled={mode == 'nxtFlw' ? true : false}
                    ></Select>
                </div>
            </div>  
            <div className='col-lg-3'>
                <div className='srchBtn'>
                    <button className='btn-tender'>Search</button>
                </div>
            </div>                                  
        </div>
        
    </form>
</div> */}





{/* <div className='card-body'>
    <form>
        <div className="row align-items-center">
            <div className="inputgroup col-lg-5 mb-4">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                        <label htmlFor="From" className="font-weight-bold"> From<span className="text-danger">&nbsp;*</span> </label>
                    </div>
                    <div className="col-lg-8">
                        <input type='date' className='form-control' />                                           
                    </div>
                </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                        <label htmlFor="to" className="font-weight-bold">
                            To<span className="text-danger">&nbsp;*</span>
                        </label>
                    </div>
                    <div className="col-lg-8">
                        <input type='date' id='to' className='form-control' />                                                 
                    </div>
                </div>
            </div>

            <div className="inputgroup col-lg-5 mb-4">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                        <label htmlFor="state" className="font-weight-bold">
                            State<span className="text-danger">&nbsp;*</span>
                        </label>
                    </div>
                    <div className="col-lg-8">
                        <Select
                            name="state"
                            id="state"
                            isSearchable="true"
                            isClearable="true"
                            // options={tenderTypeList}
                            // value={input.tenderType}
                            // onChange={inputHandlerForSelect}
                        ></Select>                                              
                    </div>
                </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                        <label htmlFor="district" className="font-weight-bold">
                            District<span className="text-danger">&nbsp;*</span>
                        </label>
                    </div>
                    <div className="col-lg-8">
                        <Select
                            name="district"
                            id="district"
                            isSearchable="true"
                            isClearable="true"
                            // options={tenderTypeList}
                            // value={input.tenderType}
                            // onChange={inputHandlerForSelect}
                        ></Select>                                              
                    </div>
                </div>
            </div>


            <div className="inputgroup col-lg-5 mb-4">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                        <label htmlFor="customerName" className="font-weight-bold">
                            Customer Name<span className="text-danger">&nbsp;*</span>
                        </label>
                    </div>
                    <div className="col-lg-8">
                        <Select
                            name="tenderType"
                            id="customerName"
                            isSearchable="true"
                            isClearable="true"
                            // options={tenderTypeList}
                            // value={input.tenderType}
                            // onChange={inputHandlerForSelect}
                        ></Select>                                              
                    </div>
                </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-dark font-weight-bold">
                        <label htmlFor="executiveName">
                            Executive Name<span className="text-danger">&nbsp;*</span>
                        </label>
                    </div>
                    <div className="col-lg-8">
                        <Select
                            name="executiveName"
                            id="executiveName"
                            isSearchable="true"
                            isClearable="true"
                            // options={tenderTypeList}
                            // value={input.tenderType}
                            // onChange={inputHandlerForSelect}
                        ></Select>                                               
                    </div>
                </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"></div>
            <div className="inputgroup col-lg-6 mb-4"></div>
            <div className="inputgroup col-lg-12 mb-4 ml-3">
                <div className="row align-items-center">
                    <div className="col-lg-10 text-right ">
                        <button className="btn btn-primary">Search</button>
                    </div>                                            
                </div>
            </div>
        </div>
    </form>
</div> */}