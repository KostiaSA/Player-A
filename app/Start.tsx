import * as  React from "react";
import * as  ReactDOM from "react-dom";
import {App, app, setApp} from "./App";
import {appState} from "./AppState";
import moment = require("moment");

moment.locale("ru");

console.log("platform", platform);


function startTimer(){
    setInterval(()=>{
        $(".timer-str").text(moment().format("HH:mm,  dddd,  D MMM YYYY"));
    },1000);
}

if (!(window as any).cordova){
    ReactDOM.render(<App ref={(e: any) => setApp(e)}/>, document.body);
    startTimer();
}
else {
    var myapp = {
        // Application Constructor
        initialize: function () {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function () {
            myapp.receivedEvent('deviceready');

            (window as any).plugins.screensize.get((screensize: any) => {
                appState.screenSize = screensize;
                console.log("screensize", screensize)
                ReactDOM.render(<App ref={(e: any) => setApp(e)}/>, document.body);
                startTimer();
            });

            //navigator.geolocation.getCurrentPosition((pos:Position)=>{console.log(new Date(pos.timestamp))});

            // if ((window as any).device.model === "T72HM3G")
            //     $("meta[name=viewport]").attr("content", "initial-scale=1.4");

            ///////////////////////////////////////////////////
            ///////////////////////////////////////////////////

            // // Implement this in `deviceready` event callback
            // ((window as any)["AdvancedGeolocation"] as any).start(function (success:any) {
            //
            //         try {
            //             var jsonObject = JSON.parse(success);
            //             console.log(jsonObject);
            //             console.log(jsonObject.provider, new Date(jsonObject.timestamp));
            //
            //             // switch (jsonObject.provider) {
            //             //     case "gps":
            //             //         break;
            //             //
            //             //     case "network":
            //             //         break;
            //             //
            //             //     case "satellite":
            //             //         break;
            //             //
            //             //     case "cell_info":
            //             //         break;
            //             //
            //             //     case "cell_location":
            //             //         break;
            //             //
            //             //     case "signal_strength":
            //             //         break;
            //             // }
            //         }
            //         catch (exc) {
            //             console.log("Invalid JSON: " + exc);
            //         }
            //     },
            //     function (error:any) {
            //         console.log("ERROR! " + JSON.stringify(error));
            //     },
            //     ////////////////////////////////////////////
            //     //
            //     // REQUIRED:
            //     // These are required Configuration options!
            //     // See API Reference for additional details.
            //     //
            //     ////////////////////////////////////////////
            //     {
            //         "minTime": 500,         // Min time interval between updates (ms)
            //         "minDistance": 1,       // Min distance between updates (meters)
            //         "noWarn": true,         // Native location provider warnings
            //         "providers": "gps",     // Return GPS, NETWORK and CELL locations
            //         "useCache": false,       // Return GPS and NETWORK cached locations
            //         "satelliteData": false, // Return of GPS satellite info
            //         "buffer": false,        // Buffer location data
            //         "bufferSize": 0,        // Max elements in buffer
            //         "signalStrength": false // Return cell signal strength data
            //     });


            ///////////////////////////////////////////////////
            ///////////////////////////////////////////////////


        },
        // Update DOM on a Received Event
        receivedEvent: function (id: any) {
            // var parentElement = document.getElementById(id);
            // var listeningElement = parentElement!.querySelector('.listening');
            // var receivedElement = parentElement!.querySelector('.received');
            //
            // listeningElement.setAttribute('style', 'display:none;');
            // receivedElement.setAttribute('style', 'display:block;');
            //
            // console.log('Received Event: ' + id);
        }
    };
    myapp.initialize();
}


