import * as React from "react";
import * as ReactDOM from "react-dom";
import {observable, autorun} from "mobx";
import {appState} from "./AppState";
import {observer} from "mobx-react";
import {MainVideo} from "./MainVideo";
import {MainEpg} from "./MainEpg";
import {InfoBox} from "./InfoBox";
import {MainEpgPopup} from "./MainEpgPopup";
import {ArchEpg} from "./ArchEpg";
import {ArchEpgPopup} from "./ArchEpgPopup";


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


    enterKeyDownCounter: number = 0;


    componentDidMount() {
        appState.app=this;
        // setTimeout(() => {
        //     appState.mainEpgVisible = true;
        //     appState.infoBoxVisible = true;
        // }, 2000);

        setTimeout(() => {
            appState.nativePlayer.play();
        }, 1000);

        window.addEventListener("resize", () => {
            //appState.winWidth = $(window).width();
            //appState.winHeight = $(window).height();
            this.forceUpdate();
        });

        document.addEventListener("keydown", (e: any) => {
            console.log("global keydown", e.keyCode);
            if (e.keyCode === 13) {
                this.enterKeyDownCounter++;
                //console.log("enterKeyDownCounter", this.enterKeyDownCounter);

                if (this.enterKeyDownCounter > 5) {  // popup
                    this.enterKeyDownCounter = 0;

                    if (appState.mainEpg)
                        appState.mainEpg.popupKeyPressed();

                }
            }
            if (!appState.mainEpgVisible && !appState.archEpgVisible && (e.keyCode === 38 || e.keyCode === 40 )) { //вверх вниз
                appState.mainEpgVisible = true;
                appState.infoBoxVisible = true;
                appState.mainEpg.loadEpg();
            }

            if (e.keyCode === 37 || e.keyCode === 39) {  // влево вправо
                if (appState.mainEpgVisible && !appState.mainEpgPopupVisible)
                    appState.showArchEpg();
            }

        }, false);

        document.addEventListener("keyup", (e: any) => {

            if (appState.mainEpgPopupVisible)
                return;
            //console.log("global keyup", e.keyCode);

            if (e.keyCode === 13 && this.enterKeyDownCounter === 1) {
                if (appState.mainEpg)
                    appState.mainEpg.enterKeyPressed();
                if (appState.archEpg)
                    appState.archEpg.enterKeyPressed();
            }
            if (e.keyCode === 13) {
                this.enterKeyDownCounter = 0;
            }

        }, false);

        document.addEventListener("backbutton", () => {
            if (appState.mainEpg)
                appState.mainEpg.backButtonPressed();
            if (appState.mainEpgPopup)
                appState.mainEpgPopup.backButtonPressed();
            if (appState.archEpg)
                appState.archEpg.backButtonPressed();
            if (appState.archEpgPopup)
                appState.archEpgPopup.backButtonPressed();
        }, false);


    };


    render(): any {

        if (!(window as any).cordova) {
            return (
                <div style={{
                    position: "relative",
                    width: 960,
                    height: 540,
                    border: "0px dotted white",
                    overdlow: "hidden"
                }}>
                    <MainVideo/>
                    <MainEpg/>
                    <MainEpgPopup/>
                    <ArchEpg/>
                    <ArchEpgPopup/>
                    <InfoBox/>
                </div>
            );
        }
        else {
            return (
                <div style={{position: "relative", height: "100%"}}>
                    <MainVideo/>
                    <MainEpg/>
                    <MainEpgPopup/>
                    <ArchEpg/>
                    <ArchEpgPopup/>
                    <InfoBox/>
                </div>
            );
        }
    }

}

