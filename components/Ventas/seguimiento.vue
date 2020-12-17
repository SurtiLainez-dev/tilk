<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-center">
                <v-tooltip top>
                    <template v-slot:activator="{on, atrrs}">
                        <v-avatar class="rowsTable" v-on="on" v-bind="atrrs" tile color="primary" size="80">
                            <v-icon size="70" dark>fa fa-user</v-icon>
                        </v-avatar>
                    </template>
                    <span>Click para ver información</span>
                </v-tooltip>
            </v-col>
            <v-col cols="8">
                <small>Info del cliente</small>
                <v-row no-gutters class="pr-10">
                    <v-col cols="6">{{Seguimiento.cliente.nombres}} {{Seguimiento.cliente.apellidos}}</v-col>
                    <v-col cols="3">{{Seguimiento.cliente.identidad}}</v-col>
                    <v-col cols="3" class="d-flex justify-end">
                        <v-chip v-if="Seguimiento.estado === 0" outlined dark color="red">
                            <v-icon left>fa fa-times</v-icon>
                            Cerrado
                        </v-chip>
                        <v-chip v-if="Seguimiento.estado === 1" outlined  dark color="success">
                            <v-icon left>fa fa-thumbtack</v-icon>
                            Abierto
                        </v-chip>
                        <v-chip dark v-if="Seguimiento.estado === 2" color="success" outlined>
                            <v-icon left>fa fa-check-circle</v-icon>
                            Cerrado con éxito
                        </v-chip>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col v-if="Seguimiento.cliente.sexo === 1">Masculino</v-col>
                    <v-col v-else>Femenino</v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-container class="pl-10 pr-10">
            <v-row no-gutters>
                <v-col cols="6">
                    <small>Detalles del seguimiento</small>
                    <v-tooltip top>
                        <template v-slot:activator="{on, attrs}">
                            <v-icon size="15px" v-on="on" @click="addFila"
                                    v-bind="attrs" class="rowsTable" color="success">fa fa-plus</v-icon>
                        </template>
                        <span>Crear un item nuevo</span>
                    </v-tooltip>
                </v-col>
                <v-col class="d-flex justify-end">
                    <v-btn v-if="Seguimiento.estado === 1" x-small color="success" class="ma-1" dark>Cerrar venta con éxito</v-btn>
                    <v-btn x-small v-if="Seguimiento.estado === 3"
                           color="warning" class="ma-1" dark>Registrar detalles de la venta</v-btn>
                </v-col>
            </v-row>
            <v-divider ></v-divider>
            <div class="contenedorTable d-flex justify-center grey lighten-5">
                <table>
                    <thead>
                    <tr>
                        <th>Fecha de Gestión</th>
                        <th>Detalle de la Gestión</th>
                        <th>Resultado de la Gestión</th>
                        <th>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, i) in Detalles">
                        <td width="15%">
                            <input type="text" class="grey lighten-4" disabled v-model="item.fecha">
                        </td>
                        <td width="30%">
                            <input type="text" :class="{'grey lighten-4':item.dibDetalle}"
                                   :disabled="item.dibDetalle"  v-model="item.detalle">
                        </td>
                        <td width="50%">
                            <input type="text" :disabled="item.dibComentario"
                                   :class="{'grey lighten-4':item.dibComentario}" v-model="item.val">
                        </td>
                        <td class="d-flex justify-center align-center">
                            <v-icon size="20px" @click="removeFila(item.key)" color="red">fa fa-times</v-icon>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <small>Contactos al cliente</small>
            <v-divider></v-divider>
            <div class="d-flex justify-center grey lighten-5">
                <table>
                    <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Detalle</th>
                        <th>Respuesta</th>
                        <th>Forma de Contacto</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, i) in Tareas">
                        <td width="10%">
                            <input type="text" class="grey lighten-4" disabled v-model="item.fecha">
                        </td>
                        <td width="15%">
                            <v-tooltip top>
                                <template v-slot:activator="{on,attrs}">
                                    <span v-on="on" v-bind="attrs">{{item.detalle.substring(0, 17)}}...</span>
                                </template>
                                <span>{{item.detalle}}</span>
                            </v-tooltip>
                        </td>
                        <td width="50%">
                            <input type="text" :class="{'grey lighten-4':!item.view}"
                                   v-model="item.respuesta" :disabled="!item.view">
                        </td>
                        <td width="15%">
                            <select :disabled="!item.view">
                                <option v-for="item in formaContactar"
                                        :value="item.value">{{item.text}}</option>
                            </select>
                        </td>
                        <td width="10%" >
                            <v-chip v-if="item.estado === 0 || item.estado === false" class="ma-1" color="red" x-small dark>Pendiente</v-chip>
                            <v-chip v-else color="success" class="ma-1" x-small dark>Realizado</v-chip>
                        </td>
                        <td class="d-flex justify-center">
                            <input type="checkbox" style="margin-top: 5px" @click="item.estado = !item.estado" v-model="item.estado" :disabled="!item.view">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <div class="d-flex justify-end">
                <v-btn v-if="Seguimiento.estado === 1" class="ma-2" @click="validarRespuesta" color="success" small dark>Guardar Cambios</v-btn>
            </div>
            <div v-if="Seguimiento.estado !== 1">
                <v-divider></v-divider>
                <small>Conclución delseguimiento:</small>
                <br>
                {{Seguimiento.conclucion}}
            </div>
        </v-container>

        <v-dialog v-model="dialogoConclucion" width="40%">
            <v-card>
                <v-card-title>Conclución del seguimiento</v-card-title>
                <v-divider></v-divider>
                <v-form ref="FormConclucionSeguimiento" class="pl-5 pr-5">
                    <v-textarea dense
                                :rules="[rule.conclucion.req, rule.conclucion.min, rule.conclucion.max]"
                                label="Conclución" counter>

                    </v-textarea>
                </v-form>
                <v-card-actions class="d-flex justify-end">
                    <v-btn color="warning" @click="seguimientoVendido" class="ma-2" small dark>Cerrar seguimiento con exito</v-btn>
                    <v-btn color="success" @click="validacionFormConlucion" class="ma-2" small dark>Registrar Conclución</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import Vue from "vue";

    export default {
        props:{tipo:Number},
        name: "seguimiento",
        computed:{
            Seguimiento(){
                return this.$store.state.Seguimiento;
            },
            mesString(){
                let fecha = new Date();
                let mes;
                let meses = ['enero','febrero','marzo','abril',
                'mayo','junio','julio','agosto',
                'septiembre','octubre','noviembre','diciembre'];
                for (let i = 0; i < meses.length; i++){
                    if (i == fecha.getMonth()){
                        mes = meses[i];
                    }
                }
                return mes;
            },
            long(){
                return this.Detalles.length;
            }
        },
        data(){
            return{
                dialogoConclucion: false,
                verificarConclucion: false,
                conlucion: '',
                cerradaBien: false,
                rule: {
                    conclucion: {
                        req: v => !!v || 'Campo requerido',
                        min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
                        max: v => (v && v.length <= 255) || 'Tiene que ser menor o igual a 255 carácteres.',
                    },
                },
                estado: false,
                Detalles: [],
                Tareas:   [],
                formaContactar:[
                    {text:'Llamada',value:1},
                    {text:'Mensaje',value:2},
                    {text:'Correo Eléctronico',value:3},
                    {text:'Vísita Informal',value:4},
                    {text:'Vísita Formal',value:5},
                    {text:'El cliente contacto',value:6},
                    {text:'Facebook',value:7},
                    {text:'WhatsApp',value:8},
                    {text:'Telegram',value:9},
                ],
            }
        },
        created() {
            let Detalles = JSON.parse(this.Seguimiento.detalles);
            Detalles.forEach( (i)=>{
                this.Detalles.push({
                   'detalle':       i.detalle,
                   'val':           i.val,
                   'key':           i.key,
                   'dibComentario': i.dibComentario,
                   'dibDetalle':    i.dibDetalle,
                   'fecha':         i.fecha
                })
            });
            let Tareas   = JSON.parse(this.Seguimiento.tareas);
            let Fecha = new Date(), FechaActual = new Date(Fecha.getFullYear(), Fecha.getMonth(), Fecha.getDate());
            let FechaTarea , FechaCreada, view;
            Tareas.forEach( (i) =>{
                FechaTarea = i.fecha.split('/');
                FechaCreada = new Date(FechaTarea[2], FechaTarea[1] - 1, FechaTarea[0]);
                view = i.estado === 0 && FechaCreada <= FechaActual;
                this.Tareas.push({
                    "num":            i.num,
                    "fecha":          i.fecha,
                    "estado":         i.estado,
                    "detalle":        i.detalle,
                    "fechadb":        i.fechadb,
                    "respuesta":      i.respuesta,
                    "revisado_tack":  i.revisado_tack,
                    "forma_contacto": i.forma_contacto,
                    "view":           view
                })
            });
            this.estado = this.Seguimiento.estado
        },
        methods:{
            addFecha(){
                let meses = ['enero','febrero','marzo','abril','mayo','junio',
                    'julio','agosto','septiembre','octubre','noviembre','diciembre'];
                let fecha = new Date(), mes;
                for (let i in meses){
                    if (fecha.getMonth() == i){
                        mes = meses[i];
                    }
                }
                return  fecha.getDate()+' de '+mes+' de '+fecha.getFullYear();
            },
            addFila(){
                this.Detalles.push({
                    'detalle':       '',
                    'val':           '',
                    'key':           this.Detalles.length,
                    'dibComentario': false,
                    'dibDetalle':    false,
                    'fecha':         this.addFecha()
                })
            },
            removeFila(fila){
                if (fila >= this.long){
                    this.Detalles.splice(fila, 1);
                    let contador = 0;
                    this.Detalles.forEach((i)=>{
                        i.key = contador;
                        contador++
                    });
                    Vue.$toast.open({
                        message: 'Item eliminado',
                        type: 'success',
                        position: 'bottom-left',
                        duration: 2000
                    });
                }else {
                    Vue.$toast.open({
                        message: 'No se puede borrar el item que selecciono',
                        type: 'error',
                        position: 'bottom-left',
                        duration: 4000
                    });
                }
            },
            validarRespuesta(){
                let contViews = 0, contRespuestas = 0, contTerminadas = 0;
                let nuevosDetalles = [], contador = 0, contEstados    = 0;
                let fecha = new Date();

                this.Tareas.forEach((i)=>{
                    if (i.view) {
                        contViews++
                        nuevosDetalles.push({
                            "key": parseInt(this.Detalles.length) + parseInt(contador),
                            "val": 'Fecha '+i.fecha+'. gerado por tilk',
                            "fecha": fecha.getDate()+' de '+this.mesString+' de '+fecha.getFullYear(),
                            "detalle": 'Terminación de tarea',
                            "dibDetalle": true,
                            "dibComentario": true
                        });
                        if (i.respuesta) {
                            contRespuestas++;
                        }if (i.estado || i.estado === 1)
                            contTerminadas++;
                        contador++
                    }
                    if (i.estado === 1 || i.estado)
                        contEstados++
                });

                if (contRespuestas === contViews && contViews === contTerminadas)
                    this.definirEstado(contEstados, nuevosDetalles);
                else
                    Vue.$toast.open({
                        message: 'Algunas respuestas del contacto del cliente estan vacias o no haz terminado tareas.',
                        type: 'error',
                        position: 'bottom-left',
                        duration: 6000
                    });
            },
            definirEstado(contador, nuevosDetalles){
                console.log(contador)
                if (contador !== 5) {
                    Vue.$toast.open({
                        message: 'Este seguimiento aún no se cierra.',
                        type: 'warning',
                        position: 'bottom-left',
                        duration: 6000
                    });
                    this.estado = 1;
                    this.actualizandoTarea(nuevosDetalles)
                }else {
                    Vue.$toast.open({
                        message: 'Este seguimiento ya se cerró.',
                        type: 'success',
                        position: 'bottom-left',
                        duration: 6000
                    });
                    this.estado = 0;
                    if (this.verificarConclucion)
                        this.actualizandoTarea(nuevosDetalles);
                    else
                        this.abrirDialogoConclucion();
                }
            },
            actualizandoTarea(nuevosDetalles){
                this.$store.commit('activarOverlay', true);
                nuevosDetalles.forEach( (i)=>{
                    this.Detalles.push(i)
                });
                let tareas = [];
                this.Tareas.forEach((i)=>{
                    i.view = false;
                    if (i.estado === true)
                        i.estado = 1;
                    else if (i.estado === false)
                        i.estado = 0;
                    tareas.push({
                        "detalle":        i.detalle,
                        "estado":         i.estado,
                        "fecha":          i.fecha,
                        "fechadb":        i.fechadb,
                        "forma_contacto": i.forma_contacto,
                        "num":            i.num,
                        "respuesta":       i.respuesta,
                        "revisado_tack":  i.revisado_tack
                    });
                    this.Detalles.forEach( (i) => {
                        i.dibComentario = true;
                        i.dibDetalle    = true;
                    })
                });

                if (this.cerradaBien)
                    this.estado = 2;

                this.$axios.put('seguimiento_venta/'+this.Seguimiento.id,{
                    id:        this.Seguimiento.id,
                    detalles:  JSON.stringify(this.Detalles),
                    tareas:    JSON.stringify(tareas),
                    estado:    this.estado,
                    conclucion: this.conlucion
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (this.tipo === 1) {
                        this.$store.commit('valorDialogo', false);
                        this.$store.commit('cargarSeguimeintos', 1);
                    }else if (this.tipo === 2){
                        this.$store.commit('cargarSeguimeintos', 1);
                    }
                    this.$store.commit('activarOverlay', false);
                    Vue.$toast.open({
                        message: 'La tarea del seguimiento se ha completado exitosamente.',
                        type: 'success',
                        position: 'bottom-left',
                        duration: 6000
                    });
                })
            },
            abrirDialogoConclucion(){
                this.dialogoConclucion = true;
                this.cerradaBien = false;
            },
            validacionFormConlucion(){
                if (this.$refs.FormConclucionSeguimiento.validate()) {
                    this.dialogoConclucion   = false;
                    this.verificarConclucion = true;
                    this.validarRespuesta()
                }
            },
            seguimientoVendido(){
                this.cerradaBien = true;
                this.dialogoConclucion = false;
                this.conlucion = 'El seguimiento concluyó en venta.';
                this.verificarConclucion = true;
                this.validarRespuesta()
            }
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
        background-color: #cccccc;
    }
    .contenedorTable{
        height: 230px;
        overflow-y: auto;
    }
</style>
