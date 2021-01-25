const db = require('electron-db')
const { ipcMain , BrowserWindow, app} = require('electron')
const PDFWindow = require('electron-pdf-window')
const WINDOW = BrowserWindow.getFocusedWindow()
// const location = path.join(__dirname, '')
const log = require('electron-log');

app.on('ready', ()=>{
    ipcMain.on('traer-usuarios', (v,arg) => {
        this.all_usuarios();
        this.recuperar_conexion();
    });

    ipcMain.on('open-nav', (v, arg) => {
        let url = 'https://ign-surti.nyc3.digitaloceanspaces.com/Contabilidad/Planillas-Generadas/Planilla-SL-A1-00000-0?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=P43MQVMWSHE6CPPXLVN2%2F20200720%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20200720T023841Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=ba18615cbc7c2fa39f4f309683a1ce6e8ce3fd2e82138ab209132a9a31803a77https://ign-surti.nyc3.digitaloceanspaces.com/Contabilidad/Planillas-Generadas/Planilla-SL-A1-00000-0?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=P43MQVMWSHE6CPPXLVN2%2F20200720%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20200720T023841Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=ba18615cbc7c2fa39f4f309683a1ce6e8ce3fd2e82138ab209132a9a31803a77'

        let winPdf = new PDFWindow({
            width: 1400,
            height: 950
        });
        winPdf.loadURL(arg)
    });

    ipcMain.on('pdf-prueba', (v, arg) => {
        let url = 'http://127.0.0.1:8000/'+arg;
        let winPdf = new PDFWindow({
            width: 1400,
            height: 950
        });
        console.log(url);
        winPdf.loadURL(url);
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




