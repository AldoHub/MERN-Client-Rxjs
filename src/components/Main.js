import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { postsService } from "../services/PostService";
import { map } from "rxjs/operators";
import uuid from "uuid";

const Main = () => {

    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState([]);

    let postsSubscription;

    useEffect(() => {
        /*
        window.addEventListener("load", () => {
            let postsContainer = document.querySelector(".posts");
            console.log(postsContainer);
            console.log(postsContainer.childNodes.length);
            if(postsContainer.childNodes.length == 0){
                localStorage.setItem("currentPage", localStorage.getItem("currentPage") - 1);
            }
        });
        */


    if(localStorage.getItem("currentPage")){
        let _posts = [];
        postsSubscription = postsService.posts$(localStorage.getItem("currentPage")).pipe(
            map( res => {
                if(res["data"].length == 0){
                    let c = localStorage.getItem("currentPage");
                    JSON.parse(c);
                    localStorage.removeItem("currentPage");

                    fetch("http://localhost:4000/api/" + (c - 1))
                    .then(response => response.json())
                    .then(posts => {
                        console.log(posts);
                        localStorage.setItem("currentPage", (c - 1));
                        posts["data"].forEach(_post => {
                            _posts.push(_post);
                        });
                        setPosts(_posts);
                    })

                }else{
                    res["data"].forEach(_post => {
                        _posts.push(_post);
                        setPosts(_posts);
                    });
                }
                setTotalPages(Array(res["pages"]).fill("").map((x,i) => i + 1));
                return _posts;
            })
        ).subscribe();
      

    }else{
      let _posts = [];
      postsSubscription = postsService.posts$().pipe(
       map(res => {
         res["data"].forEach(_post => {
             _posts.push(_post);
         });
         setTotalPages(Array(res["pages"]).fill("").map((x,i)=> i + 1));
         return _posts;
       })
     ).subscribe(_posts => {
       setPosts(_posts);
     });
    }


        return () => {
            //console.log(postsSubscription)
            postsSubscription.unsubscribe();
        };
        
    }, []);



    const getNextPosts = (event, page) => {
        event.preventDefault();
        let _posts = [];
        postsSubscription = postsService.posts$(page).pipe(
            map(res => {
                res["data"].forEach(_post => {
                    _posts.push(_post);
                });
                setTotalPages(Array(res["pages"]).fill("").map((x,i)=> i + 1));
                return _posts;
              }) 
        ).subscribe(_posts => {
            setPosts(_posts);
            localStorage.setItem("currentPage", page);   
          }); 
    }

    let pagination;
    if(totalPages.length > 0){
        let pages = [];
        totalPages.forEach(page => {
            pages.push(<a className="page-link" href="#" onClick={(event) => getNextPosts(event, page)}>{page}</a>)
        });

        pagination = (
            <div>
                <ul className="pagination">
                    {pages.map(page => {
                        return (
                            <li className="page-item" key={uuid.v4()}>{page}</li>
                        )
                    })}
                </ul> 
            </div>

        )
    }



    return(
        <React.Fragment>
           <div className="banner"></div>
           <header>
                <h1>mern posts <br /> with rxjs</h1>
           </header>
           
           <section>
            <div className="posts">
            {posts.map( post => {
                return(
                    <div className="post" key={post._id}>
                        <Link to={"item/" + post._id}>
                            <div className="cover" style={{backgroundImage: "url(" + post.cover + ")" }}></div>
                        </Link>
                    </div>

                )
            })}
            </div>
            {pagination}
           </section>

        </React.Fragment>

    )
}

export default Main;

