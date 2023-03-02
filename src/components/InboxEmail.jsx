import React from 'react'

function InboxEmail({title="", createdAt="", to="", msg="", thanks="", from="", isPlaceholder}) {

    return !isPlaceholder ?
    (
        <div className='inbox-email'>
                <div className="row">
                    <div className="col-md-2">
                        <div className="image-container mb-4">
                            <i className="fa-solid fa-envelope email-image"></i>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="email">
                            <div className="header">
                                <h4 className='title mr-2 mb-0'>{title}</h4>
                                <small className='text-muted'>{createdAt}</small>
                            </div>
                            <div className="body">
                                <p className="to mt-2">Dear <span>{to}</span>,</p>
                                <p className='msg'>{msg}</p>
                            </div>
                            <div className="footer">
                                <h6 className='thanks mb-2'>{thanks},</h6>
                                <h6 className='from my-0'>{from}</h6>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    ) :
    (
    <div className='inbox-email'>
        <div className="row">
            <div className="col-md-2">
                <div className="image-container mb-3">
                    <div className='skeleton skeleton-smallImage'></div>
                </div>
            </div>
            <div className="col-md-10">
                <div className="email">
                    <div className="header">
                        <div className='skeleton skeleton-title mb-4'></div>
                    </div>
                    <div className="body">
                        <div className='skeleton skeleton-text'></div>
                        <div className='skeleton skeleton-text'></div>
                        <div className='skeleton skeleton-text'></div>
                        <div className='skeleton skeleton-text'></div>
                        <div className='skeleton skeleton-text'></div>
                    </div>
                    <div className="footer">
                        <div className='skeleton skeleton-poster mb-2'></div>
                        <div className='skeleton skeleton-poster'></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    ) 

}

export default InboxEmail;