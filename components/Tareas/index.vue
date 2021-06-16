<template>
  <v-card flat>
    <v-toolbar class="grey lighten-4" dense flat><h5>Tareas</h5></v-toolbar>
    <v-data-table :headers="header" :items="Tareas" @click:row="verTarea" dense class="cursor">
      <template v-slot:item.fecha_creado="{item}">
        {{item.fecha_creado.split('-')[2]}}/{{item.fecha_creado.split('-')[1]}}/{{item.fecha_creado.split('-')[0]}}
      </template>
      <template v-slot:item.detalle="{item}">
        <span v-if="item.detalle.length < 35">{{item.detalle}}</span>
        <v-tooltip v-else top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">{{item.detalle.substring(0, 35)}}...</span>
          </template>
          <span>{{item.detalle}}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.hora_abierto="{item}">
        <span v-if="item.hora_abierto">{{item.hora_abierto}}</span>
        <span v-else>
          <v-icon small color="red">fa fa-eye-slash</v-icon>
        </span>
      </template>
      <template v-slot:item.tiempo_duracion="{item}">
        <span v-if="item.tiempo_duracion">{{item.tiempo_duracion}} minutos</span>
        <span v-else>-</span>
      </template>
      <template v-slot:item.id="{item}">
        <v-chip x-small dark color="warning" v-if="item.estado === 1">Pendiente</v-chip>
        <v-chip x-small dark color="red" v-if="item.estado === 2">Vencida</v-chip>
        <v-chip x-small dark color="indigo" v-if="item.estado === 3">Abierta</v-chip>
        <v-chip x-small dark color="success" v-if="item.estado === 4">Terminado</v-chip>
      </template>
    </v-data-table>

    <v-dialog  v-model="View_Tarea" width="100%" >
      <v-card>
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
                  <v-btn :disabled="!estado" block @click="terminacionTarea"
                         color="success"tile small>Registrar</v-btn>
                </v-col>
              </v-row>
            </div>
            <v-btn block dark tile small color="red" @click="cerrarNavegacion">
              Cerrar
            </v-btn>
          </v-col>
          <v-col cols="10" class="pl-3 pr-3">
            <b-overlay :show="overlay || overlaySolicitud" rounded="xl">
              <v-card flat :disabled="Tarea.estado === 4">
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
      </v-card>

    </v-dialog>
  </v-card>
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
                header:[
                  {text:'Usuario', value:'user.usuario'},
                  {text:'Fecha', value:'fecha_creado'},
                  {text:'Tarea', value:'detalle'},
                  {text:'Tipo de Tarea', value:'tipo_tarea'},
                  {text:'Abierto', value:'hora_abierto'},
                  {text:'Duración', value:'tiempo_duracion'},
                  {text:'Términado', value:'fecha_concluido'},
                  {text:'Estado', value:'id'},
                ],
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
                    this.$store.commit('tareas/cambiarValorVista', false);
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
    .cursor{
      cursor: pointer;
    }
</style>
