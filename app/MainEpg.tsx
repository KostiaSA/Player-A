import * as React from "react";
import * as ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable} from "mobx";
import SyntheticEvent = React.SyntheticEvent;
import CSSProperties = React.CSSProperties;
import moment = require("moment");
import {appState} from "./AppState";
import {KeyboardEvent} from "react";
import {IEpg, ILoadCurrentEpgAns, ILoadCurrentEpgReq, LOAD_CURRENT_EPG} from "./api/api";
import {httpRequest} from "./utils/httpRequest";
import {AgGridReact} from "ag-grid-react";
import {AgGridColDef} from "./AgGridColDef";
import ColumnApi = ag.grid.ColumnApi;
import GridApi = ag.grid.GridApi;


//import  NotifyResize = require("react-notify-resize");

export interface IMainEpgProps {

}

class AgGrid_CellRenderer extends React.Component<any, any> {
//<img src={"kit/providers/"+this.props.data.channelImage}/>
    render() {

        let imgStyle: CSSProperties = {
            display: "inline-block",
            maxHeight: 25,
            maxWidth: 50,
            height: "auto",
            width: "auto",
        }

        return (
            <table style={{whiteSpace: "normal", lineHeight: "92%", height: 25, overflow: "hidden"}}>
                <tr>
                    <td>
                        <div style={{height: 25, width: 50, textAlign: "right"}}>
                            <img style={imgStyle} src={"kit/providers/" + this.props.data.channelImage}/>
                        </div>
                    </td>
                    <td>
                        <div style={{padding: 2, height: 25}}>
                            <span style={{marginRight: 5, color: "#FFC107"}}>{this.props.data.channelTitle}</span>
                            <span style={{color: "white", marginRight: 5}}>{this.props.data.title}</span>
                            <span style={{fontSize: 13, color: "#a2a2a2"}}>{this.props.data.desc}</span>
                        </div>
                    </td>
                </tr>
            </table>
        )
        //console.log(this.props);
        // return (
        //     <Highlighter
        //         highlightClassName="search-mark"
        //         searchWords={[this.props.data.filterStr]}
        //         textToHighlight={this.props.value}
        //     />);
    }
}


@observer
export class MainEpg extends React.Component<IMainEpgProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }

    componentDidMount() {
        appState.mainEpg = this;
    };

    backButtonPressed() {
        this.text += "  esc";
    }

    epg: IEpg[];

    async loadEpg() {

        await appState.doLogin();

        let req: ILoadCurrentEpgReq = {
            cmd: LOAD_CURRENT_EPG
        };

        httpRequest<ILoadCurrentEpgReq, ILoadCurrentEpgAns>(req)
            .then((ans: any) => {
                this.epg = ans.epg;
                this.comboGridApi.setRowData(this.epg);
                this.comboGridApi.setFocusedCell(0, "col0");


                console.log("loadEpg", this.epg);
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
            left: 20,
            top: 20,
            right: 20,
            bottom: 20,
            border: "0px solid yellow",
            color: "yellow",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
        };

        if (appState.mainEpgVisible)
            style.display = "block";
        else
            style.display = "none";


        let cols: AgGridColDef[] = [];
        let fromCol: AgGridColDef = {
            colId: "col0",
            headerName: "-",
            field: "title",
            width: 535,
            //cellStyle: {whiteSpace: "normal"},
            cellRendererFramework: AgGrid_CellRenderer,
        };
        cols.push(fromCol);

        let agOpt = {
            rowHeight: 38,
            headerHeight: 0,
            columnDefs: cols,
            suppressColumnVirtualisation: true,
            enableSorting: false,
            // onGridReady: () => {
            //     //console.log("grid ready");
            //     this.opt.columnApi.autoSizeColumns(this.tabloColumns);
            // }
        };


        return (
            <div
                onKeyPress={(e: KeyboardEvent<any>) => {
                    console.log("keyCode=", e.keyCode);
                    this.text += "  " + e.keyCode + " " + e.key;
                }}
                onKeyDown={(e: KeyboardEvent<any>) => {
                    console.log("keyDown=", e.keyCode);
                    this.text += "  " + e.keyCode + " " + e.key;
                }}
                style={style}>
                <span> привет уроды</span>
                <button onClick={() => {
                    console.log("пауза");
                    appState.nativePlayer.pause()
                }}>Пауза
                </button>
                <button onClick={() => {
                    console.log("пауза");
                    appState.nativePlayer.play()
                }}>Play
                </button>
                <button onClick={() => {
                    appState.nativePlayer.src = "http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/106/index.m3u8?utc=1494406801&lutc=1494590932";
                    appState.nativePlayer.play()
                }}>РБК
                </button>
                <button onClick={() => {
                    appState.nativePlayer.src = "http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/127/index.m3u8";
                    appState.nativePlayer.play()
                }}>Первый
                </button>
                <button onClick={() => {
                    appState.nativePlayer.src = "http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/508/index.m3u8";
                    appState.nativePlayer.play()
                }}>ТВ3
                </button>
                <button onClick={() => {
                    console.log("пауза");
                    appState.mainEpgVisible = false
                }}>Close
                </button>
                <button onClick={() => {
                    this.loadEpg();
                }}>Load teleguid
                </button>
                <br/>
                {screen.width}x{screen.height}
                <div style={{height: 450, width: 550}} className="ag-dark">
                    <AgGridReact
                        gridOptions={agOpt}
                        onGridReady={this.gridReadyHandler}
                    >
                    </AgGridReact>
                </div>

            </div>
        );
    }

}