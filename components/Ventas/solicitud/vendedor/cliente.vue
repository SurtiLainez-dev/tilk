<template>
    <v-card :disabled="EstadoVista" class="pr-2 pl-2 pb-2 pt-2" flat height="100%">
        <v-row no-gutters>
            <v-col cols="2" class="d-flex align-center"><h5>Cliente</h5></v-col>
            <v-col cols="10" class="d-flex justify-end">
                <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                        <v-btn class="ma-2" text fab x-small @click="addArchivo"
                               v-on="on" v-bind="attrs" color="red">
                            <v-icon small>fa fa-file-pdf</v-icon>
                        </v-btn>
                    </template>
                    <span>Añadir documento al cliente</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                        <v-btn class="ma-2" text fab x-small @click="addTelefono"
                               v-on="on" v-bind="attrs" color="success">
                            <v-icon small>fa fa-phone-alt</v-icon>
                        </v-btn>
                    </template>
                    <span>Añadir telefono al cliente</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                        <v-btn class="ma-2" text fab x-small @click="addDetalle"
                               v-on="on" v-bind="attrs" color="success">
                            <v-icon small>fa fa-info-circle</v-icon>
                        </v-btn>
                    </template>
                    <span>Añadir detalle al cliente</span>
                </v-tooltip>
            </v-col>
        </v-row>
        <hr>
        <small>Datos personales</small>
        <v-container>
            <v-row no-gutters class="grey lighten-4">
                <v-col>
                    <table class="rowsTable ma-2">
                        <tbody>
                        <tr>
                            <th>Nombres:</th>
                            <td><input type="text" v-model="Cliente.nombres"></td>
                        </tr>
                        <tr>
                            <th>Apellidos:</th>
                            <td><input type="text" v-model="Cliente.apellidos"></td>
                        </tr>
                        <tr>
                            <th>Identidad:</th>
                            <td><input type="text" v-model="Cliente.identidad"></td>
                        </tr>
                        <tr>
                            <th>Rtn:</th>
                            <td><input type="text" v-model="Cliente.rtn"></td>
                        </tr>
                        <tr>
                            <th>Correo eléctronico:</th>
                            <td><input type="text" v-model="Cliente.email"></td>
                        </tr>
                        <tr>
                            <th>Sexo:</th>
                            <td><select class="select-css" v-model="Cliente.sexo">
                                <option :value="1">Masculino</option>
                                <option :value="2">Femenino</option>
                            </select></td>
                        </tr>
                        </tbody>
                    </table>
                </v-col>
                <v-col>
                    <table class="rowsTable ma-2">
                        <tbody>
                        <tr>
                            <th>Nacionalidad:</th>
                            <td><input type="text" v-model="Cliente.nacionalidad" disabled></td>
                        </tr>
                        <tr>
                            <th>Trabajo:</th>
                            <td><select class="select-css" v-model="Cliente.is_trabaja">
                                <option :value="1">Sí</option>
                                <option :value="2">No</option>
                            </select></td>
                        </tr>
                        <tr>
                            <th>Salario:</th>
                            <td><input type="text" v-model="Cliente.salario" ></td>
                        </tr>
                        <tr>
                            <th>Empresa trabajo:</th>
                            <td><input type="text" v-model="Cliente.empresa_trabaja" ></td>
                        </tr>
                        <tr>
                            <th>Casa:</th>
                            <td><select class="select-css" v-model="Cliente.is_casa">
                                <option :value="1">Sí</option>
                                <option :value="2">No</option>
                            </select></td>
                        </tr>
                        </tbody>
                    </table>
                </v-col>
            </v-row>
        </v-container>
        <v-row no-gutters>
            <v-col><small>Detalles del cliente</small></v-col>
            <v-col><small>Telefonos del cliente</small></v-col>
        </v-row>
        <v-container>
            <v-row no-gutters class="grey lighten-4">
                <v-col cols="6">
                    <table class="rowsTable ma-2">
                        <tbody>
                        <tr v-for="item in data_Cliente.Detalles">
                            <td><input type="text" v-model="item.detalle" ></td>
                            <td>
                                <input v-if="item.select === 2" type="text" v-model="item.val">
                                <select v-else-if="item.select === 1" class="select-css">
                                    <option v-for="i in item.datos" :value="i">{{i}}</option>
                                </select>
                            </td>
                            <td>
                                <v-btn fab color="red" @click="removeDetalle(item)"
                                       width="20px" text height="20px" dark>
                                    <v-icon size="15">fa fa-times</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </v-col>
                <v-col cols="6">
                    <table class="rowsTable ma-2">
                        <tbody>
                        <tr v-for="item in data_Cliente.Telefonos">
                            <td><input type="text" v-model="item.detalle"></td>
                            <td><input type="text" v-model="item.num"></td>
                            <td class="d-flex justify-center">
                                <v-btn fab color="red" @click="removeTelefono(item)"
                                       width="20px" text height="20px" dark>
                                    <v-icon size="15">fa fa-times</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </v-col>
            </v-row>
        </v-container>
        <small>Documentos</small>
        <v-container>
            <v-row no-gutters class="grey lighten-4">
                <v-col>
                    <table class="rowsTable ma-2">
                        <tbody>
                        <tr v-for="item in data_Cliente.Archivos">
                            <td><input type="text" v-model="item.detalle"></td>
                            <td>
                                <b-link @click="verDocumento(item.dir)" v-if="item.dir2">Ver documento {{item.detalle}}</b-link>
                                <b-form-file v-model="item.file" accept="application/pdf"
                                             browse-text="Buscar" size="sm" v-else></b-form-file>
                            </td>
                            <td>
                                <v-btn v-if="item.dir2 || item.file" @click="borrarDir(item)" width="22px" height="22px" fab color="indigo" text>
                                    <v-icon size="15">fa fa-edit</v-icon>
                                </v-btn>
                            </td>
                            <td class="d-flex justify-center">
                                <v-btn fab color="red" @click="removeArchivos(item)"
                                       width="20px" text height="20px" dark>
                                    <v-icon size="15">fa fa-times</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </v-col>
            </v-row>
        </v-container>
        <small>Direcciones</small>
        <v-container>
            <v-row no-gutters class="grey lighten-4">
                <v-col>
                    <table class="rowsTable ma-2">
                        <thead>
                        <tr>
                            <th>Departamento</th>
                            <th>Municipio</th>
                            <th>Ciudad/Aldea/Caserio</th>
                            <th>Colonia</th>
                            <th>Dirección</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in data_Cliente.Direcciones">
                            <td width="20%">
                                <select disabled class="select-css" v-model="item.departamento">
                                    <option v-for="i in Departamentos" :value="i.id">{{i.nombre}}</option>
                                </select>
                            </td>
                            <td width="20%">
                                <select disabled class="select-css" v-model="item.municipio" >
                                    <option v-for="i in item.Municipios" :value="i.id">{{i.nombre}}</option>
                                </select>
                            </td>
                            <td width="20%">
                                <select disabled class="select-css" v-model="item.ciudad" >
                                    <option v-for="i in item.Ciudades" :value="i.id">{{i.nombres}}</option>
                                </select>
                            </td>
                            <td width="20%">
                                <select disabled class="select-css" v-model="item.colonia">
                                    <option v-for="i in item.Colonias" :value="i.id">{{i.nombre}}</option>
                                </select>
                            </td>
                            <td width="40%">
                                {{item.detalle}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </v-col>
            </v-row>
        </v-container>
        <hr>
        <v-card-actions class="d-flex justify-end">
            <v-btn class="ma-2" small @click="validarArchivos" color="success" dark>Registrar Cambios</v-btn>
        </v-card-actions>

        <v-dialog v-model="dialogoEnvio" width="30%">
            <v-card class="pl-5 pr-5">
                <v-card-title>Verificación de documentos</v-card-title>
                <hr>
                <v-card-text>Los siguientes archivos se van a modificar.</v-card-text>
                <table class="rowsTable">
                    <tbody>
                    <tr v-for="item in data_Cliente.Archivos">
                        <th v-if="item.edit">{{item.detalle}}</th>
                    </tr>
                    </tbody>
                </table>
                <v-card-actions class="d-flex justify-end">
                    <v-btn class="ma-2" small color="warning" dark @click="dialogoEnvio = false">Cerrar</v-btn>
                    <v-btn class="ma-2" small color="success" dark @click="validarActualizacionDelCliente">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import {ipcRenderer} from "electron";
    import Vue from "vue";
    export default {
        name: "cliente",
        data(){
            return{
                dialogoEnvio: false,
                data_Cliente:{
                    Detalles: [],
                    Telefonos: [],
                    Archivos:  [],
                    Direcciones: []
                },
                Departamentos: [],
                longTelefonos: 0,
                longDetalles:  0,
                longArchivos:  0
            }
        },
        computed:{
            EstadoVista(){
                return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
            },
            Soli:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud;
                }
            },
            Cliente:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud.cliente;
                }
            },
            Detalles(){
                if(this.$store.state.solicitud_credito.Solicitud.cliente.detalles)
                    return JSON.parse(this.$store.state.solicitud_credito.Solicitud.cliente.detalles);
                else
                    return [];
            },
            Telefonos(){
                if(this.$store.state.solicitud_credito.Solicitud.cliente.telefonos)
                    return JSON.parse(this.$store.state.solicitud_credito.Solicitud.cliente.telefonos);
                else
                    return [];
            },
            Archivos(){
                if(this.$store.state.solicitud_credito.Solicitud.cliente.archivos)
                    return JSON.parse(this.$store.state.solicitud_credito.Solicitud.cliente.archivos);
                else
                    return [];
            },
            vista:{
                get: function () {
                    return this.$store.state.solicitud_credito.dialogoSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', val);
                }
            },
            Direcciones:{
                get:function () {
                    return JSON.parse(this.$store.state.solicitud_credito.Solicitud.cliente.direcciones);
                }
            },
            View_Tarea: {
                get: function () {
                  return this.$store.state.tareas.Tareas_view;
                },
                set: function (val) {
                  this.$store.commit('tareas/cambiarValorVista', val)
                }
            },
        },
        created() {
            console.log(this.EstadoVista)
            let tr = this.data_Cliente;
            tr.Telefonos       = this.Telefonos;
            tr.Direcciones     = this.Direcciones;
            this.cambiarEstructuraArchivos();
            this.cambiarEstructuraDetalles();
            this.longTelefonos = this.Telefonos.length - 1;
            this.longArchivos  = this.Archivos.length  - 1;
            this.longDetalles  = this.Detalles.length  - 1;
            this.cargarDepartamentos();
            this.cargarDirecciones(tr.Direcciones);
        },
        methods:{
            addArchivo(){
                this.data_Cliente.Archivos.push({
                    "dir": '',
                    "file": null,
                    "detalle": '',
                    "status": false,
                    "key":    this.data_Cliente.Archivos.length,
                    "num":    1,
                    "edit":   false,
                    "exist":  false,
                })
            },
            addDetalle(){
                this.data_Cliente.Detalles.push({
                    "datos":   [],
                    "select":  2,
                    "detalle": 'Detalle ' +(parseInt(this.data_Cliente.Detalles.length) + 1),
                    "val":     '',
                    "key":     this.data_Cliente.Detalles.length
                });
            },
            addTelefono(){
                this.data_Cliente.Telefonos.push({
                    "key": this.data_Cliente.Telefonos.length,
                    "num": '',
                    "detalle": 'Telefono '+(parseInt(this.data_Cliente.Telefonos.length) + parseInt(1))
                })
            },
            borrarDir(item){
                item.dir2 = ''
                item.file = null;
            },
            cambiarEstructuraArchivos(){
                 this.Archivos.forEach( (i) => {
                     this.data_Cliente.Archivos.push({
                         "dir": i.dir,
                         "dir2": i.dir,
                         "file": i.file,
                         "detalle": i.detalle,
                         "estado":  i.estado,
                         "key":     i.key,
                         "num":     i.num,
                         "status":  i.status,
                         "edit":    false,
                         "exist":   true
                     })
                 })
            },
            cambiarEstructuraDetalles(){
                let cont = 0;
                this.Detalles.forEach( (i) => {
                    this.data_Cliente.Detalles.push({
                        "datos": i.datos,
                        "detalle": i.detalle,
                        "select":  i.select,
                        "val":     i.val,
                        "key":     cont
                    });
                    cont++
                })
            },
            cargarCiudades: function (item) {
                this.$axios.get('/ciudades/'+item.municipio,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    item.Ciudades = res.data.ciudades;
                })
            },
            cargarColonias: function (item) {
                this.$axios.get('/colonias/'+item.ciudad,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    item.Colonias = res.data.colonias;
                })
            },
            cargarDepartamentos(){
                this.$axios.get('/departamentos',{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    this.Departamentos = res.data.depto
                })
            },
            cargarDirecciones(direcciones){
                direcciones.forEach( (i) => {
                    this.cargarMunicipios(i);
                    this.cargarCiudades(i);
                    this.cargarColonias(i)
                })
            },
            cargarMunicipios: function (item) {
                this.$axios.get('/municipios/'+item.departamento,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    console.log(res.data)
                    console.log(item)
                    item.Municipios = res.data.municipios;
                    console.log(item)
                })
            },
            notificacion(text, color){
                Vue.$toast.open({
                    message: text,
                    type: color,
                    position: 'bottom-left',
                    duration: 4000
                });
            },
            removeArchivos(item){
                let cont = 0;
                if (item.key > this.longArchivos) {
                    this.data_Cliente.Archivos.splice(item.key, 1);
                    this.data_Cliente.Archivos.forEach((i) => {
                        i.key = cont;
                        cont++;
                    })
                }
            },
            removeDetalle(item){
                let cont = 0;
                if (item.key > this.longDetalles) {
                    this.data_Cliente.Detalles.splice(item.key, 1);
                    this.data_Cliente.Detalles.forEach((i) => {
                        i.key = cont;
                        cont++;
                    })
                }
            },
            removeTelefono(item){
                let cont = 0;
                if (item.key > this.longTelefonos) {
                    this.data_Cliente.Telefonos.splice(item.key, 1);
                    this.data_Cliente.Telefonos.forEach((i) => {
                        i.key = cont;
                        cont++;
                    })
                }
            },
            validarActualizacionDelCliente(){
                this.vista = false;
                this.View_Tarea = false;
                this.$store.commit('activarOverlay', true);
                let data = new FormData();
                let archivos = [], cont = 0, th = this.data_Cliente;
                let estado = 0;
                this.data_Cliente.Archivos.forEach( (i) =>{
                    if (i.dir || i.edit)
                        estado = 1;
                    else
                        estado = 0;
                    archivos.push({
                        "dir": i.dir,
                        "file": i.file,
                        "detalle": i.detalle,
                        "estado":  estado,
                        "key":     i.key,
                        "num":     i.key,
                        "status":  i.status,
                    })
                });
                this.data_Cliente.Archivos.forEach( (i)=>{
                    if (i.edit){
                        console.log("si")
                        data.append(`file_cliente[${cont}]`, i.file);
                        cont++;
                        i.status = false;
                        i.estado = true;
                        i.file   = null;
                    }
                });
                data.append('archivos', JSON.stringify(archivos));
                data.append('detalles', JSON.stringify(th.Detalles));
                data.append('telefonos', JSON.stringify(th.Telefonos));
                data.append('id', this.Cliente.id);
                data.append('nombres', this.Cliente.nombres);
                data.append('apellidos', this.Cliente.apellidos);
                data.append('identidad', this.Cliente.identidad);
                data.append('rtn', this.Cliente.rtn);
                data.append('email', this.Cliente.email);
                data.append('is_trabaja', this.Cliente.is_trabaja);
                data.append('salario', this.Cliente.salario);
                data.append('empresa_trabaja', this.Cliente.empresa_trabaja);
                data.append('is_casa', this.Cliente.is_casa);
                data.append('direcciones', JSON.stringify(th.Direcciones));
                data.append('fecha_nacimiento', this.Cliente.fecha_nacimiento);

                this.$axios({
                    method:'post',
                    url:'clientes/edit',
                    data:data,
                    headers:{
                        'Authorization': 'Bearer ' + this.$store.state.token,
                        'Content-Type': "multipart/form-data"
                    }
                }).then((res)=>{
                    this.$store.commit('solicitud_credito/cargarSolicitudes', {tipo: 1, search: null, fecha: null});
                    th.Archivos = [];
                    archivos = [];
                    archivos = res.data.files;
                    console.log(res.data.files)
                    archivos.forEach( (i)=>{
                        console.log(i)
                        th.Archivos.push({
                            dir:     i.dir,
                            dir2:    i.dir,
                            detalle: i.detalle,
                            num:     i.num,
                            status:  i.status,
                            key:     i.key,
                            file:    null,
                            estado:  i.estado,
                            edit:    false,
                        })
                    });
                    this.Soli.cliente.telefonos = JSON.stringify(th.Telefonos);
                    this.Soli.cliente.detalles = JSON.stringify(th.Detalles);
                    this.Soli.cliente.archivos = JSON.stringify(archivos);
                    this.$store.commit('activarOverlay', false);
                    this.View_Tarea = true;
                    this.vista = true;
                    this.notificacion('Se han registrados los cambios del cliente correctamente','success')
                }).catch((error)=>{
                    this.$store.commit('activarOverlay', false);
                    this.vista = true;
                    this.notificacion('Ha ocurrido un error. Comunicar a soporte técnico','error')
                })
            },
            validarArchivos(){
                let cont = 0,  bandera = 0;
                this.data_Cliente.Archivos.forEach( (i)=>{
                    if (i.status || i.status === 1){
                        if (!i.dir2){
                            cont++;
                            i.edit = !!i.file;
                            if (i.file){
                                bandera++
                                i.edit = true;
                                cont++;
                                if (i.detalle){
                                    bandera++;
                                }
                            }else{
                                i.edit = false;
                            }
                        }
                    }else{
                        if (i.file){
                            i.edit = true;
                            cont++;
                            if (i.detalle){
                                bandera++;
                            }
                        }else{
                            i.edit = false;
                        }
                    }
                });
                this.dialogoEnvio = true;
            },
            verDocumento(dir){
                this.vista = false;
                this.$store.commit('activarOverlay', true);
                this.$axios.post('leer_documento/',
                    {ubicacion: dir}).then((res)=>{
                    if (res.status === 200){
                        ipcRenderer.send('open-nav', res.data.url);
                        this.$store.commit('activarOverlay', false);
                        this.vista = true;
                    }
                }).catch((error)=>{
                    this.$store.commit('activarOverlay', false);
                    this.vista = true;
                })
            },
        }
    }
</script>

<style scoped>
    .rowInfo{
        cursor: pointer;
        font-size: 13px;
    }
    .rowInfo:hover{
        font-size: 15px;
        background-color: #C6C6C8 !important;
    }
    table{
        width: 95%;
    }
    table tbody{
        font-size: 12px;
    }
    table tbody tr td input[type=text], select{
        width: 100%;
        box-sizing: border-box;
        padding: 2px 10px;
        margin: 1px;
        border: 1px solid #ccc;
        border-radius: 1px;
        cursor: pointer;
    }
    table tbody tr td input:hover{
        background-color: #FFF !important;
    }
    table tbody tr:hover{
        background-color: #F4F4F4;
    }
    table thead{
        border-bottom: solid 1px #47494e;
    }
    .rowsTable{
        cursor: pointer;
    }
    .select-css {
        display: block;
        font-size: 12px;
        font-weight: 400;
        color: #444;
        line-height: 1.3;
        max-width: 100%;
        box-sizing: border-box;
        border: 1px solid #aaa;
        box-shadow: 0 1px 0 1px rgba(0,0,0,.03);
        border-radius: .3em;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
        linear-gradient(to bottom, #ffffff 0%,#f7f7f7 100%);
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: .65em auto, 100%;
    }
</style>
