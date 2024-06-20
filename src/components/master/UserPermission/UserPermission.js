import axios from "axios";
import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import Select from "react-select";
import AuthContext from "../../../storeAuth/auth-context";

const initialState = {
    usertype: "",
    menu: ""
}

const initialStateErr = {
    usertype: '',
    menu: ""
}

const UserPermission = () => {

    usePageTitle("User Permission");
    // const { id } = useParams();
    const navigate = useNavigate();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();
    const [dataSending, setDataSending] = useState(false);
    const [input, setInput] = useState(initialState);
    const [roleOptions, setRoleoptions] = useState([]);
    const [menuOptions, setMenuoptions] = useState([]);
    const [menuData, setMenuData] = useState([]);
    const [subMenuList, setSubMenuList] = useState([]);
    const [permissionMatrix, setPermissionMatrix] = useState({});
    const [roleHasPermissions, setRoleHasPermissions] = useState([]);
    const [untouchedMatrix, setUntouchedMatrix] = useState({});
    const [savedData, setSavedData] = useState([])
    const authcontext = useContext(AuthContext)


    const [inputValidation, setInputValidation] = useState(initialStateErr);

    useEffect(() => {
        let data = {
            tokenid : localStorage.getItem('token')
          }
        axios.post(`${baseUrl}/api/usertypeOptionsForPermission`,data).then((response) => {
            if (response.data.status === 200) {
                generateOptions(response.data.userType);
            }
        });
        if(id){
            getSavedData()
        }
    }, [])

    useEffect(() => {
        let data = {
            tokenid : localStorage.getItem('token')
          }
        axios.post(`${baseUrl}/api/menu/options`,data).then((response) => {
            if (response.status === 200) {
                // console.log(response.data)
                setMenuData(response.data.menuList)
                generateMenuOptions(response.data.menuList);
                generateInput(response.data.menuList)
            }
        });
    }, [])

    const getSavedData = () => {
        let data = {
            tokenid : localStorage.getItem('token')
          }
        axios.post(`${baseUrl}/api/permisions/${id}`,data).then((resp) => {
            if(resp.data.status === 200){
                let usertypeValue = {
                    value   : resp.data.roleName.id,
                    label   : resp.data.roleName.name
                } 
                setInput({...input, usertype : usertypeValue})

                setSavedData(resp.data.permissions)
            }
        })
    }


    useEffect(() => {
        if(Object.keys(untouchedMatrix).length > 0  && // check empty obj or not
        savedData.length > 0){
            savedData.forEach((record) => updatePermssionMatrix(record))
        }
    }, [untouchedMatrix, savedData])

    const updatePermssionMatrix = (record) => {

        const {submenu_modules_id, can_view, can_add, can_edit, can_delete} = record; 

        setPermissionMatrix((prev) => {
            return {
                ...prev,
                [submenu_modules_id] : {
                    view : can_view,
                    add : can_add,
                    edit : can_edit,
                    delete : can_delete,
                }
            }
        })
    }
    
    const generateInput = (menuList = []) => {
        let inputMatrix = {}
        menuList.forEach((item, index) => {
        
            inputMatrix = {
                ...inputMatrix,
                ...permissionsList(item.sub_menus)
            }
        })

        // console.log(inputMatrix)
        setUntouchedMatrix(inputMatrix)
        setPermissionMatrix(inputMatrix)
    }


    const permissionsList = (submenuList = []) => {
        let submenuMatrix = {}
   
        submenuList.forEach((item, index) => {

            submenuMatrix = {
                ...submenuMatrix,
                [item.id]: {
                    view    : 0,
                    add     : 0,
                    edit    : 0,
                    delete  : 0
                }
            }
        })

        return submenuMatrix
    }



    const inputHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });

        if (e.target.value === "") {
            setInputValidation((prev) => ({ ...prev, [e.target.name]: true }));
        } else {
            setInputValidation((prev) => ({ ...prev, [e.target.name]: false }));
        }
    }

    const inputHandlerForSelect = (value, action) => {

        setInput({
            ...input,
            [action.name]: value,
        });
        if (value === "" | value === null) {
            setInputValidation({ ...inputValidation, [action.name]: true });
        }
        else {
            setInputValidation({ ...inputValidation, [action.name]: false });
        }
    };

    const generateOptions = (list = []) => {
        let options = list.map((item, index) => ({
            value: item.id,
            label: item.name,
        }))

        setRoleoptions(options)
    }

    const generateMenuOptions = (list = []) => {
 
        let options = list.map((item, index) => ({
            value: item.id,
            label: item.aliasName,
        }))

        setMenuoptions(options)
    }

    const getSubMenu = (value) => {

        if(value === null){
            setSubMenuList([])
            return;
        }

        let Menu = menuData.find((x) => x.id === value.value)
        setSubMenuList(Menu.sub_menus)
    }


    const toggleStatus = (subMenuId, action) => {
       
        let newPermissionMatrix = {
            ...permissionMatrix,
            [subMenuId] : { 
                ...permissionMatrix[subMenuId],         
                [action] : +!permissionMatrix[subMenuId][action]
            }
        }

        setPermissionMatrix(newPermissionMatrix)
    }

    const toggleAll = (subMenuId, action) => {
       
        let newPermissionMatrix = {
            ...permissionMatrix,
            [subMenuId] : { 
                view    : action,
                add     : action,
                edit    : action,
                delete  : action
            }
        }

        setPermissionMatrix(newPermissionMatrix)
    }

    const resetMenu = (value) => {
        if(value === null){
            setInput((prev) => ({
                ...prev,
                menu : null
            }))

            setSubMenuList([])
        }
    }


    let formIsValid = false;

    if(input.usertype && input.menu){
        formIsValid = true;
    }

    const postData = (data) => {
        setDataSending(true)

        axios.post(`${baseUrl}/api/setpermission`, data).then((resp) => {
            if(resp.data.status === 200){
                Swal.fire({
                    icon: "success",
                    title: "Permissions",
                    text:  resp.data.message,
                    confirmButtonColor: "#5156ed",
                  });
                  authcontext.getpermissions();
                navigate(`/tender/master/userpermissions`);

            }else{
                Swal.fire({
                    icon: "error",
                    title: "User Creation",
                    text:  (resp.data.error || 'Unable to process'),
                    confirmButtonColor: "#5156ed",
                  })
            }
            setDataSending(false);
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "User Creation",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if(!formIsValid){
            return
        }
       

        let data = {
            usertype    : input.usertype.value,
            permission  : permissionMatrix,
            tokenid     : localStorage.getItem("token")
        }

        postData(data)

    }

    const cancelHandler = () => {
        navigate(`/tender/master/userpermissions`);
    }

    return (
        <Fragment>        
                <div className="card shadow mb-4 p-4">
                    <form>
                        <div className="row align-items-center">
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="usertype" className="font-weight-bold">User Type (Role)<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <Select
                                            name="usertype"
                                            id="usertype"
                                            isSearchable="true"
                                            isClearable="true"
                                            options={roleOptions}
                                            value={input.usertype}
                                            isDisabled={!!id}
                                            onChange={(value, action) => { inputHandlerForSelect(value, action); resetMenu(value) }}
                                        ></Select>
                                        {inputValidation.usertype && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Enter Valid Input..!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="menu" className="font-weight-bold">Menu(s)<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <Select
                                            name="menu"
                                            id="menu"
                                            isSearchable="true"
                                            isClearable="true"
                                            options={menuOptions}
                                            value={input.menu}
                                            isDisabled={!input.usertype || input.usertype===''}
                                            onChange={(value, action) => { inputHandlerForSelect(value, action); getSubMenu(value) }}
                                        ></Select>
                                        {inputValidation.menu && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Enter Valid Input..!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                

                {subMenuList.length > 0 && <div className="table-responsive-sm mt-3">
                    <table className="table table-hover  table-bordered text-center">
                        <thead>
                            <tr className="table-secondary text-dark">
                                <th scope="col">Sub Menu</th>
                                <th scope="col">All</th>
                                <th scope="col" >View</th>
                                <th scope="col">Add</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subMenuList.map((record, index) => {
                                return (
                                    <tr key={index} >
                                        <td className="align-middle text-primary font-weight-bold">{record.aliasName}</td>
                                        <td>
                                        {(permissionMatrix[record.id]?.view && 
                                          permissionMatrix[record.id]?.add  &&
                                          permissionMatrix[record.id]?.edit &&
                                          permissionMatrix[record.id]?.delete
                                        ) ? 
                                        <button className="btn btn-success btn-circle btn-lg"
                                        onClick={() => toggleAll(record.id, 0)}
                                        ><i className="fas fa-check"></i>
                                        </button>
                                        :
                                        <button className="btn btn-outline-danger btn-circle btn-lg"
                                        onClick={() => toggleAll(record.id, 1)}>
                                            <i className="fas fa-close"></i>
                                        </button>
                                        } 
                                       
                                        </td>
                                        <td>
                                            {(permissionMatrix[record.id]?.view) ?
                                            <button className="btn btn-success btn-circle btn-lg"
                                            onClick={() => toggleStatus(record.id, 'view')}
                                            >
                                                <i className="fas fa-check"></i>
                                            </button> 
                                            :
                                            <button className="btn btn-outline-danger btn-circle btn-lg"
                                            onClick={() => toggleStatus(record.id, 'view')}
                                            >
                                                <i className="fas fa-close"></i>
                                            </button>
                                            }
                                        </td>
                                        
                                        <td className="align-middle">
                                        {(permissionMatrix[record.id]?.add) ?
                                            <button className="btn btn-success btn-circle btn-lg"
                                            onClick={() => toggleStatus(record.id, 'add')}
                                            >
                                                <i className="fas fa-check"></i>
                                            </button> 
                                            :
                                            <button className="btn btn-outline-danger btn-circle btn-lg"
                                            onClick={() => toggleStatus(record.id, 'add')}
                                            >
                                                <i className="fas fa-close"></i>
                                            </button>
                                            }
                                        </td>
                                     
                                        <td className="align-middle">
                                            {(permissionMatrix[record.id]?.edit) ?
                                            <button className="btn btn-success btn-circle btn-lg"
                                            onClick={() => toggleStatus(record.id, 'edit')}
                                            >
                                                <i className="fas fa-check"></i>
                                            </button> 
                                            :
                                            <button className="btn btn-outline-danger btn-circle btn-lg"
                                            onClick={() => toggleStatus(record.id, 'edit')}
                                            >
                                                <i className="fas fa-close"></i>
                                            </button>
                                            }
                                        </td>
                                        <td className="align-middle">
                                            {(permissionMatrix[record.id]?.delete) ?
                                            <button className="btn btn-success btn-circle btn-lg"
                                            onClick={() => toggleStatus(record.id, 'delete')}
                                            >
                                                <i className="fas fa-check"></i>
                                            </button> 
                                            :
                                            <button className="btn btn-outline-danger btn-circle btn-lg"
                                            onClick={() => toggleStatus(record.id, 'delete')}
                                            >
                                                <i className="fas fa-close"></i>
                                            </button>
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>}

                <div className="col-lg-12 mt-3">
                    <div className="row align-items-center">
                        <div className="col-lg-12 text-center ">
                            <button
                                className="btn btn-primary mr-2"
                                disabled={!formIsValid}
                                onClick={submitHandler}
                            >
                                {dataSending && <span className="spinner-border spinner-border-sm mr-2"></span> }
                                {dataSending === true ? ((id) ? 'Updating...' :"Submitting....") : ((id) ? 'Update' :"Save" )}

                            </button>
                            <button className="btn btn-secondary" onClick={cancelHandler} disabled = {dataSending}>
                                Cancel
                            </button>
                        </div>
                        
                    </div>
                </div>    
            </div>        
        </Fragment>
    )
}

export default UserPermission