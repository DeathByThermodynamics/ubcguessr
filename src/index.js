import React from "react";
import { render } from "react-dom";
import { LoadScript } from "@react-google-maps/api";
import Map from "./maps";
import {createRoot} from 'react-dom/client';

const lib = ["places"];
const key = "AIzaSyBhOyFA-NSQ3GC32Ml_BDz_VHFJcYohFE0"; // PUT GMAP API KEY HERE




class App extends React.Component {
  render() {
    return (
      <div>
        
       

        <Map />

          
      </div>
      
    );
  }
}

const root = createRoot(document.getElementById("root"));

root.render(<App></App>)