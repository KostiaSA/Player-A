export interface IConfig {
    appName: string;
    apiUrl: string;
}

let developDir: IConfig = {
    appName: "EdemTV Player",
    apiUrl: "http://player.buhta.ru/api",
};

let cloudDir: IConfig = {
    appName: "EdemTV Player",
    apiUrl: "http://player.buhta.ru/api",
}


export let config: IConfig = cloudDir;