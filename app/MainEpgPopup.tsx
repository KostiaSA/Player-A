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

        /*
         HD
         взрослые
         детские
         другие
         дру�ие
         кино
         музыка
         новости
         познавательные
         развлекательные
         */

        let chName = "";
        if (appState.mainEpg && appState.mainEpg.focusedEpg)
            chName = appState.mainEpg.focusedEpg.channelTitle;

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
                            <button style={chGroupButtonStyle}>ВСЕ</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}>познавательные</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}>HD каналы</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle}>кино</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}>развлекательные</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}>взрослые</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle}>новости</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}>детские</button>
                        </td>
                        <td>
                            <button style={chGroupButtonStyle}>прочие</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button style={chGroupButtonStyle}>музыка</button>
                        </td>
                    </tr>
                </table>

            </div>
        );
    }

}