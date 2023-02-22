import logo from './logo.svg';
import './App.css';
import Streetview from 'react-google-streetview';
import GoogleStreetview from './Streetview-alex.js';


// Append the 'script' element to 'head'

function requestCoords() {
  fetch('/random_ll', {
    method: 'POST',
    body: JSON.stringify({
      title: 'bruh',
      body: 'katia',
    }),
  })
}

function App() {
  const apiKey = "";
  const streetViewPanoramaOptions = {
    position: { lat: 49.2606, lng: 123.2460 },
    radius: 50,
    pov: {heading: 100, pitch: 1},
    zoom: 1,
    linksControl: false,
    fullscreenControl: false,
    addressControl: false,
    clickToGo: false
  }
  return (
    <div className="App">
      <header>
        Don't Give Jack Bars
      </header>
      <button className="bigbutton" onClick={requestCoords}></button>
      <div id="map">
        DOn't Give Jack Bars
      </div>
      <div className="panorama" id="pano">
          <GoogleStreetview apiKey={apiKey} streetViewPanoramaOptions = {streetViewPanoramaOptions}>
          
          </GoogleStreetview>
      </div>
    </div>
  );
}

export default App;
