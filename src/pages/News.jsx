import { getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import New from '../components/New'
import {newsColl} from '../config/config';
import {errAlt} from '../utilities/Alerts';

function News() {
    const [newsList, setNewslist] = useState({
        loading: true,
        data: []
    });

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        let getDocsByQuery = query(newsColl, orderBy("postDate", "desc"));
        getDocs(getDocsByQuery)
        .then(snapshot => {
            let news = [];
            snapshot.docs.forEach(doc => {
                news.push({id: doc.id, ...doc.data()})
            })
            return news;
        })
        .then(data => {
            setNewslist({
                loading: false,
                data
            })
        }).catch(() => {
            setNewslist({
                ...newsList,
                loading: false
            })
            errAlt("SomeThing Went Wrong");
        })
    }, [])

    return (
        <>
            <Navbar />
            <main id='news-section'>
                <div className="container"> 
                    <h2 className='title'>Company's <span>News</span></h2>
                    {
                        newsList.data.map((news) => {
                            return (
                                    <New 
                                    imageUrl={news.imageURL ? news.imageURL : "/assets/news/newsPlaceholder.jpg"}
                                    title={news.title}
                                    textParagraph={news.paragraph}
                                    poster={news.poster}
                                    postDate={news.postDate.toDate().toDateString()}
                                    isPlaceholder={false}
                                    key={news.id}
                                    />
                            )
                        })
                    }

                    {newsList.loading &&  <New isPlaceholder={true}/>}
                </div>
            </main>
            <Footer />
        </>
    )
}

export default News