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

export interface IMainEpgPopupProps {

}

@observer
export class MainEpgPopup extends React.Component<IMainEpgPopupProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }


    savedParentFocus: Element;

    openPopup() {
        this.savedParentFocus = document.activeElement;
        appState.mainEpgPopupVisible = true;
        $(".main-epg-popup button").first().focus();
    }

    closePopup() {
        appState.app.enterKeyDownCounter = 0;
        appState.mainEpgPopupVisible = false;
        $(this.savedParentFocus).focus();
    }

    componentDidMount() {
        appState.mainEpgPopup = this;
    };


    backButtonPressed() {
        if (appState.mainEpgPopupVisible) {
            this.closePopup();
        }
    }

    categoryClick(category: string) {
        this.closePopup();
        appState.mainEpg.setCategoryFilter(category);
    }

    serverClick(server: string) {
        this.closePopup();
        appState.server = server;
        appState.restartVideo();
    }


    renderFilter(): any {

        let chGroupButtonStyle: CSSProperties = {
            display: "block",
            fontSize: 17,
            width: "100%",
            margin: 3,
            border: "none",
            backgroundColor: "transparent",
            color: "floralwhite"
        };

        return (
            <div>
                <div style={{textAlign: "center", fontSize: 20, color: "chocolate", marginTop: 20}}>
                    <span>фильтр по категориям</span>
                </div>
                <table>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.categoryClick("ВСЕ")
                            }}>ВСЕ
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={(e: any) => {
                                this.categoryClick("познавательные");
                            }}>познавательные
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.categoryClick("HD")
                            }}>HD каналы
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.categoryClick("кино")
                            }}>кино
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.categoryClick("развлекательные")
                            }}>развлекательные
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.categoryClick("взрослые")
                            }}>взрослые
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.categoryClick("новости")
                            }}>новости
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.categoryClick("детские")
                            }}>детские
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.categoryClick("прочие")
                            }}>эфирные
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.categoryClick("музыка")
                            }}>музыка
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        )
    }

    renderServers(): any {

        let chGroupButtonStyle: CSSProperties = {
            display: "block",
            fontSize: 17,
            width: "100%",
            margin: 3,
            border: "none",
            backgroundColor: "transparent",
            color: "yellowgreen "
        };

        return (
            <div>
                <div style={{textAlign: "center", fontSize: 20, color: "chocolate", marginTop: 20}}>
                    <span>выбор сервера edem.tv</span>
                </div>
                <table>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.serverClick("iptvbot.net")
                            }}>iptvbot.net
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={(e: any) => {
                                this.serverClick("iptvbot.biz");
                            }}>iptvbot.biz
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.serverClick("iptvspy.me")
                            }}>iptvspy.me
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.serverClick("iptvspy.net")
                            }}>iptvspy.net
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.serverClick("iptvzone.me")
                            }}>iptvzone.me
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.serverClick("iptvzone.net")
                            }}>iptvzone.net
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.serverClick("ottclub.mobi")
                            }}>ottclub.mobi
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.serverClick("ottv.biz")
                            }}>ottv.biz
                            </button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.serverClick("ottv.info")
                            }}>ottv.info
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle} onClick={() => {
                                this.serverClick("ottclub.ru")
                            }}>ottclub.ru
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        )
    }

    render(): any {

        let style: CSSProperties = {
            backgroundColor: "#484848",
            position: "absolute",
            left: 70,
            right: 70,
            top: 70,
            bottom: 70,
            padding: 10,
            textAlign: "left",
            border: "2px solid #ff6b02"

        };

        if (appState.mainEpgPopupVisible)
            style.display = "block";
        else
            style.display = "none";


        let chButtonStyle: CSSProperties = {
            display: "block",
            fontSize: 17,
            margin: 3,
            border: "none",
            backgroundColor: "transparent"
        };

        let chButtonStyle2: CSSProperties = {
            fontSize: 17,
            margin: 3,
            border: "none",
            backgroundColor: "transparent"
        };

        let chGroupButtonStyle: CSSProperties = {
            display: "block",
            fontSize: 17,
            width: "100%",
            margin: 3,
            border: "none",
            backgroundColor: "transparent"
        };

        let chName = "";
        if (appState.mainEpg && appState.mainEpg.focusedEpg)
            chName = appState.mainEpg.focusedEpg.channelTitle;


        return (
            <div
                className="main-epg-popup"
                style={style}
            >
                {/*<div style={{textAlign: "center", fontSize: 20, color: "chocolate", marginTop: 5, marginBottom: 5}}>*/}
                    {/*<span>выбор списка передач/каналов</span>*/}
                {/*</div>*/}

                {/*<button style={chButtonStyle}>архив канала:*/}
                    {/*<strong>{chName}</strong>*/}
                {/*</button>*/}

                {/*<button style={chButtonStyle}>архив фильмов за 4 дня</button>*/}

                {/*<button style={chButtonStyle}>избранные каналы</button>*/}

                <table style={{width: "100%"}}>
                    <tr>
                        <td>
                            {this.renderFilter()}
                        </td>
                        <td>
                            {this.renderServers()}
                        </td>
                    </tr>
                </table>

            </div>
        );
    }

}