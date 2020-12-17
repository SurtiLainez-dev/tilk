<template>
    <v-container >
        <div class="d-flex justify-center">
            <v-card width="80%">
                <v-row no-gutters>
                    <v-col cols="6">
                        <v-card-title>Tareas programadas</v-card-title>
                    </v-col>
                    <v-col cols="6" class="d-flex justify-end align-center">
                        <v-btn class="ma-1" color="warning" x-small dark @click="ordenarTabla(1)">Pendientes</v-btn>
                        <v-btn class="ma-1" color="red" x-small dark @click="ordenarTabla(2)">Vencidas</v-btn>
                        <v-btn class="ma-1" color="indigo" x-small dark @click="ordenarTabla(3)">Abiertas</v-btn>
                        <v-btn class="ma-1" color="success" x-small dark @click="ordenarTabla(4)">Terminadas</v-btn>
                    </v-col>
                </v-row>
                <div class="contenedorTable d-flex justify-center">
                    <table class="rowsTable">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Usuario</th>
                            <th>Fecha creado</th>
                            <th>Tarea</th>
                            <th>Tipo de tarea</th>
                            <th>Hora abierto</th>
                            <th></th>
                            <th class="d-flex align-center justify-center">
                                <v-icon color="success" small>fa fa-eye</v-icon></th>
                            <th>Duración</th>
                            <th>Terminado</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, i) in Tareas" @click="verTarea(item)">
                            <td>{{i}}</td>
                            <td>{{item.user.usuario}}</td>
                            <td>{{item.fecha_creado.split('-')[2]}}/{{item.fecha_creado.split('-')[1]}}/{{item.fecha_creado.split('-')[0]}}</td>
                            <td v-if="item.detalle.length < 35">
                                {{item.detalle}}
                            </td>
                            <td v-else>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <span v-on="on" v-bind="attrs">{{item.detalle.substring(0, 35)}}...</span>
                                    </template>
                                    <span>{{item.detalle}}</span>
                                </v-tooltip>
                            </td>
                            <td>{{item.tipo_tarea}}</td>
                            <td >
                                <span v-if="item.hora_abierto">{{item.hora_abierto}}</span>
                                <span v-else >Aún no se ha abierto</span>
                            </td>
                            <td>
                                <v-chip x-small dark color="warning" v-if="item.estado === 1"></v-chip>
                                <v-chip x-small dark color="red" v-if="item.estado === 2"></v-chip>
                                <v-chip x-small dark color="indigo" v-if="item.estado === 3"></v-chip>
                                <v-chip x-small dark color="success" v-if="item.estado === 4"></v-chip>
                            </td>
                            <td class="d-flex align-center justify-center">
                                <v-icon v-if="item.is_revisado" color="success" small>fa fa-check</v-icon>
                                <v-icon v-else color="red" small>fa fa-times</v-icon>
                            </td>
                            <td>
                                <span v-if="item.tiempo_duracion">{{item.tiempo_duracion}} minutos</span>
                            </td>
                            <td>{{item.fecha_concluido}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </v-card>
        </div>


        <v-navigation-drawer v-model="View_Tarea" clipped right absolute width="100%" class="side">
            <v-row no-gutters>
                <v-col cols="1" class="d-flex align-center">
                    <v-btn class="ma-2" dark fab x-small text color="red" @click="cerrarNavegacion">
                        <v-icon>fa fa-times</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="11" class="d-flex justify-center align-center"><h4>Tarea</h4></v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters class="pl-3 pr-3">
                <v-col cols="2">
                    <small>Información de las tarea</small>
                    <b-list-group>
                        <b-list-group-item @click="vista = 1" button>Información</b-list-group-item>
                        <b-list-group-item @click="vista = 2" button>Historial</b-list-group-item>
                    </b-list-group>
                    <v-divider></v-divider>
                    <v-row no-gutters>
                        <v-col><small><strong>Tipo:</strong> {{Tarea.tipo_tarea}}</small></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col><small><strong>Detalle:</strong> {{Tarea.detalle}}</small></v-col>
                    </v-row>
                    <v-row no-gutters v-if="Tarea.fecha_abierto">
                        <v-col><small><strong>Día abierto:</strong> {{Tarea.fecha_abierto.split('-')[2]}}/{{Tarea.fecha_abierto.split('-')[1]}}/{{Tarea.fecha_abierto.split('-')[0]}}</small></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col><small><strong>Duración:</strong> {{Tarea.tiempo_duracion}} minutos</small></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col><small>{{Tarea.fecha_concluido}}</small></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col><small><strong>Hora abierto:</strong> {{Tarea.hora_abierto}}</small></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col><small><strong>Estado:</strong>
                            <v-chip x-small dark color="warning" v-if="Tarea.estado === 1">Pendiente</v-chip>
                            <v-chip x-small dark color="red" v-if="Tarea.estado === 2">Vencida</v-chip>
                            <v-chip x-small dark color="indigo" v-if="Tarea.estado === 3">Abierta</v-chip>
                            <v-chip x-small dark color="success" v-if="Tarea.estado === 4">Terminada</v-chip>
                        </small></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <div v-if="Tarea.estado !== 4">
                        <v-row no-gutters>
                            <v-col class="d-flex align-center"><small>Estado:</small></v-col>
                            <v-col class="d-flex justify-end align-center">
                                <v-switch dense v-model="estado"></v-switch>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <v-btn :disabled="!estado" @click="terminacionTarea"
                                       color="success" x-small>Registrar</v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="10" class="pl-3 pr-3">
                    <b-overlay :show="overlay || overlaySolicitud" rounded="xl">
                        <v-card :disabled="view_seguimiento">
                            <div v-if="vista === 1">
                                <div v-if="overlay || overlaySolicitud">
                                    <v-skeleton-loader v-bind="attrs" type="article"></v-skeleton-loader>
                                    <v-skeleton-loader v-bind="attrs" type="article"></v-skeleton-loader>
                                    <v-skeleton-loader v-bind="attrs" type="article"></v-skeleton-loader>
                                    <v-skeleton-loader v-bind="attrs" type="article"></v-skeleton-loader>
                                </div>
                                <div v-else>
                                    <seguimiento v-if="Tarea.tipo === 1" :tipo="3"/>
                                    <solicitud   v-else-if="Tarea.tipo === 2"/>
                                    <soli_credito_vista_vendedor v-else-if="Tarea.tipo === 3" :tipo="2"/>
                                </div>
                            </div>
                            <div v-else-if="vista === 2" class="pl-3 pr-3">
                                <strong>Historial</strong>
                                <historial :historial="Historial"/>
                            </div>
                        </v-card>
                    </b-overlay>
                </v-col>
            </v-row>

        </v-navigation-drawer>
    </v-container>
</template>

<script>
    import historial from "./historial";
    import Vue from 'vue'
    import seguimiento from "../Ventas/seguimiento";
    import solicitud from "../Ventas/solicitud/solicitud";
    import vista_vendedor from "../Ventas/solicitud/vista_vendedor";
    export default {
        components:{seguimiento, historial, solicitud,
            soli_credito_vista_vendedor:vista_vendedor},
        name: "index",
        created() {
            this.$store.commit('tareas/cargarTareas');
        },
        data(){
            return{
                Tarea: [],
                estado: false,
                seleccion: false,
                attrs: {
                    class: 'mb-6',
                    boilerplate: true,
                    elevation: 2,
                },
                vista: 1
            }
        },
        computed:{
            view_seguimiento() {
                return this.$store.state.seguimientos.Seguimientos_view;
            },
            overlay(){
                return this.$store.state.loadSeguimiento;
            },
            overlaySolicitud(){
                return this.$store.state.solicitud_credito.loadSolicitudes;
            },
            Tareas(){
                return this.$store.state.tareas.Tareas_data;
            },
            View_Tarea: {
                get: function () {
                    return this.$store.state.tareas.Tareas_view;
                },
                set: function (val) {
                    this.$store.commit('tareas/cambiarValorVista', val)
                }
            },
            Historial(){
                if (this.seleccion)
                    return Array.from(this.Tarea.historial);
            },
            Avales:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud.aval_solicituds;
                }
            },
        },
        methods:{
            cerrarNavegacion(){
                this.View_Tarea = !this.View_Tarea;
                this.$store.commit('tareas/cargarTareas');
            },
            verTarea(item){
                if (item.tipo === 1)
                    this.$store.commit('cargarSeguimientoId', item.ruta_back);
                else if (item.tipo === 2 || item.tipo === 3)
                    this.$store.commit('solicitud_credito/cargarSolicitud', item.ruta_back);

                this.Tarea = item;
                this.vista = 1;
                this.estadoTarea();
                this.seleccion = true;
                this.View_Tarea = true;
                this.viewTarea();
            },
            estadoTarea(){
                if (this.Tarea.estado === 1 || this.Tarea.estado === 2 || this.Tarea.estado === 3)
                    this.estado = false;
                else if (this.Tarea.estado === 4)
                    this.estado = true;
            },
            viewTarea(){
                let estado = 0, mensaje = '';
                if (this.Tarea.hora_abierto) {
                    estado = 0;
                    mensaje = 'Ingresó a la tarea'
                }else {
                    estado = 1;
                    mensaje = 'Ingresó por primera vez a la tarea'
                }
                let HOY = new Date();
                let hora = HOY.getHours(), minutos = HOY.getMinutes(), segundos= HOY.getSeconds();
                if (hora < 10)
                    hora = '0'+hora;
                if (minutos < 10)
                    minutos = '0'+minutos;
                if (segundos < 10)
                    segundos = '0'+segundos;
                hora = hora+':'+minutos+':'+segundos;
                this.$axios.put('tareas/'+this.Tarea.id,{
                    tiempo: estado,
                    hora:   hora,
                    mensaje: mensaje
                }).then((res)=>{
                    if (estado === 1) {
                        this.Tarea.hora_abierto  = res.data.hora;
                        this.Tarea.fecha_abierto = res.data.abierto;
                        this.Tarea.estado        = res.data.estado;
                    }
                    this.Tarea.historial = res.data.historial;
                    this.$store.commit('tareas/cargarTareas');

                    Vue.$toast.open({
                        message: 'Se ha registrado el ingreso a la tarea.',
                        type: 'success',
                        position: 'bottom-left',
                        duration: 3500
                    });
                })
            },
            terminacionTarea(){
                if (this.estado){
                    this.$store.commit('activarOverlay', true);
                    this.$axios.get('tarea/terminada/'+this.Tarea.id)
                    .then((res)=>{
                        this.$store.commit('tareas/cargarTareas');
                        this.View_Tarea = false;
                        this.vista = 1;
                        this.$store.commit('activarOverlay', false);
                        Vue.$toast.open({
                            message: 'La tarea se ha cerrado exitosamente.',
                            type: 'success',
                            position: 'bottom-left',
                            duration: 4000
                        });
                    })
                }
            },
            ordenarTabla(val){
                this.Tareas.sort(function (a) {
                    if (a.estado === val)
                        return -1;
                    else
                        return  1;

                    return 0;
                });
                console.log(this.Tareas)
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
        height: 400px;
        overflow-y: auto;
    }
    table thead{
        border-bottom: solid 1px #47494e;
    }
</style>
