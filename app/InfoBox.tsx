import * as React from "react";
import * as ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable} from "mobx";
import SyntheticEvent = React.SyntheticEvent;
import CSSProperties = React.CSSProperties;
import moment = require("moment");
import {appState} from "./AppState";
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

export interface IInfoBoxProps {

}

@observer
export class InfoBox extends React.Component<IInfoBoxProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }

    componentDidMount() {
        appState.infoBox = this;
    };

    info: IInfo;

    async loadInfo(channelId: number, time: string,) {

        await appState.doLogin();

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
    }

    comboGridApi: GridApi;
    comboGridColumnApi: ColumnApi;

    gridReadyHandler = (event: { api: GridApi, columnApi: ColumnApi }) => {
        this.comboGridApi = event.api;
        this.comboGridColumnApi = event.columnApi;

    };


    @observable text: string = "";
    // http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/508/index.m3u8

    render(): any {

        let style: CSSProperties = {
            position: "absolute",
            left: 580,
            top: 20,
            right: 20,
            bottom: 20,
            border: "1px solid yellow",
            color: "yellow",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
        };

        if (appState.infoBoxVisible)
            style.display = "block";
        else
            style.display = "none";

        let imgStyle: CSSProperties = {
            display: "inline-block",
            maxHeight: 300,
            maxWidth: 200,
            height: "auto",
            width: "auto",
        }

        if (this.info) {
            return (
                <div style={style}>
                    <img style={imgStyle}
                         src={config.apiUrl.replace("api", "") + "kit/providers/new.s-tv.ru/images/" + this.info.image}/>
                </div>
            );
        }
        else {
            return (
                <div style={style}>
                </div>
            );
        }
    }

}

// kit/providers/new.s-tv.ru\Icons                <img style={imgStyle} src={"http://192.168.0.14:3001/kit/providers/new.s-tv.ru/images/" + this.info.image}/>
