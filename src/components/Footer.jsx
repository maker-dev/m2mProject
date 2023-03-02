import React from 'react'
import { Link } from 'react-router-dom';
import { useAuthe } from '../global/Authe';

function Footer() {
  const userConnect = useAuthe().userInfo.isVerified;
  return (

  <footer className="text-center text-lg-start">
    <section className="p-4 social-section">
      <div className='container'>
        <div className="row">
          <div className="col-lg-6 text-lg-left align-self-center">
            <div className="me-5 text-white">
            <span>Get connected with us on social networks:</span>
          </div>
          </div>
          <div className="col-lg-6 text-lg-right mt-2 mt-lg-0">
            <div className='socialNet'>
              <a target="_blank" href="https://www.linkedin.com/in/m2m-services-090665252/" rel="noreferrer">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a target="_blank" href="https://www.facebook.com/profile.php?id=100086380940764" rel="noreferrer" >
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a target="_blank" href="https://www.instagram.com/m2m_services/" rel="noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a target="_blank" href="https://www.youtube.com/@M2Mservices" rel="noreferrer">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      

    </section>

    <section className="main-section">
      <div className="container text-center text-md-start mt-5">
        <div className="row mt-3">
          <div className="col-lg-4 mb-4">
            <h6 className="text-uppercase fw-bold">M<span style={{color: "#a43d3d"}}>2</span>M SERVICES</h6>
            <hr className="mb-4 mt-0 d-inline-block mx-auto"/>
            <p>
              M2M is a Moroccan company offering expertise and professionalism in Surveillance, Reception, and Guarding services.
            </p>
          </div>

          <div className="col-lg-4 mb-4">
            <h6 className="text-uppercase fw-bold">Useful links</h6>
            <hr className="mb-4 mt-0 d-inline-block mx-auto"/>
            <p>
              <Link to={"/"}>Home</Link>
            </p>
            <p>
              <Link to={"/News"}>News</Link>
            </p>
            {
            !userConnect &&
            <p>
              <Link to={"/Signin"}>Sign in</Link>
            </p>
            }
      
            {
              userConnect &&
              <p>
                <Link to={"/Inbox"}>Inbox</Link>
              </p>
            }
          </div>

          <div className="col-lg-4  mb-md-0 mb-4">
            <h6 className="text-uppercase fw-bold">Contact</h6>
            <hr className="mb-4 mt-0 d-inline-block mx-auto"/>
            <p><i className="fas fa-home mr-1"></i>El jadida, 24000 ma</p>
            <p><i className="fas fa-envelope mr-1"></i>contact@m2mservices.ma</p>
            <p><i className="fas fa-phone mr-1"></i>+212 5233-87729</p>
          </div>
        </div>
      </div>
    </section>

    <div className="text-center p-3 last-section">
      © All Rights Reserved.
      <a className='ml-2' target="_blank" href="https://www.m2mservices.ma/" rel="noreferrer">
        M2M Services
    </a>
    </div>
  </footer>
    )
}


export default Footer;