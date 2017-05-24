import * as React from "react";
import * as ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable} from "mobx";
import SyntheticEvent = React.SyntheticEvent;
import CSSProperties = React.CSSProperties;
import moment = require("moment");
import {appState, ChannelPlayState} from "./AppState";
import {KeyboardEvent} from "react";
import {
    IEpg, IInfo, ILoadCurrentEpgAns, ILoadCurrentEpgReq, ILoadInfoAns, ILoadInfoReq, LOAD_CURRENT_EPG,
    LOAD_INFO
} from "./api/api";
import {httpRequest} from "./utils/httpRequest";
import {AgGridReact} from "ag-grid-react";
import {AgGridColDef} from "./AgGridColDef";
import ColumnApi = ag.grid.ColumnApi;
import GridApi = ag.grid.GridApi;
import {config} from "./config/config";


//import  NotifyResize = require("react-notify-resize");

export interface IPauserProps {

}

@observer
export class Pauser extends React.Component<IPauserProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }

    componentDidMount() {
        appState.pauser = this;

        setInterval(() => {
            if (appState.pauserVisible) {
                this.forceUpdate();
            }
        }, 1000);

    };

    backButtonPressed() {
        this.enterKeyPressed();
    }

    enterKeyPressed() {
        if (appState.getGuiState() === "pauser") {


            let chState = appState.channelPlayStates[appState.playedChannel];

            let deltaSec = appState.getPlayerPausedSecs();
            console.log("deltaSec", deltaSec);

            if (deltaSec < 60) {
                if (appState.nativePlayer) {
                    appState.nativePlayer.play();
                }
                chState.startTime = new Date(chState.startTime.getTime() + deltaSec * 1000);
            }
            else {
                let toTime = new Date(appState.getActivePlayerTime().getTime());
                let utc = moment(toTime).toDate().getTime().toString().substr(0, 10);

                let lutc = (new Date()).getTime().toString().substr(0, 10);
                let url = chState.epgUrl + "?utc=" + utc + "&lutc=" + lutc;

                chState.isArchive = true;
                chState.startTime = toTime;
                chState.currentTimeSec = 0;
                chState.lastCurrentTime = new Date();

                if (appState.nativePlayer) {
                    appState.nativePlayer.src = url;
                    appState.nativePlayer.play();
                }
            }
            appState.showVideo();

        }
    }

    info: IInfo;

    private loadInfoTimeoutHandler?: number;

    async loadInfo(channelId: number, time: string,) {
        await appState.doLogin();

        if (this.loadInfoTimeoutHandler)
            clearTimeout(this.loadInfoTimeoutHandler);

        this.loadInfoTimeoutHandler = setTimeout(() => {

            let req: ILoadInfoReq = {
                cmd: LOAD_INFO,
                channelId: channelId,
                time: time,
            };

            httpRequest<ILoadInfoReq, ILoadInfoAns>(req)
                .then((ans: any) => {
                    this.info = ans.info;
                    console.log("this.info", this.info);
                    this.forceUpdate();
                })
                .catch((err: any) => {
                    alert(err);
                });

        }, 200);

    }


    @observable text: string = "";
    // http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/508/index.m3u8

    render(): any {

        let style: CSSProperties = {
            position: "absolute",
            ...appState.getPauserPos(),
            color: "yellow",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            overflow: "hidden",
            textAlign: "center",
            fontSize: 24,
            borderRadius: 35,
            padding: 15
        };

        if (appState.pauserVisible)
            style.display = "block";
        else
            style.display = "none";

        //let pauserSecs = Math.round(((new Date()).getTime() - appState.getActivePlayerTime().getTime()) / 1000);
        let pauserSecs = appState.getPlayerPausedSecs();

        let secStr = "";
        if (Math.abs(pauserSecs) < 60) {
            secStr = Math.abs(pauserSecs) + " сек";
        }
        else if (Math.abs(pauserSecs) < 3600) {
            let d = new Date("2000-01-01 00:00");
            let dd = new Date(d.getTime() + Math.abs(pauserSecs) * 1000);
            secStr = moment(dd).format("mm:ss");
        }
        else {
            let d = new Date("2000-01-01 00:00");
            let dd = new Date(d.getTime() + Math.abs(pauserSecs) * 1000);
            secStr = moment(dd).format("HH:mm:ss");
        }

        return (
            <div style={style}>
                <div>пауза</div>
                <div
                    style={{
                        marginTop: 10,
                        color: "#c7c7c7"
                    }}>{secStr}</div>
            </div>
        );
    }
}
