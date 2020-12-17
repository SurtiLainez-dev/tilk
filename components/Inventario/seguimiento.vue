<template>
    <div>
        <strong>Datos del Cliente</strong>
        <v-form ref="FormValidarIdentidadCliente">
            <v-row no-gutters>
                <v-col cols="3" >
                    <v-text-field class="ma-2" v-model="Cliente.identidad"
                                  @keyup.enter="validarForm(1)"
                                  :loading="Cliente.loading"
                                  :rules="[rules.identidad.id, rules.identidad.some]"
                                  label="Identificación del cliente" filled dense></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field class="ma-2" v-model="Cliente.nombres" :disabled="Cliente.exists"
                                  :loading="Cliente.loading"
                                  :rules="[rules.nombres.req, rules.nombres.min, rules.nombres.max]"
                                  label="Nombres del cliente" filled dense></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field class="ma-2" v-model="Cliente.apellidos"
                                  :loading="Cliente.loading"
                                  :disabled="Cliente.exists"
                                  :rules="[rules.nombres.req, rules.nombres.min, rules.nombres.max]"
                                  label="Apellidos del cliente" filled dense></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-select class="ma-2" v-model="Cliente.sexo"
                              :loading="Cliente.loading"
                              :items="sexos"
                              :rules="[rules.nombres.req]"
                              :disabled="Cliente.exists"
                              label="Sexo" filled dense></v-select>
                </v-col>
            </v-row>
            <v-alert v-if="!Cliente.exists" dense border="left" prominent type="warning" text>
                <v-row no-gutters align="center">
                    <v-col class="grow">
                        Este cliente no existe. Por favor llene los campos de nombres, apellidos y sexo; a continuación lo registra.
                    </v-col>
                    <v-col class="shrink">
                        <v-btn small @click="validarForm(2)">Registrar Cliente</v-btn>
                    </v-col>
                </v-row>
            </v-alert>
            <Errores422/>
        </v-form>
        <v-container>
            <small>Detalles del seguimiento</small>
            <v-icon class="rowsTable" @click="addFila" size="15px" color="success">fa fa-plus</v-icon>
            <v-row no-gutters v-for="item in detalles">
                <v-col cols="2" class="d-flex align-center">
                    <b-form-input size="sm" disabled v-model="item.fecha"></b-form-input>
                </v-col>
                <v-col cols="6" class="d-flex align-center">
                    <b-form-input v-model="item.detalle" :disabled="item.dibDetalle" size="sm"></b-form-input>
                </v-col>
                <v-col cols="3" class="d-flex align-center">
                    <b-form-input :disabled="item.dibComentario" v-model="item.val" size="sm"></b-form-input>
                </v-col>
                <v-col cols="1" class="d-flex justify-end align-center">
                    <v-btn width="25px" height="25px" color="red" fab dark @click="removeFila(item.key)">
                        <v-icon size="15px">fa fa-times</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <hr>
            <div v-if="Tareas.length > 0">
                <b-table :fields="fields"
                         bordered hover
                         :items="Tareas" small caption-top>
                    <template v-slot:table-caption>Tareas que se realizarán</template>
                    <template v-slot:head(num)>#</template>
                    <template v-slot:cell(forma_contacto)="scope">
                        <b-select size="sm" disabled v-model="scope.item.forma_contacto" :options="formaContactar"></b-select>
                    </template>
                </b-table>
                <hr>
                <v-row>
                    <v-col class="d-flex justify-end">
                        <v-btn color="success" small @click="validarTareas" dark>Registrar Seguimiento</v-btn>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Errores422 from "../Errores422";
    import Swal from "sweetalert2";
    export default {
        components:{Errores422},
        props:{
            articulo: Object,
            precio: Number,
            pagos: Number,
            forma_pago: String,
            cuota:Number,
            prima: Number,
            contado: Number
        },
        name: "seguimiento",
        data(){
            return{
                fields:['num','detalle','fecha','forma_contacto', 'respuesta','se_contacto'],
                Tareas: [],
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
                rules:{
                    identidad:{
                        id: v => (/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Identidad no válida',
                        some:v => (v.length === 8 || v.length === 13 || v.length === 14) || 'Identidad no válida',
                    },
                    nombres:{
                        req: v => !!v || 'Campo requerido',
                        min: v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
                        max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
                    }
                },
                sexos:[
                    {text:'Masculino', value:1},
                    {text:'Femenino', value:2},
                ],
                Cliente:{
                    identidad: '',
                    nombres:   '',
                    apellidos: '',
                    sexo:      '',
                    id:        null,
                    loading:   false,
                    exists:    true,
                    incio:     true
                },
                side:true,
                erroresServidor:{},
                detalles:[
                    {detalle: 'Detalles del artículo',          val:this.articulo.nombre_articulo+' - '+this.articulo.modelo, key:0, dibComentario:true, dibDetalle: true, fecha: this.addFecha()},
                    {detalle: 'Precio de contado',              val:'L '+new Intl.NumberFormat().format(this.contado),    key:1, dibComentario:true,  dibDetalle: true, fecha: this.addFecha()},
                    {detalle: 'Precio inicial acordado',        val:'L '+new Intl.NumberFormat().format(this.precio),     key:2, dibComentario:true,  dibDetalle: true, fecha: this.addFecha()},
                    {detalle: 'Forma inicial de pago acordada', val:this.forma_pago,                                      key:3, dibComentario:true,  dibDetalle: true, fecha: this.addFecha()},
                    {detalle: 'Prima inicial acordada',         val:'L '+new Intl.NumberFormat().format(this.prima),      key:4, dibComentario:true,  dibDetalle: true, fecha: this.addFecha()},
                    {detalle: 'Cuota inicial acordada',         val:'L '+new Intl.NumberFormat().format(this.cuota),      key:5, dibComentario:true,  dibDetalle: true, fecha: this.addFecha()},
                    {detalle: 'Cantidad inicial de meses',      val:this.pagos+ ' meses',      key:6, dibComentario:true,  dibDetalle: true, fecha: this.addFecha()},
                    {detalle: 'Telefono',                       val:'',              key:7, dibComentario:false, dibDetalle: true, fecha: this.addFecha()},
                    {detalle: 'Correo Eléctronico',             val:'',              key:8, dibComentario:false, dibDetalle: true, fecha: this.addFecha()},
                    {detalle: 'Dirección',                      val:'',              key:9, dibComentario:false, dibDetalle: true, fecha: this.addFecha()},
                ],
                Seguimiento:{
                    articulo:this.articulo.articulo
                }
            }
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
            validarForm(tipo){
                if (tipo === 1)
                    this.cargarCliente();
                else{
                    if (this.$refs.FormValidarIdentidadCliente.validate()){
                        this.registrarCliente();
                    }
                }
            },
            cargarCliente(){
                this.Tareas            = [];
                this.Cliente.sexo      = '';
                this.Cliente.nombres   = '';
                this.Cliente.apellidos = '';
                this.Cliente.loading = true;
                this.$axios.get('cliente_segumiento/'+this.Cliente.identidad,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.Cliente.exists    = !!res.data.cliente;
                    if (this.Cliente.exists){
                        this.Cliente.sexo      = res.data.cliente.sexo;
                        this.Cliente.nombres   = res.data.cliente.nombres;
                        this.Cliente.apellidos = res.data.cliente.apellidos;
                        this.Cliente.id        = res.data.cliente.id;
                        this.crearTareas();
                    }
                    this.Cliente.loading   = false;
                    this.Cliente.incio     = false;
                })
            },
            registrarCliente(){
                this.$store.commit('activarOverlay', true);
                this.$axios.post('cliente_rapido',{
                    nombres:   this.Cliente.nombres.toUpperCase(),
                    apellidos: this.Cliente.apellidos.toUpperCase(),
                    identidad: this.Cliente.identidad,
                    sexo:      this.Cliente.sexo
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.$store.commit('activarOverlay', false);
                    this.Cliente.id = res.data.id;
                    Swal.fire(
                        'Registro Exitoso',
                        `Se registro exitosamente el cliente ${this.Cliente.nombres} ${this.Cliente.apellidos}.`,
                        'success'
                    );
                    this.Cliente.exists = true;
                    this.crearTareas();
                }).catch((error)=>{
                    this.$store.commit('activarOverlay', false);
                    if (error.response.status === 422){
                        this.erroresServidor = error.response.data.errors
                    }
                })
            },
            addFila(){
                this.detalles.push({
                    'detalle':       '',
                    'val':           '',
                    'key':           this.detalles.length,
                    'dibComentario': false,
                    'dibDetalle':    false,
                    'fecha':         this.addFecha()
                })
            },
            removeFila(fila){
                if (fila > 9){
                    this.detalles.splice(fila, 1)
                }else {
                    Vue.$toast.open({
                        message: 'No se puede borrar el item que selecciono',
                        type: 'error',
                        position: 'bottom-left',
                        duration: 4000
                    });
                }
            },
            crearTareas(){
                let fecha= new Date();
                fecha.setDate(fecha.getDate() + 1);
                for (let i = 0; i < 5; i++){
                    this.Tareas.push({
                        "num": i+1,
                        "detalle":        `Seguimiento a ${this.Cliente.nombres} ${this.Cliente.apellidos}`,
                        "fechadb":        fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getDate(),
                        "fecha":          fecha.getDate()+'/'+(fecha.getMonth() + 1)+'/'+fecha.getFullYear(),
                        "forma_contacto": 1,
                        "respuesta":      '',
                        "estado":         0,
                        "revisado_tack":  0,
                        "view":           0
                    });
                    if (i < 1)
                        fecha.setDate(fecha.getDate() + 1);
                    else if (i >= 1)
                        fecha.setDate(fecha.getDate() + 2);
                }
            },
            validarTareas(){
                let bandera = 2, cont = 0;
                this.detalles.forEach( (i) => {
                    //vrificar si hay telefono
                    console.log(i)
                    if (i.key === 7){
                        if (i.val.length >= 8)
                            cont++;
                        else
                            Vue.$toast.open({
                                message: 'Debes colocar un telefono válido',
                                type: 'error',
                                position: 'bottom-left',
                                duration: 4000
                            });

                    }
                    //verificar si hay direccion
                    if (i.key === 9){
                        if (i.val.length > 5)
                            cont++;
                        else
                            Vue.$toast.open({
                                message: 'Mínimo 5 letras en dirección',
                                type: 'error',
                                position: 'bottom-left',
                                duration: 4000
                            });
                    }

                    if (cont === bandera && this.Cliente.nombres.length > 0)
                        this.registrarSeguimiento();
                })
            },
            registrarSeguimiento(){
                this.$store.commit('activarOverlay', true);
                let detalles = JSON.stringify(this.detalles);
                let tareas   = JSON.stringify(this.Tareas);
                this.$axios.post('seguimiento_venta',{
                    cliente_id:  this.Cliente.id,
                    articulo_id: this.articulo.articulo,
                    detalles:    detalles,
                    tareas:      tareas,
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.$store.commit('valorDialogo', false)
                    this.$store.commit('activarOverlay', false);
                    Swal.fire(
                        'Registro Exitoso',
                        `Se registro exitosamente el seguimiento del cliente ${this.Cliente.nombres} ${this.Cliente.apellidos}.
                                Si quieres ver el seguimiento puedes ir al inicio.`,
                        'success'
                    );
                })
            }
        },
    }
</script>

<style scoped>
    .side{
        opacity: 0.95;
    }
    .rowsTable{
        cursor: pointer;
    }
</style>
