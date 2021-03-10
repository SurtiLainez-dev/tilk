<template>
<v-card  :disabled="TRASLADO.estado !== 1">
  <v-toolbar flat color="grey lighten-5">
    <h6>Actualización del Traslado</h6>
  </v-toolbar>
  <v-form ref="FormMobActualizarTraslado">
    <v-row no-gutters>
      <v-col>
        <v-select dense label="Desición de Entrega" class="ma-2" :rules="rulesR"
                  :items="selectDecision" v-model="tras.decision"></v-select>
      </v-col>
      <v-col>
        <v-file-input v-model="Traslado.file_subido" label="Documento Firmado" class="ma-2"
                      v-if="TRASLADO.estado === 1"
                      dense counter :disabled="tras.decision === 2" :rules="rulesF"></v-file-input>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-text-field label="Observación" v-model="Traslado.observaciones" dense
                      class="ma-2" :disabled="tras.decision === 2"></v-text-field>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-card flat :disabled="tras.decision === 2">
      <v-simple-table dense class="rowsTable">
        <template v-slot:default>
          <thead>
          <tr>
            <th>#</th>
            <th>Serie del Sistema</th>
            <th>Nombre</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Sub-familía</th>
            <th>Estado</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in Traslado.mob_cuerpo_traslados">
            <td>{{i + 1}}</td>
            <td>{{item.mob_mobiliario.serie_s}}</td>
            <td>{{item.mob_mobiliario.nombre}}</td>
            <td>{{item.mob_mobiliario.mob_modelo.nombre}}</td>
            <td>{{item.mob_mobiliario.mob_modelo.mob_marca.nombre}}</td>
            <td>{{item.mob_mobiliario.mob_modelo.sub_f}}</td>
            <td>
              <v-select dense label="Fué Entregado" :items="selectEntregado" v-model="item.estado"></v-select>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" dark small tile @click="validarForm">Actualizar Traslado</v-btn>
    </v-card-actions>
  </v-form>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "actualizar",
  data(){
    return{
      Traslado: null,
      tras:{
        decision: 3
      },
      selectEntregado:[
        {text:'Sí', value: 1},
        {text:'No', value: 0},
      ],
      selectDecision:[
        {text:'Concretar Entrega', value: 3},
        {text:'Cancelar Entrega', value: 2},
      ],
      rulesR: [
        v => !!v || 'Este campo es requerido',
      ],
      rulesF: [
        v => (!!v && this.tras.decision === 3) || 'El documento es requerido',
      ],
    }
  },
  created() {
    this.$store.commit('activarOverlay', false);
    this.Traslado = this.TRASLADO
    this.Traslado.file_subido = null;
  },
  computed:{
    TRASLADO: {
      get: function (){
        return this.$store.state.mob.familias.TRASLADO;
      },
      set: function (data){
        this.$store.commit('mob/familias/asignar_TRASLADO', data)
      }
    }
  },
  methods:{
    actualiarTraslado(){
      this.$store.commit('activarOverlay', true);
      let data =new FormData();
      data.append('traslado_id', this.TRASLADO.id);
      data.append('cuerpo', JSON.stringify(this.Traslado.mob_cuerpo_traslados));
      data.append('decision', this.tras.decision);
      data.append('file', this.Traslado.file_subido);
      data.append('nueva_sucursal', this.TRASLADO.sucursal_destino);
      data.append('nuevo_col', this.TRASLADO.nuevo_col_responsable)

      this.$axios({
        method: 'post',
        url: 'mob/mobiliarios/actualizar',
        data:data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('mob/familias/cargar_TRASLADOS');
        this.TRASLADO.estado = this.tras.decision;
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
        this.TRASLADO.file_subido = res.data.dir;
        this.VISTA = 1;

        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 3500);
      }).catch((error)=>{
        if (error.response.status === 422)
          this.$store.commit('notificacion',{texto: error.response.data.error, color:'error'});
        else
          this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});

        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.tras.decision === 2)
        this.actualiarTraslado();
      else
        if (this.$refs.FormMobActualizarTraslado.validate())
          this.actualiarTraslado();
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
