<template>
<v-card>
  <v-toolbar flat color="grey lighten-3">
    <h5>Mantenimientos a Mobiliarios</h5>
    <v-spacer></v-spacer>
    <v-btn color="indigo" @click="dialogoNuevo = true" dark tile small>Programar Mantenimiento</v-btn>
  </v-toolbar>

  <v-data-table dense
                class="rowsTable"
                :items="MANTENIMIENTOS"
                @click:row="abrirDialogoInfo"
                :loading="LOAD_MANTENIMIENTOS"
                loading-text="Cargando Mantenimientos ..."
                :headers="header">
    <template v-slot:item.colaborador.nombres="{item}">
      {{item.colaborador.nombres}} {{item.colaborador.apellidos}}
    </template>
    <template v-slot:item.estado="{item}">
      <v-chip x-small dark color="orange" v-if="item.estado === 1">Pendiente</v-chip>
      <v-chip x-small dark color="success" v-else-if="item.estado === 2">Realizado</v-chip>
      <v-chip x-small dark color="error" v-else-if="item.estado === 3">Vencida</v-chip>
      <v-chip x-small dark color="indigo" v-else-if="item.estado === 4">Cancelada</v-chip>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogoNuevo" width="35%">
    <v-card>
      <v-toolbar flat color="grey lighten-5">
        <h6>Programando Nuevo Mantenimiento</h6>
      </v-toolbar>
      <v-container>
        <v-form ref="FormMobMantenimiento">
          <v-autocomplete dense :items="MOBILIARIOS" :loading="LOAD_MOBILIARIOS"
                          label="Seleccione un Mobiliario" v-model="mantenimiento.mobiliario"
                          class="ma-2" :rules="rulesRequired">
          </v-autocomplete>
          <v-autocomplete dense :items="Colaboradores" v-model="mantenimiento.colaborador"  class="ma-2"
                          label="Seleccione Colaborador Responsable del Mantenimiento" :rules="rulesRequired">
          </v-autocomplete>
          <v-text-field   dense label="Motivo" counter :rules="rulesMotivo" class="ma-2"
                          v-model="mantenimiento.motivo"></v-text-field>
          <v-menu v-model="menuFecha2" :nudge-right="40" offset-y min-width="auto"
                  :close-on-content-click="false" transition="scale-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="mantenimiento.fecha" class="ma-2"
                            :rules="rulesRequired" dense
                            label="Fecha de Programada" v-bind="attrs" v-on="on">
              </v-text-field>
            </template>
            <v-date-picker
                v-model="mantenimiento.fecha"
                @input="menuFecha2 = false"></v-date-picker>
          </v-menu>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark tile small @click="dialogoNuevo = false">Cerrar</v-btn>
          <v-btn color="success" dark tile small @click="validarForm">Registrar</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoInfo" width="50%">
    <v-card v-if="data">
      <v-toolbar color="grey lighten-4" flat>
        <h6>Ficha del Mantenimiento {{data.cod}}</h6>
      </v-toolbar>

      <v-container>
        <v-form ref="FormMobMantenimientoDes">
          <v-alert v-if="data.estado === 1" dense color="orange" dark>Este mantenimiento está sin cerrar</v-alert>
          <v-text-field label="Colaborador Responsable del Mantenimiento" dense disabled class="ma-2"
                        :value="data.colaborador.nombres+' '+data.colaborador.apellidos"></v-text-field>
          <v-text-field label="Motivo del Mantenimiento" dense disabled class="ma-2"
                        :value="data.motivo"></v-text-field>
          <v-row no-gutters>
            <v-col>
              <v-text-field label="Código Mantenimiento" dense disabled class="ma-2"
                            :value="data.cod"></v-text-field>
            </v-col>
            <v-col>
              <v-select dense label="Estado del Matenimiento" :items="selectEstado" :disabled="data.estado !== 1"
                        class="ma-2" v-model="mantenimiento.estado" :rules="rulesRequired"></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-menu v-model="menuFecha" :nudge-right="35" offset-y min-width="auto"
                      :close-on-content-click="false" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="data.fecha_programada" class="ma-2"
                                :rules="rulesRequired" dense disabled
                                label="Fecha de Programada" v-bind="attrs" v-on="on">
                  </v-text-field>
                </template>
                <v-date-picker
                    v-model="data.fecha_programada"
                    @input="menuFecha = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu v-model="menuF" :nudge-right="35" offset-y min-width="auto"
                      :close-on-content-click="false" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="data.fecha_realizado" class="ma-2"
                                :rules="rulesRequired" dense :disabled="data.estado !== 1"
                                label="Fecha Realizado" v-bind="attrs" v-on="on">
                  </v-text-field>
                </template>
                <v-date-picker
                    v-model="data.fecha_realizado"
                    @input="menuF = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="9">
              <v-text-field label="Mobiliario" dense disabled class="ma-2"
                            :value="data.mob_mobiliario.nombre"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field label="Serie del Mobiliario" dense disabled class="ma-2"
                            :value="data.mob_mobiliario.serie_s"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-text-field label="Modelo del Mobiliario" dense disabled class="ma-2"
                            :value="data.mob_mobiliario.mob_modelo.nombre"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Marca del Mobiliario" dense disabled class="ma-2"
                            :value="data.mob_mobiliario.mob_modelo.mob_marca.nombre"></v-text-field>
            </v-col>
          </v-row>
          <v-textarea dense  label="Observación Sobre el Mantenimiento"
                      counter class="ma-2" :disabled="data.estado !== 1"
                      v-model="data.observacion" :rules="rulesObs"></v-textarea>
        </v-form>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="orange" small dark @click="dialogoInfo = false">Cerrar</v-btn>
        <v-btn color="success" v-if="data.estado === 1" small dark @click="validarFormCierre">Registrar Cierre</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
export default {
  name: "mantenimientos",
  data(){
    return{
      menuFecha: false,
      menuFecha2: false,
      menuF:     false,
      dialogoNuevo: false,
      rulesRequired:[
        v => !!v || 'Este campo es requerido',
      ],
      rulesMotivo: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length >= 7) || 'Tiene que ser mayor a 7 carácteres',
        v => (v && v.length <= 100) || 'Tiene que ser menor o igual a 100 carácteres'
      ],
      rulesObs: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres',
        v => (v && v.length <= 255) || 'Tiene que ser menor o igual a 255 carácteres'
      ],
      mantenimiento:{
        colaborador: '',
        mobiliario:  '',
        motivo:      '',
        fecha:       '',
        estado:      null
      },
      loadColaboradores: false,
      Colaboradores:     [],
      header:[
        {text:'Código', value:'cod'},
        {text:'Colaborador Responsable', value:'colaborador.nombres'},
        {text:'Mobiliario', value:'mob_mobiliario.nombre'},
        {text:'Seríe del Sistema', value:'mob_mobiliario.serie_s'},
        {text:'Modelo', value:'mob_mobiliario.mob_modelo.nombre'},
        {text:'Marca', value:'mob_mobiliario.mob_modelo.mob_marca.nombre'},
        {text:'Estado', value:'estado'},
      ],
      data: null,
      dialogoInfo: false,
      selectEstado:[
        {text: 'Pendiente', value: 1},
        {text: 'Realizado', value: 2},
        {text: 'Vencido', value: 3},
        {text: 'Cancelado', value: 4},
      ]
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Mobiliario > Mantenimientos ');
    this.$store.commit('mob/familias/cargar_MANTENIMIENTOS');
    this.$store.commit('mob/familias/cargar_MOBILIARIOS');
    this.cargarColaboradores();
  },
  computed:{
    MANTENIMIENTOS(){
      return this.$store.state.mob.familias.MANTENIMIENTOS;
    },
    MOBILIARIOS(){
      let Mobiliarios = [];
      this.$store.state.mob.familias.MOBILIARIOS.forEach((i)=>{
        Mobiliarios.push({
          text: i.nombre+' - '+i.mob_modelo.mob_marca.nombre+' - '+i.mob_modelo.nombre+' - '+i.serie_s,
          value:   i.id
        })
      });
      return Mobiliarios;
    },
    LOAD_MANTENIMIENTOS(){
      return this.$store.state.mob.familias.LOADMANTENIMIENTOS;
    },
    LOAD_MOBILIARIOS(){
      return this.$store.state.mob.familias.LOADMIBILIARIOS;
    }
  },
  methods:{
    abrirDialogoInfo(data){
      this.data                 = data;
      this.mantenimiento.estado = data.estado
      this.dialogoInfo          = true;
    },
    cargarColaboradores(){
      this.loadColaboradores = true;
      this.$axios.get('colaboradores_2').then((res)=>{
        res.data.colaboradores.forEach((i)=>{
          this.Colaboradores.push({
            text:  i.nombres+' '+i.apellidos,
            value: i.id
          })
        })
        this.loadColaboradores = false;
      })
    },
    registrarCierre(){
      this.$store.commit('activarOverlay', true);
      this.dialogoInfo = false;

      this.$axios.put('mob/mobiliarios/mantenimientos/'+this.data.id,{
        observacion: this.data.observacion,
        mob_id:      this.data.mob_mobiliario_id,
        estado:      this.mantenimiento.estado
      }).then((res)=>{
        this.data.estado = this.mantenimiento.estado;
        this.dialogoInfo = true;
        this.$store.commit('notificacion',{texto:res.data.msj,color:'success'});
        this.$store.commit('mob/familias/cargar_MANTENIMIENTOS');
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        },3500);
      }).catch((error)=>{
        this.dialogoInfo = true;
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor',color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    registrarMantenimiento(){
      this.$store.commit('activarOverlay', true);
      this.dialogoNuevo = false;

      this.$axios.post('mob/mobiliarios/mantenimientos',{
        mobiliario_id: this.mantenimiento.mobiliario,
        fecha:         this.mantenimiento.fecha,
        colaborador:   this.mantenimiento.colaborador,
        motivo:        this.mantenimiento.motivo
      }).then((res)=>{
        this.$store.commit('mob/familias/cargar_MANTENIMIENTOS');
        this.$store.commit('notificacion',{texto:res.data.msj,color:'success'});
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        },3500);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor',color:'error'});
        this.dialogoNuevo = false;
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormMobMantenimiento.validate())
        this.registrarMantenimiento();
    },
    validarFormCierre(){
      if (this.$refs.FormMobMantenimientoDes.validate())
        this.registrarCierre();
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
