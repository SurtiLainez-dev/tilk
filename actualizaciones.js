const { ipcMain , BrowserWindow, app, shell, dialog, Notification} = require('electron')
const res = require('request');
const fs      = require('fs')

// app.on('ready', ()=>{
//     ipcMain.on('descargar-nueva-version', (v,arg) => {
//         console.log('accedio a la descarga');
//         console.log(arg)
//         // this.descargarActualizacion(arg);
//     });
// })
//
// module.exports.descargarActualizacion = (data) =>{
//     let win = BrowserWindow.getFocusedWindow();
//     fs.readFile(data.url, (isError, arg)=>{
//         if (isError){
//             win.webContents.send('error-descarga');
//             return;
//         }
//
//         res.writeHead(200, {
//             'Content-Type': 'application / octet-stream', // decirle al navegador que este es un archivo binario
//             'Content-Disposition': 'archivo adjunto; nombre de archivo = prueba', // Dígale al navegador que este es un archivo que debe descargarse
//         });
//         res.end(data)
//     })
// }