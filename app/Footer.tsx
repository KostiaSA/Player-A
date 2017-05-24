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

export interface IFooterProps {

}

@observer
export class Footer extends React.Component<IFooterProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }

    componentDidMount() {
        appState.footer = this;
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


    @observable text: string = "";
    // http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/508/index.m3u8

    render(): any {

        let style: CSSProperties = {
            position: "absolute",
            ...appState.getFooterPos(),
            border: "0px solid yellow",
            color: "yellow",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            paddingLeft: 10,
            overflow:"hidden"
        };

        if (appState.footerVisible)
            style.display = "block";
        else
            style.display = "none";


        if (this.info) {
            let yearColor = "rgb(204, 204, 204)";

            let genreSpan: any = null;
            if (this.info.genreTitle)
                genreSpan = <span style={{fontSize: 14, color: yearColor}}>{this.info.genreTitle}</span>;

            let yearSpan: any = null;
            if (this.info.year && this.info.year !== "0")
                yearSpan = <span style={{fontSize: 14, color: yearColor}}>{", " + this.info.year + " г."}</span>;

            let directorSpan: any = null;
            if (this.info.director && this.info.director !== "")
                directorSpan =
                    <span style={{fontSize: 14, color: yearColor}}>{", реж.: " + this.info.director}</span>;

            let actorsSpan: any = null;
            if (this.info.actors && this.info.actors !== "")
                actorsSpan =
                    <div style={{marginTop: 5, fontSize: 14, color: "#a2a2a2"}}>{"в ролях: " + this.info.actors}</div>;

            return (
                <div style={style}>
                    <div style={{padding: 2, overflow: "hidden"}}>
                        <div style={{
                            fontSize: 16,
                            color: "white",
                            marginTop: 5,
                            marginBottom: 5
                        }}>{this.info.title}</div>
                        {genreSpan}
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
