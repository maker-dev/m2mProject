import React, { useEffect, useRef } from 'react'

function Arrow() {
    const arrowRef = useRef();
    const eventHandler = () => {
        if (window.scrollY < 400) {
            arrowRef.current.className = ""; 
        } else {
            arrowRef.current.className = "Arrow-active";
        }
    }
    useEffect(() => {
        window.addEventListener("scroll",eventHandler);
        return () => {
            window.removeEventListener("scroll", eventHandler);
        }
    }, [])
    const scrolltoTop = () => {
        window.scrollTo(0, 0)
    }
    
    return (
        <div id="Arrow-up" ref={arrowRef} onClick={scrolltoTop}><i className="fa-solid fa-arrow-up"></i></div>
    )
}

export default Arrow;