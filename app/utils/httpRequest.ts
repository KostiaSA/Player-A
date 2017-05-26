import * as Promise from "bluebird";
import {IReq, IAns, GET_ENCRYPT_KEY_CMD} from "../api/api";
import {appState} from "../AppState";
import crypto = require("crypto-js");
import {config} from "../config/config";

export function httpRequest<TReq extends IReq, TAns extends IAns>(req: TReq): Promise<TAns> {

    return new Promise<TAns>(
        (resolve: (obj: TAns) => void, reject: (error: string) => void) => {

            var xhr = new XMLHttpRequest();
            let url = "api";
            url = config.apiUrl;
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-type', "application/json;charset=UTF-8");

            xhr.onload = function () {
                //console.log("httpRequest ---------------------- GET");
                let ansBody = JSON.parse((this as XMLHttpRequest).responseText) as TAns;
                //console.log("httpRequest ---------------------- PARSE");
                if (ansBody.error)
                    reject(ansBody.error);
                else {
                    resolve(ansBody);
                }
            };

            xhr.onerror = function (ev: Event) {
                reject("нет связи с сервером");
            };

            let bodyEncrypted = "";
            if (req.cmd !== GET_ENCRYPT_KEY_CMD)
                bodyEncrypted = crypto.AES.encrypt(JSON.stringify(req), appState.encryptKey).toString();

            let fullReq = {
                sessionId: appState.sessionId,
                cmd: req.cmd,
                body: bodyEncrypted
            };

            //console.log("httpRequest ---------------------- SEND");
            xhr.send(JSON.stringify(fullReq));

        });


}
