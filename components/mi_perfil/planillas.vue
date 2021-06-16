<template>
  <v-card>
    <v-toolbar dense flat>
      <h6>Planillas</h6>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar" class="ma-2" v-model="search"></v-text-field>
    </v-toolbar>

    <v-data-table :headers="headers" :items="PLANILLAS" :loading="LOAD_PLANILLAS"
                  loading-text="Cargando planillas ..." class="rowsTable"
                  dense :search="search" @click:row="datosPlanilla">
      <template v-slot:item.total_planilla="{item}">
        L {{int.format(item.total_planilla)}}
      </template>
      <template v-slot:item.fecha_creacion="{item}">
        {{item.fecha_creacion.split('-')[2]}}/{{item.fecha_creacion.split('-')[1]}}/{{item.fecha_creacion.split('-')[0]}}
      </template>
      <template v-slot:item.periodo="{item}">
        {{item.periodo}} de {{item.mes_asignado}} de {{item.ano}}
      </template>
      <template v-slot:item.is_pagado="{item}">
        <v-icon v-if="item.is_pagado === 1" x-small color="success">fa fa-check</v-icon>
        <v-icon v-else-if="item.is_pagado === 0" x-small color="red">fa fa-times</v-icon>
      </template>
      <template v-slot:item.estado="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-icon v-on="on" v-bind="attrs" v-if="item.estado === 1" x-small color="success">fa fa-check</v-icon>
            <v-icon v-on="on" v-bind="attrs" v-else-if="item.estado === 0" x-small color="red">fa fa-times</v-icon>
          </template>
          <span v-if="item.estado === 1">Documento cargado</span>
          <span v-else-if="item.estado === 0">Tienes que subir la planilla firmada</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogo" width="35%">
      <v-card>
        <v-toolbar color="grey lighten-5" flat><h6>Datos de la planilla {{planilla.codigo}}</h6></v-toolbar>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Total de la Planillas</v-list-item-title>
            <v-list-item-subtitle>L {{int.format(planilla.total_planilla)}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Estado de parte {{USER.colaborador.nombres+' '+USER.colaborador.apellidos}}</v-list-item-title>
            <v-list-item-subtitle v-if="planilla.estado === 0">No se ha cargado la planilla fírmada</v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="planilla.estado === 1">Ya se cargó la planilla fírmada</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Estado del pago</v-list-item-title>
            <v-list-item-subtitle v-if="planilla.is_pagado === 0">No se ha pagado</v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="planilla.is_pagado === 1">Ya se cargó el pago</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Planilla generada</v-list-item-title>
            <v-list-item-subtitle><b-link @click="verDocumento(planilla.file)">Ver</b-link></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-file-input dense label="Cargar Documento" v-model="file"
                      v-if="planilla.estado === 0" class="ma-2"></v-file-input>
        <v-list-item two-line v-else-if="planilla.estado === 1">
          <v-list-item-content>
            <v-list-item-title>Documento cargado</v-list-item-title>
            <v-list-item-subtitle><b-link @click="verDocumento(planilla.file)">Ver</b-link></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" small tile dark @click="cargarPlanilla">Subir Documento</v-btn>
          <v-btn color="orange" @click="dialogo = false" small tile dark>Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "planillas",
  data(){
    return{
      file: null,
      planilla: {},
      dialogo: false,
      int: new Intl.NumberFormat(),
      search: '',
      headers:[
        {text:'Código', value:'codigo'},
        {text:'Creado', value:'fecha_creacion'},
        {text:'Periodo', value:'periodo'},
        {text:'Total', value:'total_planilla'},
        {text:'Estado', value:'estado'},
        {text:'Pagado', value:'is_pagado'},
      ]
    }
  },
  created() {
    this.$store.commit('perfil/cargar_PLANILLAS');
  },
  computed:{
    USER(){
      return this.$store.state.perfil.USER;
    },
    LOAD_PLANILLAS(){
      return this.$store.state.perfil.LOAD_PLANILLAS;
    },
    VISTA:{
      get: function (){
        return this.$store.state.perfil.VISTA;
      },
      set: function (val){
        this.$store.commit('perfil/asignar_VISTA', val)
      }
    },
    PLANILLAS(){
      return this.$store.state.perfil.PLANILLAS;
    }
  },
  methods:{
    cargarPlanilla(){
      if (this.file){
        let data = new FormData();
        data.append('id', this.planilla.id);
        data.append('planilla', this.file);
        this.dialogo = false;
        this.$store.commit('activarOverlay', true);
        this.$axios({
          url: 'planilla/subir',
          method: 'post',
          data:data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.file = null;
          this.$store.commit('perfil/cargar_PLANILLAS');
          this.$store.commit('notificacion', {texto:'Se ha registrado el documento', color:'success'});
          setTimeout(()=>{
            this.$store.commit('activarOverlay', false);
          }, 2500);
        }).catch((error)=>{
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      }else{
        this.$store.commit('notificacion',{texto:'No se ha cargado el documento', color:'warning'});
      }
    },
    datosPlanilla(data){
      this.planilla = data;
      this.dialogo  = true;
    },
    verDocumento(URL){
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.dialogo = true;
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento', color:'error'});
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
</style>
