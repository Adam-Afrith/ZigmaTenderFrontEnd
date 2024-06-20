import { Fragment } from "react"
import { Link } from "react-router-dom"
import { usePageTitle } from "../hooks/usePageTitle"

const Unauthorized = () => {
    usePageTitle('')
    let errMag = "Access Denied";
    return (
        <Fragment>
            <div className="text-center unauthstyle">
                <div className="error" data-text="Access Denied" style={{ whiteSpace: 'nowrap' }}>Access Denied</div>
                <p className="lead text-gray-800 mb-5">You are Not Authorized to Access this Page</p>
                <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
                {/* <a href="index.html"></a> */}
                <Link to={'/tender'}>← Back to Dashboard </Link>
            </div>


        </Fragment>
    )
}

export default Unauthorized;