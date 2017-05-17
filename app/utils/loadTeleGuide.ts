//
// declare let require: Function;
//
// let targz = require('targz');
//
// export function loadTeleGuid(): Promise<void> {
//
//     return new Promise<void>(
//         (resolve: () => void, reject: (error: string) => void) => {
//
//             //resolve(param);
//             window.requestFileSystem = window.requestFileSystem || (window as any).webkitRequestFileSystem;
//
//             let onError = (err: any) => {
//                 console.log("loadTeleGuid error", err);
//                 reject("loadTeleGuid error: " + err.toString());
//             };
//
//             let fileUrl: string;
//             let dirUrl: string;
//
//             let xhr = new XMLHttpRequest();
//             xhr.open("GET", "https://www.teleguide.info/download/new3/xmltv.xml.gz", true);
//             xhr.responseType = "blob";
//             xhr.onerror = onError;
//             xhr.onload = (e) => {
//                 window.requestFileSystem(LocalFileSystem.PERSISTENT, 100 * 1024 * 1024, (fs) => {
//                     fs.root.getFile("xmltv.xml.gz", {create: true}, function (fileEntry) {
//                         fileEntry.createWriter((writer) => {
//
//                             //writer.onwrite = done;
//                             writer.onerror = onError;
//
//                             let blob = new Blob([xhr.response]);
//                             writer.write(blob);
//                             fileUrl = fileEntry.toURL();
//
//                             console.log("loaded: " + fileUrl);
//
//                             targz.decompress({
//                                 src: 'fileUrl',
//                                 dest: 'dirUrl'
//                             }, function(err:any){
//                                 if(err) {
//                                     console.log(err);
//                                 } else {
//                                     console.log("Done!");
//                                 }
//                             });
//
//                             // (window as any).zip.unzip(fileUrl, dirUrl, function (result: number) {
//                             //     if (result === 0)
//                             //         resolve();
//                             //     else
//                             //         reject("ошибка распаковки xmltv.xml.gz code=" + result);
//                             // });
//
//                         }, onError);
//                     }, onError);
//
//                     fs.root.getDirectory("unzipped", {create: true}, (fileEntry) => {
//                         dirUrl = fileEntry.toURL();
//                     }, onError);
//                 }, onError);
//             };
//
//             xhr.send();
//
//         });
//
//
// }
//
// // it("should unzip", function (done) {
// //     zip.unzip(fileUrl, dirUrl, function (result) {
// //         expect(result).toBe(0);
// //         done();
// //     });
// // });
// //
// // }
