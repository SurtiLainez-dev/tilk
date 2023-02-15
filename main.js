/*
**  Nuxt
*/
const http = require('http');
const { Nuxt, Builder } = require('nuxt');
let config = require('./nuxt.config.js');
config.rootDir = __dirname;// for electron-builder
const log = require('electron-log');
// Init Nuxt.js
const nuxt = new Nuxt(config);
const builder = new Builder(nuxt);
const server = http.createServer(nuxt.render);
// Build only in dev mode
if (config.dev) {
	builder.build().catch(err => {
		console.error(err) // eslint-disable-line no-console
		process.exit(1)
	})
}
// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`Nuxt working on ${_NUXT_URL_}`)

/*
** Electron
*/
let win = null // Current window
const electron = require('electron');
const {BrowserWindow, Notification} = require('electron');
const path = require('path');
const app = electron.app;

const newWin = () => {
	win = new BrowserWindow({
		// fullscreen: true,
		// show: false,
		paintWhenInitiallyHidden: false,
		icon: path.join(__dirname, 'static/icon.png')
	});
	win.maximize();
	win.on('closed', () => win = null);

	app.setAppUserModelId('Tilk')

	if (config.dev) {
		// Install vue dev tool and open chrome dev tools
		const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
		installExtension(VUEJS_DEVTOOLS.id).then(name => {
			console.log(`Added Extension:  ${name}`)
			win.webContents.openDevTools()
		}).catch(err => console.log('An error occurred: ', err))
		// Wait for nuxt to build
		const pollServer = () => {
			http.get(_NUXT_URL_, (res) => {
				if (res.statusCode === 200) { win.loadURL(_NUXT_URL_) } else { setTimeout(pollServer, 300) }
			}).on('error', pollServer)
		}
		pollServer()
	} else { return win.loadURL(_NUXT_URL_) }

};

electron.ipcMain.on('app_version', (event) => {
	event.sender.send('app_version', { version: app.getVersion() });
});
app.on('ready', newWin);

app.on('window-all-closed', () => app.quit());
app.on('activate', () => win === null && newWin());


const db = require('./db');
const upd = require('./actualizaciones');
db.crear_db_inicios();
db.crear_db_usuarios();
db.crear_db_conexiones();
db.crear_db_conexion();
db.crear_db_articulos();
db.crear_db_almacenamientoLocal();
db.crear_db_almacenamientoUtilidades();
// db.crear_db_almacenamientoUtilidades();
// upd.descargarActualizacion();


