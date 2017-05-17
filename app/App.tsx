import * as React from "react";
import * as ReactDOM from "react-dom";
import {observable, autorun} from "mobx";
import {appState} from "./AppState";
import {observer} from "mobx-react";
import {MainVideo} from "./MainVideo";
import {MainEpg} from "./MainEpg";


export interface IAppPage {
    icon: string;
    color: string;
    content: React.ReactElement<any>;
    onClick?: () => void;
}

export let app: App;

export function setApp(_app: App) {
    app = _app;

    // autorun(() => {
    //     if (app)
    //         console.log("app.winHeight " + appState.winHeight);
    //     else
    //         console.log("жопа ")
    // })
}

@observer
export class App extends React.Component<any, any> {


    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;

        this.pages = [];

    }

    nativeTabs: Element;
    pages: IAppPage[];


    handlePageClick() {

    }

    componentDidMount() {
        setTimeout(() => {
            appState.mainEpgVisible = true;
        }, 3000);

        setTimeout(() => {
            appState.nativePlayer.play();
        }, 1000);

        window.addEventListener("resize", () => {
            //appState.winWidth = $(window).width();
            //appState.winHeight = $(window).height();
            this.forceUpdate();
        });
    };


    render(): any {

        if (!(window as any).cordova) {
            return (
                <div style={{position: "relative", width:960, height: 540, border:"0px dotted white", overdlow:"hidden"}}>
                    <MainVideo/>
                    <MainEpg/>
                </div>
            );
        }
        else {
            return (
                <div style={{position: "relative", height: "100%"}}>
                    <MainVideo/>
                    <MainEpg/>
                </div>
            );
        }
    }

}
