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
import {config} from "./config/config";


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

        let yearColor = "rgb(204, 204, 204)";

        let genreSpan: any = null;
        if (this.props.data.genreTitle)
            genreSpan = <span style={{fontSize: 13, color: "#a2a2a2"}}>{this.props.data.genreTitle}</span>;

        let yearSpan: any = null;
        if (this.props.data.year && this.props.data.year > 0)
            yearSpan = <span style={{fontSize: 13, color: yearColor}}>{", " + this.props.data.year + " г."}</span>;

        let directorSpan: any = null;
        if (this.props.data.director && this.props.data.director !== "")
            directorSpan =
                <span style={{fontSize: 13, color: "#a2a2a2"}}>{", реж.: " + this.props.data.director}</span>;

        let actorsSpan: any = null;
        if (this.props.data.actors && this.props.data.actors !== "")
            actorsSpan = <span style={{fontSize: 13, color: "#a2a2a2"}}>{", в ролях: " + this.props.data.actors}</span>;

        let testSpan: any = null;
        //testSpan=<span>{this.props.data.time.toString()} - {this.props.data.endtime.toString()}</span>;
        testSpan = <span>{this.props.data.currtime.toString()}</span>;


        let time = (new Date(this.props.data.time)).getTime();
        let endtime = (new Date(this.props.data.endtime)).getTime();
        let currtime = (new Date(this.props.data.currtime)).getTime();
        let currtimePercent = (currtime - time) / (endtime - time);

        return (
            <table style={{whiteSpace: "normal", lineHeight: "93%", height: 25, overflow: "hidden", width: "100%"}}>
                <tr>
                    <td>
                        <div style={{height: 25, width: 50, textAlign: "right"}}>
                            <img style={imgStyle}
                                 src={config.apiUrl.replace("api", "") + "kit/providers/" + this.props.data.channelImage}/>
                        </div>
                    </td>
                    <td>
                        <div style={{padding: 2, height: 23}}>
                            {testSpan}
                            <span style={{marginRight: 5, color: "#FFC107"}}>{this.props.data.channelTitle}</span>
                            <span style={{color: "white", marginRight: 5}}>{this.props.data.title}</span>
                            {genreSpan}
                            {yearSpan}
                            {directorSpan}
                            {actorsSpan}
                            <span style={{fontSize: 13, color: "#a2a2a2"}}>{", " + this.props.data.desc}</span>
                        </div>
                    </td>
                    <td>
                        <div style={{height: 6, width: 30, border: "1px solid orange", backgroundColor: "black"}}>
                            <div style={{height: 6, width: currtimePercent * 30, backgroundColor: "orange"}}>
                            </div>
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
        appState.mainEpgVisible = false;
        appState.infoBoxVisible = false;
    }

    epg: IEpg[];


    async loadEpg() {
        await appState.doLogin();


        let req: ILoadCurrentEpgReq = {
            cmd: LOAD_CURRENT_EPG,
            login: appState.login,
            password: appState.password,
        };

        httpRequest<ILoadCurrentEpgReq, ILoadCurrentEpgAns>(req)
            .then((ans: any) => {
                console.log("loadEpg", ans.epg[0]);

                if (!this.epg || this.epg.length !== ans.epg.length) {
                    this.epg = ans.epg;
                    this.comboGridApi.setRowData(this.epg);
                }
                else {
                    let index=0;
                    this.comboGridApi.forEachNode( function(node:any) {
                        node.data=ans.epg[index];
                        index++;
                    });
                    this.comboGridApi.refreshView();
                }

                if (this.focusedChannelId === -1) {
                    this.comboGridApi.ensureIndexVisible(0);
                    this.comboGridApi.setFocusedCell(0, "col0");
                    console.log("setFocusedCell(0)");
                }
                else {
                    let index = 0;
                    for (let item of this.epg) {
                        if (item.channelId === this.focusedChannelId) {

                            if (!this.isChannelVisible(this.focusedChannelId)) {
                                this.comboGridApi.ensureIndexVisible(this.epg.length-1);
                                this.comboGridApi.ensureIndexVisible(index);
                                this.comboGridApi.setFocusedCell(index, "col0");
                            }
                            else
                                this.comboGridApi.setFocusedCell(index, "col0");

                            break;
                        }
                        else
                            index++;
                    }
                }
            })
            .catch((err: any) => {
                alert(err);
            });


    }

    private isChannelVisible(channelId: number): boolean {
        var nodes = this.comboGridApi.getRenderedNodes();
        for (let node of nodes) {
            if (node.data.channelId === channelId) {
                console.log("ch visible");
                return true;
            }
        }
        console.log("ch NOT visible");
        return false;
    }

    comboGridApi: GridApi;
    comboGridColumnApi: ColumnApi;

    gridReadyHandler = (event: { api: GridApi, columnApi: ColumnApi }) => {
        this.comboGridApi = event.api;
        this.comboGridColumnApi = event.columnApi;

    };

    focusedChannelId: number = -1;
    focusedEpg?: IEpg;

    //@observable text: string = "";
    // http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/508/index.m3u8

    render(): any {
        console.log("render mainEpg");
        let style: CSSProperties = {
            ...appState.getMainEpgPos(),
            position: "absolute",
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
            width: appState.getMainEpgWidth() - 17,
            cellRendererFramework: AgGrid_CellRenderer,
        };
        cols.push(fromCol);

        let agOpt = {
            rowHeight: 42,
            headerHeight: 0,
            columnDefs: cols,
            suppressColumnVirtualisation: true,
            enableSorting: false,
            // onGridReady: () => {
            //     //console.log("grid ready");
            //     this.opt.columnApi.autoSizeColumns(this.tabloColumns);
            // }
        };

        let headerHeight = 25;

        return (
            <div
                onKeyPress={(e: KeyboardEvent<any>) => {
                    console.log("keyCode=", e.keyCode);
                    //this.text += "  " + e.keyCode + " " + e.key;
                }}
                onKeyDown={(e: KeyboardEvent<any>) => {
                    console.log("keyDown=", e.keyCode);
                    //this.text += "  " + e.keyCode + " " + e.key;
                }}
                style={style}>
                <div style={{height: headerHeight}}>
                    <span className="timer-str" style={{fontSize: 16, color: "yellow", padding: 3}}></span>
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
                        appState.mainEpgVisible = false;
                        appState.infoBoxVisible = false;
                    }}>Close
                    </button>
                    <button onClick={() => {
                        this.loadEpg();
                    }}>Load teleguid
                    </button>
                    {screen.width}x{screen.height}
                </div>
                <div id="mainepggrid"
                     style={{height: appState.getMenuHeight() - headerHeight, width: appState.getMainEpgWidth()}}
                     className="ag-dark">
                    <AgGridReact
                        gridOptions={agOpt}
                        onGridReady={this.gridReadyHandler}
                        onCellFocused={(e: any) => {

                            let focusedRowIndex = this.comboGridApi.getFocusedCell().rowIndex;
                            let renderedRows = this.comboGridApi.getRenderedNodes();

                            this.focusedEpg = undefined;//renderedRows[0].data;

                            for (let row of renderedRows) {
                                if (row.rowIndex === focusedRowIndex) {
                                    this.focusedEpg = row.data;
                                    break;
                                }
                            }

                            if (this.focusedEpg) {
                                this.focusedChannelId = this.focusedEpg.channelId;

                                appState.infoBox.loadInfo(this.focusedEpg.channelId, this.focusedEpg.time);
                                $("#mainepggrid").find(".ag-cell").off("keydown.buhta");
                                $("#mainepggrid").find(".ag-cell").on("keydown.buhta", (event) => {
                                    if (event.keyCode === 13) {
                                        appState.mainEpgVisible = false;
                                        appState.infoBoxVisible = false;
                                        appState.nativePlayer.src = this.focusedEpg!.channelUrl;
                                        appState.nativePlayer.play();
                                    }
                                });
                            }
                            else
                                alert("focusedEpg?");

                        }}

                    >
                    </AgGridReact>
                </div>

            </div>
        );
    }

}