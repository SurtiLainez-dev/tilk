<template>
    <v-card :disabled="EstadoVista" class="pr-2 pl-2 pb-2 pt-2" flat>
        <v-row no-gutters>
            <v-col cols="11"><h5>Avales</h5></v-col>
            <v-col cols="1">
                <v-btn @click="addAvales" fab color="success" x-small dark>
                    <v-icon small>fa fa-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <hr>
        <v-alert v-model="existsEditado" type="warning" dense dismissible
        >Hay avales que no estan registrado a la solicitud.</v-alert>
        <v-row no-gutters>
            <v-col v-for="item in avales" cols="4" sm="3">
                <v-card height="145px" width="150px" @dblclick="removeAval(item)"
                        flat class="grey lighten-4 ma-1 rowsTable ma-1" @click="abrirInfo(item)">
                    <v-row no-gutters><v-col class="d-flex justify-center ma-2"><h6 class="text-center"><strong>{{item.nombres}} {{item.apellidos}}</strong></h6></v-col></v-row>
                    <v-row no-gutters><v-col class="d-flex justify-center ma-2"><small><strong>{{item.identidad}}</strong></small></v-col></v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <div v-if="verInfo">
            <small>Datos del aval</small>
            <v-card flat color="grey lighten-4" >
                <v-progress-linear indeterminate v-if="busqueda"></v-progress-linear>
                <table class="rowsTable ma-2">
                    <tbody>
                    <tr>
                        <th>Identidad:</th>
                        <td>
                            <input v-model="data_Aval.identidad" type="text" :disabled="busqueda"
                                   @keyup.enter="buscarCliente(data_Aval)">
                        </td>
                    </tr>
                    <tr>
                        <th>Nombres:</th>
                        <td>
                            <input ref="campoNombresAvales"  @keyup.enter="$refs.campoApellidosAvales.focus()"
                                   v-model="data_Aval.nombres" type="text" >
                        </td>
                    </tr>
                    <tr>
                        <th>Apellidos:</th>
                        <td>
                            <input v-model="data_Aval.apellidos"
                                   type="text" ref="campoApellidosAvales" >
                        </td>
                    </tr>
                    <tr>
                        <th>Sexo:</th>
                        <td>
                            <select class="select-css" v-model="data_Aval.sexo">
                                <option value="1">Masculino</option>
                                <option value="2">Femenino</option>
                            </select>
                        </td>
                    </tr>
                    <tr v-for="item in Archivos">
                        <th><input type="text" v-model="item.detalle"></th>
                        <td>
                            <b-link @click="verDocumento(item.dir)" v-if="item.dir">Ver {{item.detalle}}</b-link>
                            <b-form-file v-else size="sm" accept="application/pdf" browse-text="Buscar"
                                         v-model="item.file"></b-form-file>
                        </td>
                        <td v-if="item.file">
                            <v-btn fab color="red" @click="item.file = null"
                                   width="20px" text height="20px" dark>
                                <v-icon size="15">fa fa-times</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <v-divider></v-divider>
                <v-row no-gutters>
                    <v-col class="d-flex justify-start align-center">
                        <v-btn color="success" @click="registrarArchivos" :disabled="!data_Aval.consultado"
                               class="ma-2 text--white" x-small>Registrar datos de este cliente</v-btn>
                    </v-col>
                    <v-col class="d-flex justify-center align-center">
                        <v-chip dark x-small v-if="data_Aval.existe" color="success">Cliente registrado</v-chip>
                        <v-chip dark x-small v-else color="error">Cliente no registrado</v-chip>
                    </v-col>
                    <v-col class="d-flex justify-center align-center">
                        <v-chip dark x-small v-if="data_Aval.aval" color="success">Aval </v-chip>
                        <v-chip dark x-small v-else color="error">No es aval</v-chip>
                    </v-col>
                    <v-col class="d-flex justify-end align-center">
                        <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                                <v-btn text class="ma-1" dark color="success" v-on="on" v-bind="attrs"
                                       fab width="22px" height="22px" @click="addDocumento">
                                    <v-icon size="15">fa fa-plus</v-icon></v-btn>
                            </template>
                            <span>Agregar documento a este cliente</span>
                        </v-tooltip>
                    </v-col>
                </v-row>
            </v-card>
        </div>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
            <v-btn color="success" @click="registrarAvales" dark small >Registrar Avales</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Vue from "vue";
    import {ipcRenderer} from "electron";
    export default {
        name: "avales",
        computed:{
            EstadoVista(){
                return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
            },
            Soli:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud;
                }
            },
            dialogo:{
                get: function () {
                    return this.$store.state.solicitud_credito.dialogoSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', val);
                }
            },
            Avales:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud.aval_solicituds;
                }
            },
            AvalesEstaticos:{
                get:function () {
                    return this.$store.state.solicitud_credito.AvalesEstaticos;
                }
            },
        },
        data(){
            return{
                busqueda: false,
                data_Aval: [],
                avales: [],
                longAvales: 0,
                verInfo: false,
                Archivos: [],
                existsEditado: false,
                SinGuardar: [],
                save: false
            }
        },
        created() {
            this.avales        = this.AvalesEstaticos;
            this.longAvales    = this.Avales.length - 1;
            this.$store.commit('activarOverlay', false);
            this.AvalesEstaticos.forEach((i)=>{
                if (!i.aval)
                    this.existsEditado = true;
            })
        },
        methods:{
            addAvales(){
                this.AvalesEstaticos.push({
                    "consultado": false,
                    "nombres": '',
                    "apellidos": '',
                    "sexo":      0,
                    "identidad": '',
                    "archivos": [
                        {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                        {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                        {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                        {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                        {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
                    ],
                    "key":       this.AvalesEstaticos.length,
                    "id": null,
                    "tipo": 1,
                    "existe": false,
                    "aval":  false
                })
            },
            addDocumento(){
                this.Archivos.push({
                    "detalle": 'Archivo SN',
                    "dir":      '',
                    "file":     null,
                    "estado":   0,
                    "status":   false,
                    "key":      this.Archivos.length,
                    "num":      2
                });
            },
            abrirInfo(item){
                console.log(item.archivos)
                this.data_Aval = item;
                this.verInfo = true;
                this.Archivos = item.archivos
            },
            buscarCliente(item){
                let regexId = RegExp("^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$");
                if (item.key > this.longAvales){
                    if (item.identidad.length === 13 && regexId.test(item.identidad)){
                        // this.dialogo = false;
                        this.busqueda = true;
                        // this.$store.commit('activarOverlay', true);
                        this.$axios.get('cliente_segumiento/'+item.identidad)
                        .then((res)=>{
                            if (res.data.cliente){
                                this.existsEditado = true;
                                item.nombres   = res.data.cliente.nombres;
                                item.apellidos = res.data.cliente.apellidos;
                                item.sexo      = res.data.cliente.sexo;
                                item.archivos  = JSON.parse(res.data.cliente.archivos);
                                item.id        = res.data.cliente.id;
                                this.Archivos  = JSON.parse(res.data.cliente.archivos);
                                this.notificacion('El cliente existe. Datos cargados','success');
                                this.$store.commit('activarOverlay', false);
                                this.dialogo = true;
                                this.data_Aval.existe = true;
                            }else{
                              this.$refs.campoNombresAvales.focus()
                                this.existsEditado = false;
                                this.data_Aval.existe = false;
                                let archivos = [
                                    {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                                    {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                                    {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                                    {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                                    {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
                                ];
                                item.nombres   = '';
                                item.apellidos = '';
                                item.sexo      = '';
                                item.archivos  = archivos;
                                item.id        = null;
                                this.Archivos  = archivos;
                                this.$store.commit('activarOverlay', false);
                                this.dialogo = true;
                                this.notificacion('El cliente no existe. Cargar los datos manualmente','error');
                            }
                            this.busqueda = false;
                        })
                    }
                    item.consultado = true;
                }

            },
            notificacion(text, color){
                Vue.$toast.open({
                    message: text,
                    type: color,
                    position: 'bottom-left',
                    duration: 4000
                });
            },
            registrarArchivos(){
                let cont = 0;
                var data     = new FormData();
                this.Archivos.forEach( (item) => {
                    if (item.file && !item.dir){
                        data.append(`file_cliente[${cont}]`, item.file);
                        cont++;
                        item.estado = 1;
                    }
                });
                data.append('archivos',JSON.stringify(this.Archivos));
                data.append('nombres', this.data_Aval.nombres);
                data.append('apellidos', this.data_Aval.apellidos);
                data.append('identidad', this.data_Aval.identidad);
                data.append('sexo', this.data_Aval.sexo);

                if (cont > 0){
                    if (!this.data_Aval.existe){
                        this.registrarCliente(data);
                    }else{
                        this.dialogo = false;
                        this.$store.commit('activarOverlay', true);
                        this.Archivos.forEach( (item) => {
                            if (item.file && !item.dir){
                                data.append(`file_cliente[${cont}]`, item.file);
                                cont++;
                                item.estado = 1;
                            }
                        });
                        data.append('archivos',JSON.stringify(this.Archivos));
                        data.append('id', this.data_Aval.id);

                        this.$axios({
                            method: 'post',
                            url:    'clientes/edit/files',
                            data:   data,
                            headers:{
                                'Authorization': 'Bearer ' + this.$store.state.token,
                                'Content-Type': "multipart/form-data"
                            }
                        }).then((res)=>{
                            this.notificacion('Registro de archivos exitosos','success');
                            this.AvalesEstaticos.forEach((i)=>{
                                if (i.id === this.data_Aval.id){
                                    i.archivos = res.data.archivos;
                                }
                            });
                            this.Archivos = res.data.archivos;
                            this.$store.commit('activarOverlay', false);
                            this.dialogo = true;
                        }).catch((error)=>{
                            this.$store.commit('activarOverlay', false);
                            this.dialogo = true;
                            this.notificacion('Error al subir los archivos','error')
                        })
                    }
                }else{
                    this.notificacion('No hay documentos para enviar','warning')
                }
            },
            registrarAvales(){
                if (this.existsEditado){
                    let avales = [];
                    this.AvalesEstaticos.forEach((i)=>{
                        if (!i.aval){
                            avales.push({
                                "id": i.id
                            })
                        }
                    })
                    this.dialogo = false;
                    this.$store.commit('tareas/cambiarValorVista', false);
                    this.$store.commit('activarOverlay', true);
                    this.$axios.put('solicitud_credito/avales/'+this.Soli.id,{
                        avales: avales
                    }).then((res)=>{
                        this.$store.commit('solicitud_credito/cargarSolicitudes', {tipo: 1, search: null, fecha: null});
                        this.Avales = res.data.avales;
                        let dataAval = null;
                        this.$store.commit('solicitud_credito/agregarAvalesEstaticos', {tipo: 2});
                        this.Avales.forEach( (i, cont) => {
                            dataAval={
                                "nombres": i.cliente.nombres,
                                "apellidos": i.cliente.apellidos,
                                "sexo":      i.cliente.sexo,
                                "id":        i.cliente.id,
                                "archivos":  JSON.parse(i.cliente.archivos),
                                "key":       cont,
                                "identidad": i.cliente.identidad,
                                "tipo":      1,
                                "consultado": true,
                                "existe":     true,
                                "aval":       true
                            };
                            this.$store.commit('solicitud_credito/agregarAvalesEstaticos', dataAval,);
                            dataAval= {}
                        });
                        this.notificacion('Se han añadido los avales exitosamente','success');
                        this.verInfo = false;
                        this.existsEditado = false;
                        this.dialogo = true;
                        this.$store.commit('activarOverlay', false);
                        this.$store.commit('tareas/cambiarValorVista', true);
                    })
                }else{
                    this.notificacion('No hay avales que agregar','error')
                    this.dialogo = true;
                    this.$store.commit('activarOverlay', false);
                    this.$store.commit('tareas/cambiarValorVista', true);
                }
            },
            registrarCliente(data){
                let regexId = RegExp("^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$");
                if (this.data_Aval.identidad.length === 13 && this.data_Aval.sexo
                        && this.data_Aval.nombres.length >= 3 && this.data_Aval.apellidos.length >= 3
                        && regexId.test(this.data_Aval.identidad)){
                    this.dialogo = false;
                    this.$store.commit('activarOverlay', true);
                    this.$store.commit('tareas/cambiarValorVista', false);
                    this.$axios({
                        method: 'post',
                        url:    'clientes',
                        data:   data,
                        headers:{
                            'Authorization': 'Bearer ' + this.$store.state.token,
                            'Content-Type': "multipart/form-data"
                        }
                    }).then((res)=>{
                        this.AvalesEstaticos.forEach((i)=>{
                            console.log(i)
                            if (i.identidad == res.data.identidad){
                                i.archivos = res.data.files;
                                i.id       = res.data.cliente;
                                console.log(i)
                            }
                        });
                        this.Archivos = res.data.files;
                        this.$store.commit('activarOverlay', false);
                        this.$store.commit('tareas/cambiarValorVista', true);
                        this.dialogo = true;
                        this.data_Aval.existe = true;
                        this.existsEditado = true;
                        this.notificacion('Se creo el cliente exitosamente','success');
                        this.notificacion('Se agregaron los documentos exitosemente','success');
                    }).catch((error)=>{
                        this.$store.commit('tareas/cambiarValorVista', true);
                        this.notificacion('Error al crear el cliente.','error')
                    })
                }else{
                    this.notificacion('Faltan datos del cliente','error')
                }
            },
            removeAval(item){
                let cont = 0;
                if (item.key > this.longAvales) {
                    this.avales.splice(item.key, 1);
                    this.avales.forEach((i) => {
                        i.key = cont;
                        cont++;
                    });
                    this.data_Aval = [];
                    this.verInfo = false;
                    this.Archivos = [];
                }
            },
            verDocumento(dir){
                this.dialogo = false;
                this.$store.commit('activarOverlay', true);
                this.$axios.post('leer_documento/',
                    {ubicacion: dir}).then((res)=>{
                    if (res.status === 200){
                        ipcRenderer.send('open-nav', res.data.url);
                        this.$store.commit('activarOverlay', false);
                        this.dialogo = true;
                    }
                }).catch((error)=>{
                    this.$store.commit('activarOverlay', false);
                    this.dialogo = true;
                })
            },
        }
    }
</script>

<style scoped>
    .rowsTable{
        cursor: pointer;
    }
    table{
        width: 98%;
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
