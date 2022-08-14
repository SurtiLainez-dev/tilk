const db = require('electron-db')
const { ipcMain , BrowserWindow, app, shell, dialog, Notification} = require('electron')
const PDFWindow = require('electron-pdf-window')
const WINDOW = BrowserWindow.getFocusedWindow()
const {download} = require('electron-dl')
const request = require('request');
const fs      = require('fs')
// const location = path.join(__dirname, '')
const log = require('electron-log');
const electron = require("electron");

app.on('ready', ()=>{
    let win = BrowserWindow.getFocusedWindow();
    ipcMain.on('traer-usuarios', (v,arg) => {
        this.all_usuarios();
        this.recuperar_conexion();
        this.recuperar_almacenamientoLocal();

    });

    ipcMain.on('open-nav', (v, arg) => {
        let url = 'https://ign-surti.nyc3.digitaloceanspaces.com/Contabilidad/Planillas-Generadas/Planilla-SL-A1-00000-0?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=P43MQVMWSHE6CPPXLVN2%2F20200720%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20200720T023841Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=ba18615cbc7c2fa39f4f309683a1ce6e8ce3fd2e82138ab209132a9a31803a77https://ign-surti.nyc3.digitaloceanspaces.com/Contabilidad/Planillas-Generadas/Planilla-SL-A1-00000-0?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=P43MQVMWSHE6CPPXLVN2%2F20200720%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20200720T023841Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=ba18615cbc7c2fa39f4f309683a1ce6e8ce3fd2e82138ab209132a9a31803a77'

        let winPdf = new PDFWindow({
            width: 1400,
            height: 950
        });
        winPdf.loadURL(arg)
    });

    ipcMain.on('pint_navegador', (v, arg) =>{
        shell.openExternal(arg);
    })

    ipcMain.on('pdf-prueba', (v, arg) => {
        let url = 'http://127.0.0.1:8000/'+arg;
        let winPdf = new PDFWindow({
            width: 1400,
            height: 950
        });
        console.log(url);
        winPdf.loadURL(url);
    })

    ipcMain.on('open__dialog_save_files', async (v, args)=>{
        const win = BrowserWindow.getFocusedWindow()
        const dir = await dialog.showOpenDialog(win,{
            properties: ['openDirectory']
        });
        win.webContents.send('recuperar-almacenamiento', dir[0]);
        this.crear_almacenamientoLocal(dir[0])
    })

    ipcMain.on('save_file', (v, args)=>{
        let received_bytes = 0;
        let total_bytes = 0;

        let req = request({
            method: 'GET',
            uri: args.path_remoto
        });

        let out = fs.createWriteStream(args.path_local);
        req.pipe(out);

        req.on('response', function ( data ) {
            // Change the total bytes value to get progress later.
            total_bytes = parseInt(data.headers['content-length' ]);
        });

        req.on('data', function(chunk) {
            // Update the received bytes
            received_bytes += chunk.length;

            showProgress(received_bytes, total_bytes);
        });

        req.on('end', function (){
            const notification = {
                title: 'Documento Descargado',
                body: 'El documento se almacenó en el directorio definido por le usuario',
                silent : false
            }
            const Noty = new Notification(notification)
            Noty.show();
            Noty.on('click', ()=>{
                shell.showItemInFolder(args.path_local)
            })
        })

        function showProgress(received,total){
            let percentage = (received * 100) / total;
            console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
        }
    })

});

//usuarios
ipcMain.on('crear-usuario', (e, arg) =>{
    if (arg){
        db.getRows('usuarios', {correo:arg}, (succ, data) => {
            console.log(data)
            if (!data[0]){
                this.crear_usuario(arg)
            }
        })
    }
})
ipcMain.on('add_conexion', (e, arg) => {
    db.getRows( 'conexion', {add:1}, (succ, data) => {
        console.log("aca si")
        if (!data[0]){
            this.crear_conexion(arg)
        }else {
            this.actualizar_conexion(1, arg)
        }
    } )
});
ipcMain.on('add_almacenamiento', (e, arg)=>{
    db.getRows('almacenamientos',{add:1}, (succ, data)=>{
        if (!data[0])
            this.crear_almacenamientoLocal();
        else
            this.actualizar_almacenamientoLocal(1,arg);
    })
});



module.exports.crear_usuario = (correo)=>{
    let obj = new Object();
    obj.correo = correo;
    obj.id = new Date().getTime()
    db.insertTableContent('usuarios', obj, (succ, msg)=>{
        console.log("sw guardo")
    })

}
module.exports.all_usuarios = () => {
    db.getAll('usuarios', (succ, data) => {
        const win = BrowserWindow.getFocusedWindow()
        win.webContents.send('usuarios', data)
    })
}
module.exports.crear_conexion = (conexion) => {
    let obj = new Object()
    obj.conexion = conexion
    obj.add = 1
    db.insertTableContent('conexion', obj, (succ,msg) => {
        console.log("conexion guardada")
        this.recuperar_conexion()
    })
}
module.exports.actualizar_conexion = (id, conexion) => {
    let where = {
        "add": id
    };
    let set = {
        "conexion": conexion
    };
    db.updateRow('conexion', where, set, (succ, msg) => {
        if (succ)
            console.log('se actualizo la conexion');
        else
            console.log("error")
        this.recuperar_conexion()
    })
};
module.exports.recuperar_conexion = () => {
    db.getRows('conexion', {add:1}, (succ, data) => {
        const win = BrowserWindow.getFocusedWindow()
        win.webContents.send('recuperar-conexion', data[0])
        console.log("entro")
        console.log(data[0])
    })
}

//almacenamiento
module.exports.actualizar_almacenamientoLocal = (id, dir) => {
    let where = {
        "add": id
    };
    let set = {
        "ruta": dir
    };
    db.updateRow('almacenamientos', where, set, (succ, msg) => {
        this.recuperar_almacenamientoLocal();

    })
    console.log("se actualizo. dir "+dir)
}
module.exports.recuperar_almacenamientoLocal = () =>{
    db.getRows('almacenamientos', {add:1},(succ, data)=>{
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('recuperar-almacenamiento', data[0].ruta)
    })
}
module.exports.crear_almacenamientoLocal = (dir)=> {
    db.getRows('almacenamientos', {add: 1}, (succ, data) => {
        if (data) {
            this.actualizar_almacenamientoLocal(1,dir);
        }else{
            let obj = new Object();
            obj.ruta = dir;
            obj.add  = 1;
            db.insertTableContent('almacenamientos', obj, (succ, msg)=>{
                new Notification({title:'Registro Exitoso', body:'Se ha guardado exitosamente la ruta de almacenamiento de archivos'}).show()
            })
        }
    })
}
//creacion de base de datos
module.exports.crear_db_usuarios = function () {
    db.createTable('usuarios', (succ, msg) => {
        console.log("Se creo exitasamente la bd de usuarios")
    })
}
module.exports.crear_db_conexiones = function () {
    db.createTable('conexion', (succ, msg) => {
    })
}
module.exports.crear_db_inicios = function () {
    db.createTable('inicios', (succ, msg) => {

    })
}
module.exports.crear_db_articulos = function () {
    db.createTable('articulos', (succ, msg) => {
    })
}
module.exports.crear_db_almacenamientoLocal = function (){
    db.createTable('almacenamientos', (succ, msg) => {
    })
}
