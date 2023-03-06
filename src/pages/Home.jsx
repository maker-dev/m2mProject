/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useAuthe } from '../global/Authe'
function Home() {
  const userConnect = useAuthe().userInfo.isVerified;
  const images = [
    "client-1.png",
    "client-2.png",
    "client-3.png",
    "client-4.png",
    "client-5.png",
    "client-6.png",
    "client-7.png",
    "client-8.png",
    "client-9.png",
    "client-10.png",
    "client-11.png",
    "client-12.png",
    "client-13.png",
    "client-14.png",
    "client-15.png",
    "client-16.png",
    "client-17.png",
    "client-18.png",
    "client-19.png",
    "client-20.png"
  ]
  return (
    <>
    <Navbar />
    {/* hero section */}
    <div id="hero" className="d-flex justify-content-center align-items-center">
      <img src='/assets/home/heroImage.png' alt='hero Image' className='heroImage' />
        <div className="title text-center container">
          <h1 className="text-white text-uppercase font-weight-bold">Work With Us</h1>
          <p className="text-white">
            We're on a mission to make working life simpler,
            <br />
            more pleasant 
            and more productive for everyone.
          </p>
            {!userConnect && <Link to={"/Register"}><button className="text-capitalize text-white">Get Started</button></Link> }
            {userConnect && <Link to={"/Apply"}><button className="text-capitalize text-white">Apply Now</button></Link> }
        </div>
    </div>
    {/* why us section */}
    <div id="why-us">
      <div className='center-vertical'>
        <div className='container'>
          <div className="row">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <div className='img-head'>
                <img src='/assets/home/aboutUs.png' alt='about us image' />
              </div>
            </div>
            <div className='col-12 col-lg-6'>
                <h2 className='text-head'>
                    Know More About Us
                </h2>
                <div className='break-small mb-2'></div>
                <p className='text-para'>
                  M2M is a Moroccan company offering expertise and professionalism in Surveillance, Reception, 
                  and Guarding services.
                </p>
                <div className="row">
                  <div className="col-12 col-md-4 mb-2 mb-md-0">
                    <div className="box">
                      <i className='fa fa-users mb-3'></i>
                      <h4 className='mb-0'>AGENTS</h4>
                      <p className='mb-0'>1200</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 mb-2 mb-md-0">
                    <div className="box">
                      <i className="fa-solid fa-handshake mb-3"></i>
                      <h4 className='mb-0'>CLIENTS</h4>
                      <p className='mb-0'>800</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 mb-2 mb-md-0">
                    <div className="box">
                      <i className="fa-solid fa-city mb-3"></i>
                      <h4 className='mb-0'>CITIES</h4>
                      <p className='mb-0'>11</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* our jobs section */}
    <div id="our-jobs">
      <div className="container">
        <h2 className='text-center fw-bold'>Our <span>Jobs</span></h2>
        <div className="row">
          <div className="col-12 col-md-6 col-lg-4 m-auto">
            <div className="card border-0 text-center mb-lg-0 mb-4">
              <div className="card-body shadow-sm">
              <img src='/assets/icons/security.svg' alt='security image' />
              <h3>Security</h3>
              <p>Security guards and surveillance agents are first impressions for two companies and professionalism is crucial.</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 m-auto">
            <div className="card border-0 text-center mb-lg-0  mb-4">
              <div className="card-body shadow-sm">
              <img src='/assets/icons/hostess.svg' alt='hostess image' />
              <h3>Hostess</h3>
              <p>Quality improved by hostesses and hosts, set apart by personalized selection, supervision, flexibility, responsiveness, proximity.</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 m-auto">
            <div className="card border-0 text-center">
              <div className="card-body shadow-sm">
              <img src='/assets/icons/dog-trainer.svg' alt='dog-trainer image' />
              <h3>Dog Trainer</h3>
              <p>We provide protection for property and people in a designated area, following employer instructions, utilizing dog handler skills.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* our clients section*/}
    <div id="our-clients">
      <div className="container">
        <h2 className="text-center fw-bold">Our <span>Clients</span></h2>
        <div className="row">
          {
            images.map((image, index) => {
              return (<div className="col-6 col-md-4 col-lg-3" key={index}>
                      <div className="client-logo">
                        <img src={"/assets/clients/" + image} alt='client image' className='img-fluid'/>
                      </div>
                    </div>)
            })
          }
        </div>
      </div>
    </div>
    <Footer />
    
    </>
  )
}

export default Home