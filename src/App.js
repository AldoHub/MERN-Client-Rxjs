import React, {useEffect, useState} from 'react';
import { Link, withRouter } from "react-router-dom";
import Routes from "./routes";


const App = (props) =>   {
  
  
  const [path, setPath] = useState("");

  window.addEventListener("load", () => {
    console.log("window loaded");
    if(window.location.pathname === "/create"){
      setPath(window.location.pathname);
    }
  });
  
  const checkPath = () => {
    props.history.listen((location) => {
      setPath(location.pathname);
    })
  }

  useEffect(() => {
     checkPath(); 
  },[])

  const showAddItem = path; 
  let addItem;
  if(showAddItem !== "/create"){
    addItem = (<li id="additem"><Link to="/create">Add Item</Link></li>);
  }
  
  return (
    <div className="App">
    <nav>
      <ul>
        <li><Link to="/"> mernposts </Link></li>
      </ul>
      <ul>
        {addItem}
      </ul>
    </nav>
    
     <Routes/>
    </div>
  );
}

export default withRouter(App);
