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

export interface IRewinderProps {

}

@observer
export class Rewinder extends React.Component<IRewinderProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }

    componentDidMount() {
        appState.rewinder = this;

        setInterval(() => {
            if (appState.getGuiState() === "rewinder") {
                if ((new Date()).getTime() - appState.rewinderLastUpdateTime.getTime() > 1000) {
                    this.enterKeyPressed();
                }
            }
        }, 200);

    };

    backButtonPressed() {
        if (appState.getGuiState() === "rewinder") {
            appState.showVideo();
        }
    }

    enterKeyPressed() {
        if (appState.getGuiState() === "rewinder") {

            let chState = appState.channelPlayStates[appState.playedChannel];

            let toTime = new Date(appState.getActivePlayerTime().getTime() + appState.rewinderSecs * 1000);
            let utc = moment(toTime).toDate().getTime().toString().substr(0, 10);

            let lutc = (new Date()).getTime().toString().substr(0, 10);
            let url = chState.epgUrl + "?utc=" + utc + "&lutc=" + lutc;

            if (toTime.getTime()>new Date().getTime()-30000)  // если переход в будущее
                url = chState.epgUrl;

            chState.isArchive = true;
            chState.startTime = toTime;
            chState.currentTimeSec = 0;
            chState.lastCurrentTime = new Date();

            if (appState.nativePlayer) {
                appState.nativePlayer.src = appState.prepareUrl(url);
                appState.nativePlayer.play();
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
            ...appState.getRewinderPos(),
            color: "yellow",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            overflow: "hidden",
            textAlign: "center",
            fontSize: 24,
            borderRadius: 35,
            padding: 15
        };

        if (appState.rewinderVisible)
            style.display = "block";
        else
            style.display = "none";

        let sign = "";
        if (appState.rewinderSecs > 0)
            sign = "+ ";
        else if (appState.rewinderSecs < 0)
            sign = "- ";

        let secStr = "";
        if (Math.abs(appState.rewinderSecs) < 60) {
            secStr = Math.abs(appState.rewinderSecs) + " сек";
        }
        else if (Math.abs(appState.rewinderSecs) < 3600) {
            let d = new Date("2000-01-01 00:00");
            let dd = new Date(d.getTime() + Math.abs(appState.rewinderSecs) * 1000);
            secStr = moment(dd).format("mm:ss");
        }
        else {
            let d = new Date("2000-01-01 00:00");
            let dd = new Date(d.getTime() + Math.abs(appState.rewinderSecs) * 1000);
            secStr = moment(dd).format("HH:mm:ss");
        }
        if (appState.rewinderSecsToZero) {
            secStr = "сейчас";
            sign="";
        }

        let currDate = appState.getActivePlayerTime();

        let timeStr = moment(new Date(currDate.getTime() + appState.rewinderSecs * 1000)).format("dd HH:mm:ss");

        return (
            <div style={style}>
                <div>{sign}{secStr}</div>
                <div
                    style={{
                        marginTop: 10,
                        color: "#c7c7c7"
                    }}>{timeStr}</div>
            </div>
        );
    }
}
