import { useSelector } from "react-redux";

function MessageToast() {
    const messages = useSelector((state) => state.message); 

    return(
        <div className="position-fixed top-0 end-0 p-3" style={{zIndex: '99999999'}}>
            {messages.map((message) => (
                <div
                key={message.id}
                className="toast show"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                >
                    <div className={`toast-header text-white bg-${message.type} opacity-75`}>
                        <strong className="me-auto">{message.title}</strong>
                        <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                        />
                    </div>
                    <div className="toast-body">{message.text}</div>
                </div>
            ))}
        </div>
    )
}

export default MessageToast;