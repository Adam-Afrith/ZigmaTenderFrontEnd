import { Fragment } from "react"

const ModalCard = (props) => {
    return (
        <Fragment>
            <div
                className="modal fade"
                id={props.id}
                tabIndex={-1}
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className={`modal-dialog  ${(props.modalsize === 'large') ? 'modal-xl' : ''}`} role="document">
                    <div className="modal-content">
                        {props.children}
                    </div>
                </div>
            </div>
        </Fragment>

    )
}

export default ModalCard