import * as React from "react";
import * as ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable} from "mobx";
import SyntheticEvent = React.SyntheticEvent;
import CSSProperties = React.CSSProperties;
import moment = require("moment");
import {appState} from "./AppState";
import {KeyboardEvent} from "react";

//import  NotifyResize = require("react-notify-resize");

export interface IMainVideoProps {

}

@observer
export class MainVideo extends React.Component<IMainVideoProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }

    componentDidMount() {

    };


    render(): any {

        let style = {
            backgroundColor: "black",
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundSize: "cover",
            objectFit: "contain"
        };

        if (!(window as any).cordova) {
            return (
                <div
                    className="main-video"
                    onClick={() => {
                        appState.showMainEpg(true);
                    }}

                    ref={(e) => {
                        //appState.nativePlayer = e;
                        console.log("controller", (appState.nativePlayer as any));
                    }}
                    style={{...style, backgroundColor: "silver"}} width={screen.width} height={screen.height}>
                </div>
            );
        }
        else {
            return (
                <video
                    className="main-video"
                    onClick={() => {
                        appState.mainEpgVisible = true;
                        appState.infoBoxVisible = true;
                        appState.mainEpg.loadEpg();
                    }}

                    onTimeUpdate={(e: any) => {
                        console.log("onTimeUpdate", appState.nativePlayer.videoHeight, appState.nativePlayer.videoWidth, appState.nativePlayer.currentTime);
                        let chState = appState.channelPlayStates[appState.playedChannel];
                        if (!chState)
                            alert("main-video: not chState!");
                        chState.currentTimeSec = appState.nativePlayer.currentTime;
                        chState.lastCurrentTime = new Date();
                    }}

                    ref={(e) => {
                        appState.nativePlayer = e;
                        console.log("controller", (appState.nativePlayer as any));
                    }}
                    style={style} width={screen.width} height={screen.height}>
                    <source
                        type="application/x-mpegURL"/>
                </video>
            );
        }
        // return (
        //     <video controls style={style} width={appState.screenSize.width} height={appState.screenSize.height}>
        //         <source
        //             src="http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/106/index.m3u8?utc=1494406801&lutc=1494590932"
        //             type="application/x-mpegURL"/>
        //     </video>
        // );
    }

}