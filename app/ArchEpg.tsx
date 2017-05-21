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
    IEpg, ILoadArchEpgAns, ILoadArchEpgReq, ILoadCurrentEpgAns, ILoadCurrentEpgReq, LOAD_ARCH_EPG,
    LOAD_CURRENT_EPG
} from "./api/api";
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
            maxHeight: 35,
            maxWidth: 60,
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
        //testSpan = <span>{this.props.data.currtime.toString()}</span>;


        let time = (new Date(this.props.data.time)).getTime();
        let endtime = (new Date(this.props.data.endtime)).getTime();
        let currtime = (new Date(this.props.data.currtime)).getTime();
        let currtimePercent = (currtime - time) / (endtime - time);

        let timeColor = "coral"; // архив
        let state = "архив";
        if (this.props.data.endtime < this.props.data.currtime) {
            timeColor = "coral"; // архив
            state = "архив";
        }
        else if (this.props.data.time < this.props.data.currtime) {
            timeColor = "darkturquoise"; // в эфире
            state = "сейчас";
        }
        else {
            timeColor = "yellowgreen"; // будет
            state = "будет";
        }


        return (
            <table style={{whiteSpace: "normal", lineHeight: "93%", height: 25, overflow: "hidden", width: "100%"}}>
                <tr>
                    <td>
                        <div style={{height: 25, width: 50, textAlign: "right"}}>
                            <img style={imgStyle}
                                 src={config.apiUrl.replace("api", "") + "kit/providers/new.s-tv.ru/images/" + this.props.data.image}/>
                        </div>
                    </td>
                    <td style={{width: "100%"}}>
                        <div style={{padding: 2, height: 23}}>
                            {testSpan}
                            <span style={{
                                marginRight: 5,
                                color: timeColor,
                                width: 50
                            }}>{moment(this.props.data.time).add(3,"h").format("dd")  }</span>
                            <span style={{
                                marginRight: 5,
                                color: timeColor
                            }}>{moment(this.props.data.time).add(3,"h").format("HH:mm")}</span>
                            <span style={{color: "white", marginRight: 5}}>{this.props.data.title}</span>
                            {genreSpan}
                            {yearSpan}
                            {directorSpan}
                            {actorsSpan}
                            <span style={{fontSize: 13, color: "#a2a2a2"}}>{", " + this.props.data.desc}</span>
                        </div>
                    </td>
                    <td>
                        <span style={{color: timeColor, fontSize:12}}>{state}</span>
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
export class ArchEpg extends React.Component<IMainEpgProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }

    componentDidMount() {
        appState.archEpg = this;
    };

    backButtonPressed() {
        appState.closeArchEpg();
    }

    enterKeyPressed() {
        if (appState.archEpgVisible && !appState.archEpgPopupVisible) {

            if (this.focusedEpg!.endtime < this.focusedEpg!.currtime) {
                // архив
                appState.archEpgVisible = false;
                appState.mainEpgVisible = false;
                appState.infoBoxVisible = false;
                // "http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/106/index.m3u8?utc=1494406801&lutc=1494590932"
                let utc= moment(this.focusedEpg!.time).add(3,"h").add(-1,"m").toDate().getTime().toString().substr(0,10);
                let lutc= (new Date()).getTime().toString().substr(0,10);
                console.log("appState.nativePlayer.src",appState.mainEpg.focusedEpg!.channelUrl+"?utc="+utc+"&lutc="+lutc);
                appState.nativePlayer.src = appState.mainEpg.focusedEpg!.channelUrl+"?utc="+utc+"&lutc="+lutc;
                appState.nativePlayer.play();
            }
            else if (this.focusedEpg!.time < this.focusedEpg!.currtime) {
                // в эфире
                appState.archEpgVisible = false;
                appState.mainEpgVisible = false;
                appState.infoBoxVisible = false;
                appState.nativePlayer.src = appState.mainEpg.focusedEpg!.channelUrl;
                appState.nativePlayer.play();
            }
            else {
                // будет

            }

        }
    }

    popupKeyPressed() {
        if (appState.archEpgVisible && !appState.archEpgPopupVisible) {
            appState.archEpgPopup.openPopup();
        }
    }


    // setCategoryFilter(category: string) {
    //     this.focusedChannelId = -1;
    //     this.category = category;
    //     this.loadEpg();
    // }

    @observable category: string = "АРХИВ";
    epg: IEpg[];


    async loadEpg() {
        await appState.doLogin();


        let req: ILoadArchEpgReq = {
            cmd: LOAD_ARCH_EPG,
            login: appState.login,
            password: appState.password,
            channelId: appState.mainEpg.focusedChannelId
        };

        httpRequest<ILoadArchEpgReq, ILoadArchEpgAns>(req)
            .then((ans: any) => {
                console.log("loadEpg", ans.epg[0]);

                if (!this.epg || this.epg.length !== ans.epg.length) {
                    this.epg = ans.epg;
                    this.comboGridApi.setRowData(this.epg);
                }
                else {
                    let index = 0;
                    this.comboGridApi.forEachNode(function (node: any) {
                        node.data = ans.epg[index];
                        index++;
                    });
                    this.comboGridApi.refreshView();
                }

                if (!this.focusedTime) {
                    this.comboGridApi.ensureIndexVisible(0);
                    this.comboGridApi.setFocusedCell(0, "col0");
                    console.log("setFocusedCell(0)");
                }
                else {
                    let index = 0;
                    for (let item of this.epg) {
                        if (item.time <= this.focusedTime && item.endtime >= this.focusedTime) {

                            if (!this.isTimeVisible(this.focusedTime)) {
                                this.comboGridApi.ensureIndexVisible(this.epg.length - 1);
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

    private isTimeVisible(time: string): boolean {
        var nodes = this.comboGridApi.getRenderedNodes();
        for (let node of nodes) {
            if (node.data.time === time) {
                console.log("time visible");
                return true;
            }
        }
        console.log("time NOT visible");
        return false;
    }

    comboGridApi: GridApi;
    comboGridColumnApi: ColumnApi;

    gridReadyHandler = (event: { api: GridApi, columnApi: ColumnApi }) => {
        this.comboGridApi = event.api;
        this.comboGridColumnApi = event.columnApi;

    };

    focusedTime: string;
    focusedEpg?: IEpg;

    //@observable text: string = "";
    // http://kostiasa.iptvbot.biz/iptv/ZPM92BU4CR5XF3/508/index.m3u8

    render(): any {
        console.log("render ArchEpg");
        let style: CSSProperties = {
            ...appState.getMainEpgPos(),
            position: "absolute",
            border: "0px solid yellow",
            color: "yellow",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
        };

        if (appState.archEpgVisible)
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
                    <span className="timer-str" style={{fontSize: 16, color: "darkturquoise", padding: 3}}></span>
                    <span style={{
                        fontSize: 16,
                        color: "white",
                        padding: 3,
                        float: "right"
                    }}>каналы: {this.category.toLocaleUpperCase()}</span>

                </div>
                <div id="archepggrid"
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
                                this.focusedTime = this.focusedEpg.time;
                                appState.infoBox.loadInfo(this.focusedEpg.channelId, this.focusedTime);
                            }
                            else
                                alert("focused time Epg?");

                        }}

                    >
                    </AgGridReact>
                </div>

            </div>
        );
    }

}