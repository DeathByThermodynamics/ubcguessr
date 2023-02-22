import React from "react";

import './index.css';
import './mainpage.css';
import provideCode from './generator';

let map;

let ticker;

function codeGenerator() {
    console.log(Math.random())
}

class ErrorPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: props.message,
            reason: props.reason,
            parent: props.parent
        }
    }

    render() {
        return (
            <div className="errorInset">
                <div className="heading2red"> {this.state.message} </div>
                <div className="heading3"> {this.state.reason} </div>
                <div className="buttonContainer">
                                <button className="submitButton2" onClick={() => this.state.parent.clearError()}> OK </button> 

                            </div>
            </div>
        )
    }
}

class PlayerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerlist: props.playerlist,
            
        }
    }

    render() {
        let returner = [];
        let list = this.state.playerlist;


        for (var i = 0; i < Object.keys(list).length; i++) {
            let player = Object.keys(list)[i].toString()
            returner.push(<div className="flexPlayerBox">
                <div className="entryleft"> {player} </div>
                <div className="entryright"> {list[player].toString() + " points"}</div>
            </div>)
        }

        return returner;
    }
}


class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLink: props.submitLink,
            stater: props.stater,
            score: props.score,
            name: '',
            game_id: '',
            tick_counter: '',
            game_content: {},
            game_started: false,
            is_host: "true",
            rounds: 1,
            error: ""
        }
        this.playerList = React.createRef();
        this.playerList2 = React.createRef();
        //console.log(props);
        map = props.parent;
        //console.log(map)
        this.hostServer = this.hostServer.bind(this);
        this.tickServer = this.tickServer.bind(this);
        this.joinServer = this.joinServer.bind(this);
        this.leaveMPGame = this.leaveMPGame.bind(this);
        this.leaveSPGame = this.leaveSPGame.bind(this);
        this.clearError = this.clearError.bind(this);
    }

    clearError() {
        this.setState({error: ""})
    }

    hostServer(name, rounds) {
        try {
            (async () => {
                try {
                const rawResponse = await fetch('https://ubcguesser.web.app/post', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                        request: "create_server",
                        name: name,
                        rounds: rounds,
                    })
                });
                
                const content = await rawResponse.json();
                this.state.rounds = rounds;
                //console.log(content);
                this.joinServer(name, content.gameCode);
            }
            catch(e) {
                console.log(e)
            }
              })();
        } catch(e) {
            console.log(e)
        }
        
    }

    joinServer(name, id) {
        this.state.name = name;
        this.state.game_id = id;
        map.state.mp_Name = name;
        map.state.mp_Seed = id;
        console.log("Joining");
        (async () => {
            const rawResponse = await fetch('https://ubcguesser.web.app/post', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                    request: "create_user",
                    name: name,
                    seed: id,
                })
            });
            const content = await rawResponse.json();
            //console.log(content);
            if (content.message == "Success") {
                
                this.state.game_content = content.game_data;
                map.state.mp_Game_Data = content.game_data
                this.tickServer()
                ticker = setInterval(this.tickServer, 1000)
                this.setState({stater: 3.5})
            } else {
                this.setState({error: content.reason})
            }
            
          })();
    }

    startGame(name, id) {
        console.log(id);
        (async () => {
            const rawResponse = await fetch('https://ubcguesser.web.app/post', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                    request: "start_game",
                    name: name,
                    seed: id,
                })
            });
            const content = await rawResponse.json();
            //console.log(content);
            if (content.message == "Success") {
                console.log("Start Game success! Starting soon...")
            } else {
                this.setState({error: content.reason})
            }
            
          })();
    }
    tickServer() { // THis is the most important part of the server-client connection
        //console.log(map.state.mp_Seed);
        (async () => {
            const rawResponse = await fetch('https://ubcguesser.web.app/post', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                    request: "post_score", // grabs an update while doing this as well
                    name: map.state.mp_Name,
                    seed: map.state.mp_Seed,
                    score: map.state.score,
                })
            });
            const content = await rawResponse.json();
            if (content.message == "Success") {
                //console.log(content);
                // bait out a reset 
                let update = false;
                let sum1 = Object.values(content.game_data).reduce((acc, curr) => acc + curr, 0)
                let sum2 = Object.values(map.state.mp_Game_Data).reduce((acc, curr) => acc + curr, 0)
                if (sum1 != sum2) {
                    //console.log("reset lmao")
                    update = true;
                }

                map.state.mp_Game_Data = content.game_data
                map.state.mp_Random = content.game_seed
                //console.log(map.state.mp_Started)
                //console.log(map.state.mp_Game_Over)
                if ((!map.state.mp_Started) && content.game_started == "true") {
                    map.state.mp_Started = true;
                    this.state.submitLink(content.rounds)
                    
                }
                
                else if (!map.state.mp_Started || map.state.mp_Game_Over) {
                    //console.log("it's over")
                    if (map.state.mp_Game_Over) {
                        map.interfaceBridge({game_content: content.game_data, is_host: content.host, rounds: content.rounds})
                    }
                    else {
                        this.setState({game_content: content.game_data, is_host: content.host, rounds: content.rounds})
                        this.setState((state) => ({stater_placeholder: state.stater_placeholder}))
                    }
                    
                    
                    
                    //if (update) {
                    //    this.forceUpdate() // temporary solution, react does not want to cooperate.
                    //    let whatever = this.state.stater_placeholder 
                    //    whatever++;
                    //    console.log("reset called")
                    //    this.setState((state) => ({game_content: content.game_data, is_host: content.host, rounds: content.rounds, stater_placeholder: whatever}))
                    //}
                }
                

                
            } else {
                console.log("An error occured while ticking the server.")
                this.setState({stater: 1, error: content.reason})
                clearInterval(ticker);
            }
            
          })();
    }

    leaveMPGame(set_state) {
        this.setState({stater: set_state})
        clearInterval(ticker);
        map.resetEverything();
    }

    leaveSPGame(set_state) {
        this.setState({stater: set_state})
        map.resetEverything();
    }

    render() {
        //console.log("rerendering")
        let returner = [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/UBC-Main-Mall.jpg/2560px-UBC-Main-Mall.jpg" width="100%" height="100%"></img>]
        if (this.state.error != "") {
            returner.push(
                <ErrorPopup reason={this.state.error} message="An Error Occurred" parent={this}>

                </ErrorPopup>
            )
        }
        
        if (this.state.stater == -1 && map.state.mp_Name == "") {
            returner.push (
            <div>
                        
                        <div className="mainInset"> 
                            <div className="title">
                                ubcguessr
                            </div>
                            <div className="selection">
                                <div className="heading2">
                                    Final Score: {this.state.score}
                                </div>
                            </div>
                            <div className="buttonContainer">
                                <button className="submitButton2" onClick={() => this.leaveSPGame(1)}> MAIN MENU </button> 

                            </div>
                            
                        </div>
                        
                    </div>
            )
        }
        else if (this.state.stater == -1) {
            let playerlist = map.state.mp_Game_Data
            if (this.playerList2.current != null) {
                this.playerList2.current.setState({playerlist: playerlist})
                this.setState({stater_placeholder: 3.5})
            }
            //console.log("Rendering Playerlist")
            returner.push (
                <div>
                            
                            <div className="mainInset"> 
                                <div className="title">
                                    ubcguessr
                                </div>
                                <div className="selectionFinal">
                                    <div className="heading2">
                                        Final Scores
                                    </div>
                                </div>
                                <div className="selection2">
                                
                                    <PlayerList ref={this.playerList2} playerlist={playerlist}></PlayerList>
                                </div>
                                <div className="buttonContainer">
                                    <button className="submitButton2" onClick={() => this.leaveMPGame(1) }> MAIN MENU </button> 
    
                                </div>
                                
                            </div>
                            
                        </div>
                )
        }
        else if (this.state.stater == 0) {
            // single
            returner.push(
                <div>
                        <div className="mainInset"> 
                            <div className="title">
                                ubcguessr
                            </div>
                            <div className="selection">
                                <label className="heading2">Number of Rounds</label>
                                <select name="rounds" id="rounds" className="heading2A">
                                    <option value="1">1</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                </select>
                            </div>
                            <div className="buttonContainer">
                                <button className="submitButton2" onClick={() => this.state.submitLink(parseInt(document.getElementById("rounds").value))}> BEGIN </button> 
                                <button className="submitButton2" onClick={() => this.setState({stater: 1})}> BACK </button> 

                            </div>
                            
                        </div>
                        
                    </div>
            )
        }

        else if (this.state.stater == 3) {
            // multi
            returner.push(
                <div>
                        <div className="mainInset"> 
                            <div className="title">
                                ubcguessr
                            </div>
                            <div className="selection">
                                <label className="heading2">Name</label>
                                    <input id="NameInput" className="heading2A" maxLength="15">
                                        
                                    </input>
                            </div>
                            <div className="selection">
                                <label className="heading2">Number of Rounds</label>
                                    <select name="rounds" id="rounds" className="heading2A">
                                        <option value="1">1</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                    </select>
                            </div>
                            <div className="buttonContainer">
                                <button className="submitButton2" id="hostButton" onClick={() => this.hostServer(document.getElementById("NameInput").value, parseInt(document.getElementById("rounds").value))} > HOST </button> 
                                <button className="submitButton2" onClick={() => this.setState({stater: 2})}> BACK </button>
                            </div>
                            
                        </div>
                        
                    </div>
            )
        }
 
        else if (this.state.stater == 3.5) {
            // In Multiplayer Game
            let playerlist = map.state.mp_Game_Data
            //console.log(playerlist)
            if (this.playerList.current != null) {
                this.playerList.current.setState({playerlist: playerlist})
            }
            if (document.getElementById("hostButton") != null) {
                if (this.state.is_host == "true") {
                    document.getElementById("hostButton").disabled = false;
                } else {
                    document.getElementById("hostButton").disabled = true;
                }
            }
            
            returner.push(
                <div>
                        <div className="mainInset2"> 
                            <div className="title">
                                ubcguessr
                            </div>
                            <div className="heading2"> code: {this.state.game_id}</div>
                            <div className="heading3"> {this.state.rounds} rounds </div>
                            <div className="selection2">
                                
                                <PlayerList ref={this.playerList} playerlist={playerlist}></PlayerList>
                            </div>
                            <div className="buttonContainer">
                                <button className="submitButton2" id="hostButton" onClick={() => this.startGame(this.state.name, this.state.game_id)} > START </button> 
                                <button className="submitButton2" onClick={() => this.leaveMPGame(2)}> LEAVE </button>
                            </div>
                            
                        </div>
                        
                    </div>
            )
        }

        else if (this.state.stater == 2) {
            // multi
            returner.push(
                <div>
                        <div className="mainInset"> 
                            <div className="title">
                                ubcguessr
                            </div>
                            <div className="buttonContainer">
                                <button className="submitButton2" onClick={() => this.setState({stater: 3})}> HOST </button> 
                                <button className="submitButton2" onClick={() => this.setState({stater: 4})}> JOIN </button> 
                                <button className="submitButton2" onClick={() => this.setState({stater: 1})}> BACK </button>
                            </div>
                            
                        </div>
                        
                    </div>
            )
        }

        else if (this.state.stater == 4) {
            // JOIN multiplayer server
            returner.push(
                <div>
                        <div className="mainInset"> 
                            <div className="title">
                                ubcguessr
                            </div>
                            <div className="selection">
                                <label className="heading2">Name</label>
                                    <input id="NameInput" className="heading2R" maxLength="15">
                                        
                                    </input>
                                
                            </div>
                            <div className="selection">
                                <label className="heading2">Server ID</label>
                                    <input id="ServerID" className="heading2R" maxLength="30">
                                        
                                    </input>
                            </div>
                            
                            <div className="buttonContainer">
                                <button className="submitButton2" id="hostButton" onClick={() => this.joinServer(document.getElementById("NameInput").value, document.getElementById("ServerID").value)} > JOIN </button> 
                                <button className="submitButton2" onClick={() => this.setState({stater: 2})}> BACK </button>
                            </div>
                            
                        </div>
                        
                    </div>
            )
        }
        // state 1
        else {
            returner.push (
                <div>
                            <div className="mainInset"> 
                                <div className="title">
                                    ubcguessr
                                </div>
                                <div className="buttonContainer">
                                    <button className="submitButton2" onClick={() => this.setState({stater: 0})} > Singleplayer </button> 
                                    <button className="submitButton2" onClick={() => this.setState({stater: 2})}> Multiplayer </button> 
                                </div>
                            </div>
                            
                        </div>
    
            )
        }

        return returner
        
        
        
    }
}

export default MainPage;