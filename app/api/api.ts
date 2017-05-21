export interface IReq {
    cmd: string;
}

export interface IAns {
    error?: string;
}


// -------  GET_ENCRYPT_KEY ----------
export const GET_ENCRYPT_KEY_CMD = "1";

export interface IGetEncryptKeyReq extends IReq {

}
export interface IGetEncryptKeyAns extends IAns {
    encryptKey: string;
}


// -------  LOGIN ----------
export const LOGIN_CMD = "2";

export interface ILoginReq extends IReq {
    login: string;
    password: string;
}

export interface ILoginAns extends IAns {
    user: string
}

////////////**************************///////////////
////////////**************************///////////////
////////////**************************///////////////
////////////**************************///////////////

export interface IEpg {
    channelId: number;
    channelTitle: string;
    channelImage: string;
    channelUrl: string;
    time: string;
    endtime: string;
    currtime: string;
    title: string;
    categoryTitle: string;
    desc: string;
    genreTitle: string;
    year: string;
    director: string;
    actors: string;
    image: string;
}

export interface IInfo {
    channelId: number;
    channelTitle: string;
    channelImage: string;
    time: string;
    endtime: string;
    title: string;
    categoryTitle: string;
    desc: string;
    genreTitle: string;
    year: string;
    director: string;
    actors: string;
    image: string;
}


export const LOAD_CURRENT_EPG = "101";

export interface ILoadCurrentEpgReq extends IReq {
    login: string;
    password: string;
    category:string;
}

export interface ILoadCurrentEpgAns extends IAns {
    epg: IEpg[];
}

export const LOAD_INFO = "102";

export interface ILoadInfoReq extends IReq {
    channelId:number;
    time:string;
}

export interface ILoadInfoAns extends IAns {
    info: IInfo;
}


export const RELOAD_PLAYLIST = "103";

export interface IReloadPlayListReq extends IReq {
    login: string;
    password: string;
}

export interface IReloadPlayListAns extends IAns {
}

export const LOAD_ARCH_EPG = "104";

export interface ILoadArchEpgReq extends IReq {
    login: string;
    password: string;
    channelId:number;
}

export interface ILoadArchEpgAns extends IAns {
    epg: IEpg[];
}
