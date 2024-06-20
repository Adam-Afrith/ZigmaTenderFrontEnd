import React, { useEffect, useState, useRef, } from "react";
import CreateExpenseCreationSubList from "./CreateExpenseCreationSubList";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useImageStoragePath } from "../../hooks/useImageStoragePath";
import { ImageConfig } from "../../hooks/Config";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
const initailState = {
  staff: "",
  entryDate: "",
  description: "",
  invoice: "",
};
const CreateExpenseCreation = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const { server1: baseUrl } = useBaseUrl();
  const [input, setInput] = useState(initailState);
  const [optionsForStaff, setOptionsForStaff] = useState([]);
  const [Bdm, setBdm] = useState([]);
  const [limit, setLimit] = useState('');
  const [table, setTable] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [pass, setPass] = useState(false);
  const [invc, setinvc] = useState();
  const [EditId, setEditId] = useState();
  const [del, setDel] = useState(false);
  const [editCheck, setEditCheck] = useState(false);
  const [mainDisable, setmainDisable] = useState(false);
  const [img, setImg] = useState([]);
  const { expense: filePath } = useImageStoragePath();
  const [getlist, setList] = useState([]);
  const selectStaffName = localStorage.getItem('userName');
 
  
  useEffect(() => {

    // async function fetchData(id) {
    setEditCheck(false);
    const imgFile = [];
    /*********for staff drop dwon************ */
    axios.post(`${baseUrl}/api/expenses/staffList`).then((res) => {
      if (res.status === 200) {

        // generateOptions(res.data.get_staff);
        let op = res.data.get_staff
        let roles = op.map((role, index) => ({
          value: role.id,
          label: role.userName,
          user: role.userType,
          lmtstatus: role.isUnlimited,
          lmt: role.limit,
        }))

        setOptionsForStaff(roles)
      }
    });

    if (!id) {


      axios.post(`${baseUrl}/api/expenseinv`).then((res) => {
        if (res.status === 200) {


          setinvc(res.data.inv);
          setInput((prev) => {
            return {
              ...prev,
              invoice: res.data.inv,
            };
          });
        }
      })
    }
  }, []);


  /******************get sublist while update*************************************** */
  useEffect(() => {
    setInput((prev) => {
      const selectedStaff = optionsForStaff.find((x) => x.label === selectStaffName);

      return {
        ...prev,
        entryDate: getCurrentDate(),
        staff: selectedStaff && selectedStaff ? selectedStaff : null,
      };
    });

    const userValues = optionsForStaff
      .filter((option) => option.label === selectStaffName)
      .map((option) => option.user);

   

    setBdm(userValues[0]);
    

    if (id && optionsForStaff.length > 0) {


      axios.get(`${baseUrl}/api/updatedl/` + id).then((res) => {
        if (res.status === 200) {
          let Updatedata = res.data.update_del;
          // setmainDisable(true);



          setInput((prev) => {
            return {
              ...prev,

              entryDate: Updatedata?.entry_date,
              description: Updatedata?.description,
              staff: optionsForStaff.find((x) => x.value === Updatedata.executive_id),
              invoice: Updatedata?.expense_no,
            };
          });

          setinvc(Updatedata.expense_no);
          getSubdata(Updatedata.expense_no);
        }


      });

      // fetchData();


    }
    /*********************get expenseive invoice************************* */
    else {

      axios.post(`${baseUrl}/api/expenseinv`).then((res) => {
        if (res.status === 200) {
          setinvc(res.data.inv);
          setInput((prev) => {
            return {
              ...prev,
              invoice: res.data.inv,
            };
          });
        }
      });
    }



    // }


  }, [optionsForStaff]);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  const generateOptions = (usertype = []) => {
    let roles = usertype.map((role, index) => ({
      value: role.id,
      label: role.userName,
    }))

    setOptionsForStaff(roles)
  }

  const formSubmit = () => {
    let data = {
      invc: invc,
      description: input.description,
      entryDate: input.entryDate,
      staffName: input.staff.value,
    };

    axios.post(`${baseUrl}/api/finalSubmit`, data).then((res) => {
      if (res.data.status === 200) {


        Swal.fire({
          icon: "success",
          title: "New Expense",
          text: 'Added Successfully!!',
          confirmButtonColor: "#5156ed",
        })

        navigate(`/tender/expenses/otherExpense`)



      } else if (res.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "New SubExpense",
          text: 'Something Went Worng',
          confirmButtonColor: "#5156ed",
        });
      }


      // Swal.fire({
      //   icon: "success",
      //   title: "Added",
      //   text: "Added Successfully!",
      //   confirmButtonColor: "#5156ed",
      // });
      // navigate(`/tender/expenses/otherExpense`);

    });
  }
  const formCancel = () => {


    navigate(`/tender/expenses/otherExpense`);

  }
  const getSubdata = async (inv_no) => {

    let data = {
      invc: inv_no,
    };
    let response = await axios.post(`${baseUrl}/api/expensesub`, data)
    let listarr = generatepopArray(response);


  }

  const inputHandlerForSelect = (value, action) => {

    setBdm(value.user);
    if (value.lmtstatus === 0) {
      setLimit(value.lmt)
    }

    setInput({ ...input, [action.name]: value });
  };


  const inputHandlerForText = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };


  const handleEdit = (id) => {

    setEditId(id);
  };




  const handleDel = (id) => {

    setDel(true);
    axios.get(`${baseUrl}/api/otherexpensesubdel/${id}`)
      .then((res) => {
        if (res.data.status === 200) {

          getSubdata(input.invoice);

        }
        else if (res.data.status === 300) {
          navigate(`/tender/expenses/otherExpense`)
        }
        else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "New SubExpense",
            text: 'data Cant delete',
            confirmButtonColor: "#e30e32",
          });
        }
      });
  };

  const editData = {
    expenseType: { value: currentRow.etid, label: currentRow.expenseType },
    amount: currentRow.amount,
    description: currentRow.description_sub,
    document: currentRow.document,
  };

  let incre = 1;

  /********************************************/
  let details = '';
  const generatepopArray = async (res) => {

    let status = res.data.status;

    if (status == 400) {
      setmainDisable(false);

      //  setList(`<tr key={"0"}>
      //  <td>{"No data available in table"}</td>
      //  </tr>`);
      // setList([]);
    }
    else {

      let list = [...res.data.sublist];

      if (list.length !== 0) {
        setmainDisable(true);
        const details = list.map((item, index) => {
          var inc = index + 1;

          return (
            <tr key={index}>
              <td>{inc}</td>
              <td>{item.expenseType}</td>
              <td>{item.amount}</td>
              <td>{item.description_sub}</td>
              <td>
                {item.hasfilename ? (
                  <img
                    src={
                      item.filetype.split('/')[0] === 'image'
                        ? filePath + item.hasfilename
                        : item.filetype.split('/')[1] === 'octet-stream' &&
                          item.originalfilename.split('.').pop() === 'csv'
                          ? ImageConfig['csv']
                          : item.filetype.split('/')[1] === 'octet-stream' &&
                            item.originalfilename.split('.').pop() === 'rar'
                            ? ImageConfig['rar']
                            : item.filetype === 'text/plain' &&
                              item.originalfilename.split('.').pop() === 'csv'
                              ? ImageConfig['csv']
                              : ImageConfig[item.originalfilename.split('.').pop()]
                    }
                    alt="Uploaded img"
                    width={50}
                    height={50}
                  />
                ) : (
                  <span>No image upload</span>
                )}


              </td>
              <td>

                <FiEdit
                  onClick={() => {
                    handleEdit(item.id);
                  }}
                  style={{ color: 'green', cursor: 'pointer' }}
                />
                <span style={{ margin: '0 10px' }}></span> {/* Add margin for spacing */}
                <RiDeleteBin5Fill
                  onClick={() => {
                    handleDel(item.id);
                  }}
                  style={{ color: 'red', cursor: 'pointer' }}
                />

              </td>
            </tr>
          );
        });

        setList(details);

      }
      else {
        setmainDisable(false);
      }
    }

  }

  /******************************************************* */
  return (
    <>
      <div className="OtherExpenseMain">
        <div className="container-fluid p-0">
          <div className="card shadow mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark font-weight-bold">
                      <label htmlFor="staff">Staff <span className="text-danger font-weight-bold">*</span></label>
                    </div>
                    <div className="col-lg-8">
                      <Select
                        name="staff"
                        id="staff"
                        isSearchable={true}
                        isClearable={true}
                        options={optionsForStaff}
                        value={input?.staff}
                        onChange={inputHandlerForSelect}
                        isDisabled={true}
                      />

                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark font-weight-bold">
                      <label htmlFor="e_date">Entry Date<span className="text-danger font-weight-bold">*</span></label>
                    </div>
                    <div className="col-lg-8">
                      <input
                        type="date"
                        name="entryDate"
                        value={input.entryDate || getCurrentDate()}
                        onChange={(e) => inputHandlerForText(e)}
                        className="form-control"

                        disabled={mainDisable}
                      />
                      <input
                        type="hidden"
                        name="invoice"
                        id="invoice"
                        value={invc}

                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="otherExpenseMainForm">
                <CreateExpenseCreationSubList
                  pass={pass}
                  setTable={setTable}
                  editData={editData}
                  currentRow={currentRow}
                  input={input}
                  img={img}
                  editCheck={editCheck}
                  setEditCheck={setEditCheck}
                  invc={invc}
                  getSubdata={getSubdata}
                  EditId={EditId}
                  setEditId={setEditId}
                  Bdm={Bdm}
                  getCurrentDate={getCurrentDate}
                />
              </div>
              <div className="row mt-3 px-2">
                <div className="table-responsive">
                  <table
                    className="table table-bordered text-center"
                    id="dataTable"
                    width="100%"
                    cellSpacing={0}
                  >
                    <thead className="text-center bg-greeny text-white">
                      <tr>
                        <th className="">Sl.No</th>
                        <th className="">Expense Type </th>
                        <th className="">Amount</th>
                        <th className="">Description</th>
                        <th className="">Document</th>
                        <th className="">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getlist.length > 0 ? getlist : <tr><td colSpan="6">No Data Found</td></tr>}

                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark font-weight-bold">
                      <label htmlFor="descrip">Description</label>
                    </div>
                    <div className="col-lg-8">
                      <textarea
                        type="textarea"
                        name="description"
                        col="40"
                        row="40"
                        className="form-control"
                        value={input?.description}
                        onChange={inputHandlerForText}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center align-content-between">
                <button className="btn btn-success mr-3" onClick={formSubmit}>Save</button>
                <button className="btn btn-secondary" onClick={formCancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateExpenseCreation;
