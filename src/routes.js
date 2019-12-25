import React from "react";
import { Switch, Route } from "react-router-dom";

//components
import Main from "./components/Main";
import Post from "./components/Post";
import AddPost from "./components/AddPost";

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/create" component={AddPost} />
        <Route exact path="/item/:id" component={Post} />
    </Switch>
)


export default Routes;