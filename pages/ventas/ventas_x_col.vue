<template>
<v-card flat>
  <v-card v-if="VISTA === 1" flat tile>
    <v-card flat height="100" color="grey lighten-5">
      <v-toolbar color="grey lighten-5" flat dense>
        <v-toolbar-title>Ventas - Vista Permitidas a Usuarios</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn small tile color="pink" v-if="showSelect" text @click="dialogoCol = true">Asignar Colaborador</v-btn>
        <v-btn small tile text color="indigo">Busqueda Avanzada para mostrar Cuentas</v-btn>
        <v-btn small tile text @click="abrirBusqueda">Busqueda Avanzada para Asignar</v-btn>
        <v-btn small text color="success" fab><v-icon small @click="$store.commit('cuentas/cargar_VENTAS_VISTA', {inicio:fechaI, final:fechaF});">fa fa-sync</v-icon></v-btn>
      </v-toolbar>

      <v-row no-gutters >
        <v-col cols="2">
          <v-switch v-model="showSelect" label="Varios Ventas"></v-switch>
        </v-col>
        <v-col cols="3" class="d-flex justify-end">
          <v-dialog ref="dialogFechaInicio" v-model="dialogoFechaInicio" :return-value.sync="fechaI"
                    persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field label="Fecha de inicio" v-bind="attrs" v-on="on"
                            v-model="fechaI"></v-text-field>
            </template>
            <v-date-picker v-model="fechaI" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogoFechaInicio = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogFechaInicio.save(fechaI)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="3">
          <v-dialog ref="dialogFechaFinal" v-model="dialogoFechaFinal" :return-value.sync="fechaF"
                    persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field class="ml-1 mr-1" label="Fecha final" v-bind="attrs" v-on="on"
                            v-model="fechaF"></v-text-field>
            </template>
            <v-date-picker v-model="fechaF" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogoFechaFinal = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogFechaFinal.save(fechaF)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="4" class="d-flex justify-end">
          <v-text-field v-model="search" label="Buscar cuenta"
                        append-outer-icon="mdi-magnify"></v-text-field>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table dense :items="VENTAS" loading="Cargando datos..." :items-per-page="25" :show-select="showSelect"
                  :headers="headers" :search="search" :loading="LOAD_VENTAS" v-model="select" @click:row="goCuenta">
      <template v-slot:item.created_at="{item}">
        {{item.created_at.split(' ')[0].split('-')[2]}}/{{item.created_at.split(' ')[0].split('-')[1]}}/{{item.created_at.split(' ')[0].split('-')[0]}}
      </template>
      <template v-slot:item.colN="{item}">{{item.colN}} {{item.colA}}</template>
      <template v-slot:item.estado="{item}">
        <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
        <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
        <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
        <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
      </template>
    </v-data-table>
  </v-card>

  <v-card flat tile v-else-if="VISTA === 2">
    <v-toolbar flat>
      <v-btn color="orange" fab tile dark x-small @click="VISTA = 1">
        <v-icon>fa fa-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <h5 class="grey--text">Cuenta de {{dataVenta.nombres}} {{dataVenta.apellidos}}</h5>
      <v-spacer></v-spacer>
      <small class="grey--text"><strong>Cuenta #{{dataVenta.cod}}</strong></small>
    </v-toolbar>
    <v-divider></v-divider>
    <vista_asignacion :colaboradores="COLABORADORES" :cuenta="dataVenta"/>
  </v-card>

  <v-dialog v-model="dialgoBA" width="90%">
    <v-card>
      <v-toolbar flat tile dense class="grey lighten-3">
        <v-toolbar-title>Busqueda Avanzada</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-autocomplete dense label="Seleccionar Sucursal de las Cuentas" :loading="LOAD_SUCURSALES" v-model="sucursal_id"
                            hint="Se seleccionaran todas las cuentas de esta sucursal" persistent-hint
                            :items="SUCURSALES" :item-value="'id'" :item-text="'nombre'"></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete dense label="Seleccionar Colaborador" :loading="LOAD_COLABORADORES" v-model="colaborador_id"
                            hint="Se seleccionaran todas las cuentas donde el colaborador no este permitido para la vista" persistent-hint
                            :items="COLABORADORES"></v-autocomplete>
          </v-col>
          <v-col>
            <v-select dense label="Estado" v-model="estado_id" :items="estados"></v-select>
          </v-col>
          <v-col cols="2">
            <v-text-field disabled dense label="# Resultados" v-model="resultados"></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions class="d-flex justify-end">
          <v-btn @click="consultaBA" color="success" dark small tile text>Consultar Cuentas</v-btn>
        </v-card-actions>
        <v-divider></v-divider>
        <v-data-table dense :items="dataBA" loading="Cargando datos..." :items-per-page="5"
                      :headers="headers">
          <template v-slot:item.created_at="{item}">
            {{item.created_at.split(' ')[0].split('-')[2]}}/{{item.created_at.split(' ')[0].split('-')[1]}}/{{item.created_at.split(' ')[0].split('-')[0]}}
          </template>
          <template v-slot:item.colN="{item}">{{item.colN}} {{item.colA}}</template>
          <template v-slot:item.estado="{item}">
            <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
            <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
            <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
            <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
          </template>
        </v-data-table>
        <v-divider></v-divider>
        <v-card-text>Al colaborador seleccionado se le van a transferir {{resultados}} cuentas. Al crear la transferencia el colaborador tendrá acceso
        para revisar expedientes y otros doucumentos de la cuentas.</v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark text tile small @click="dialgoBA = false">Cerrar</v-btn>
          <v-btn color="success" dark text tile small @click="registrarAsignacionBA(1)">Realizar Transferencia</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoCol" width="35%">
    <v-card>
      <v-toolbar flat tile dense class="grey lighten-3">
        <v-toolbar-title>Busqueda Avanzada</v-toolbar-title>
      </v-toolbar>

      <v-container>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-autocomplete dense label="Seleccionar Colaborador" :loading="LOAD_COLABORADORES" v-model="colaborador_id"
                            :items="COLABORADORES"></v-autocomplete>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" @click="dialogoCol = false" class="ma-2" tile small dark>Cerrar</v-btn>
          <v-btn color="success" tile small dark class="ma-2" @click="consultaCol">Registrar</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>

</v-card>
</template>

<script>
import vista_asignacion from "@/components/Ventas/vista_asignacion.vue";
export default {
  components:{vista_asignacion},
  name: "ventas_x_col",
  data(){
    return{
      dataVenta: {},
      dialogoCol: false,
      sucursal_id: 0,
      colaborador_id: 0,
      dialgoBA: false,
      dataBA: [],
      resultados: 0,
      select: [],
      showSelect: false,
      dialogoFechaInicio: false,
      dialogoFechaFinal: false,
      search: '',
      fechaI: '',
      fechaF: '',
      estado_id: 0,
      estados:[
        {value: 1, text:'Al día'},
        {value: 2, text:'Mora'},
        {value: 3, text:'Canceladas'},
        {value: 0, text:'Todas'},
      ],
      headers:[
        {text:'# Ventas', value:'cod'},
        {text:'Identidad', value:'identidad'},
        {text:'Nombres', value:'nombres'},
        {text:'Apellidos', value:'apellidos'},
        {text:'Colaborador', value:'colN'},
        {text:'Sucursal', value:'sucN'},
        {text:'Estado', value:'estado'},
        {text:'Fecha', value:'created_at'},
      ]
    }
  },
  created() {
    this.VISTA = 1;
    let fecha = new Date;
    this.fechaI = fecha.getFullYear()+'-01-01';
    this.fechaF = fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getDate();

    this.$store.commit('col/cargar_COLABORADORES');
    this.$store.commit('guardarTitulo', 'Ventas > Vista Permitida');
    this.$store.commit('cuentas/cargar_VENTAS_VISTA', {inicio:this.fechaI, final:this.fechaF});
  },
  computed:{
    COLABORADORES(){
      return this.$store.state.col.COLABORADORES2;
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES;
    },
    VENTAS(){
      return this.$store.state.cuentas.VENTASVV;
    },
    LOAD_VENTAS(){
      return this.$store.state.cuentas.LOADCUENTAS;
    },
    LOAD_SUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES;
    },
    LOAD_COLABORADORES() {
      return this.$store.state.col.LOADCOLABORADORES;
    },
    VISTA:{
      get: function (){
        return this.$store.state.col.VISTA;
      },
      set: function (val){
        this.$store.commit('col/cambiar_VISTA', val);
      }
    }
  },
  methods:{
    abrirBusqueda(){
      this.$store.commit('suc/cargar_SUCURSALES');
      this.dialgoBA = true;
    },
    consultaBA(){
      this.dataBA = [];
      let sucursales = [];
      if (this.VENTAS.length){
        if (this.colaborador_id > 0 && this.sucursal_id > 0){
          sucursales = this.VENTAS.filter(item => item.sucursal_id === this.sucursal_id)
          sucursales.forEach(item=>{
            if (!item.usuarios)
              this.dataBA.push(item)
            else if (!item.usuarios.includes(this.colaborador_id))
              this.dataBA.push(item)
          })

          if (this.estado_id > 0)
            this.dataBA = this.dataBA.filter(item => item.estado === this.estado_id);

          this.resultados = this.dataBA.length
        }else
          this.$store.commit('notificacion',{color:'warning', texto:'No haz seleccionado una sucursal o colaborador'})
      }else
        this.$store.commit('notificacion',{color:'warning', texto:'Ni hay ninguna cuenta cargada'})
    },
    consultaCol(){
      let data = [];
      if (this.colaborador_id > 0){
        if (this.select.length > 0){
          this.select.forEach(item=>{
            if (!item.usuarios)
              this.dataBA.push(item)
            else if (!item.usuarios.includes(this.colaborador_id))
              this.dataBA.push(item)
          })

          if (this.dataBA.length > 0)
            this.registrarAsignacionBA(2);
          else
            this.$store.commit('notificacion',{color:'warning', texto:'Este calaborador no se le pueden asignar las ventas seleccionadas'})
        }else
          this.$store.commit('notificacion',{color:'warning', texto:'No hay cuentas seleccionadas'})
      }else
        this.$store.commit('notificacion',{color:'warning', texto:'No haz seleccionado un colaborador'})
    },
    goCuenta(data){
      this.$store.commit('cuentas/cargar_CUENTA', data.id);
      this.dataVenta = data;
      this.VISTA     = 2;
    },
    registrarAsignacionBA(tipo){
      this.$store.commit('activarOverlay', true);
      this.dialgoBA = false;
      this.dialogoCol = false;
      this.$axios.post('ventas/f/asignar_colaborador',{
        ventas: this.dataBA,
        col:    this.colaborador_id
      }).then((res)=>{
        this.$store.commit('cuentas/cargar_VENTAS_VISTA', {inicio:this.fechaI, final:this.fechaF})
        this.$store.commit('activarOverlay', false);
        this.showSelect = false
        this.select     = [];
        this.dataBA = [];
        this.resultados = 0;
        this.$store.commit('notificacion',{color:'success', texto:res.data.msj});
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        if (tipo === 1)
          this.dialgoBA = true;
        else if (tipo === 2)
          this.dialogoCol = true;

        this.$store.commit('notificacion',{color:'error', texto:'Hubo un error al registrar la asignación'});
      })
    }
  }
}
</script>

<style scoped>

</style>