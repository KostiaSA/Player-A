import * as React from "react";
import * as ReactDOM from "react-dom";
import {observable, autorun} from "mobx";
import {appState, ChannelPlayState} from "./AppState";
import {observer} from "mobx-react";
import {MainVideo} from "./MainVideo";
import {MainEpg} from "./MainEpg";
import {InfoBox} from "./InfoBox";
import {MainEpgPopup} from "./MainEpgPopup";
import {ArchEpg} from "./ArchEpg";
import {ArchEpgPopup} from "./ArchEpgPopup";
import {Footer} from "./Footer";
import {Rewinder} from "./Rewinder";
import {Pauser} from "./Pauser";


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
        appState.app = this;
        // setTimeout(() => {
        //     appState.mainEpgVisible = true;
        //     appState.infoBoxVisible = true;
        // }, 2000);

        setTimeout(() => {

            appState.playedChannel = "РБК-ТВ";
            let chState: ChannelPlayState = {
                epgChannelName: appState.playedChannel,
                epgTitle: "",
                epgTime: "",
                epgUrl: "http://kostiasa.ottv.biz/iptv/LS9WCK6KT28XLT/106/index.m3u8",
                isArchive: false,
                startTime: new Date(),
                currentTimeSec: 0,
                lastCurrentTime: new Date()
            };
            appState.channelPlayStates[appState.playedChannel] = chState;
            if (appState.nativePlayer) {
                appState.nativePlayer.src = "http://kostiasa.ottv.biz/iptv/LS9WCK6KT28XLT/106/index.m3u8";
                appState.nativePlayer.play();
            }
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
                    if (appState.archEpg)
                        appState.archEpg.popupKeyPressed();

                }
            }
            if (appState.getGuiState() === "video" && (e.keyCode === 38 || e.keyCode === 40 )) { //вверх вниз
                appState.showMainEpg(true);
            }

            if (e.keyCode === 37) {  // влево
                if (appState.getGuiState() == "mainEpg") {
                    appState.showArchEpg();
                }
                else if (appState.getGuiState() == "video") {
                    appState.showRewinder();
                    appState.rewinderSecs = -15;
                }
                else if (appState.getGuiState() === "rewinder") {
                    if (appState.rewinderSecs < 600)
                        appState.rewinderSecs -= 15;
                    else
                        appState.rewinderSecs -= 60;
                }
            }

            if (e.keyCode === 39) {  // вправо
                if (appState.getGuiState() == "mainEpg") {
                    if (appState.mainEpg)
                        appState.mainEpg.popupKeyPressed();
                }
                else if (appState.getGuiState() == "archEpg") {
                    if (appState.archEpg)
                        appState.archEpg.popupKeyPressed();
                }
                if (appState.getGuiState() == "video") {
                    appState.showRewinder();
                    appState.rewinderSecs = 15;
                }
                else if (appState.getGuiState() === "rewinder") {
                    if (appState.rewinderSecs < 600)
                        appState.rewinderSecs += 15;
                    else
                        appState.rewinderSecs += 60;
                }
            }

        }, false);

        document.addEventListener("keyup", (e: any) => {

            if (appState.getGuiState() === "mainEpgPopup")
                return;
            if (appState.getGuiState() === "archEpgPopup")
                return;
            //console.log("global keyup", e.keyCode);

            if (e.keyCode === 13 && this.enterKeyDownCounter === 1) {
                if (appState.getGuiState() === "rewinder")
                    appState.rewinder.enterKeyPressed();
                else if (appState.getGuiState() === "mainEpg")
                    appState.mainEpg.enterKeyPressed();
                else if (appState.getGuiState() === "archEpg")
                    appState.archEpg.enterKeyPressed();
                else if (appState.getGuiState() === "video")
                    appState.showPauser();
                else if (appState.getGuiState() === "pauser")
                    appState.pauser.enterKeyPressed();

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
            if (appState.rewinder)
                appState.rewinder.backButtonPressed();
            if (appState.pauser)
                appState.pauser.backButtonPressed();
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
                    <Footer/>
                    <Rewinder/>
                    <Pauser/>
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
                    <Footer/>
                    <Rewinder/>
                    <Pauser/>


                    {/*<button style={{*/}
                        {/*position: "absolute",*/}
                        {/*top: 0,*/}
                        {/*left: 100*/}
                    {/*}} onClick={() => {*/}
                        {/*console.log("Play");*/}
                        {/*appState.nativePlayer.play()*/}
                    {/*}}>Play*/}
                    {/*</button>*/}
                    {/*<button style={{*/}
                        {/*position: "absolute",*/}
                        {/*top: 0,*/}
                        {/*left: 10*/}
                    {/*}} onClick={() => {*/}
                        {/*console.log("пауза");*/}
                        {/*appState.nativePlayer.pause()*/}
                    {/*}}>Пауза*/}
                    {/*</button>*/}
                    {/*<button style={{*/}
                        {/*position: "absolute",*/}
                        {/*top: 0,*/}
                        {/*left: 200*/}
                    {/*}} onClick={() => {*/}
                        {/*console.log("минус минута");*/}
                        {/*//var utc = ((new Date()).getTime()-50*60*1000).toString().substr(0, 10);*/}
                        {/*var utc = ((new Date("2017-05-21 10:59:30")).getTime()).toString().substr(0, 10);*/}
                        {/*var lutc = (new Date()).getTime().toString().substr(0, 10);*/}
                        {/*//console.log("http://kostiasa.ottv.biz/iptv/LS9WCK6KT28XLT/106/index.m3u8" + "?utc=" + utc + "&lutc=" + lutc);*/}
                        {/*appState.nativePlayer.src = "http://kostiasa.ottv.biz/iptv/LS9WCK6KT28XLT/106/index.m3u8" + "?utc=" + utc + "&lutc=" + lutc;*/}
                        {/*appState.nativePlayer.play()*/}
                    {/*}}>Минус минута*/}
                    {/*</button>*/}
                    {/*<span style={{*/}
                        {/*color: "yellow",*/}
                        {/*fontSize: 15,*/}
                        {/*position: "absolute",*/}
                        {/*top: 0,*/}
                        {/*left: 400*/}
                    {/*}} className="timer-str"></span>*/}
                </div>
            );
        }
    }

}

