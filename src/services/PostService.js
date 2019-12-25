import { Observable } from "rxjs";

const posts$ = (page) => {
  
    if(page != null){
        return Observable.create( observer => {
            fetch("http://localhost:4000/api/" + page)
            .then(response => response.json())
            .then(posts => {
                
                observer.next(posts);
                observer.complete();
            })
            .catch(err => observer.error(err));
        })
    }else{
        return Observable.create( observer => {
            fetch("http://localhost:4000/api/1")
            .then(response => response.json())
            .then( posts => {
                observer.next(posts);
                observer.complete();
            })
            .catch(err => observer.error(err));
        })
    }
  
    
}


const post$ = (postid) => {
    return Observable.create( observer => {
        fetch("http://localhost:4000/api/post/" + postid)
        .then(response => response.json())
        .then(post => {
            observer.next(post);
            observer.complete();
        })
        .catch(err => observer.error(err));
    })
}


const createPost = (post) => {
    const { title , content , cover} = post;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("cover", cover, cover["filename"]);

    const options = {
        method: "post",
        body: formData
    }

    return fetch("http://localhost:4000/api/create", options);
   
}

const updatePost = (post, newCover) => {
    const { title, content, id, oldcover, oldcovername } = post;
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("oldcover", oldcover);
    formData.append("oldcovername", oldcovername);

    const options = {
        method: "put",
        body: formData
    }

    if(newCover.length > 0 && newCover !== undefined) {
        formData.append("cover", newCover[0], newCover[0]["filename"]);
        return fetch("http://localhost:4000/api/update/" + id, options);
    }else{
        return fetch("http://localhost:4000/api/update/" + id, options);
    }

}

const deletePost = (postid) => {
   
    const formData = new FormData();
    formData.append("id", postid);

    const options = {
        method: "delete",
        body: formData
    }


    return fetch("http://localhost:4000/api/delete/" + postid, options);

}


export const postsService = {
    posts$,
    post$,
    createPost,
    updatePost,
    deletePost
}


