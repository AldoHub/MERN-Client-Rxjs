import React, {useEffect, useState, useRef} from "react";
import { postsService } from "../services/PostService";
import { Redirect , withRouter } from "react-router-dom";
import { map } from "rxjs/operators";

const Post = (props) => {
    
    const [isBusy, setIsBusy] = useState(false);
    const [routeRedirect, setRedirect] = useState(false);   
    const [timer, setTimer] = useState(false);
    const [post, setPost] = useState("");
    const [editMode, setEditMode] = useState(false);
    
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const fileRef = useRef(null);

    useEffect(() => {
      
       

        setTimer(true);
        const postSubscription = postsService.post$(props.match.params.id)
        .pipe(
            map(res => {
                console.log(res["data"]);
                return res["data"];
            })
        )
        .subscribe(res =>{
            setPost(res);
        })

        setTimeout(() => setTimer(false), 1000);

        return () => {
            postSubscription.unsubscribe();
        }

    }, [props.match.params.id]);     


    const editModeToggle = () =>{
        setEditMode(!editMode);
    }

    const redirect = routeRedirect;
    if(redirect){
        return <Redirect to="/" />  
    }
 
    const updatePost = (e) => {
        e.preventDefault();
        setIsBusy(true);

        let postObject = {
            id: props.match.params.id,
            title: titleRef.current.value,
            content: contentRef.current.value,
            oldcover: post.cover,
            oldcovername: post.covername
        }

        postsService.updatePost(postObject, fileRef.current.files)
        .then(res => {
            setIsBusy(false);
            setEditMode(false);
            window.location.reload();
            console.log(res);
        })
        .catch(err => {
            setIsBusy(false);
            setEditMode(false);
            console.log(err);
        });

    }

    const deletePost = () => {
       postsService.deletePost(props.match.params.id)
       .then(res => {
           console.log(res);
           setRedirect(true);
       })
       .catch(err => {
           console.log(err);
       })
    }


    let editPanel;
    if(editMode){
        if(isBusy){
            editPanel = (
                <div className="processing">
                    <p>Request is being processed</p>
                    <div className="loader">Loading...</div>
                </div> 
            )
        }else{

            editPanel = (
                <div className="editPanel">
                    <button className="panelButton" onClick={editModeToggle}>Close Edit Panel</button>  

                    <form onSubmit={updatePost}>
                        <p>Edit the current post below</p>

                        <label htmlFor="title"> Post Title</label>
                        <input type="text" name="title" id="title" required ref={titleRef} defaultValue={post.title}  />

                        <label htmlFor="content">Post Content: </label>
                        <textarea name="content" required minLength="100"  ref={contentRef} defaultValue ={post.content}  ></textarea>

                        <label htmlFor="cover" className="cover">Cover</label>
                        <input type="file" ref={fileRef} />

                        <input type="submit" value="update post" />
                    </form>

                    <button className="delete" onClick={deletePost}> Delete Post </button>

                </div>
            )

        }
    }

    let currentPost;
    if(timer){
        currentPost = (
            <div className="loaderContainer">
                <p>Fetching the post, please wait</p>
                <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div> 
        )
    }else{
        currentPost = (
            <React.Fragment>

                <div className="postContainer">
                    <img src={post.cover} />
                    <div className="content">
                        <button className="edit" onClick={editModeToggle}>Edit Panel</button> 
                        <h2>{post.title}</h2>
                        <div>{post.content}</div>
                    </div>
                </div>

                {editPanel}

            </React.Fragment>
        )

    }


    return(
        <React.Fragment>
           {currentPost}
        </React.Fragment>
    );

}

export default withRouter(Post);

