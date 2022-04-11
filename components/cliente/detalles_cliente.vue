<template>
  <v-card flat>
    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <tbody>
        <tr v-for="item in Detalles">
          <td>{{item.detalle}}</td>
          <td v-if="item.select === 2">
            <v-text-field dense type="text" v-model="item.val"></v-text-field>
          </td>
          <td v-else-if="item.select === 1">
            <v-select v-model="item.val" :items="item.datos" dense>
            </v-select>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" class="text-white" :disabled="!permiso.includes(143)" small tile @click="enviarDetalles">Editar Detalles</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "detalles_cliente",
  props:{permiso:Array},
  computed:{
    CLIENTE: function (){
      get: {
        return this.$store.state.cliente.CLIENTE;
      }
    },
  },
  data(){
    return{
      Detalles: []
    }
  },
  created() {
    if (JSON.parse(this.CLIENTE.detalles))
      this.Detalles = JSON.parse(this.CLIENTE.detalles)
    else
      this.Detalles = [
        {detalle: 'Estado civil',             val:'', select: 1, datos:['Soletr@','Casad@', 'Unión libre']},
        {detalle: 'Nombre del conyugue',      val:'', select: 2, datos:[]},
        {detalle: 'Hijos',                    val:'', select: 1, datos:['Sí','No']},
        {detalle: 'Cantidad de hijos',        val:'', select: 2, datos:[]},
        {detalle: 'Cantidad de dependientes', val:'', select: 2, datos:[]},
        {detalle: 'Tipo de vivienda',         val:'', select: 1, datos:['Casa propia','Casa Familiar','Condiminio de apartamentos','apartamento','Guarderia']},
        {detalle: 'Otros ingresos',           val:'', select: 2, datos:[]},
        {detalle: 'Total de otros ingresos',  val:'', select: 2, datos:[]},
        {detalle: 'Contrato laboral',         val:'', select: 1, datos:['Sí','No']},
        {detalle: 'Tiempo laborando',         val:'', select: 2, datos:[]},
      ]
  },
  methods:{
    enviarDetalles(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('perfil_cliente/edit/detalles',{
        id: this.CLIENTE.id,
        detalles: JSON.stringify(this.Detalles)
      }).then((res)=>{
        this.CLIENTE.detalles = JSON.stringify(this.Detalles);
        this.notificacion(res.data.msj,'success')
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion('Hubo un error','error')
      })
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
