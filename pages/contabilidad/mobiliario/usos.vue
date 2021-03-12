<template>
<v-card>
  <v-toolbar flat color="grey lighten-3">
    <h5>Uso del Mobiliario</h5>
    <v-spacer></v-spacer>
    <v-btn small color="indigo" @click="abrirDilogoNuevo" dark tile>Nueva Salida</v-btn>
  </v-toolbar>

  <v-data-table class="rowsTable"
                :headers="header"
                :loading="LOAD_USOS"
                :items="USOS"
                loading-text="Carganfo Usos del Mobiliario"
                dense>
    <template v-slot:item.colaborador.nombres="{item}">
      {{item.colaborador.nombres}} {{item.colaborador.apellidos}}
    </template>
    <template v-slot:item.estado="{item}">
      <v-chip x-small dark color="orange" v-if="item.estado === 1">Abierta</v-chip>
      <v-chip x-small dark color="success" v-else-if="item.estado === 2">Cerrada</v-chip>
      <v-chip x-small dark color="red" v-else-if="item.estado === 3">Cancelada</v-chip>
    </template>
    <template v-slot:item.id="{item}">
      <v-btn fab tile x-small dark width="25" height="25" @click="asignarData(item)" color="indigo">
        <v-icon>fa fa-eye</v-icon>
      </v-btn>
    </template>
  </v-data-table>


  <v-dialog v-model="dialogoInfo" width="90%">
    <v-card v-if="data">
      <v-toolbar color="grey lighten-4" flat>
        <h6>Detalles de Uso #{{data.cod}}</h6>
        <v-spacer></v-spacer>
        <v-chip x-small dark color="orange" v-if="data.estado === 1">Abierta</v-chip>
        <v-chip x-small dark color="success" v-else-if="data.estado === 2">Cerrada</v-chip>
        <v-chip x-small dark color="red" v-else-if="data.estado === 3">Cancelada</v-chip>
      </v-toolbar>

      <v-container>
        <v-form ref="FormMobCierreUso">
          <v-alert v-if="data.estado === 1" dense color="orange" dark>Tienes que cerrar este uso de mobiliario</v-alert>
          <v-row no-gutters>
            <b-link @click="verDocumento(data.file)">Ver Documento Generado</b-link>
          </v-row>
          <v-row no-gutters v-if="data.estado !== 1">
            <b-link @click="verDocumento(data.file_subido)">Ver Documento Súbido</b-link>
          </v-row>
          <br>
          <v-row no-gutters>
            <v-col>
              <v-text-field class="ma-2" dense label="Código" v-model="data.cod" disabled></v-text-field>
            </v-col>
            <v-col>
              <v-text-field dense label="Colaborador Responsable" :value="data.colaborador.nombres+' '+data.colaborador.apellidos"
                            disabled class="ma-2"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field dense label="Usuario Responsable" :value="data.user.usuario"
                            disabled class="ma-2"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-text-field class="ma-2" dense label="Observación" disabled v-model="data.observacion"></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="data.estado === 1">
            <v-file-input dense label="Documento Firmado" :rules="rulesRequired"
                          v-model="data.file_subido"></v-file-input>
          </v-row>
        </v-form>

        <v-simple-table class="rowsTable" dense>
          <template v-slot:default>
            <thead>
            <tr>
              <td>#</td>
              <td>Nombre del mobiliario</td>
              <td>Modelo</td>
              <td>Marca</td>
              <td>Serie del Sistema</td>
              <td>Cant. Salida</td>
              <td>Cant. Gastada</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in data.mob_cuerpo_usos">
              <td>{{i + 1}}</td>
              <td>{{item.mob_mobiliario.nombre}}</td>
              <td>{{item.mob_mobiliario.mob_modelo.nombre}}</td>
              <td>{{item.mob_mobiliario.mob_modelo.mob_marca.nombre}}</td>
              <td>{{item.mob_mobiliario.serie_s}}</td>
              <td>{{item.cantidad_salida}} <span v-if="item.mob_mobiliario.is_unidades === 1">{{item.mob_mobiliario.unidad}}</span></td>
              <td>
                <v-text-field dense v-model="item.cantidad_entrada" :disabled="data.estado !== 1"
                              placeholder="Cantidad de Gastada"></v-text-field>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="orange" dark small tile @click="dialogoInfo = false">Cerrar</v-btn>
        <v-btn color="red" dark small tile @click="validarFormCierre(3)" v-if="data.estado === 1">Cancelar Uso</v-btn>
        <v-btn color="success" dark small tile @click="validarFormCierre(2)" v-if="data.estado === 1">Cerrar Uso</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogoNuevo" width="90%">
    <v-card>
      <v-toolbar color="grey lighten-4">
        <h6>Nueva Salida</h6>
        <v-spacer></v-spacer>
        <v-btn color="indigo" small @click="addMobiliario" tile dark>Agregar Mobiliario</v-btn>
      </v-toolbar>
      <v-card flat class="pl-5 pr-5 pb-5 pt-5">
        <v-form ref="FormMobNuevoUso">
          <v-row>
            <v-col>
              <v-autocomplete label="Sucursal de Salida" dense :item-text="'nombre'"
                              v-model="uso.sucursal" @change="cargarMob" :rules="rulesRequired"
                              :loading="loadSucursales" :item-value="'id'" :items="Sucursales">
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete label="Colaborador Responsable" dense v-model="uso.colaborador_id"
                              :loading="loadColaboradores" :items="Colaboradores" :rules="rulesRequired">
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete label="Mantenimiento" :items="Mantenimientos" :loading="loadMantenimientos"
                              v-model="uso.mantenimiento_id" dense></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-text-field label="Estado" dense value="Iniciado" disabled></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field label="Observación" dense :rules="rulesRequired"
                            v-model="uso.observacion">
              </v-text-field>
            </v-col>
          </v-row>

          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>Mobiliario</th>
                <th>Es Consumible</th>
                <th>Cantidad Salida</th>
                <th>Quitar</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, i) in uso.Cuerpo">
                <td>
                  <v-autocomplete dense :items="Mobiliarios"
                                  v-model="item.data" @change="esConsumible(item)"></v-autocomplete>
                </td>
                <td>
                  <v-select dense v-model="item.is_consumible" disabled
                            :items="selectConsumibles"></v-select>
                </td>
                <td>
                  <v-text-field dense v-model="item.unidad_actual"></v-text-field>
                </td>
                <td>
                  <v-btn fab tile color="red" dark width="25px" height="25px">
                    <v-icon>fa fa-times</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" small dark tile @click="dialogoNuevo = false">Cerrar</v-btn>
          <v-btn color="success" small dark tile @click="validarForm">Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "usos",
  data(){
    return{
      loadMantenimientos: false,
      Mantenimientos: [],
      data: null,
      rulesRequired:[
        v => !!v || 'Este campo es requerido',
      ],
      Mobiliarios:  [],
      Mobs:         [],
      loadMobiliarios: false,
      dialogoNuevo: false,
      dialogoInfo:  false,
      Colaboradores: [],
      loadColaboradores: false,
      uso:{
        colaborador_id: '',
        mantenimiento_id: null,
        observacion: '',
        Cuerpo:[],
        sucursal: null
      },
      loadSucursales: false,
      Sucursales:     [],
      selectConsumibles:[
        {text:'Es consumible', value: 1},
        {text:'No es consumible', value: 0},
      ],
      header:[
        {text:'Código',value:'cod'},
        {text:'Usuario',value:'user.usuario'},
        {text:'Colaborador',value:'colaborador.nombres'},
        {text:'Estado',value:'estado'},
        {text:'Ver',value:'id'},
      ]
    }
  },
  methods:{
    abrirDilogoNuevo(){
      this.uso.Cuerpo   = [];
      this.dialogoNuevo = true;
    },
    addMobiliario(){
      this.uso.Cuerpo.push({
        id:             '',
        mobiliario:     '',
        key:            this.uso.Cuerpo.length,
        cantidadSalida: 0,
        is_consumible:  0,
        data:           null,
        unidad_actual:  0
      })
    },
    asignarData(data){
      this.data        = data;
      this.dialogoInfo = true;
    },
    cargarColaboradores(){
      this.loadColaboradores = true;
      this.$axios.get('colaboradores_2').then((res)=>{
        res.data.colaboradores.forEach((i)=>{
          this.Colaboradores.push({
            text:  i.nombres+' '+i.apellidos,
            value: i.id,
          })
        })
        this.loadColaboradores = false;
      })
    },
    cargarMantenimientos(){
      this.loadMantenimientos = true;
      this.$axios.get('mob/mobiliarios/mantenimientos/pendientes').then((res)=>{
        res.data.mantenimientos.forEach((i)=>{
          this.Mantenimientos.push({
            text:  i.cod+' - '+i.mob_mobiliario.nombre+ ' - '+i.mob_mobiliario.serie_s,
            value: i.id,
          })
        })
        this.loadMantenimientos = false;
      })
    },
    cargarMob(){
      this.Mobiliarios = this.MOBILIARIOS.filter( i => i.sucursal_id === this.uso.sucursal);
    },
    cargarSucursales(){
      this.loadSucursales = true;
      this.$axios.get('sucursales').then((res)=>{
        this.Sucursales     = res.data.suc;
        this.loadSucursales = false
      })
    },
    esConsumible(data){
      console.log(data)
      data.is_consumible = parseInt(data.data.split('--')[1]);
      data.id            = parseInt(data.data.split('--')[0]);
      data.unidad_actual = parseFloat(data.data.split('--')[2])
    },
    registrarCierre(tipo){
      this.$store.commit('activarOverlay', true);
      let data =new FormData();
      data.append('id',     this.data.id);
      data.append('cuerpo', JSON.stringify(this.data.mob_cuerpo_usos));
      data.append('tipo',   tipo);
      data.append('file', this.data.file_subido);
      this.dialogoInfo = false;
      this.$axios({
        method: 'post',
        url:    'mob/mobiliarios/usos/cierre',
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('mob/familias/cargar_MOBILIARIOS');
        this.$store.commit('notificacion',{texto:res.data.msj,color:'success'});
        this.$store.commit('mob/familias/cargar_USOS');
        this.data.estado = tipo;
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 3500)
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor',color:'error'});
        this.dialogoInfo = true;
        this.$store.commit('activarOverlay', false);
      })
    },
    registrarUso(){
      this.$store.commit('activarOverlay', true);
      this.dialogoNuevo         = false;
      this.$axios.post('mob/mobiliarios/usos',{
        colaborador_id:   this.uso.colaborador_id,
        mantenimiento_id: this.uso.mantenimiento_id,
        observacion:      this.uso.observacion,
        cuerpo:           this.uso.Cuerpo
      }).then((res)=>{
        this.$store.commit('mob/familias/cargar_USOS');
        this.uso.colaborador_id   = '';
        this.uso.sucursal         = '';
        this.uso.mantenimiento_id = '';
        this.uso.observacion      = '';
        this.uso.Cuerpo           = [];
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        },3500);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
        this.dialogoNuevo         = true;
      })
    },
    removeFila(key){
      this.uso.Cuerpo.splice(key, 1);
      this.uso.Cuerpo.forEach((i,cont)=>{
        i.key = cont;
      })
    },
    validarForm(){
      if (this.uso.Cuerpo.length > 0){
        if (this.$refs.FormMobNuevoUso.validate())
          this.registrarUso();
        else
          this.$store.commit('notificacion',{texto:'Hace falta llenar campos',color:'error'});
      }else{
        this.$store.commit('notificacion',{texto:'Tienes que elegir un mobiliario como mínimo', color:'warning'})
      }
    },
    validarFormCierre(tipo){
      if (tipo === 2){
        if (this.$refs.FormMobCierreUso.validate()) {
          let long = this.data.mob_cuerpo_usos.length;
          let cont = 0;
          this.data.mob_cuerpo_usos.forEach((i) => {
            if (i.cantidad_entrada)
              cont++
          })
        if (long === cont)
          this.registrarCierre(tipo);
        else
          this.$store.commit('notificacion',{texto:'No puedes dejar campos vacios',color:'warning'});
        }else
          this.$store.commit('notificacion',{texto:'No se ha subido el documento firmado',color:'warning'});
      }else{
        this.registrarCierre(tipo)
      }
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.dialogoInfo = false;
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
          this.dialogoInfo = true;
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
        this.dialogoInfo = true;

      })
    }
  },
  computed:{
    MOBILIARIOS(){
      let Mobiliarios = [];
      this.$store.state.mob.familias.MOBILIARIOS.forEach((i)=>{
        Mobiliarios.push({
          text: i.nombre+' - '+i.mob_modelo.mob_marca.nombre+' - '+i.mob_modelo.nombre+' - '+i.serie_s,
          value:   i.id+'--'+i.is_consumible+'--'+i.unidades,
          sucursal_id: i.sucursal_id,
        })
      });
      return Mobiliarios;
    },
    LOAD_MOBILIARIOS(){
      return this.$store.state.mob.familias.LOADMIBILIARIOS;
    },
    LOAD_USOS(){
      return this.$store.state.mob.familias.LOADUSOS;
    },
    USOS(){
      return this.$store.state.mob.familias.USOS;
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Mobiliario > Uso de Mobiliario');
    this.$store.commit('mob/familias/cargar_USOS');
    this.cargarSucursales();
    this.cargarColaboradores();
    this.cargarMantenimientos();
    this.$store.commit('activarOverlay', false);
    this.$store.commit('mob/familias/cargar_MOBILIARIOS');
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
