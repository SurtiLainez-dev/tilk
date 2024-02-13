<template>
    <v-container>
        <small>Referencias del cliente</small>
        <v-btn fab text width="20px" height="20px" x-small color="success" dark @click="addReferecias">
            <v-icon size="15">fa fa-plus</v-icon>
        </v-btn>
        <v-card :disabled="validado" flat tile>
          <v-row>
            <v-col>
              <table class="rowsTable">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre completo</th>
                  <th>Cod.</th>
                  <th>Teléfono</th>
                  <th>Parentesco</th>
                  <th>Dirección</th>
                  <th>Nuevo</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Solicitud.referencias">
                  <th width="2%">
                    {{parseInt(item.key) + parseInt(1)}}
                  </th>
                  <td width="25%">
                    <input type="text" v-model="item.nombre">
                  </td>
                  <td width="5%">
                    <input type="text" v-model="item.area">
                  </td>
                  <td width="10%">
                    <input type="text" v-model="item.telefono">
                  </td>
                  <td width="15%">
                    <input type="text" v-model="item.parentesco">
                  </td>
                  <td width="34%">
                    <input type="text" v-model="item.direccion"/>
                  </td>
                  <td width="5%" class="text-center">
                    <input type="checkbox" v-model="item.nuevo" disabled/>
                  </td>
                  <td width="4%" class="text-center">
                    <v-btn fab @click="removeReferencia(item.key)" x-small color="red" width="20px" height="20px" dark>
                      <v-icon size="15">fa fa-times</v-icon>
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>
          <hr>
          <small>Agenda del cliente</small>
          <small>Puedes copiar cualquier informacion de esta agenda presionado las teclas (Ctrl + C).</small>
          <small>Para pegar la información solo presion las teclas (Ctrl + V)</small>
          <table>
            <thead>
            <tr>
              <th>Detalle</th>
              <th>Telefono</th>
              <th>+ Info</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in Cliente.telefonos">
              <td><input type="text" :value="item.detalle"></td>
              <td><input type="text" :value="item.num"></td>
              <td v-if="item.info">
                <input v-if="item.info.dir" type="text" :value="item.info.dir">
                <input v-else type="text" value="-----" disabled>
              </td>
            </tr>
            </tbody>
          </table>
          <small>Avales</small>
          <v-btn fab text width="20px" height="20px" x-small color="success" dark @click="addAvales">
            <v-icon size="15">fa fa-plus</v-icon>
          </v-btn>
          <v-row>
            <v-col>
              <table class="rowsTable">
                <thead>
                <tr>
                  <th>Identidad</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Sexo</th>
                  <td></td>
                  <td></td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Solicitud.avales">
                  <td width="20%">
                    <v-row no-gutters>
                      <v-col cols="10">
                        <input type="text"  v-model="item.identidad" @keyup.enter="buscarCliente(item)">
                      </v-col>
                      <v-col cols="2" class="d-flex align-center justify-center">
                        <b-spinner v-if="item.load"  variant="success" type="grow" small></b-spinner>
                      </v-col>
                    </v-row>
                  </td>
                  <td width="25%">
                    <input type="text" :disabled="item.exist" v-model="item.nombres">
                  </td>
                  <td width="25%">
                    <input type="text" :disabled="item.exist" v-model="item.apellidos">
                  </td>
                  <td width="20%">
                    <select class="select-css" :disabled="item.exist" v-model="item.sexo">
                      <option value="1">Masculino</option>
                      <option value="2">Femenino</option>
                    </select>
                  </td>
                  <td width="7%">
                    <v-tooltip top>
                      <template v-slot:activator="{on, attrs}">
                        <v-btn color="red" class="ma-1" height="22px" width="22px"
                               @click="dialogoFiles = true"
                               fab v-on="on" v-bind="attrs" x-small>
                          <v-icon size="15" color="white">fa fa-file-pdf</v-icon>
                        </v-btn>
                      </template>
                      <span>Ver documentos del cliente</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{on, attrs}">
                        <v-btn color="indigo" class="ma-1" height="22px" @click="guardarAval(item)"
                               width="22px" fab v-on="on" v-bind="attrs" x-small>
                          <v-icon size="15" color="white">fa fa-save</v-icon>
                        </v-btn>
                      </template>
                      <span>Guardar cliente</span>
                    </v-tooltip>

                  </td>
                  <td width="3%">
                    <v-btn fab @click="removeAval(item.key)" x-small color="red" width="22px" height="22px" dark>
                      <v-icon size="15">fa fa-times</v-icon>
                    </v-btn>
                  </td>

                  <v-dialog v-model="dialogoFiles" width="60%">
                    <v-card>
                      <v-card-title class="grey lighten-2">Documentos de {{item.nombres}} {{item.apellidos}}</v-card-title>
                      <v-container class="d-flex justify-center grey lighten-5">
                        <table class="rowsTable">
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
                          <tr v-for="i in item.archivos">
                            <td width="30%"><input type="text" v-model="i.detalle"></td>
                            <td class="d-flex justify-center">
                              <v-icon v-if="i.status" color="success">fa fa-check</v-icon>
                              <v-icon v-else color="red">fa fa-times</v-icon>
                            </td>
                            <td v-if="i.status === 1 || i.status">
                              <v-btn @click="verDocumento(i.dir)" fab height="25px" width="20px" text color="red">
                                <v-icon size="15">fa fa-file-pdf</v-icon>
                              </v-btn>
                            </td>
                            <td v-else-if="i.status === 0 || !i.status">
                              <v-row no-gutters>
                                <v-col cols="11">
                                  <b-form-file browse-text="Buscar" v-model="i.file" @change="cambiarEstadoFile(i)"
                                               :placeholder="'buscar '+i.detalle" accept="application/pdf" size="sm">
                                  </b-form-file>
                                </v-col>
                                <v-col v-if="i.file" cols="1" class="d-flex justify-center">
                                  <v-btn fab height="24px" width="24px" text @click="i.file = null">
                                    <v-icon size="15px">fa fa-trash-alt</v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </td>
                            <td>
                              <span v-if="i.num === 1">Sí</span>
                              <span v-if="i.num === 2">No</span>
                            </td>
                            <td>
                              <v-btn width="20px" height="20px" @click="removeArchivos(i.key, item)"
                                     text fab color="red">
                                <v-icon size="15">fa fa-times</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </v-container>
                      <v-divider></v-divider>
                      <v-card-actions class="d-flex justify-end">
                        <v-btn color="success" @click="addArchivos(item)" small dark>Agregar Fila</v-btn>
                        <v-btn color="warning" @click="dialogoFiles = false" small dark>Cerrar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>
        </v-card>
        <hr>
        <v-row no-gutters class="d-flex justify-end">
            <v-btn color="warning" class="ma-2" tile small dark @click="vistaSolicitud = 2">Volver</v-btn>
            <v-btn color="indigo" class="ma-2" tile small dark @click="validarDatos">Validar</v-btn>
            <v-btn color="success" class="ma-2 text--white" tile small @click="vistaSolicitud = 4" :disabled="!validado">Pasar a la revisión</v-btn>
        </v-row>
    </v-container>
</template>

<script>
    import Vue from "vue";
    import {ipcRenderer} from "electron";
    export default {
        name: "referencias",
        computed:{
            Solicitud:{
                get:function () {
                    return this.$store.state.solicitud_credito.data;
                }
            },
            Cliente(){
              return this.$store.state.solicitud_credito.Cliente;
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
        data(){
            return{
                dialogoFiles: false,
                validado: false
            }
        },
        methods:{
            actualizarCliente(item){
                this.$store.commit('activarOverlay', true);
                let data = new FormData(), cont=0;
                for (let i in item.archivos){
                    if (item.archivos[i].file && !item.status) {
                        data.append(`file_cliente[${cont}]`, item.archivos[i].file);
                        cont++;
                    }
                }

                data.append('id',               item.id);
                data.append('nombres',          item.nombres.toUpperCase());
                data.append('apellidos',        item.apellidos.toUpperCase());
                data.append('archivos',         JSON.stringify(item.archivos));

                this.$axios({
                    method:'post',
                    url:'clientes/edit',
                    data:data,
                    headers:{
                        'Authorization': 'Bearer ' + this.$store.state.token,
                        'Content-Type': "multipart/form-data"
                    }
                }).then((res)=>{
                    item.id = res.data.cliente;
                    let archivos = res.data.files;
                    item.archivos = [];
                    archivos.forEach( (i)=>{
                        item.archivos.push({
                            dir: i.dir,
                            detalle: i.detalle,
                            num:     i.num,
                            status:  i.status,
                            key:     i.key,
                            file:    null,
                            estado:  i.estado
                        })
                    });
                    this.notificacion(
                        `Datos actualizados del aval ${parseInt(item.key) + parseInt(1)}`,
                        'success')
                    this.$store.commit('activarOverlay', false);
                }).catch((error)=>{
                    this.$store.commit('activarOverlay', false);
                })
            },
            addArchivos(item){
                item.archivos.push({
                    dir:     '',
                    detalle: '',
                    num:     1,
                    status:  false,
                    key:     item.archivos.length,
                    file:    null
                })
            },
            addAvales(){
                this.Solicitud.avales.push({
                    "id":        null,
                    "identidad": null,
                    "nombres":   '',
                    "apellidos": '',
                    "sexo":      '',
                    "archivos":  [],
                    "key":       this.Solicitud.avales.length,
                    "exist":     true,
                    "save":      false,
                    "load":      false,
                    "files":     false,
                    "Contfiles": 0
                })
            },
            addReferecias(){
                this.Solicitud.referencias.push({
                    "nombre":     '',
                    "telefono":   '',
                    "parantesco": '',
                    "direccion":  '',
                    "area":       '504',
                    "estado":     false,
                    "key":        this.Solicitud.referencias.length,
                    "comentario": ''
                })
            },
            buscarCliente(item){
                item.load = true;
                this.$axios.get('cliente_segumiento/'+item.identidad)
                    .then((res)=>{
                        if (res.data.cliente){
                            item.id        = res.data.cliente.id;
                            item.nombres   = res.data.cliente.nombres;
                            item.apellidos = res.data.cliente.apellidos;
                            item.sexo      = res.data.cliente.sexo;
                            item.exist     = true;
                            if (res.data.cliente.archivos){
                                item.archivos     = JSON.parse(res.data.cliente.archivos);
                                item.Contfiles    = parseInt(JSON.parse(res.data.cliente.archivos).length) - 1;
                            }else{
                                item.archivos     = [
                                    {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                                    {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                                    {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                                    {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                                    {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
                                ];
                                item.Contfiles = 4
                            }
                        }else{
                            item.exist     = false;
                            item.nombres   = '';
                            item.apellidos = '';
                            item.sexo      = '';
                            item.save      = true;
                            item.archivos     = [
                                {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                                {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                                {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                                {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                                {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
                            ];
                            item.Contfiles = 4
                            Vue.$toast.open({
                                message: `El cliente con identidad ${item.identidad} no existe.`,
                                type: 'warning',
                                position: 'bottom-left',
                                duration: 4000
                            });
                            Vue.$toast.open({
                                message: `Campos del aval habilitados para crearlo.`,
                                type: 'success',
                                position: 'bottom-left',
                                duration: 4000
                            });
                        }
                        item.files = true;
                        item.load  = false
                    })
            },
            cambiarEstadoFile(item){
                item.estado = 1;
            },
            guardarAval(item){
                if (item.identidad) {
                    if (this.validarCliente(item) && this.validarArchivos(item)) {
                        if (item.exist){
                            this.actualizarCliente(item)
                        }else{
                            this.registrarCliente(item)
                        }
                    }
                }else {
                    this.notificacion(`No se ha buscado un aval en la fila ${parseInt(item.key) + parseInt(1)}`, 'error')
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
            registrarCliente(item){
                this.$store.commit('activarOverlay', true);
                let data = new FormData(), cont = 0;
                for (let i in item.archivos){
                    if (item.archivos[i].file) {
                        data.append(`file_cliente[${cont}]`, item.archivos[i].file);
                        cont++;
                    }
                }
                data.append('nombres',          item.nombres.toUpperCase());
                data.append('apellidos',        item.apellidos.toUpperCase());
                data.append('identidad',        item.identidad);
                data.append('sexo',             item.sexo);
                data.append('archivos',         JSON.stringify(item.archivos));

                this.$axios({
                    method:'post',
                    url:'clientes',
                    data:data,
                    headers:{
                        'Authorization': 'Bearer ' + this.$store.state.token,
                        'Content-Type': "multipart/form-data"
                    }
                }).then((res)=>{
                    this.$store.commit('activarOverlay', false);
                    item.id       = res.data.cliente;
                    let archivos  = res.data.files;
                    item.archivos = [];
                    item.exist    = true;
                    archivos.forEach( (i)=>{
                        item.archivos.push({
                            dir: i.dir,
                            detalle: i.detalle,
                            num:     i.num,
                            status:  i.status,
                            key:     i.key,
                            file:    null,
                            estado:  i.estado
                        })
                    });
                    this.notificacion(`El aval de la fila ${parseInt(item.key) + parseInt(1)} se ha registrado`,'success')
                }).catch((res)=>{
                    this.$store.commit('activarOverlay', false);
                })
            },
            removeArchivos(fila, item){
                let cont = 0;
                if (fila > item.Contfiles){
                    item.archivos.splice(fila,1);
                    item.archivos.forEach( (i) => {
                        i.key = cont;
                        cont++;
                    })
                }
            },
            removeAval(fila){
                let cont = 0;
                this.Solicitud.avales.splice(fila, 1);
                this.Solicitud.avales.forEach( (i) => {
                    i.key = cont;
                    cont++;
                })
            },
            removeReferencia(fila){
                let cont = 0;
                if (fila > 3){
                    this.Solicitud.referencias.splice(fila, 1);
                    this.Solicitud.referencias.forEach( (i) => {
                        i.key = cont;
                        cont++;
                    })
                }
            },
            validarArchivos(item) {
                let contador = 0, long = 0;
                item.archivos.forEach((i) => {
                    if (i.num === 1 && !i.status) {
                        long++;
                        if (i.detalle.length > 2 && i.file)
                            contador++;
                    }
                });

                if (long === contador) {
                    return true
                } else {
                    Vue.$toast.open({
                        message: `Hay datos incompletos en los archivos.`,
                        type: 'warning',
                        position: 'bottom-left',
                        duration: 4000
                    });
                    return false;
                }
            },
            validarAvales(){
                let avl = this.Solicitud.avales;
                let bandera = avl.length, cont = 0;
                avl.forEach( (i)=> {
                    if (i.id)
                        cont++;
                    else
                        this.notificacion(`Hace falta registrar los datos del aval ${parseInt(i.key) + parseInt(1)}`,
                        'warning')
                });

                return bandera === cont;
            },
            validarCliente(item){
                let cont = 0, bandera = 4;
                let regexId = RegExp("^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$");
                if (item.identidad.length === 13 && regexId.test(item.identidad))
                    cont++;
                else
                    this.notificacion(`La identidad es obligatoria en el aval ${parseInt(item.key) + parseInt(1)}.`,'warning');

                if (item.nombres.length >= 3)
                    cont++;
                else
                    this.notificacion(`Los nombres son obligatorios en el aval ${parseInt(item.key) + parseInt(1)}.`,'warning');

                if (item.apellidos.length >= 3)
                    cont++;
                else
                    this.notificacion(`Los apellidos son obligatorios en el aval ${parseInt(item.key) + parseInt(1)}.`,'warning');

                if (item.sexo)
                    cont++;
                else
                    this.notificacion(`el sexo es obligatorio en el aval ${parseInt(item.key) + parseInt(1)}`,'warning');

                return bandera === cont;
            },
            validarDatos(){
                if (this.validarReferencias() && this.validarAvales())
                    this.validado = true;

            },
            validarReferencias(){
                let ref = this.Solicitud.referencias;
                let bandera = ref.length, contador = 0, cont = 0;
                let telefonos = [];
                ref.forEach((i) => {
                    telefonos = this.Cliente.telefonos.filter(item=>item.num == i.telefono);
                    i.nuevo = telefonos.length === 0;

                    cont = 0;
                    if (i.nombre.length > 5)
                        cont++;
                    else
                        this.notificacion(
                            `Completa el nombre de la referencia ${parseInt(i.key) + parseInt(1)}`,
                            'warning')

                    if (i.telefono.length >= 8 || i.telefono.length <= 10)
                        cont++;
                    else
                        this.notificacion(
                            `El telefono de la referencia ${parseInt(i.key) + parseInt(1)} no es valido`,
                            'warning')

                    if (i.parentesco.length >= 3)
                        cont++;
                    else
                        this.notificacion(
                            `El parentesco de la referencia ${parseInt(i.key) + parseInt(1)} es obligatoria`,
                            'warning');

                    if (i.direccion.length > 10)
                        cont++;
                    else
                        this.notificacion(
                            `La dirección de la referencia ${parseInt(i.key) + parseInt(1)} es obligatoria`,
                            'warning');

                    if (cont === 4)
                        contador++
                });

                return contador === bandera;

            },
            verDocumento(dir){
                this.dialogoFiles = false;
                this.$store.commit('activarOverlay', true);
                this.$axios.post('leer_documento/',
                    {ubicacion: dir}).then((res)=>{
                    if (res.status === 200){
                        ipcRenderer.send('open-nav', res.data.url);
                        this.$store.commit('activarOverlay', false);
                        this.dialogoFiles = true;
                    }
                }).catch((error)=>{
                    this.dialogoFiles = true;
                    this.$store.commit('activarOverlay', false);
                })
            },
        },
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
    .rowsTable{
        cursor: pointer;
    }
</style>
