<template>
<v-card flat>
  <v-toolbar dense flat color="grey lighten-3">
    <h6>Segmentos de cobros</h6>
  </v-toolbar>
  <v-toolbar flat dense class="d-flex justify-end">
    <v-tooltip top>
      <template v-slot:activator="{on, attrs}">
        <v-btn color="indigo" fab x-small dark v-on="on" @click="abrirDialogo(1)"
               v-bind="attrs"><v-icon>fa fa-plus</v-icon></v-btn>
      </template>
      <span>Agregar nuevo segmento</span>
    </v-tooltip>
  </v-toolbar>

  <v-data-table dense :headers="header" :loading="LOADSEGMENTOS" :items-per-page="20" @click:row="asignarSegmento"
                loading-text="Cargando segmentos" :items="SEGMENTOS">
    <template v-slot:item.inicio="{item}">
      de {{item.inicio}} a {{item.final}} días
    </template>
    <template v-slot:item.color="{item}">
      <div class="pa-3 d-inline-block secondary rounded-circle" :style="'background-color:'+ item.color +'!important;'"></div>
    </template>
  </v-data-table>


  <v-dialog v-model="dialogo" width="45%">
    <v-card>
      <v-toolbar flat dense>
        <v-toolbar-title  v-if="tipo === 1">Nuevo Segmento</v-toolbar-title>
        <v-toolbar-title v-else-if="tipo === 2">{{SEGMENTO.nombre}}</v-toolbar-title>
        <template v-slot:extension>
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab :key="0">
              <span v-if="tipo === 1">Creando Segmento</span>
              <span v-else-if="tipo === 2">Editando Segmento</span>
            </v-tab>
            <v-tab  :key="1"  v-if="tipo === 2">Información del Segmento</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tab">
        <v-tab-item :key="0"><v-form ref="FormNuevoSegmentoCobros" class="pa-3">
            <v-row no-gutters>
              <v-col>
                <v-text-field outlined class="ma-3" :rules="[rule.nombre.req, rule.nombre.min, rule.nombre.max]"
                              label="Nombre" dense v-model="segmento.nombre" counter></v-text-field>
              </v-col>
              <v-col>
                <v-text-field outlined class="ma-3" label="Alias" :rules="[rule.nombre.req, rule.nombre.min, rule.alias.max]"
                              dense v-model="segmento.alias" counter></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-card-text> Color de segmento</v-card-text>
                <v-color-picker hide-canvas hide-sliders show-swatches hide-mode-switch hide-inputs dot-size="15" v-model="segmento.color"></v-color-picker>
              </v-col>
              <v-col>
                <v-row no-gutters>
                  <v-col>
                    <v-text-field class="ma-3" dense outlined :rules="[rule.dias.inicio]" :disabled="tipo === 2"
                                  label="Inicio" v-model="segmento.inicio" suffix="días"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field class="ma-3" dense outlined :disabled="tipo === 2" label="Final" :rules="[rule.dias.final]"
                                  v-model="segmento.final" suffix="días"></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col>
                    <v-textarea label="Explicación del segmento" :rules="[rule.nombre.req, rule.nombre.min]"
                                placeholder="Explica cual es el funcionamiento de este segmento" :disabled="tipo === 2"
                                class="ma-3" v-model="segmento.explicacion" outlined dense counter></v-textarea>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters>
              <v-col><v-card-title>Funciones</v-card-title></v-col>
              <v-col class="d-flex align-center justify-end">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn v-on="on" v-bind="attrs" color="success" @click="addFuncion" fab x-small dark><v-icon>fa fa-plus</v-icon></v-btn>
                  </template>
                  <span>Agregar funciones</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-simple-table height="200" dense fixed-header>
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Días</th>
                  <th>Quitar</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item , i) in segmento.funciones">
                  <td width="90%">
                    <vs-input size="small" v-model="item.nombre" style="min-width: 400px; max-width: 600px"/>
                  </td>
                  <td>
                    <vs-input size="small" v-model="item.dias" style="min-width: 50px; max-width: 100px"/>
                  </td>
                  <td>
                    <v-btn height="25" width="25" fab dark color="red" @click="deleteFuncion(item)"><v-icon x-small>fa fa-times</v-icon></v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider></v-divider>
            <v-alert dense border="left" v-for="item in errores" v-if="item.length > 0" type="warning">
              {{item}}
            </v-alert>
            <v-card-actions class="d-flex justify-end">
              <v-btn small tile color="orange" dark @click="dialogo = false">Cerrar</v-btn>
              <v-btn small tile color="success" dark @click="validarForm" v-if="tipo === 1">Registrar</v-btn>
              <v-btn small tile color="success" dark @click="validarForm" v-if="tipo === 2">Guardar Edición</v-btn>
            </v-card-actions>
          </v-form></v-tab-item>

      </v-tabs-items>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import {vsInput, vsSelect, vsIcon} from 'vuesax';
import Vue from 'vue';
import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';
export default {
  name: "segmentos",
  data(){
    return{
      tab: 1,
      tipo: 1,
      rule: {
        nombre: {
          req: v => !!v || 'Campo requerido',
          min: v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
          max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        },
        alias:{
          max: v => (v && v.length <= 25) || 'Tiene que ser menor o igual a 25 carácteres.',
        },
        dias:{
          inicio: v => ( parseInt(v) >= 0) || 'Tiene que ser 0, o mayor a 0',
          final: v => (parseInt(this.segmento.inicio) < parseInt(this.segmento.final)) || 'Tiene que ser mayor al inicio'
        }
      },
      errores: [],
      dialogo: false,
      segmento:{
        color: '',
        nombre: '',
        alias: '',
        inicio: 0,
        final: 1,
        explicacion:'',
        funciones:[]
      },
      header:[
        {text:'Nombre', value:'nombre'},
        {text:'Alias',  value:'alias'},
        {text:'Intervalo', value:'inicio'},
        {text:'Color',     value:'color'},
      ],
      sucursales:{
        data: [],
        load: false,
        suc:  [],
        existe: []
      },
      usuarios:{
        data: [],
        load: false
      },
      encargados:[]
    }
  },
  created() {
    this.$store.commit('cobros/segmentos/cargar_SEGMENTOS');
    this.$store.commit('guardarTitulo', 'Cobros > Segmentos');
    Vue.use(vsInput);
    Vue.use(vsSelect);
    Vue.use(vsIcon)
    this.$store.commit('activarOverlay', false);
  },
  computed:{
    LOADSEGMENTOS(){
      return this.$store.state.cobros.segmentos.LOADSEGMENTOS;
    },
    SEGMENTOS(){
      return this.$store.state.cobros.segmentos.SEGMENTOS;
    },
    SEGMENTO:{
      get: function (){
        return this.$store.state.cobros.segmentos.SEGMENTO;
      },
      set: function (data){
        this.$store.commit('cobros/segmentos/asignar_SEGMENTO', data);
      }
    }
  },
  methods:{
    abrirDialogo(tipo){
      this.tipo = tipo;
      this.segmento.nombre = '';
      this.segmento.alias  = '';
      this.segmento.explicacion = '';
      this.segmento.inicio      = 0;
      this.segmento.final       = 1;
      this.dialogo = true;
    },
    anadirEncargados(){
      this.sucursales.data   = [];
      this.sucursales.existe = [];
      this.encargados.forEach((item)=>{
        if (this.SEGMENTO.id === item.cob_segmento_id){
          this.sucursales.suc.forEach((index, i)=>{
            if (item.sucursal_id === index.id){
              this.sucursales.data.push({
                user_id: item.user_id,
                id:      index.id,
                nombre:  index.nombre,
                visible: false
              });
            }
            else{
              this.sucursales.existe.push({
                user_id: null,
                id:      index.id,
                nombre:  index.nombre,
                visible: false
              });
            }
          })
        }
      });
      if (this.sucursales.existe.length === 0 && this.sucursales.data.length === 0)
        this.sucursales.existe = this.sucursales.suc;
    },
    addFuncion(){
      this.segmento.funciones.push({
        key:   this.segmento.funciones.length,
        nombre: '',
        dias:  this.segmento.inicio
      });
    },
    asignarSegmento(data){
      this.SEGMENTO             = data;
      this.tipo                 = 2;
      this.segmento.nombre      = data.nombre;
      this.segmento.alias       = data.alias;
      this.segmento.funciones   = JSON.parse(data.funciones);
      this.segmento.color       = data.color;
      this.segmento.explicacion = data.explicacion;
      this.segmento.inicio      = parseInt(data.inicio);
      this.segmento.final       = parseInt(data.final);
      this.tab                  = 0;
      this.dialogo              = true;
    },
    deleteFuncion(data){
      if (this.segmento.funciones.length > 0){
        this.segmento.funciones.splice(data.key, 1);
        this.segmento.funciones.forEach((item, i)=>{
          item.key = i
        });
      }
    },
    editarSegmento(){
      this.errores = [];
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.put('cobros/segmentos/'+this.SEGMENTO.id,{
        nombre:      this.segmento.nombre,
        alias:       this.segmento.alias,
        color:       this.segmento.color.substr(0,7),
        inicio:      this.segmento.inicio,
        final:       this.segmento.final,
        explicacion: this.segmento.explicacion,
        funciones:   JSON.stringify(this.segmento.funciones)
      }).then((res)=>{
        this.segmento.final       = 1;
        this.segmento.inicio      = 0;
        this.segmento.explicacion = '';
        this.segmento.nombre      = '';
        this.segmento.funciones   = [];
        this.segmento.alias       = '';
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$store.commit('cobros/segmentos/cargar_SEGMENTOS');
      }).catch((error)=>{
        this.dialogo = true;
        this.$store.commit('activarOverlay', false);
        if (error.response.status === 422){
          let errores = Object.values(error.response.data.errors);
          errores.forEach((item, i)=>{
            if (item.length > 0){
              item.forEach((val)=>{
                this.errores.push(val);
              })
            }
          })
        }else if (error.response.status === 400)
          this.$store.commit('notificacion',{texto:'El color seleccionado ya existe en otro segmento', color:'error'});
        else
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    registrarSegmento(){
      this.errores = [];
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cobros/segmentos',{
        nombre:      this.segmento.nombre,
        alias:       this.segmento.alias,
        color:       this.segmento.color.substr(0,7),
        inicio:      this.segmento.inicio,
        final:       this.segmento.final,
        explicacion: this.segmento.explicacion,
        funciones:   JSON.stringify(this.segmento.funciones)
      }).then((res)=>{
        this.segmento.final       = 1;
        this.segmento.inicio      = 0;
        this.segmento.explicacion = '';
        this.segmento.nombre      = '';
        this.segmento.funciones   = [];
        this.segmento.alias       = '';
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$store.commit('cobros/segmentos/cargar_SEGMENTOS');
      }).catch((error)=>{
        this.dialogo = true;
        this.$store.commit('activarOverlay', false);
        if (error.response.status === 422){
          let errores = Object.values(error.response.data.errors);
          errores.forEach((item, i)=>{
            if (item.length > 0){
              item.forEach((val)=>{
                this.errores.push(val);
              })
            }
          })
        }else if (error.response.status === 400)
          this.$store.commit('notificacion',{texto:'El color seleccionado ya existe en otro segmento', color:'error'});
        else
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    validarForm(){
      if (this.$refs.FormNuevoSegmentoCobros.validate()){
        if (this.segmento.funciones.length > 1){
          if (this.tipo === 1)
            this.registrarSegmento();
          else
            this.editarSegmento();
        }
        else
          this.$store.commit('notificacion',{texto:'Tienes que describir dos funciones', color:'success'});
      }
    }
  }
}
</script>

<style scoped>

</style>
