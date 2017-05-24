import {observable} from "mobx";
import {App, IAppPage} from "./App";
import moment = require("moment");
import {MainEpg} from "./MainEpg";
import {httpRequest} from "./utils/httpRequest";
import {GET_ENCRYPT_KEY_CMD, IGetEncryptKeyAns, IGetEncryptKeyReq, ILoginAns, ILoginReq, LOGIN_CMD} from "./api/api";
import {InfoBox} from "./InfoBox";
import {MainEpgPopup} from "./MainEpgPopup";
import {ArchEpg} from "./ArchEpg";
import {ArchEpgPopup} from "./ArchEpgPopup";
import {Footer} from "./Footer";
import {Rewinder} from "./Rewinder";
import {Pauser} from "./Pauser";


export interface ChannelPlayState {
    epgChannelName: string;
    epgTitle: string;
    epgTime: string;
    epgUrl: string;

    isArchive: boolean;
    startTime: Date;
    currentTimeSec: number;
    lastCurrentTime: Date;
}

export type GuiState =
    "video"
    | "mainEpg"
    | "mainEpgPopup"
    | "archEpg"
    | "archEpgPopup"
    | "footer"
    | "rewinder"
    | "pauser";

export class AppState {
    loginOk: boolean;
    @observable sessionId: string;
    @observable login: string = "212850";
    @observable password: string = "31025";
    encryptKey: string;


    playedChannel: string;
    channelPlayStates: { [epgChannelName: string]: ChannelPlayState; } = {};

    app: App;
    mainEpg: MainEpg;
    mainEpgPopup: MainEpgPopup;

    archEpg: ArchEpg;
    archEpgPopup: ArchEpgPopup;

    infoBox: InfoBox;
    footer: Footer;
    rewinder: Rewinder;
    pauser: Pauser;

    screenSize: { height: number, width: number };

    @observable mainEpgVisible: boolean = false;
    @observable mainEpgPopupVisible: boolean = false;

    @observable archEpgVisible: boolean = false;
    @observable archEpgPopupVisible: boolean = false;

    @observable infoBoxVisible: boolean = false;

    @observable footerVisible: boolean = false;
    @observable rewinderVisible: boolean = false;
    @observable rewinderSecs: number = 0;

    @observable pauserVisible: boolean = false;

    nativePlayer: HTMLVideoElement;


    clearState() {
    }

    async doLogin(): Promise<void> {

        if (appState.loginOk) {
            return Promise.resolve();
        }
        else {
            return httpRequest<IGetEncryptKeyReq, IGetEncryptKeyAns>({cmd: GET_ENCRYPT_KEY_CMD})
                .then((ans: IGetEncryptKeyAns) => {

                    appState.encryptKey = ans.encryptKey;

                    let loginReq: ILoginReq = {
                        cmd: LOGIN_CMD,
                        login: appState.login,
                        password: appState.password
                    };

                    return httpRequest<ILoginReq, ILoginAns>(loginReq)
                        .then((ans: any) => {
                            appState.loginOk = true;
                            window.localStorage.setItem("login", appState.login);
                            window.localStorage.setItem("password", appState.password);
                        })
                        .catch((err: any) => {
                            alert(err);
                        });

                })
                .catch((err: any) => {
                    alert(err);
                });
        }

    }


    getMenuPadding(): number {
        return 20;
    }

    getInfoBoxWidthPercent(): number {
        return 37;
    }

    getMenuHeight(): number {
        return screen.height - (2 * this.getMenuPadding());
    }

    getMenuWidth(): number {
        return screen.width - (2 * this.getMenuPadding());
    }

    getInfoBoxWidth(): number {
        return Math.round(this.getMenuWidth() * this.getInfoBoxWidthPercent() / 100);
    }

    getMainEpgWidth(): number {
        return this.getMenuWidth() - this.getInfoBoxWidth();
    }

    getMainEpgPos(): any {
        return {
            left: this.getMenuPadding(),
            top: this.getMenuPadding(),
            width: this.getMainEpgWidth(),
            bottom: this.getMenuPadding(),
        }
    }

    getInfoBoxPos(): any {
        return {
            left: this.getMainEpgPos().left + this.getMainEpgPos().width,
            top: this.getMenuPadding(),
            width: this.getInfoBoxWidth(),
            bottom: this.getMenuPadding(),
        }
    }

    showArchEpg() {
        this.pauserVisible = false;
        this.rewinderVisible = false;
        this.footerVisible = false;
        this.mainEpgVisible = false;
        this.mainEpgPopupVisible = false;
        this.archEpgVisible = true;
        this.archEpgPopupVisible = false;
        this.infoBoxVisible = true;
        this.archEpg.loadEpg();
        console.log("appState.showArchEpg");
    }

    closeArchEpg() {
        this.pauserVisible = false;
        this.mainEpgVisible = true;
        this.archEpgVisible = false;
        setTimeout(() => {
            $(this.mainEpg.focusedElement).focus()
        }, 1);
        console.log("appState.closeArchEpg");
    }

    showMainEpg(reload: boolean) {
        this.pauserVisible = false;
        this.rewinderVisible = false;
        this.footerVisible = false;
        this.mainEpgVisible = true;
        this.mainEpgPopupVisible = false;
        this.archEpgVisible = false;
        this.archEpgPopupVisible = false;
        this.infoBoxVisible = true;
        if (reload)
            this.mainEpg.loadEpg();
        console.log("appState.showMainEpg");
    }

    showVideo() {
        this.pauserVisible = false;
        this.rewinderVisible = false;
        this.footerVisible = false;
        this.mainEpgVisible = false;
        this.mainEpgPopupVisible = false;
        this.archEpgVisible = false;
        this.archEpgPopupVisible = false;
        this.infoBoxVisible = false;
        //this.app.forceUpdate();
        console.log("appState.showVideo");
    }

    showFooter() {
        this.pauserVisible = false;
        this.footerVisible = true;
        this.rewinderVisible = false;
        this.mainEpgVisible = false;
        this.mainEpgPopupVisible = false;
        this.archEpgVisible = false;
        this.archEpgPopupVisible = false;
        this.infoBoxVisible = false;

        // todo не будет работать, если началась другая программа (надо проверку на окончание делать)
        appState.footer.loadInfo(this.mainEpg.focusedEpg!.channelId, this.mainEpg.focusedEpg!.time);

        console.log("appState.showFoooter");
    }

    showRewinder() {
        this.pauserVisible = false;
        this.footerVisible = false;
        this.rewinderVisible = true;
        this.mainEpgVisible = false;
        this.mainEpgPopupVisible = false;
        this.archEpgVisible = false;
        this.archEpgPopupVisible = false;
        this.infoBoxVisible = false;
        console.log("appState.showRewinder");
    }

    showPauser() {
        this.pauserVisible = true;
        this.footerVisible = false;
        this.rewinderVisible = false;
        this.mainEpgVisible = false;
        this.mainEpgPopupVisible = false;
        this.archEpgVisible = false;
        this.archEpgPopupVisible = false;
        this.infoBoxVisible = false;
        if (appState.nativePlayer) {
            appState.nativePlayer.pause();
        }

        console.log("appState.showRewinder");
    }

    getGuiState(): GuiState {
        if (this.pauserVisible)
            return "pauser";
        else if (this.rewinderVisible)
            return "rewinder";
        else if (this.mainEpgPopupVisible)
            return "mainEpgPopup";
        else if (this.archEpgPopupVisible)
            return "archEpgPopup";
        else if (this.mainEpgVisible)
            return "mainEpg";
        else if (this.archEpgVisible)
            return "archEpg";
        else if (this.footerVisible)
            return "footer";
        else
            return "video";
    }

    getFooterPos(): any {
        return {
            left: this.getMenuPadding(),
            right: this.getMenuPadding(),
            height: 150,
            bottom: this.getMenuPadding(),
        }
    }

    getRewinderPos(): any {

        let rewinderWidth = 170;
        let rewinderHeight = 90;

        return {
            left: (screen.width - rewinderWidth) / 2,
            top: (screen.height - rewinderHeight) / 2 - 10,
            height: rewinderHeight,
            width: rewinderWidth,
        }
    }

    getActivePlayerTime(): Date {
        let state = this.channelPlayStates[this.playedChannel];
        if (!state)
            return new Date();
        else
            return new Date(state.startTime.getTime() + state.currentTimeSec * 1000);
    }

    getPlayerPausedSecs(): number {
        let state = this.channelPlayStates[this.playedChannel];
        if (!state)
            return 0;
        else
            return Math.round(((new Date()).getTime() - state.lastCurrentTime.getTime()) / 1000);
    }

    getPauserPos(): any {

        let rewinderWidth = 170;
        let rewinderHeight = 90;

        return {
            left: (screen.width - rewinderWidth) / 2,
            top: (screen.height - rewinderHeight) / 2 - 10,
            height: rewinderHeight,
            width: rewinderWidth,
        }
    }
}


export let appState = new AppState();

(window as any).appState = appState;