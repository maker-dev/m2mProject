import React from 'react'

function New({imageUrl = "", title = "", textParagraph = "", poster = "", postDate = "", isPlaceholder}) {
    const isReadMore =  (paragraph) => {
        let words = paragraph.split(" ");
        let displayedText = words[0];
        for (let i = 1; i < words.length; i++) {
            if (displayedText.length + 1 + words[i].length < 200) {
                displayedText += ` ${words[i]}`;
            } else {
                break;
            }
        }
        
        if (displayedText.length < paragraph.length) {
            return {isReadMore: true, displayedText: displayedText, hiddenText: paragraph.substring(displayedText.length)}
        } else {
            return {isReadMore: false, displayedText: displayedText, hiddenText: ""}
        }
    }
    const toggleText = (e) => {
        const button = e.target;
        if (button.previousElementSibling.firstElementChild.className === "hidden") {
            button.textContent = "Read Less";
            button.previousElementSibling.firstElementChild.className = "";
        } else {
            button.textContent = "Read More";
            button.previousElementSibling.firstElementChild.className = "hidden";
        }
    }
    const results = isReadMore(textParagraph);

    return !isPlaceholder ?
    (
    <div className="new">
        <div className="row">
            <div className="col-12 col-md-6 col-lg-5">
                {/* eslint-disable jsx-a11y/img-redundant-alt */}
                <img src={imageUrl} className='new-image mb-3' alt='news Image' />
            </div>
            <div className="col-12 col-md-6 col-lg-7">
                <div className="new-content">
                    <div className="div">
                        <div className="new-header">
                            <h3>{title}</h3>
                            <hr/>
                        </div>
                        <div className="new-body">
                            {results.isReadMore && <p>{results.displayedText}<span className='hidden'>{results.hiddenText}</span></p>}
                            {!results.isReadMore && <p>{results.displayedText}</p>}
                            {results.isReadMore && <button className='btn btn-info' onClick={toggleText}>Read More</button>}                                
                        </div>
                    </div>
                    <div className="new-footer">
                        <h5>Posted By {poster}</h5>
                        <small className='text-muted'>Published on {postDate}</small>   
                    </div>
                </div>
            </div>
        </div>
    </div>
    ) :
    (
    <div className="new">
        <div className="row">
            <div className="col-12 col-md-6 col-lg-5">
                {/* eslint-disable jsx-a11y/img-redundant-alt */}
                <div className='skeleton skeleton-image'></div>
            </div>
            <div className="col-12 col-md-6 col-lg-7">
                <div className="new-content">
                    <div className="div">
                        <div className="new-header">
                            <div className='skeleton skeleton-title'></div>
                            <div className='skeleton skeleton-breakline'></div>
                        </div>
                        <div className="new-body">
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text"></div>
                        </div>
                    </div>
                    <div className="new-footer">
                        <div className='skeleton skeleton-poster'></div>
                        <div className='skeleton skeleton-date'></div>   
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default New