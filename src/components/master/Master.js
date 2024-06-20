import { Fragment } from "react";
import { Link } from "react-router-dom";

const Master = () => {
  return (
    <Fragment>
      <div className="d-sm-flex align-items-center justify-content-between">
        <h1 className="h3  text-gray-800">Master</h1>
        <Link className="text-primary text-decoration-none"><i className="fa fa-plus-circle mr-1"></i><b>Add New</b></Link>
      </div>

 

    </Fragment>
  );
};

export default Master;
