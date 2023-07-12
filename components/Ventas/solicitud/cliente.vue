<template>
    <v-card :height="height" :width="width" class="d-flex align-center mb-1">
        <v-container v-if="vista === 1">
            <v-form ref="FormValidarIdentidadCliente" v-on:submit.prevent>
                <v-text-field label="Identidad del cliente"
                              :rules="rulesIdentidad"
                              @keyup.enter="validarIdentidad"
                              v-model="Cliente.identidad"
                              outlined
                              :loading="loadIdentidad"
                              prepend-inner-icon="fa fa-portrait"
                              counter dense></v-text-field>
            </v-form>
        </v-container>
        <v-container v-else-if="vista === 2">
            <v-container class="grey lighten-5 pa-2">
                <v-row no-gutters>
                    <v-col>
                        <table class="rowsTable">
                            <tbody>
                            <tr>
                                <td>Identidad del cliente *</td>
                                <td><input ref="inputIdentidad" @keyup.enter="$refs.inputNombres.focus()"
                                           v-model="Cliente.identidad" type="text"></td>
                            </tr>
                            <tr>
                                <td>Nombres del cliente *</td>
                                <td><input ref="inputNombres" @keyup.enter="$refs.inputApellidos.focus()"
                                           v-model="Cliente.nombres"type="text"></td>
                            </tr>
                            <tr>
                                <td>Apellidos del cliente *</td>
                                <td><input ref="inputApellidos" @keyup.enter="$refs.inputEmail.focus()"
                                           v-model="Cliente.apellidos"  type="text"></td>
                            </tr>
                            <tr >
                                <td>Correo eléctronico</td>
                                <td><input ref="inputEmail" @keyup.enter="$refs.inputRtn.focus()"
                                           v-model="Cliente.email" type="text"></td>
                            </tr>
                            <tr >
                                <td>Rtn del cliente</td>
                                <td><input ref="inputRtn" @keyup.enter="$refs.inputSexo.focus()"
                                           v-model="Cliente.rtn" type="text"></td>
                            </tr>
                            <tr >
                                <td>Sexo *</td>
                                <td><select ref="inputSexo" @keyup.enter="$refs.inputFechaDia.focus()"
                                            class="select-css" v-model="Cliente.sexo">
                                    <option value="1">Masculino</option>
                                    <option value="2">Femenino</option>
                                </select></td>
                            </tr>
                            </tbody>
                        </table>
                    </v-col>
                    <v-col>
                        <table class="rowsTable">
                            <tbody>
                            <tr >
                                <td width="40%">Fecha de nacimiento *</td>
                                <td class="containerFechas">
                                    <input ref="inputFechaDia" @keyup.enter="$refs.inputFechaMes.focus()"
                                           @change="formarFecha" v-model="Fechas.dia" type="text" placeholder="Día">
                                    <input ref="inputFechaMes" @keyup.enter="$refs.inputFechaAno.focus()"
                                           @change="formarFecha" v-model="Fechas.mes" type="text" placeholder="Més">
                                    <input ref="inputFechaAno" @keyup.enter="$refs.inputIsTrabajo.focus()"
                                           @change="formarFecha" v-model="Fechas.ano" type="text" placeholder="Año">
                                </td>
                            </tr>
                            <tr >
                                <td>Trabaja *</td>
                                <td>
                                    <select ref="inputIsTrabajo" @keyup.enter="$refs.InputLugarTrabaja.focus()"
                                            class="select-css" v-model="Cliente.is_trabaja">
                                        <option value="1">Sí</option>
                                        <option value="0">No</option>
                                    </select>
                                </td>
                            </tr>
                            <tr >
                                <td>Lugar de trabajo</td>
                                <td><input ref="InputLugarTrabaja" @keyup.enter="$refs.inputSalario.focus()"
                                           v-model="Cliente.empresa_trabaja" type="text"></td>
                            </tr>
                            <tr >
                                <td>Salario*</td>
                                <td><input ref="inputSalario" @keyup.enter="$refs.inputNacionalidad.focus()"
                                           v-model="Cliente.salario" type="text"></td>
                            </tr>
                            <tr >
                                <td>Nacionalidad *</td>
                                <td><input ref="inputNacionalidad" @keyup.enter="$refs.inputIsCasa.focus()"
                                           v-model="Cliente.nacionalidad" type="text"></td>
                            </tr>
                            <tr >
                                <td>Casa propia *</td>
                                <td>
                                    <select ref="inputIsCasa" class="select-css" v-model="Cliente.is_casa">
                                        <option value="1">Sí</option>
                                        <option value="0">No</option>
                                    </select>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </v-col>
                    <v-col>
                        <table class="rowsTable">
                            <tbody>
                                <tr v-for="item in Cliente.detalles">
                                    <td>{{item.detalle}}</td>
                                    <td v-if="item.select === 2"><input type="text" v-model="item.val"></td>
                                    <td v-else-if="item.select === 1">
                                        <select class="select-css" v-model="item.val">
                                            <option v-for="i in item.datos" :value="i">{{i}}</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <hr>
                        <small>Detalles extras del cliente</small>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="contenedorTable2">
                    <v-col cols="4">
                        <small>Telefonos</small>
                        <v-btn fab x-small color="success" @click="addTelefonos" text><v-icon>fa fa-plus</v-icon></v-btn>
                        <table class="rowsTable">
                            <thead>
                            <tr>
                                <th>Detalle</th>
                                <th>Número</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in Cliente.telefonos">
                                    <td><input type="text" v-model="item.detalle"></td>
                                    <td><input type="text" v-model="item.num"></td>
                                    <td>
                                        <v-btn color="red" width="20px" height="20px"
                                               @click="removeTelefono(item.key)"
                                               fab x-small text><v-icon size="15">fa fa-times</v-icon></v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </v-col>
                    <v-col cols="8">
                        <small>Archivos del cliente</small>
                        <v-btn fab x-small color="success" @click="addArchivos" text><v-icon>fa fa-plus</v-icon></v-btn>
                        <table class="rowsTable disabled">
                            <thead>
                            <tr>
                                <th>Nombre del archivo</th>
                                <th class="d-flex justify-center">Estado</th>
                                <th>Archivo</th>
                                <th>*</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in Cliente.archivos">
                                <td><input type="text" v-model="item.detalle"></td>
                                <td class="d-flex justify-center">
                                    <v-icon v-if="item.status" color="success">fa fa-check</v-icon>
                                    <v-icon v-else color="red">fa fa-times</v-icon>
                                </td>
                                <td v-if="item.status === 1 || item.status">
                                    <v-btn @click="verDocumento(item.dir)" fab height="25px" width="20px" text color="red">
                                        <v-icon size="15">fa fa-file-pdf</v-icon>
                                    </v-btn>
                                </td>
                                <td v-else-if="item.status === 0 || !item.status">
                                    <v-row no-gutters>
                                        <v-col cols="11">
                                            <b-form-file browse-text="Buscar" v-model="item.file" @change="cambiarEstadoFile(item)"
                                                         :placeholder="'buscar '+item.detalle" accept="application/pdf" size="sm">
                                            </b-form-file>
                                        </v-col>
                                        <v-col v-if="item.file" cols="1" class="d-flex justify-center">
                                            <v-btn fab height="24px" width="24px" text @click="item.file = null">
                                                <v-icon size="15px">fa fa-trash-alt</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </td>
                                <td>
                                    <span v-if="item.num === 1">Sí</span>
                                    <span v-if="item.num === 2">No</span>
                                </td>
                                <td>
                                    <v-btn color="red" width="20px" height="20px"
                                           @click="removeArchivos(item.key)"
                                           fab x-small text><v-icon size="15">fa fa-times</v-icon></v-btn>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row no-gutters class="contenedorTable">
                    <v-col>
                        <small>Direcciones</small>
                        <v-btn fab x-small color="success" @click="addDirecciones" text><v-icon>fa fa-plus</v-icon></v-btn>
                        <b-spinner v-if="loadDireccion" variant="success" type="grow" small></b-spinner>
                        <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                                <v-btn color="success" fab @click="Ciudad.dialogo = true"
                                       x-small text v-on="on" v-bind="attrs">
                                    <v-icon>fa fa-city</v-icon>
                                </v-btn>
                            </template>
                            <span>Crear ciudad/aldea/caserio</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                                <v-btn color="success" fab x-small @click="Colonia.dialogo = true"
                                       text v-on="on" v-bind="attrs">
                                    <v-icon>fa fa-building</v-icon>
                                </v-btn>
                            </template>
                            <span>Crear colonia</span>
                        </v-tooltip>

                        <table class="rowsTable">
                            <thead>
                            <tr>
                                <th>Departamento</th>
                                <th>Municipio</th>
                                <th>Ciudad/Aldea/Caserio</th>
                                <th>Colonia</th>
                                <th>Detalle</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in Cliente.direcciones">
                                <td width="15%">
                                  <v-autocomplete v-model="item.departamento" @change="cargarMunicipios(item)" :item-text="'nombre'"
                                                  :items="Departamentos" :item-value="'id'" dense outlined></v-autocomplete>
                                </td>
                                <td width="15%">
                                  <v-autocomplete v-model="item.municipio" :items="item.Municipios" :item-value="'id'" dense
                                                  outlined @change="cargarCiudades(item)" :item-text="'nombre'"></v-autocomplete>
                                </td>
                                <td width="20%">
                                  <v-autocomplete v-model="item.ciudad" :items="item.Ciudades" :item-value="'id'" dense
                                                  outlined  @change="cargarColonias(item)" :item-text="'nombre'"></v-autocomplete>
                                </td>
                                <td width="20%">
                                  <v-autocomplete v-model="item.colonia" :items="item.Colonias" :item-value="'id'" dense
                                                  outlined :item-text="'nombre'"></v-autocomplete>
                                </td>
                                <td width="28%">
                                    <v-textarea rows="2" style="font-size: 10px; padding: 1px" outlined v-model="item.detalle"></v-textarea>
                                </td>
                                <td width="2%">
                                    <v-btn width="20px" height="20px" @click="removeDireccion(item.key)"
                                           color="red" fab text>
                                        <v-icon size="15">fa fa-times</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </v-col>
                </v-row>
            </v-container>

            <v-card-actions class="d-flex justify-end">
                <b-spinner variant="success" v-if="Cliente.subiendo" small type="grow"></b-spinner>
                <v-btn color="success" :disabled="Cliente.subiendo" v-if="Cliente.exists" small @click="validarDatosCliente">Editar cliente</v-btn>
                <v-btn color="success" :disabled="Cliente.subiendo" v-else-if="!Cliente.exists" small @click="validarDatosCliente">Registrar cliente</v-btn>
                <v-btn color="success" :disabled="!registro" small @click="vistaSolicitud = 2">Siguiente paso</v-btn>
            </v-card-actions>
        </v-container>

        <v-dialog v-model="Ciudad.dialogo" width="30%">
            <v-card>
                <v-row class="grey lighten-5" no-gutters>
                    <v-col cols="11">
                        <v-card-title>Nueva ciudad/caserio/aldea </v-card-title>
                    </v-col>
                    <v-col cols="1" class="d-flex align-center">
                        <b-spinner v-if="loadCiudad" variant="success" type="grow" small></b-spinner>
                    </v-col>
                </v-row>
                <v-form ref="FormCiudadNueva"  class="pl-5 pr-5">
                    <v-select label="Seleccione un departamento" :items="Departamentos"
                              :rules="[Ciudad.rules.r.req]"
                              :item-value="'id'" :item-text="'nombre'" v-model="Ciudad.departamento"
                              @change="cargarMunicipios_new"></v-select>
                    <v-select label="Seleccione un municipio" v-model="Ciudad.municipio"
                              :item-value="'id'" :item-text="'nombre'"
                              :rules="[Ciudad.rules.r.req]"
                              :items="Municipios"></v-select>
                    <v-text-field v-model="Ciudad.nombre" counter
                                  :rules="[Ciudad.rules.r.req, Ciudad.rules.r.min, Ciudad.rules.r.max]"
                                  label="Nombre de la ciudad/caserio/aldea" ></v-text-field>
                    <v-select label="Tipo" :items="Ciudad.tipo_data"
                              :rules="[Ciudad.rules.r.req]"
                              v-model="Ciudad.tipo"></v-select>
                </v-form>
                <v-card-actions class="d-flex justify-end">
                    <v-btn color="warning" small @click="Ciudad.dialogo = false" dark>Cerrar</v-btn>
                    <v-btn color="success" small @click="validarFormCiudad" dark>Registrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="Colonia.dialogo" width="30%">
            <v-card>
                <v-row class="grey lighten-5" no-gutters>
                    <v-col cols="11">
                        <v-card-title>Nueva colonia </v-card-title>
                    </v-col>
                    <v-col cols="1" class="d-flex align-center">
                        <b-spinner v-if="loadCiudad" variant="success" type="grow" small></b-spinner>
                    </v-col>
                </v-row>
                <v-form ref="FormColoniaNueva"  class="pl-5 pr-5">
                    <v-select label="Seleccione un departamento" :items="Departamentos"
                              :rules="[Ciudad.rules.r.req]"
                              :item-value="'id'" :item-text="'nombre'" v-model="Ciudad.departamento"
                              @change="cargarMunicipios_new"></v-select>
                    <v-select label="Seleccione un municipio" v-model="Ciudad.municipio"
                              :item-value="'id'" :item-text="'nombre'"
                              :rules="[Ciudad.rules.r.req]" @change="cargarCiudades_new"
                              :items="Municipios"></v-select>
                    <v-select label="Seleccione una ciudad/aldea/caserio" v-model="Colonia.ciudad"
                              :item-value="'id'" :item-text="'nombres'"
                              :rules="[Ciudad.rules.r.req]"
                              :items="Ciudades"></v-select>
                    <v-text-field v-model="Colonia.nombre" counter
                                  :rules="[Ciudad.rules.r.req, Ciudad.rules.r.min, Ciudad.rules.r.max]"
                                  label="Nombre de la colonia" ></v-text-field>

                </v-form>
                <v-card-actions class="d-flex justify-end">
                    <v-btn color="warning" small @click="Ciudad.dialogo = false" dark>Cerrar</v-btn>
                    <v-btn color="success" small @click="validarFormColonia" dark>Registrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import Vue from "vue";
    import {ipcRenderer} from "electron";
    export default {
        name: "cliente",
        data(){
            return{
                cantArchivos: 0,
                Fechas:{
                    dia: null,
                    mes: null,
                    ano: null
                },
                Colonia:{
                    nombre: '',
                    ciudad: '',
                    dialogo: false
                },
                loadCiudad: false,
                Ciudad:{
                    rules:{
                        r:{
                            req: v => !!v || 'Campo requerido',
                            min:v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
                            max:v => (v && v.length <= 60) || 'Tiene que ser menor o igual a 60 carácteres.',
                        }
                    },
                    dialogo:   false,
                    departamento: '',
                    municipio:    '',
                    nombre:       '',
                    tipo:         '',
                    tipo_data: [
                        {text:'Caserio', value:'Caserio'},
                        {text:'Ciudad', value:'Ciudad'},
                        {text:'Aldea', value:'Aldea'}
                    ]
                },
                loadIdentidad: false,
                Departamentos: [],
                Municipios:    [],
                Ciudades:      [],
                rulesIdentidad:[
                    v => !!v || 'La identidad es requerida',
                    v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Identidad no válida, tienes datos diferentes a números',
                    v => (v.length === 0 || v.length === 13 || v.length === 14) || 'Tiene que ser de 13 o 14 carácteres.'
                ],
                loadDireccion: false,
            }
        },
        created() {
            if (this.vista === 1) {
                this.height = '300px';
                this.width  = '40%';
            }else if (this.vista === 2){
                this.height = '100%';
                this.width  = '100%';
                this.cargarDirecciones(this.Cliente.direcciones)
            }
            this.cargarDepartamentos();
            this.Solicitud.avales = [];
            this.Solicitud.referencias=
                [
                    {nombre: '', telefono: '', parentesco: '', direccion: '', estado:false, key: 0, comentario: ''},
                    {nombre: '', telefono: '', parentesco: '', direccion: '', estado:false, key: 1, comentario: ''},
                    {nombre: '', telefono: '', parentesco: '', direccion: '', estado:false, key: 2, comentario: ''},
                    {nombre: '', telefono: '', parentesco: '', direccion: '', estado:false, key: 3, comentario: ''},
                ]
        },
        computed:{
            btncliente:{
                get:function () {
                    return this.$store.state.solicitud_credito.hiddenBtnCliente;
                },
                set:function (val) {
                    return this.$store.commit('solicitud_credito/cambiarValorBtnCliente', val);
                }
            },
            Cliente:{
                get:function () {
                    return this.$store.state.solicitud_credito.Cliente;
                }
            },
            vistaSolicitud:{
                get:function () {
                    return this.$store.state.solicitud_credito.SolicitudCredito_vista;
                },
                set:function (val) {
                    return this.$store.commit('solicitud_credito/cambiarVista', val)
                }
            },
            vista:{
                get:function () {
                    return this.$store.state.solicitud_credito.Cliente_vista;
                },
                set: function (val) {
                    return this.$store.commit('solicitud_credito/vistaCliente', val)
                }
            },
            height:{
                get:function () {
                    return this.$store.state.solicitud_credito.height;
                },
                set: function (val) {
                    return this.$store.commit('solicitud_credito/cambiarHeight', val)
                }
            },
            width:{
                get:function () {
                    return this.$store.state.solicitud_credito.width;
                },
                set: function (val) {
                    return this.$store.commit('solicitud_credito/cambiarWifth', val)
                }
            },
            registro:{
                get: function(){
                    return this.$store.state.solicitud_credito.Cliente.registro;
                },
                set: function () {
                    this.$store.commit('solicitud_credito/cambiarValorRegistro')
                }
            },
            Solicitud:{
                get:function () {
                    return this.$store.state.solicitud_credito.data;
                }
            },
        },
        methods:{
            addArchivos(){
                this.Cliente.archivos.push({
                    dir:     '',
                    detalle: '',
                    num:     1,
                    status:  false,
                    key:     this.Cliente.archivos.length,
                    file:    null
                })
            },
            addDirecciones(){
                this.Cliente.direcciones.push({
                    'departamento': '',
                    'municipio':    '',
                    'ciudad':       '',
                    'colonia':      '',
                    'detalle':      '',
                    'key':          this.Cliente.direcciones.length,
                    'Municipios':   [],
                    'Ciudades':     [],
                    'Colonias':     [],
                })
            },
            addTelefonos(){
                this.Cliente.telefonos.push({
                    'detalle':       'Telefono '+(parseInt(1) + parseInt(this.Cliente.telefonos.length)),
                    'num':           '',
                    'key':           this.Cliente.telefonos.length
                })
            },
            buscarcliente(){
                let th = this.Cliente;
                this.loadIdentidad = true;
                this.$axios.get('cliente_segumiento/'+th.identidad)
                    .then((res)=>{
                        if (res.data.cliente){
                            let cl = res.data.cliente;
                            th.exists    = true;
                            th.id        = cl.id;
                            th.nombres   = cl.nombres;
                            th.apellidos = cl.apellidos;
                            th.email     = cl.email;
                            th.rtn       = cl.rtn;
                            th.sexo      = cl.sexo;
                            if (cl.fecha_nacimiento){
                                this.Fechas.dia = cl.fecha_nacimiento.split('-')[2];
                                this.Fechas.mes = cl.fecha_nacimiento.split('-')[1];
                                this.Fechas.ano = cl.fecha_nacimiento.split('-')[0];
                            }
                            if (cl.telefonos)
                                th.telefonos = JSON.parse(cl.telefonos);
                            else
                                th.telefonos = [];
                            th.fecha_nacimiento = cl.fecha_nacimiento;
                            th.is_trabaja       = cl.is_trabaja;
                            th.empresa_trabaja  = cl.empresa_trabaja;
                            if (cl.salario)
                                th.salario = cl.salario;
                            else
                                th.salario = 0;
                            if (cl.nacionalidad)
                                th.nacionalidad     = cl.nacionalidad;
                            th.is_casa          = cl.is_casa;
                            if (cl.detalles){
                                th.detalles     = JSON.parse(cl.detalles)
                            }else{
                                th.detalles     = [
                                    {detalle: 'Estado civil',             val:'', select: 1, datos:['Soletr@','Casad@', 'Unión libre']},
                                    {detalle: 'Nombre del conyugue',      val:'', select: 2, datos:[]},
                                    {detalle: 'Hijos',                    val:'', select: 1, datos:['Sí','No']},
                                    {detalle: 'Cantidad de hijos',        val:'', select: 2, datos:[]},
                                    {detalle: 'Cantidad de dependientes', val:'', select: 2, datos:[]},
                                    {detalle: 'Tipo de vivienda',         val:'', select: 1, datos:['Casa propia','Casa Familiar','Condiminio de apartamentos','apartamento','Guarderia']},
                                    {detalle: 'Otros ingresos',           val:'', select: 2, datos:[]},
                                    {detalle: 'Total de otros ingresos',  val:'', select: 2, datos:[]},
                                    {detalle: 'Contrato laboral',         val:'', select: 1, datos:['Sí','No']},
                                    {detalle: 'Tiempo laborando',         val:'', select: 2, datos:[]},
                                ]
                            }
                            if (cl.archivos){
                                th.archivos     = JSON.parse(cl.archivos);
                                this.cantArchivos = parseInt(JSON.parse(cl.archivos).length) - 1;
                            }else{
                                th.archivos     = [
                                    {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                                    {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                                    {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                                    {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                                    {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
                                ];
                                this.cantArchivos = 4
                            }
                            if (cl.direcciones){
                                console.log(JSON.parse(cl.direcciones))
                                th.direcciones = JSON.parse(cl.direcciones);
                                this.cargarDirecciones(th.direcciones);
                            }else{
                                th.direcciones = [];
                            }
                            th.exists = true;
                            th.registro = true;
                        }else {
                            th.exists = false;
                            let cl = res.data.cliente;
                            th.nombres          = '';
                            th.apellidos        = '';
                            th.email            = '';
                            th.rtn              = '';
                            th.sexo             = '';
                            th.fecha_nacimiento = '';
                            th.is_trabaja       = '';
                            th.empresa_trabaja  = '';
                            th.salario          = 0;
                            th.is_casa          = '';
                            th.detalles         = [
                                {detalle: 'Estado civil',             val:'', select: 1, datos:['Soletr@','Casad@', 'Unión libre']},
                                {detalle: 'Nombre del conyugue',      val:'', select: 2, datos:[]},
                                {detalle: 'Hijos',                    val:'', select: 1, datos:['Sí','No']},
                                {detalle: 'Cantidad de hijos',        val:'', select: 2, datos:[]},
                                {detalle: 'Cantidad de dependientes', val:'', select: 2, datos:[]},
                                {detalle: 'Tipo de vivienda',         val:'', select: 1, datos:['Casa propia','Casa Familiar','Condiminio de apartamentos','apartamento','Guarderia']},
                                {detalle: 'Otros ingresos',           val:'', select: 2, datos:[]},
                                {detalle: 'Total de otros ingresos',  val:'', select: 2, datos:[]},
                                {detalle: 'Contrato laboral',         val:'', select: 1, datos:['Sí','No']},
                                {detalle: 'Tiempo laborando',         val:'', select: 2, datos:[]},
                            ];
                            th.archivos         = [
                                {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                                {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                                {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                                {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                                {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
                            ];
                            th.telefonos        = [];
                            th.direcciones      = [];
                        }

                        this.loadIdentidad = false;
                        this.vista = 2;
                        this.height = '100%';
                        this.width  = '100%';
                        this.btncliente = true;
                    }).catch((error)=>{
                        this.notificacion('Hubo error al cargar los datos. Presiona ENTER nuevamente','error');
                        this.loadIdentidad = false;
                    })
            },
            cambiarEstadoFile(item){
                item.estado = 1;
            },
            cargarCiudades: function (item) {
                this.loadDireccion = true;
                item.Ciudades = [];
                this.$axios.get('/ciudades/'+item.municipio,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    res.data.ciudades.forEach((i)=>{
                      item.Ciudades.push({
                        id: i.id,
                        nombre: i.nombres+' - '+i.tipo
                      })
                    })
                    this.loadDireccion = false;
                })
            },
            cargarCiudades_new(){
                this.loadCiudad = true;
                this.$axios.get('/ciudades/'+this.Ciudad.municipio,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    this.Ciudades = res.data.ciudades;
                    this.loadCiudad = false;
                })
            },
            cargarColonias: function (item) {
                this.loadDireccion = true;
                this.$axios.get('/colonias/'+item.ciudad,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    item.Colonias = res.data.colonias;
                    this.loadDireccion = false;
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
                  console.log(i)
                    this.cargarMunicipios(i);
                    this.cargarCiudades(i);
                    this.cargarColonias(i)
                })
            },
            cargarMunicipios: function (item) {
                this.loadDireccion = true;
                this.$axios.get('/municipios/'+item.departamento,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    item.Municipios = res.data.municipios;
                    this.loadDireccion = false;
                })
            },
            cargarMunicipios_new(){
                this.loadCiudad = true;
                this.$axios.get('/municipios/'+this.Ciudad.departamento,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    this.Municipios = res.data.municipios;
                    this.loadCiudad = false;
                })
            },
            enviarDatos(){
                if (this.Cliente.exists)
                    this.$store.commit('solicitud_credito/editarCliente');
                else
                    this.$store.commit('solicitud_credito/crearCliente');

                this.Cliente.exists = true;
            },
            formarFecha(){
                if (this.Fechas.dia && this.Fechas.dia.length === 1 && this.Fechas.dia < 10)
                    this.Fechas.dia = `${0}${this.Fechas.dia}`;
                if (this.Fechas.mes && this.Fechas.mes.length === 1 && this.Fechas.mes < 10)
                    this.Fechas.mes = `${0}${this.Fechas.mes}`;
                this.Cliente.fecha_nacimiento = this.Fechas.ano+'-'+this.Fechas.mes+'-'+this.Fechas.dia;
                console.log(this.Fechas.mes)
                console.log(this.Cliente.fecha_nacimiento)
            },
            guardarCiudad(){
                this.Ciudad.dialogo = false;
                this.$store.commit('activarOverlay', true);
                this.$axios.post('ciudades',{
                    municipio: this.Ciudad.municipio,
                    nombre:    this.Ciudad.nombre,
                    tipo:      this.Ciudad.tipo
                }).then((res)=>{
                    this.$store.commit('activarOverlay', false);
                    Vue.$toast.open({
                        message: `se ha registrado exitosamente ${this.Ciudad.nombre} como ${this.Ciudad.tipo}.`,
                        type: 'success',
                        position: 'bottom-left',
                        duration: 4000
                    });
                    this.Ciudad.nombre = '';
                    this.Ciudad.municipio = '';
                })
            },
            guardarColonia(){
                this.Colonia.dialogo = false;
                this.$store.commit('activarOverlay', true);
                this.$axios.post('colonias',{
                    ciudad_id: this.Colonia.ciudad,
                    nombre:    this.Colonia.nombre,
                }).then((res)=>{
                    this.$store.commit('activarOverlay', false);
                    Vue.$toast.open({
                        message: `se ha registrado exitosamente la colonia/barrio ${this.Colonia.nombre}.`,
                        type: 'success',
                        position: 'bottom-left',
                        duration: 4000
                    });
                    this.Colonia.nombre = '';
                    this.Colonia.municipio = '';
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
            removeArchivos(fila){
                let cont = 0;
                if (fila > this.cantArchivos){
                    this.Cliente.archivos.splice(fila,1);
                    this.Cliente.archivos.forEach( (i) => {
                        i.key = cont;
                        cont++;
                    })
                }
            },
            removeDireccion(fila){
                let item = 0;
                this.Cliente.direcciones.splice(fila, 1)
                this.Cliente.direcciones.forEach( (i) => {
                    i.key = item;
                    item++;
                })
            },
            removeTelefono(fila){
                let item = 0;
                this.Cliente.telefonos.splice(fila, 1);
                this.Cliente.telefonos.forEach( (i) => {
                    i.key = item;
                    i.detalle = 'Telefono '+(parseInt(item) + parseInt(1));
                    item++;
                })
            },
            validarArchivos(){
                let contador = 0, long = 0;
                this.Cliente.archivos.forEach( (i) => {
                    if (i.num === 1 && !i.status){
                        long++;
                        if (i.detalle.length > 2 && i.file)
                            contador ++;
                    }
                });

                if (long === contador){
                    return true
                }else{
                    Vue.$toast.open({
                        message: `Hay datos incompletos en los archivos.`,
                        type: 'warning',
                        position: 'bottom-left',
                        duration: 4000
                    });
                    return  false;
                }
            },
            validarDatosCliente(){
                if (this.validarInformacion() && this.validarTelefonos() && this.validarArchivos() && this.validarDirecciones()){
                    this.enviarDatos()
                }
            },
            validarDirecciones(){
                let contador = 0, long = this.Cliente.direcciones.length;
                if (long > 0){
                    this.Cliente.direcciones.forEach( (i)=>{
                        if (i.colonia && i.detalle)
                            contador++
                    });
                    if (contador === long)
                        return true;
                    else{
                        Vue.$toast.open({
                            message: `Hay datos incompletos en las direcciones.`,
                            type: 'warning',
                            position: 'bottom-left',
                            duration: 4000
                        });
                        return false;
                    }
                }else{
                    Vue.$toast.open({
                        message: `Tiene que ingresa mínimo una dirección.`,
                        type: 'warning',
                        position: 'bottom-left',
                        duration: 4000
                    });
                    return false;
                }
            },
            validarFormCiudad(){
                if (this.$refs.FormCiudadNueva.validate())
                    this.guardarCiudad()
            },
            validarFormColonia(){
                if (this.$refs.FormColoniaNueva.validate())
                    this.guardarColonia()
            },
            validarIdentidad(){
                if (this.$refs.FormValidarIdentidadCliente.validate())
                    this.buscarcliente();
            },
            validarInformacion(){
                let contador = 10, cont= 0, th = this.Cliente;
                let regexId = RegExp("^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$");
                if (th.identidad.length === 13 && regexId.test(th.identidad))
                    cont++;
                else
                    this.notificacion('La identidad es obligatoria.','warning');

                if (th.salario && th.salario >= 0)
                    cont++;
                else
                    this.notificacion('El salario es obligatorio, puede ser 0 o mayor a 0.','warning');


                if (th.nombres.length >= 3)
                    cont++;
                else
                    this.notificacion('Los nombres son obligatorios.','warning');

                if (th.apellidos.length >= 3)
                    cont++;
                else
                    this.notificacion('Los apellidos son obligatorios.','warning');

                if (th.nombres.length >= 3)
                    cont++;
                else
                    this.notificacion('Los nombres son obligatorios.','warning');

                if (th.sexo)
                    cont++;
                else
                    this.notificacion('el sexo es obligatorio','warning');

                let regexFecha = new RegExp("^(\\d{4})[\\/\\-](0?[1-9]|1[012])[\\/\\-](0?[1-9]|[12][0-9]|3[01])$");
                if (regexFecha.test(th.fecha_nacimiento))
                    cont++;
                else
                    this.notificacion('La fecha de nacimiento es obligatoria.','warning');

                if (th.is_trabaja == 0 || th.is_trabaja == 1)
                    cont++;
                else
                    this.notificacion('Especificar si el solicitante trabaja.','warning');

                if (th.nacionalidad)
                    cont++;
                else
                    this.notificacion('La nacionalidad es obligatoria obligatorio.','warning');

                if (th.is_casa == 0 || th.is_casa == 1)
                    cont++;
                else
                    this.notificacion('Especificar si el solicitante tiene casa es obligatorio.','warning');

                return contador === cont;
            },
            validarTelefonos(){
                let contador = 0, long = this.Cliente.telefonos.length;
                if (long > 0){
                    this.Cliente.telefonos.forEach( (i)=>{
                        if (i.detalle.length > 0 && i.num.length === 8)
                            contador++
                    });
                    if (contador === long)
                        return true;
                    else {
                        Vue.$toast.open({
                            message: `Hay datos incompletos en los telefonos.`,
                            type: 'warning',
                            position: 'bottom-left',
                            duration: 4000
                        });
                        return  false;
                    }
                }else{
                    Vue.$toast.open({
                        message: `Tiene que ingresar mínimo un telefono.`,
                        type: 'warning',
                        position: 'bottom-left',
                        duration: 4000
                    });
                    return false
                }
            },
            verDocumento(dir){
                this.$store.commit('activarOverlay', true);
                this.$axios.post('leer_documento/',
                    {ubicacion: dir}).then((res)=>{
                    if (res.status === 200){
                        ipcRenderer.send('open-nav', res.data.url);
                        this.$store.commit('activarOverlay', false);
                    }
                }).catch((error)=>{
                    this.$store.commit('activarOverlay', false);
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
    .contenedorTable{
        overflow-y: auto;
        height: 200px;
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
    textarea{
        width: 100%;
        box-sizing: border-box;
        padding: 2px 10px;
        margin: 1px;
        border: 1px solid #ccc;
        border-radius: 1px;
        cursor: pointer;
    }
    textarea:hover{
        background-color: #FFF;
    }
    .containerFechas{
        display: flex;
        align-items: stretch;
    }
    .contenedorTable2{
        overflow-y: auto;
        height: 240px;
    }

</style>
