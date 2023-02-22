import React from "react";
import { GoogleMap, StreetViewPanorama, Marker } from "@react-google-maps/api";
import { StreetViewService } from '@react-google-maps/api';
import './index.css';
import './mainpage.css';
import { LoadScript } from "@react-google-maps/api";
import MainPage from "./mainpage";
import randomLatLng from "./generator.js"


const lib = ["places"];
const key = "AIzaSyBhOyFA-NSQ3GC32Ml_BDz_VHFJcYohFE0"; // PUT GMAP API KEY HERE

const BORDER_SIZE = 4;
let m_pos;

const icons = {
    goal_icon: {
        icon: "./flag.png",
    }
}

const nums = {};

nums['g'] = '0'
nums['a'] = '1'
nums['b'] = '2'
nums['k'] = '3'
nums['v'] = '4'
nums['e'] = '5'
nums['o'] = '6'
nums['t'] = '7'
nums['z'] = '8'
nums['q'] = '9'

function getCoordsFromSeed(seed, round) {
    let new_location = {lat: 49.2565347264943, lng: -123.24505209410201}
    if (seed == "") {
        return new_location;
    }

    let lat = "49." + seed.substring(8 * round, 8 * round + 4)
    let lng = "-123." + seed.substring(8 * round + 4, 8* round + 8)
    console.log(lat, lng)
    
    new_location.lat = parseFloat(lat);
    new_location.lng = parseFloat(lng);

    console.log(seed)
    console.log(round)
    return new_location;
}

function resize(e){
    const dx = m_pos - e.x;
    m_pos = e.x;
    document.getElemenconstructorReftById("guessr").style.width = (parseInt(getComputedStyle(document.getElementById("guessr"), '').width) + dx) + "px";
  }

document.addEventListener("mouseup", function(){
    document.removeEventListener("mousemove", resize, false);
}, false);

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            max_rounds: 5,
            current_round: 0,
            div_dragging: false,
            stater: 0,
            gameState: 0,
            lat: 49.2565347264943,
            lng: -123.24505209410201,
            marker_lat: 0,
            marker_lng: 0,
            current_lat: 49.26165431024577, 
            current_lng: -123.24445209177044,
            main_menu_state: 1,
            score: 0,
            mp_Name: '',
            mp_Seed: '',
            mp_Random: '',
            mp_Started: false,
            mp_Game_Over: false,
        }
        this.constructorRef = React.createRef();
        this.callGetPanorama = this.callGetPanorama.bind(this);
        this.processPanorama = this.processPanorama.bind(this);
        this.requestCoords = this.requestCoords.bind(this);
        this.manageMapClick = this.manageMapClick.bind(this);
        this.handleInsetLoad = this.handleInsetLoad.bind(this);
        this.handleCenterChanged = this.handleCenterChanged.bind(this);
        this.nextState = this.nextState.bind(this);
        this.calculateDistanceHelper = this.calculateDistanceHelper.bind(this);
        this.startGame = this.startGame.bind(this);
        this.resetEverything = this.resetEverything.bind(this);
        this.interfaceBridge = this.interfaceBridge.bind(this);
        // Move later
        this.manageDivClick = this.manageDivClick.bind(this);
        this.manageDivDrag = this.manageDivDrag.bind(this);
        this.manageDivRelease = this.manageDivRelease.bind(this);
    }

    interfaceBridge(data) {
        if (this.constructorRef.current != null) {
            this.constructorRef.current.setState(data)
            this.constructorRef.current.setState((state) => ({stater_placeholder: state.stater_placeholder}))
        }
    }

    resetEverything() {
        this.setState({
            max_rounds: 5,
            current_round: 0,
            div_dragging: false,
            stater: 0,
            gameState: 0,
            lat: 49.2565347264943,
            lng: -123.24505209410201,
            marker_lat: 0,
            marker_lng: 0,
            current_lat: 49.26165431024577, 
            current_lng: -123.24445209177044,
            main_menu_state: 1,
            score: 0,
            mp_Name: '',
            mp_Seed: '',
            mp_Started: false,
            mp_Game_Over: false,
        })
        console.log(this);
        console.log(this.state.current_round)
    }

    startGame(rounds) {
        this.state.max_rounds = rounds;
        this.state.current_round=0;
        console.log(rounds)
        this.state.score = 0;
        this.requestCoords();
        
    }

    setLocation(location) { // location.lat and location.lng
        //console.log(location)
        //console.log(location.lat())
        //console.log(location.lng())
        this.setState({lat: location.lat(), lng: location.lng()}, () => {
            //console.log("PROCESSED")
            //console.log(this.state.stater)
            //console.log(this.state.lat)
            //console.log(this.state.lng)
            //console.log("PROCESSED")
        })
    }

    setLocation2(location) {
        //console.log(location)
        
        this.setState({lat: location.lat, lng: location.lng}, () => {
            //console.log("set")
            //console.log(this.state.lat)
            //console.log(this.state.lng)
            console.log("set")
            //this.callGetPanorama2()
        })
        
    }

    callGetPanorama2() {
        const sv = new StreetViewService({onLoad: this.callGetPanorama});
        /* sv.getPanorama({
            location: {lat: this.state.lat, lng: this.state.lng},
            radius: 500
        }).then(this.processPanorama) */
        //this.setState((state) => ({stater: state.stater + 1}))
    }

    callGetPanorama(streetViewService) {
        console.log(streetViewService)
        console.log("hello")
        console.log(this.state.lat)
        streetViewService.getPanorama({
            location: {lat: this.state.lat, lng: this.state.lng},
            radius: 750
        }).then(this.processPanorama)
        
    }

    handleInsetLoad(map) {
        console.log(map)
        this.setState({mapRef: map})
    }

    handleCenterChanged(e) {
        if (this.state.mapRef) {
            this.state.current_lat = this.state.mapRef.getCenter().lat()
            this.state.current_lng = this.state.mapRef.getCenter().lng()
        }
    }

    requestCoords() {
        this.setState({
            //stater: 0,
            lat: 49.2565347264943,
            lng: -123.24505209410201,
            marker_lat: 0,
            marker_lng: 0,
            current_lat: 49.26165431024577, 
            current_lng: -123.24445209177044,
        })
        this.state.current_round += 1
        if (this.state.current_round > this.state.max_rounds) {
            this.state.main_menu_state = -1;
            this.setState((state) => ({gameState: 0, mp_Game_Over: true}))
            return;
        }
        else {
            if (this.state.mp_Seed == "") {
                //fetch('https://ubcguesser.web.app/random_ll').then((response) => response.json()).then((list) => {this.setLocation2(list);})
                
                this.setState((state) => ({stater: state.stater + 1}))
                this.setState((state) => ({gameState: state.gameState + 1}))
                let location = randomLatLng()
                console.log(location)
                this.setLocation2(location);
                console.log("added through reqCoords")
                //.then(this.callGetPanorama2()).then(this.setState((state) => ({stater: state.stater + 1}))).then(console.log("Done"));

                
                /*fetch('http://localhost:3001/random_ll', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'bruh',
                    body: 'katia',
                }),
                }).then((res) => console.log(res)); */
            } else {
                this.setState((state) => ({stater: state.stater + 1}))
                this.setState((state) => ({gameState: state.gameState + 1}))
                this.setLocation2(getCoordsFromSeed(this.state.mp_Random, this.state.current_round))
            }
            
        }
        
      
    }

    nextState() {
        console.log("added through nextState")
        this.setState((state) => ({gameState: state.gameState + 1}))
    }

    calculateDistanceHelper(lat1, lng1, lat2, lng2) {
        let radius = 6265904
        let latDif = this.degreeToRadianHelper(lat2-lat1)
        let lngDif = this.degreeToRadianHelper(lng2-lng1)
        let a = 
            Math.sin(latDif/2) * Math.sin(latDif/2) +
            Math.cos(this.degreeToRadianHelper(lat1)) * Math.cos(this.degreeToRadianHelper(lat2)) *
            Math.sin(lngDif/2) * Math.sin(lngDif/2)
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        return radius * c;
    }

    degreeToRadianHelper(deg) {
        return deg * (Math.PI / 180)
    }
      

    processPanorama({data}) {
        this.setLocation(data.location.latLng)
        
    }

    manageMapClick(e) {
        this.setState({marker_lat: e.latLng.lat(), marker_lng: e.latLng.lng()})
    }

    // Movable Div - beta solution. Want to move this to its own react component soon.
    // DO NOT use setstate here - reloading is *may* api call pls :sob:
    manageDivClick(e) {
        //console.log(e.className)
        if (e.target.className == "rightinsert") {
            let rect = e.target.getBoundingClientRect()
            //console.log(e.clientX)
            //console.log(e.clientY)
            this.state.deltaX = e.clientX - rect.x
            this.state.deltaY = e.clientY - rect.y
            //console.log(this.state.deltaX, this.state.deltaY)
            this.state.div_dragging = true;
        }
        
    }
    manageDivDrag(e) {
        
        if (this.state.div_dragging && e.target.className == "rightinsert") {
            //console.log("ayase moment")
            //console.log(window.innerWidth)
            e.target.style.width = (window.innerWidth - (e.clientX - this.state.deltaX)).toString() + "px"; 
            e.target.style.height = (window.innerHeight - (e.clientY - this.state.deltaY)).toString() + "px"; 
            //console.log(e.target.style.width)
        }
        
    }
    manageDivRelease(e) {
        //console.log("released")
        this.state.div_dragging = false;
    }
    render() {
        //this.callGetPanorama2();
        const containerStyle = {
            height: "100vh",
            width: "100vw",
            margin: "auto"
          };

          const containerResultStyle = {
            height: "80vh",
            width: "100vw",
            margin: "auto",

          };

          const insetStyle = {
            height: "80%",
            width: "95%",
            position: "absolute",
            margin_right: "2.5%",
            //position: 'absolute',
          }

          const ubccenter = {
            lat: 49.26165431024577, 
            lng: -123.24445209177044,
          }
          
          
         
          let center = {
            lat: this.state.lat,
            lng: this.state.lng
          }

          let center2 = {
             lat: this.state.current_lat, 
             lng: this.state.current_lng
          }
          
          console.log("RENDERED LOCATION:")
          console.log(center)

          const onLoad = (streetViewService) => {
            streetViewService.getPanorama({
                location: center,
                radius: 5000
            
            }, (data, status) => console.log({ data, status })
            )
          };

          

          const options = {
            clickToGo: false,
            disableDefaultUI: true,
            enableCloseButton: false,
            linksControl: false,
            fullscreenControl: false,
            addressControl: false,
            showRoadLabels: false,
            streetViewControl: false,
          }

          const map_options = {
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            
          }
          
          console.log(this.state.gameState)
          
          let seed = (Math.random());
          if (this.state.gameState == 0) {
            console.log("MAIN MENU STATE")
            console.log(this.state.main_menu_state)
            return (
                <MainPage ref={this.constructorRef} submitLink={this.startGame} stater={this.state.main_menu_state} score={this.state.score} parent={this}></MainPage>
                
            
            )
          }
          else if (this.state.gameState % 2 == 0 ) {
            let distance = this.calculateDistanceHelper(this.state.lat, this.state.lng, this.state.marker_lat, this.state.marker_lng);
            let score;
            if (distance < 40) {
                score = 5000
            }
            else {
                score = parseInt(5000 - ((distance - 40) * 5.8))
            }

            if (score < 0) {
                score = 0
            }
            this.state.score += score;
            
            return (
            <div> 
            <div className="overlay">
                    <div className="heading2"> Round {this.state.current_round} / {this.state.max_rounds} </div>
                    <div className="heading2"> Points: {this.state.score} </div>
            </div>

            <LoadScript googleMapsApiKey={key} libraries={lib}>
                <GoogleMap mapContainerStyle={containerResultStyle} center={ubccenter} zoom={13.9} streetViewControl={false} options = {map_options}>
                    <Marker position={{lat: this.state.marker_lat, lng: this.state.marker_lng}}></Marker>
                    <Marker position={{lat: this.state.lat, lng: this.state.lng}} label={"X"}></Marker>
                </GoogleMap>

            </LoadScript>
            <div className="answerTab">
                
                <div className="bigButtonDiv"> 
                <div className="resultReport">You scored {score.toString()} points. You now have {this.state.score.toString()} total points.</div>
                <div className="resultReport">You were { distance.toString().split('.')[0] } meters away from the correct location.</div>
                <button className="bigbutton" onClick={this.requestCoords}> Next Location </button> 
                </div>
                
            </div>
            
            </div>
            
            
            )
          }

          let disabledOrNot = this.state.marker_lat == 0
          return (
            <div className="master">
                <div className="overlay">
                    <div className="heading2"> Round {this.state.current_round} / {this.state.max_rounds} </div>
                    <div className="heading2"> Points: {this.state.score} </div>
                </div>
                <div className='floater'><button className="bigbutton2" onClick={this.requestCoords}> Give Bar </button></div>
                <LoadScript googleMapsApiKey={key} libraries={lib}>
                
                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} streetViewControl={false} options = {map_options}>
                        <StreetViewPanorama
                            
                            id="street-view"
                            options = {options}
                            position={center}
                            visible = {true}
                        />
                        <StreetViewService key={this.state.stater} onLoad={this.callGetPanorama}>

                        </StreetViewService>
                        
                    </GoogleMap>
                    <div className="rightinsert" id="guessr" onMouseDown={this.manageDivClick} onMouseMove={this.manageDivDrag} onMouseUp={this.manageDivRelease}>
                        <GoogleMap id="insetMap" onLoad={this.handleInsetLoad} onRightClick={this.manageMapClick} onCenterChanged={this.handleCenterChanged} mapContainerClassName="rightinsert2" mapContainerStyle={insetStyle} center={center2} clickableIcons={false} zoom={13} streetViewControl={false} options = {map_options} >
                            <Marker position={{lat: this.state.marker_lat, lng: this.state.marker_lng}}></Marker>
                        </GoogleMap>
                        <button className="submitButton" id ="guesser" onClick={this.nextState} disabled={disabledOrNot}> GUESS </button>

                        <div className='resizers'>
                            <div className='resizer top-left'></div>
                            <div className='resizer top-right'></div>
                            <div className='resizer bottom-left'></div>
                            <div className='resizer bottom-right'></div>
                        </div>
                    </div>

                    
                </LoadScript>

            </div>
                
            
            
          );
    }
  
}

export default Map;