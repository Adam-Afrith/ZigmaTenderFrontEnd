import { Fragment } from "react";

const CollapseCard = (props) => {
    return ( 
        <Fragment>
         {/* <!-- Collapsable Card --> */}
       
        <div className="card shadow mb-2">
            {/* <!-- Card Header - Accordion --> */}
            <a href={`#${props.id}`} className="d-block card-header py-3 collapsed bg-white" data-toggle="collapse"
                role="button" aria-expanded="false" aria-controls={props.id}>
                <h6 className="m-0 font-weight-bold text-dark text-uppercase">{props.title}</h6>
            </a>
            {/* <!-- Card Content - Collapse --> */}
            <div className="collapse " id={props.id} >
                <div className="card-body bg-light">
                  {props.children}
                </div>
            </div>
        </div>
        </Fragment>
    )
}

export default CollapseCard;