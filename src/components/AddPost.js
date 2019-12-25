import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { postsService } from "../services/PostService";

const AddPost = () => {

    const [title, setTitle] = useState(null);
    const [content, setContent] = useState(null);
    const [cover, setCover] = useState(null);

    const [isBusy, setIsBusy] = useState(false);
    const [routeRedirect, setRedirect] = useState(false);   

    const addPost = (e) => {
        e.preventDefault();
        setIsBusy(true);

        let post = {
            title,
            content,
            cover: cover[0]
        }
        
        postsService.createPost(post)
        .then(res => {
            console.log(res);
            setIsBusy(false);
            setRedirect(true);
        })
        .catch(err => {
            console.log(err);
            setIsBusy(false);
        })

    }


    const redirect = routeRedirect;
    if(redirect){
        return <Redirect to="/" />
    }


    let createForm;
    if(isBusy){
        createForm = (
            <div className="loaderContainer">
                <p>Request is being processed</p>
                <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div> 

        )
    }else{
        createForm = (
           <form onSubmit={addPost}>
               <p>Create the new post</p>

                <label htmlFor="title">Post title:</label>
                <input type="text" name="title" id="title" required onChange={(e) => setTitle(e.target.value)} />

                <label htmlFor="content">Post content: </label>
                <textarea name="content" id="content" required minLength="100" onChange={(e) => setContent(e.target.value)} ></textarea>


                <label htmlFor="cover" className="cover">Cover</label>
                <input type="file" id="cover" required onChange={(e) => setCover(e.target.files)} />

                <input type="submit" value="create post" />
           </form>
       ) 
    }


    return(
        <React.Fragment>
            {createForm}
        </React.Fragment>

    )
}

export default AddPost;

