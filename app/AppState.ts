import {observable} from "mobx";
import {IAppPage} from "./App";
import moment = require("moment");
import {MainEpg} from "./MainEpg";
import {httpRequest} from "./utils/httpRequest";
import {GET_ENCRYPT_KEY_CMD, IGetEncryptKeyAns, IGetEncryptKeyReq, ILoginAns, ILoginReq, LOGIN_CMD} from "./api/api";
import {InfoBox} from "./InfoBox";


export class AppState {
    loginOk: boolean;
    @observable sessionId: string;
    @observable login: string="212850";
    @observable password: string="31025";
    encryptKey: string;


    mainEpg: MainEpg;
    infoBox: InfoBox;

    //@observable winHeight: number;
    //@observable winWidth: number;
    screenSize: { height: number, width: number };

    @observable mainEpgVisible: boolean = false;
    @observable infoBoxVisible: boolean = false;

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
}


export let appState = new AppState();

(window as any).appState = appState;