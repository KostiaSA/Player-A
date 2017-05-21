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

export interface IArchEpgPopupProps {

}

@observer
export class ArchEpgPopup extends React.Component<IArchEpgPopupProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }


    savedParentFocus: Element;

    openPopup() {
        this.savedParentFocus = document.activeElement;
        appState.archEpgPopupVisible = true;
        $(".main-epg-popup button").first().focus();
    }

    closePopup() {
        appState.archEpgPopupVisible = false;
        $(this.savedParentFocus).focus();
    }

    componentDidMount() {
        appState.archEpgPopup = this;
    };


    backButtonPressed() {
        if (appState.archEpgPopupVisible) {
            this.closePopup();
        }
    }

    categoryClick(category: string) {
        this.closePopup();
        appState.archEpg.setCategoryFilter(category);
    }

    render(): any {

        let style: CSSProperties = {
            backgroundColor: "linen",
            position: "absolute",
            left: 50,
            right: 50 + appState.getInfoBoxPos().width,
            top: 80,
            bottom: 80,
            padding: 10,
            textAlign: "left"

        };

        if (appState.archEpgPopupVisible)
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
        if (appState.archEpg && appState.archEpg.focusedEpg)
            chName = appState.archEpg.focusedEpg.channelTitle;

        return (
            <div
                className="main-epg-popup"
                style={style}
            >
                <div style={{textAlign: "right", fontSize: 20, color: "chocolate", marginTop: 5, marginBottom: 5}}>
                    <span>выбор списка передач/каналов</span>
                </div>

                <button style={chButtonStyle}>архив канала:
                    <strong>{chName}</strong>
                </button>

                <button style={chButtonStyle}>архив фильмов за 4 дня</button>

                <button style={chButtonStyle}>избранные каналы</button>

                <div style={{textAlign: "right", fontSize: 20, color: "chocolate", marginTop: 20}}>
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
                            <button style={chGroupButtonStyle}onClick={(e:any) => {
                                this.categoryClick("познавательные");
                            }}>познавательные</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}onClick={() => {
                                this.categoryClick("HD")
                            }}>HD каналы</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle}onClick={() => {
                                this.categoryClick("кино")
                            }}>кино</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}onClick={() => {
                                this.categoryClick("развлекательные")
                            }}>развлекательные</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}onClick={() => {
                                this.categoryClick("взрослые")
                            }}>взрослые</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle}onClick={() => {
                                this.categoryClick("новости")
                            }}>новости</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}onClick={() => {
                                this.categoryClick("детские")
                            }}>детские</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}onClick={() => {
                                this.categoryClick("прочие")
                            }}>прочие</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle}onClick={() => {
                                this.categoryClick("музыка")
                            }}>музыка</button>
                        </td>
                    </tr>
                </table>

            </div>
        );
    }

}