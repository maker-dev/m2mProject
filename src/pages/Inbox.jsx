import React from 'react'
import Footer from '../components/Footer'
import InboxEmail from '../components/InboxEmail'
import Navbar from '../components/Navbar'
import { useAuthe } from '../global/Authe'

function Inbox() {
  const inbox = useAuthe().userInfo.user.inbox;
  return (
    <>
      <Navbar />
      <main id='inbox-section'>
        <div className="container">
            <h2 className='title'>My <span>Inbox</span></h2>
            {inbox?
              inbox.slice(0).reverse().map((email, index) => {
                return (
                <InboxEmail
                  key={index}
                  title={email.title}
                  createdAt={email.createdAt}
                  to={email.to}
                  msg={email.msg}
                  thanks={email.thanks}
                  from={email.from}
                  isPlaceholder={false}
                />
                )
              })
              :
              <InboxEmail 
              isPlaceholder={true}
              />
            }
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Inbox