<template>
    <v-container>
        <h6 class="text-center">Datos de la solicitud de crédito</h6>
        <v-divider></v-divider>
        <v-row class="grey lighten-3">
            <v-col>
                <small>Datos del cliente</small>
                <v-divider></v-divider>
                <table class="rowsTable">
                    <tbody>
                    <tr>
                        <th>Identidad: </th>
                        <td>{{Cliente.identidad}}</td>
                    </tr>
                    <tr>
                        <th>Nombre completo: </th>
                        <td>{{Cliente.nombres}} {{Cliente.apellidos}}</td>
                    </tr>
                    <tr>
                        <th>Fecha de nacimiento:</th>
                        <td v-if="Cliente.fecha_nacimiento">{{Cliente.fecha_nacimiento.split('-')[2]}}/{{Cliente.fecha_nacimiento.split('-')[1]}}/{{Cliente.fecha_nacimiento.split('-')[0]}}</td>
                    </tr>
                    <tr>
                        <th>Sexo:</th>
                        <td v-if="Cliente.sexo === 1">Masculino</td>
                        <td v-else-if="Cliente.sexo === 2">Femenino</td>
                    </tr>
                    <tr>
                        <th>E-mail:</th>
                        <td>{{Cliente.email}}</td>
                    </tr>
                    <tr>
                        <th>Nacionalidad:</th>
                        <td>{{Cliente.nacionalidad}}</td>
                    </tr>
                    <tr>
                        <th>Trabaja:</th>
                        <td v-if="Cliente.is_trabaja === 0">No</td>
                        <td v-else-if="Cliente.is_trabaja === 1">Si</td>
                    </tr>
                    <tr>
                        <th>Lugar de trabajo:</th>
                        <td>{{Cliente.empresa_trabaja}}</td>
                    </tr>
                    <tr>
                        <th>Ingreso:</th>
                        <td>L. {{Cliente.salario}}</td>
                    </tr>
                    </tbody>
                </table>
            </v-col>
            <v-col>
                <small>Telefonos</small>
                <v-divider></v-divider>
                <table class="rowsTable">
                    <tbody>
                    <tr v-for="item in Cliente.telefonos">
                        <th>{{item.detalle}}</th>
                        <td>{{item.num}}</td>
                    </tr>
                    </tbody>
                </table>
            </v-col>
            <v-col>
                <small>Detalles del cliente</small>
                <v-divider></v-divider>
                <table class="rowsTable">
                    <tbody>
                    <tr v-for="item in Cliente.detalles">
                        <th>{{item.detalle}}</th>
                        <td>{{item.val}}</td>
                    </tr>
                    </tbody>
                </table>
            </v-col>
        </v-row>
        <v-row class="grey lighten-3">
            <v-col cols="5">
                <small>Documentos</small>
                <v-divider></v-divider>
                <table class="rowsTable">
                    <tbody>
                    <tr v-for="item in Cliente.archivos">
                        <th>{{item.detalle}}</th>
                        <td v-if="item.dir">
                            <v-btn width="25px" height="25px" @click="verDocumento(item.dir)"
                                   class="ma-1" fab color="red">
                                <v-icon size="15" color="white">fa fa-file-pdf</v-icon>
                            </v-btn>
                        </td>
                        <td v-else>No hay documento subido a este cliente</td>
                    </tr>
                    </tbody>
                </table>
            </v-col>
            <v-col cols="7">
                <small>Direcciones</small>
                <v-divider></v-divider>
                <table class="rowsTable">
                    <thead>
                    <tr>
                        <th>Departamento</th>
                        <th>Municipio</th>
                        <th>Ciudad/Aldea/Caserio</th>
                        <th>Dirección</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in Cliente.direcciones">
                        <td width="20%">
                            <select class="select-css" v-model="item.departamento" disabled>
                                <option v-for="i in item.Municipios" :value="i.departamento.id">{{i.departamento.nombre}}</option>
                            </select>
                        </td>
                        <td width="20%">
                            <select class="select-css" v-model="item.municipio" disabled>
                                <option v-for="i in item.Municipios" :value="i.id">{{i.nombre}}</option>
                            </select>
                        </td>
                        <td width="20%">
                            <select class="select-css" v-model="item.ciudad" disabled>
                                <option v-for="i in item.Ciudades" :value="i.id">{{i.nombres}}</option>
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
        <hr>
        <v-row class="grey lighten-3">
            <v-col>
                <v-card v-if="combo" flat>
                  <table>
                    <thead>
                    <tr>
                      <th colspan="2">Codigo</th>
                      <th colspan="1">Nombre</th>
                      <th colspan="3">Detalle</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td colspan="2">{{Solicitud_Articulo.codigo}}</td>
                      <td colspan="1">{{Solicitud_Articulo.nombre}}</td>
                      <td colspan="3">{{Solicitud_Articulo.detalle}}</td>
                    </tr>
                    </tbody>
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>Código</th>
                      <th>Articulos Incluidos</th>
                      <th>Modelo</th>
                      <th>Marca</th>
                      <th>Sub Familia</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, i) in Solicitud_Articulo.detalle_combo">
                      <td>{{i+1}}</td>
                      <td>{{item.articulo.codigo_sistema}}</td>
                      <td>{{item.articulo.nombre_articulo}}</td>
                      <td>{{item.articulo.modelo}}</td>
                      <td>{{item.articulo.marca.nombre}}</td>
                      <td>{{item.articulo.sub_familia_articulo.nombre}}</td>
                    </tr>
                    </tbody>
                  </table>
                </v-card>
                <v-card v-else flat>
                  <small>Datos del artículo</small>
                  <v-divider></v-divider>
                  <table class="rowsTable">
                    <tbody>
                    <tr>
                      <th>Descripción:</th>
                      <td>{{Solicitud_Articulo.descripcion_corta}}</td>
                    </tr>
                    <tr>
                      <th>Sub-familía:</th>
                      <td>{{Solicitud_Articulo.fam}}</td>
                    </tr>
                    <tr>
                      <th>Marca:</th>
                      <td>{{Solicitud_Articulo.marca}}</td>
                    </tr>
                    <tr>
                      <th>Módelo:</th>
                      <td>{{Solicitud_Articulo.modelo}}</td>
                    </tr>
                    </tbody>
                  </table>
                </v-card>
            </v-col>
<!--            <v-col>-->
<!--                <small>Datos del precio</small>-->
<!--                <v-divider></v-divider>-->
<!--                <table class="rowsTable">-->
<!--                    <tbody>-->
<!--                        <tr>-->
<!--                            <th>Prima: </th>-->
<!--                            <td>L {{Solicitud_Precio.prima}}</td>-->
<!--                        </tr>-->
<!--                        <tr>-->
<!--                            <th>Tiempo de crédito:</th>-->
<!--                            <td>{{Solicitud_Precio.meses}} meses</td>-->
<!--                        </tr>-->
<!--                        <tr>-->
<!--                            <th>Forma de pago:</th>-->
<!--                            <td v-if="Solicitud_Precio.forma_pago === 1">Semanal</td>-->
<!--                            <td v-else-if="Solicitud_Precio.forma_pago === 2">Quincenal</td>-->
<!--                            <td v-else-if="Solicitud_Precio.forma_pago === 3">Mensual</td>-->
<!--                        </tr>-->
<!--                        <tr>-->
<!--                            <th>Cuota:</th>-->
<!--                            <td>L {{Solicitud_Precio.cuota}}</td>-->
<!--                        </tr>-->
<!--                    </tbody>-->
<!--                </table>-->
<!--            </v-col>-->
        </v-row>
        <v-divider></v-divider>
        <v-row class="grey lighten-3">
            <v-col>
                <small>Referencias</small>
                <v-divider></v-divider>
                <table class="rowsTable">
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Telefono</th>
                        <th>Relación</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in Solicitud_Referencias">
                            <td>{{item.nombre}}</td>
                            <td>{{item.telefono}}</td>
                            <td>{{item.parentesco}}</td>
                        </tr>
                    </tbody>
                </table>
            </v-col>
            <v-col>
                <small>Avales</small>
                <v-divider></v-divider>
                <table class="rowsTable">
                    <thead>
                    <tr>
                        <th>Identidad</th>
                        <th>Nombre completo</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="Solicitud_Avales" v-for="item in Solicitud_Avales">
                        <td>{{item.identidad}}</td>
                        <td>{{item.nombres}} {{item.apellidos}}</td>
                    </tr>
                    </tbody>
                </table>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-autocomplete v-model="Archivo.colaborador"
                        label="Enviar a" :item-text="'nombre'" :item-value="'id'"
                        :items="Colaboradores">
        </v-autocomplete>
        <v-row no-gutters>
            <v-col class="d-flex justify-end align-center">
                <v-btn tile :disabled="!registrado" @click="dialogoArchivo = true" small>Abrir envío del archivo</v-btn>
                <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                        <v-btn fab class="ma-2" v-on="on" :disabled="!registrado"
                               v-bind="attrs" @click="solicitarClave" small text>
                            <v-icon>fa fa-print</v-icon>
                        </v-btn>
                    </template>
                    <span>Imprimir solicitúd de crédito</span>
                </v-tooltip>
                <v-btn class="ma-2" tile color="success" @click="registrar" small>
                    Enviar solicitúd
                </v-btn>
                <v-btn class="ma-2" tile color="warning" @click="sideSolicitud = false"
                       small>
                    Cerrar
                </v-btn>
              <v-btn class="ma-2" tile text color="warning" @click="vistaSolicitud = 3"
                     small>
                Volver
              </v-btn>
            </v-col>
        </v-row>


        <v-dialog v-model="dialogoArchivo" width="30%">
            <v-card>
                <v-card-title class="grey lighten-5">Subir solicitúd firmada</v-card-title>
                <v-form ref="FormArchivoSolicitudCredito" class="pl-5 pr-5">
                    <v-file-input label="Solicitúd firmada" accept="application/pdf" v-model="Archivo.file"></v-file-input>
                    <v-card-actions class="d-flex justify-end">
                        <v-btn color="warning" small @click="dialogoArchivo = false">Cerrar</v-btn>
                        <v-btn color="success" small @click="validarformFile">Registrar</v-btn>
                    </v-card-actions>
                </v-form>

            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {ipcRenderer} from "electron";
    import Vue from "vue";
    export default {
        props:{combo: Boolean},
        name: "revision",
        computed:{
            Cliente(){
                return this.$store.state.solicitud_credito.Cliente;
            },
            Solicitud_Precio(){
                return this.$store.state.solicitud_credito.data.Precio;
            },
            Solicitud_Articulo(){
                return this.$store.state.solicitud_credito.data.Articulo;
            },
            Solicitud_Referencias(){
                return this.$store.state.solicitud_credito.data.referencias;
            },
            Solicitud_Avales(){
                return this.$store.state.solicitud_credito.data.avales;
            },
            Observacion(){
                return this.$store.state.solicitud_credito.data.observacion_precio;
            },
            sideSolicitud:{
              get:function () {
                return this.$store.state.solicitud_credito.SolicitudCredito_view;
              },
              set: function (val) {
                this.$store.commit('solicitud_credito/cambiarValorVista', val);
              }
            },
            user(){
              return this.$store.state.usuario;
            },
            vistaSolicitud:{
            get:function () {
              return this.$store.state.solicitud_credito.SolicitudCredito_vista;
            },
            set:function (val) {
              return this.$store.commit('solicitud_credito/cambiarVista', val)
            }
          },
        },
        mounted() {
            this.cargarDirecciones(this.Cliente.direcciones);
            this.cargarColaboradores();
        },
        data(){
            return{
                Archivo:{
                    file: null,
                    colaborador: ''
                },
                registrado: false,
                enviadoFile: false,
                Solicitud:   null,
                dialogoArchivo: false,
                Colaboradores:  [],
                rules:[
                    v => !!v || 'Campo requerido',
                ],
            }
        },
        methods:{
            notificacion(text, color){
                Vue.$toast.open({
                    message: text,
                    type: color,
                    position: 'bottom-left',
                    duration: 4000
                });
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
                    item.Municipios = res.data.municipios;
                })
            },
            print(clave){
                let url = this.$axios.defaults.baseURL+'documentos/ventas/solicitud_credito/usuario='+this.user+'/solicitud='+this.Solicitud+'/'+clave
                ipcRenderer.send('pint_navegador', url);
                this.$store.commit('activarOverlay', false);
                this.dialogoArchivo = true;
            },
            registrar(){
                let codigo = '';
                if (this.combo)
                  codigo = this.Solicitud_Articulo.codigo;
                else
                  codigo = this.Solicitud_Articulo.codigo_sistema;
                if (this.Archivo.colaborador){
                    let forma_pago = '';
                    if (this.Solicitud_Precio.forma_pago === 1)
                        forma_pago = 'Semanal';
                    else if (this.Solicitud_Precio.forma_pago === 2)
                        forma_pago = 'Quincenal';
                    else if (this.Solicitud_Precio.forma_pago === 3)
                        forma_pago = 'Mensual';
                    this.$store.commit('activarOverlay', true);
                    this.$axios.post('solicitud_credito',{
                        user:               this.Archivo.colaborador,
                        cliente_id:         this.Cliente.id,
                        cod_sistema:        codigo,
                        saldo_financiar:    parseFloat(this.Solicitud_Precio.total_credito),
                        tasa:               this.Solicitud_Precio.financiamiento,
                        tiempo:             parseInt(this.Solicitud_Precio.meses),
                        forma_pago:         forma_pago,
                        detalles_precio:    JSON.stringify(this.Solicitud_Precio),
                        referencias:        JSON.stringify(this.Solicitud_Referencias),
                        precio_contado:     this.Solicitud_Precio.contado,
                        prima:              this.Solicitud_Precio.prima,
                        observacion_precio: this.Observacion,
                        avales:             JSON.stringify(this.Solicitud_Avales),
                        cuota:              this.Solicitud_Precio.cuota,
                        combo:              this.combo
                    }).then((res)=>{
                        this.$store.commit('activarOverlay', false);
                        this.Solicitud = res.data.solicitud;
                        this.registrado = true;
                        this.notificacion('La solicitud se ha registrado exitosamente','success');
                    }).catch((error)=>{
                        this.$store.commit('activarOverlay', false);
                    })
                }else{
                    this.notificacion('Tienes que seleccionar a quien se lo envias','warning')
                }
            },
            cargarColaboradores(){
                this.$axios.get('/colaboradores_2').then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        this.Colaboradores= [];
                        res.data.colaboradores.forEach( (i) => {
                            if (i.usuarios){
                                console.log(i)
                                this.Colaboradores.push({
                                    "nombre": i.nombres+' '+i.apellidos,
                                    "id":  i.usuarios.id
                                });
                            }
                        });
                    }
                })
            },
            solicitarClave(){
              this.$store.commit('activarOverlay', true);
              this.$axios.post('solicitar_clave_doucmento').then((res)=>{
                this.$store.commit('notificacion',{texto:'Cargando inventario', color:'success'});
                this.print(res.data.clave)
              }).catch((error)=>{
                this.$store.commit('activarOverlay', false);
                this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'danger'});
            })
          },
            validarformFile(){
                if (this.Archivo.file)
                    this.terminacionRegistro();
                else
                    this.notificacion('Datos incompletos','error')
            },
            terminacionRegistro(){
                this.dialogoArchivo = false;
                this.$store.commit('activarOverlay', true);
                let data = new FormData();
                data.append('id', this.Solicitud);
                data.append('file', this.Archivo.file);
                this.$axios.post('subir_solicitud_credito',data)
                .then((res)=>{
                    this.sideSolicitud = false;
                    this.Solicitud_Avales = [];
                    this.notificacion('El archivo se ha registrado exitosamente','success');
                    this.notificacion('Tienes que esperar respuesta de faturación para proseguir con la venta','success');
                    this.$store.commit('activarOverlay', false);
                })
            }
        }
    }
</script>

<style scoped>
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
