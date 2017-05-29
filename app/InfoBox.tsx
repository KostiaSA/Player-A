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

    comboGridApi: GridApi;
    comboGridColumnApi: ColumnApi;

    gridReadyHandler = (event: { api: GridApi, columnApi: ColumnApi }) => {
        this.comboGridApi = event.api;
        this.comboGridColumnApi = event.columnApi;

    };


    @observable text: string = "";
    // http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/508/index.m3u8

    render(): any {
        appState.preprocessEpgInfo(this.info as any);

        let style: CSSProperties = {
            position: "absolute",
            ...appState.getInfoBoxPos(),
            border: "0px solid yellow",
            color: "yellow",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            paddingLeft: 10,
            overflow: "hidden"
        };

        if (appState.infoBoxVisible)
            style.display = "block";
        else
            style.display = "none";

        let imgStyle: CSSProperties = {
            display: "inline-block",
            maxHeight: appState.getMenuHeight() / 3,
            maxWidth: appState.getInfoBoxWidth() - 10,
            height: "auto",
            width: "auto",
        }


        if (this.info) {
            let yearColor = "rgb(204, 204, 204)";

            let genreSpan: any = null;
            if (this.info.genreTitle)
                genreSpan = <span style={{fontSize: 14, color: yearColor}}>{this.info.genreTitle + ", "}</span>;

            let yearSpan: any = null;
            if (this.info.year && this.info.year !== "0")
                yearSpan = <span style={{fontSize: 14, color: yearColor}}>{this.info.year + " г., "}</span>;

            let countrySpan: any = null;
            if (this.info.country && this.info.country !== "")
                countrySpan = <span style={{fontSize: 13, color: yearColor}}>{this.info.country + ", "}</span>;

            let directorSpan: any = null;
            if (this.info.director && this.info.director !== "")
                directorSpan =
                    <span style={{fontSize: 14, color: yearColor}}>{"реж.: " + this.info.director}</span>;

            let actorsSpan: any = null;
            if (this.info.actors && this.info.actors !== "")
                actorsSpan =
                    <div style={{marginTop: 5, fontSize: 14, color: "#a2a2a2"}}>{"в ролях: " + this.info.actors}</div>;


            return (
                <div style={style}>
                    <div style={{height: 25, textAlign:"right"}}>
                        <span style={{fontSize: 16, color: "yellowgreen", padding: 3}}>сервер: {appState.server} </span>
                    </div>
                    <div style={{textAlign: "left", paddingTop: 5}}>
                        <img style={imgStyle}
                             src={config.apiUrl.replace("api", "") + "kit/providers/" + this.info.epgProvider + "/images/" + this.info.image}/>
                    </div>
                    <div style={{padding: 2, overflow: "hidden"}}>
                        <div style={{
                            fontSize: 16,
                            color: "white",
                            marginTop: 5,
                            marginBottom: 5
                        }}>{this.info.title}</div>
                        {genreSpan}
                        {countrySpan}
                        {yearSpan}
                        {directorSpan}
                        {actorsSpan}
                        <div style={{marginTop: 7, fontSize: 13, color: "#a2a2a2"}}>{this.info.desc}</div>
                    </div>

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
