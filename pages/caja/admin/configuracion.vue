<template>
<v-card>
  <v-toolbar flat color="grey lighten-4">
    <h5>Cajas Generales de Surtidora Laínez</h5>
    <v-spacer></v-spacer>
    <v-text-field dense label="Buscar" v-model="search"></v-text-field>
  </v-toolbar>
  <v-data-table dense :search="search"
                class="rowsTable"
                :headers="header"
                :loading="load"
                @click:row="abrirDialogo"
                :items="CAJAS"
                loading-text="Cargando Cajas">
    <template v-slot:item.estado_cierre="{item}">
      <v-chip x-small dark v-if="item.estado_cierre === 1" color="orange">Abierta a cualquier hora</v-chip>
      <v-chip x-small dark v-else-if="item.estado_cierre === 0" color="indiigo">Con horarios</v-chip>
    </template>
    <template v-slot:item.estado="{item}">
      <v-chip x-small dark v-if="item.estado === 1" color="success">Abierta</v-chip>
      <v-chip x-small dark v-else-if="item.estado === 0" color="orange">Cerrada</v-chip>
    </template>
    <template v-slot:item.activa="{item}">
      <v-chip x-small dark v-if="item.activa === 1" color="success">Disponible</v-chip>
      <v-chip x-small dark v-else-if="item.activa === 0" color="orange">No Disponible</v-chip>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogo" width="50%" v-if="dialogo">
    <v-card>
      <v-card-title>Configurando Caja {{Caja.codigo}} - {{Caja.sucursal.nombre}}</v-card-title>
      <v-divider></v-divider>
      <v-container>
        <v-form ref="FormConfigurandoCaja" class="ma-5">
          <v-row no-gutters>
            <v-col>
              <v-text-field label="Usuario Responsable" v-model="Caja.user.usuario"
                            dense disabled class="ma-4"></v-text-field>
            </v-col>
            <v-col>
              <v-select dense v-model="data_caja.estodo_cierre" :items="Select" class="ma-4"
                        label="Configuración de Cierre de Caja" disabled></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-menu ref="FechaInicio" v-model="MenuHoraInicio" :close-on-content-click="false"
                      :nudge-right="40" :return-value.sync="Caja.hora_inicio"
                      transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="Caja.hora_inicio" disabled class="ma-4"
                      label="Hora de Inicio" prepend-icon="mdi-clock-time-four-outline"
                      readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-time-picker v-if="MenuHoraInicio" v-model="Caja.hora_inicio" full-width
                               @click:minute="$refs.FechaInicio.save(Caja.hora_inicio)"></v-time-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu ref="FechaFinal" v-model="MenuHoraFinal" :close-on-content-click="false"
                      :nudge-right="40" :return-value.sync="Caja.hora_cierre"
                      transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="Caja.hora_cierre" disabled class="ma-4"
                                label="Hora de Cierre" prepend-icon="mdi-clock-time-four-outline"
                                readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-time-picker v-if="MenuHoraFinal" v-model="Caja.hora_cierre" full-width
                               @click:minute="$refs.FechaFinal.save(Caja.hora_cierre)"></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-text-field v-model="Caja.password" :type="show1 ? 'text' : 'password'"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" label="Contraseña"
                            class="input-group--focused ma-4" @click:append="show1 = !show1"
                            :rules="[rule.required, rule.min]">
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="data_caja.password2" :type="show2 ? 'text' : 'password'"
                            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" label="Repetir Contraseña"
                            class="input-group--focused ma-4" @click:append="show2 = !show2" :rules="[rule.igual]">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-select dense :items="selectEstos" v-model="Caja.activa"
                        label="Estado de la caja" class="ma-4"></v-select>
            </v-col>
            <v-col></v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn small tile color="orange" dark @click="dialogo = false">Cerrar</v-btn>
        <v-btn small tile color="success" dark @click="validarForm">Guardar Configuración</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "configuracion",
  data(){
    return{
      search: '',
      load:   true,
      show1: false,
      show2: false,
      rule:{
        required: value => !!value || 'La contraseña es requerida',
        min: v => v.length >= 8 || 'Debe ingresar mínimo 8 carácteres',
        igual: value => this.Caja.password === value || 'Las contraseñas deben coincidir'
      },
      header:[
        {text: 'Sucursal', value:'sucursal.nombre'},
        {text: '#', value:'num_caja'},
        {text: 'Código', value:'codigo'},
        {text: 'Responsble', value:'user.usuario'},
        {text: 'Estado de Horario', value:'estado_cierre'},
        {text: 'Estado', value:'estado'},
        {text: 'Estado Configuración', value:'activa'},
        {text: 'Hora de Inicio', value:'hora_inicio'},
        {text: 'Hora de Cierre', value:'hora_cierre'},
      ],
      dialogo: false,
      MenuHoraInicio: false,
      MenuHoraFinal:  false,
      selectEstos:[
        {text: 'Caja Desactivada', value: 0},
        {text: 'Caja Activa',      value: 1}
      ],
      Select: [
        {text: 'Abrir caja sin horarios', value: 0},
        {text: 'Abrir caja con horarios', value: 1},
      ],
      Caja:    [],
      data_caja:{
        estodo_cierre: 0,
        password:      '',
        hora_inicio:   null,
        hora_final:    null,
        password2:     ''
      }
    }
  },
  computed:{
    CAJAS(){
      return this.$store.state.caja.CAJAS;
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Administrador > Cajas > Configuración');
    this.cargarCajas()
  },
  methods:{
    cargarCajas(){
      this.load = true;
      this.$axios.get('cajas/cajas').then((res)=>{
        this.$store.commit('caja/agregar_CAJAS', res.data.cajas)
        this.load = false;
      })
    },
    abrirDialogo(data){
      this.Caja = data;
      this.dialogo = true;
      this.Caja.password = '';
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    storeConfiguracion(){
      this.$store.commit('activarOverlay', true);
      this.dialogo = false;
      this.$axios.post('cajas/configuracion',{
        hora_incio:  this.Caja.hora_inicio,
        hora_cierre: this.Caja.hora_cierre,
        password:    this.Caja.password,
        activa:      this.Caja.activa,
        id:          this.Caja.id
      }).then((res)=>{
        this.cargarCajas()
        this.notificacion(res.data.msj,'success');
        this.Caja = [];
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        },4500)
      }).catch((error)=>{
        this.dialogo = true;
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormConfigurandoCaja.validate())
        this.storeConfiguracion();
      else
        this.notificacion('Faltan datos','error');
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
