export interface IConfig {
    appName: string;
    apiUrl: string;
}

let developDir: IConfig = {
    appName: "EdemTV Player",
    apiUrl: "http://192.168.0.14:3001/api",
};

let cloudDir: IConfig = {
    appName: "EdemTV Player",
    apiUrl: "http://81.177.142.4/api",
}


export let config: IConfig = cloudDir;