const db = require('electron-db')
const { ipcMain , BrowserWindow, app, shell, dialog, Notification} = require('electron')
const PDFWindow = require('electron-pdf-window')
const request = require('request');
const fs      = require('fs')
const https = require("https")
const path = require("path");
const Log = require("electron-log")
app.on('ready', ()=>{
    let win = BrowserWindow.getFocusedWindow();
    ipcMain.on('traer-usuarios', (v,arg) => {
        this.all_usuarios();
        this.recuperarConexionSeleccionada();
        this.recuperar_conexion();
        this.recuperar_almacenamientoLocal();
        this.recuperar_almacenamientoUtil();
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
        if (args === 1){
            win.webContents.send('recuperar-almacenamiento', dir[0]);
            this.crear_almacenamientoLocal(dir[0])
        }
        else if (args === 2){
            win.webContents.send('recuperar-almacenamientoUtil', dir[0]);
            this.crear_almacenamientoUtil(dir[0]);
        }
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

    ipcMain.on('descargar-nueva-version', (v,arg) => {
        this.descargarActualizacion(arg);
    });

    ipcMain.on('instalar-version', (v, arg)=>{
        Log.info('instalando')
        Log.info(arg);
        // let cp = require("child_process");
        const  cmd = require("node-cmd");
        cmd.runSync("start "+arg)
        // cp.exec("star cmd");
        // cp.spawn('cmd', ['/'+arg.dir, 'start '+arg.exe]);
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


ipcMain.on('crear-utilidad', (e, arg)=>{
    console.log(arg)
    db.createTable('utilidades', arg.dir, (e, succ)=>{});
    db.clearTable('utilidades', arg.dir, (e, succ)=>{});
    this.almacenar_utilidad(arg);
})

ipcMain.on('add_conexion', (e, arg) => {
    db.getRows( 'conexion', {add:1}, (succ, data) => {
        this.crear_conexion(arg)
    } )
});
ipcMain.on('addConexionSeleccionada', (e, arg) => {
    db.getRows( 'conexion_seleccionada', {add:1}, (succ, data) => {
        console.log("conexion seleccionada 1")
        console.log(data)
        if (!data[0]){
            console.log('nueva conexion seleccionada')
            this.crearConexionSeleccionada(arg)
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

module.exports.almacenar_utilidad = (data)=>{
    // db.createTable('utilidades', data.dir, (succ, arg)=>{
    //
    // })
    let obj       = new Object();
    obj.token     = data.token;
    obj.token_doc = data.token_doc;
    obj.venta     = data.data;
    obj.usuario   = data.usuario;
    obj.url       = data.url
    obj.add       = 1;
    console.log(data)
    db.insertTableContent('utilidades',data.dir, obj, (succ, msg)=>{
        const notification = {
            title: 'Abriendo Utilidades de Tilk',
            body:  'Se abrirá Utilidades de Tilk, sino abre, ejecutelo manualmente',
            silent : false
        }
        const Noty = new Notification(notification)
        Noty.show();
    })
}

module.exports.all_usuarios = () => {
    db.getAll('usuarios', (succ, data) => {
        const win = BrowserWindow.getFocusedWindow()
        win.webContents.send('usuarios', data)
    })
}
module.exports.crear_conexion = (data) => {
    let obj = new Object()
    obj.conexion = data.conexion
    obj.alias    = data.alias
    obj.add      = 1
    db.insertTableContent('conexion', obj, (succ,msg) => {
        console.log("conexion guardada")
        this.recuperar_conexion();
    })
}
module.exports.crearConexionSeleccionada = (conexion) => {
    let obj = new Object()
    obj.conexion = conexion
    obj.add = 1
    db.insertTableContent('conexion_seleccionada', obj, (succ,msg) => {
        console.log("conexion seleccionada guardada")
        this.recuperarConexionSeleccionada();
    })
}
module.exports.actualizar_conexion = (id, conexion) => {
    let where = {
        "add": id
    };
    let set = {
        "conexion": conexion
    };
    db.updateRow('conexion_seleccionada', where, set, (succ, msg) => {
        if (succ)
            console.log('se actualizo la conexion');
        else
            console.log("error")
        // this.recuperarConexionSeleccionada()
    })
};
module.exports.recuperar_conexion = () => {
    db.getRows('conexion', {add:1}, (succ, data) => {
        const win = BrowserWindow.getFocusedWindow()
        win.webContents.send('recuperar-conexion', data)
    })
}

module.exports.recuperarConexionSeleccionada = () => {
    db.getRows('conexion_seleccionada', {add:1}, (succ, data) => {
        const win = BrowserWindow.getFocusedWindow()
        win.webContents.send('recuperar-conexion-seleccionada', data)
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
module.exports.actualizar_almacenamientoUtil = (id, dir) => {
    let where = {
        "add": id
    };
    let set = {
        "ruta": dir
    };
    db.updateRow('almacenamientoUtil', where, set, (succ, msg) => {
        this.recuperar_almacenamientoUtil();

    })
    console.log("se actualizo. dir "+dir)
}
module.exports.eliminar_almacenamientoUtilidades = (id, arg) =>{
    db.clearTable('utilidades',arg.dir,(succ, msg)=>{
        console.log("informacion utilidad eliminada")
    })
}
module.exports.recuperar_almacenamientoLocal = () =>{
    db.getRows('almacenamientos', {add:1},(succ, data)=>{
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('recuperar-almacenamiento', data[0].ruta)
    })
}
module.exports.recuperar_almacenamientoUtil = () =>{
    db.getRows('almacenamientoUtil', {add: 1}, (succ, data)=>{
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('recuperar-almacenamientoUtil', data[0].ruta)
    })
}
module.exports.crear_almacenamientoLocal = (dir)=> {
    db.getRows('almacenamientos', {add: 1}, (succ, data) => {
        if (data.length > 0) {
            this.actualizar_almacenamientoLocal(1,dir);
        }else{
            let obj = new Object();
            obj.ruta = dir;
            obj.add  = 1;
            db.insertTableContent('almacenamientos', obj, (succ, msg)=>{
                const notification = {
                    title: 'Ruta Almacenada',
                    body: 'La ruta para almacenar documentos se guardó exitosamente',
                    silent : false
                }
                const Noty = new Notification(notification)
                Noty.show();
            })
        }
    })
}
module.exports.crear_almacenamientoUtil = (dir)=> {
    db.getRows('almacenamientoUtil', {add: 1}, (succ, data) => {
        if (data.length > 0) {
            this.actualizar_almacenamientoUtil(1,dir);
        }else{
            let obj = new Object();
            obj.ruta = dir;
            obj.add  = 1;
            db.insertTableContent('almacenamientoUtil', obj, (succ, msg)=>{
                const notification = {
                    title: 'Ruta Almacenada',
                    body: 'La ruta de utilidades de TILK se ha registrado.',
                    silent : false
                }
                const Noty = new Notification(notification)
                Noty.show();
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
module.exports.crear_db_conexion = function () {
    db.createTable('conexion_seleccionada', (succ, msg) => {
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



module.exports.crear_db_almacenamientoUtilidades = function (){
    db.createTable('almacenamientoUtil', (succ, msg) => {

    })
}


module.exports.descargarActualizacion = (data) =>{
    let win = BrowserWindow.getFocusedWindow();

    let nombre = path.basename(data.url)
    let dir    = data.dir+'/'+nombre;
    let options = {
        url: data.url,
        method: 'GET',
        headers: {
            'Content-Type': 'application / octet-stream', // decirle al navegador que este es un archivo binario
            'Content-Disposition': 'archivo adjunto; nombre de archivo =' + nombre, // Dígale al navegador que este es un archivo que debe descargarse
        }
    }
    Log.info(data);
    Log.info('dir');
    Log.info(dir);
    let fileStream = fs.createWriteStream(dir);
    https.get(data.url, (res)=>{
        res.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            win.webContents.send('descarga-version-terminada', dir)
        })
    }).on('error', (e) => {
        console.error(e);
        fileStream.close();
        fileStream.destroy();
    });

}
