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

export interface IWelcomePageProps {

}

@observer
export class WelcomePage extends React.Component<IWelcomePageProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }

    componentDidMount() {

    };


    render(): any {

        console.log("render WelcomePage");

        let style: CSSProperties = {
            backgroundColor: "ghostwhite",
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            padding: 50,
            fontSize: 20

        };
        if (appState.loginOk || appState.starting)
            return null;
        else
            return (
                <div
                    style={style} width={screen.width} height={screen.height}>
                    <div>
                        Buhta Player 1.0
                    </div>
                    <div>
                        <p><strong>Buhta Player</strong> - это приложение для медиаплеера <strong>Xiaomi Mi Box
                            3</strong>. Оно позволяет просматривать
                            тв-передачи, транслируемые IPTV-сервисом ЭДЭМ (<strong>edem.tv</strong>)</p>
                        <p>Для настройки плейлиста зайдите на сайт <strong>player.buhta.ru</strong></p>
                        <p>логин: <strong>{appState.login}</strong></p>
                        <p>пароль: <strong>{appState.password}</strong></p>
                    </div>
                </div>
            );
    }

}