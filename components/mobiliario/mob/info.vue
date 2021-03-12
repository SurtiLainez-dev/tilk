<template>
  <v-card >
    <v-toolbar flat color="grey lighten-5">
      <h6>Información General</h6>
      <v-spacer></v-spacer>
      <v-btn color="indigo" dark small @click="dialogo = true" tile>Cambiar Estado</v-btn>
    </v-toolbar>

    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <tbody>
        <tr>
          <th>Sucursal Asignada</th>
          <td>
            <v-chip x-small color="success" v-if="MOBILIARIO.estado === 1" dark>Activo</v-chip>
            <v-chip x-small color="red" v-else-if="MOBILIARIO.estado === 2" dark>Fuera de Servicio</v-chip>
            <v-chip x-small color="indigo" v-else-if="MOBILIARIO.estado === 3" dark>Almacenado</v-chip>
            <v-chip x-small color="orange" v-else-if="MOBILIARIO.estado === 4" dark>Movimiento</v-chip>
            <v-chip x-small color="orange" v-else-if="MOBILIARIO.estado === 5" dark>Dañado</v-chip>
            <v-chip x-small color="orange" v-else-if="MOBILIARIO.estado === 6" dark>Mantenimiento</v-chip>
          </td>
        </tr>
        <tr>
          <th>Sucursal Asignada</th>
          <td>{{MOBILIARIO.sucursal.nombre}}</td>
        </tr>
        <tr>
          <th>Colaborador Responsable</th>
          <td>{{MOBILIARIO.colaborador.nombres}} {{MOBILIARIO.colaborador.apellidos}}</td>
        </tr>
        <tr>
          <th>Nombre</th>
          <td>{{MOBILIARIO.nombre}}</td>
        </tr>
        <tr>
          <th>Modelo</th>
          <td>{{MOBILIARIO.mob_modelo.nombre}}</td>
        </tr>
        <tr>
          <th>Marca</th>
          <td>{{MOBILIARIO.mob_modelo.mob_marca.nombre}}</td>
        </tr>
        <tr>
          <th>Familía</th>
          <td>{{MOBILIARIO.mob_modelo.mob_familia.nombre}}</td>
        </tr>
        <tr>
          <th>Sub-familía</th>
          <td>{{MOBILIARIO.mob_modelo.sub_f}}</td>
        </tr>
        <tr>
          <th>Serie del Sistema</th>
          <td>{{MOBILIARIO.serie_s}}</td>
        </tr>
        <tr>
          <th>Serie del Fabricante</th>
          <td>{{MOBILIARIO.serie_f}}</td>
        </tr>
        <tr>
          <th>Precio de Costo</th>
          <td>L {{MOBILIARIO.precio_costo}}</td>
        </tr>
        <tr>
          <th>Precio Actual</th>
          <td>L {{MOBILIARIO.precio_actual}}</td>
        </tr>
        <tr>
          <th>Es Depreciable</th>
          <td>
            <v-chip x-small dark color="indigo" v-if="MOBILIARIO.is_depreciacions === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_depreciacions === 0">No</v-chip>
          </td>
        </tr>
        <tr>
          <th>Es Pieza</th>
          <td>
            <v-chip x-small dark color="indigo" v-if="MOBILIARIO.is_pieza === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_pieza === 0">No</v-chip>
          </td>
        </tr>
        <tr>
          <th>Medida en Unidades</th>
          <td>
            <v-chip x-small dark color="indigo" v-if="MOBILIARIO.is_unidades === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_unidades === 0">No</v-chip>
          </td>
        </tr>
        <tr v-if="MOBILIARIO.is_unidades === 1">
          <th>Cantidad de Unidades</th>
          <td>{{MOBILIARIO.unidades}} {{MOBILIARIO.unidad}}</td>
        </tr>
        <tr>
          <th>Es Consumible</th>
          <td>
            <v-chip x-small dark color="indigo" v-if="MOBILIARIO.is_consumible === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_consumible === 0">No</v-chip>
          </td>
        </tr>
        <tr>
          <th>Etiquetas Hechas</th>
          <td>
            <v-chip x-small dark color="success" v-if="MOBILIARIO.is_etiquetas === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_etiquetas === 0">Sin Hacer</v-chip>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>


    <v-dialog v-model="dialogo" width="30%">
      <v-card >
        <v-toolbar flat color="grey lighten-4">
          <h6>Cambiando Estado del Mobiliario</h6>
        </v-toolbar>

        <v-form ref="FormMobCambioEstado" v-on:submit.prevent class="pl-5 pr-5 pt-2">
          <v-select dense class="ma-2" :items="selectEstado" label="Seleccione un nuevo Estado"
                    v-model="estado.estado" :rules="rulesEstado">
          </v-select>
          <v-textarea dense label="Observación del Cambio de Estado" v-model="estado.observacion"
                      class="ma-2" :rules="rulesRequired">
                      </v-textarea>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn small dark color="orange" tile @click="dialogo = false">Cerrar</v-btn>
          <v-btn small dark color="success" @click="validarForm" tile>Registrar Cambio</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "info",
  data(){
    return{
      rulesRequired:[
        v => !!v || 'Este campo es requerido',
        v =>  v.length > 10 || 'Tiene que ser mayor a 10 carácteres'
      ],
      rulesEstado:[
        v => !!v || 'Este campo es requerido',
        v => v !== this.MOBILIARIO.estado || 'Tiene que ser diferente al estado actual'
      ],
      estado:{
        estado: 0,
        observacion: ''
      },
      dialogo: false,
      selectEstado:[
        {text:'Activo',            value: 1},
        {text:'Fuera de Servicio', value: 2},
        {text:'Almacenado',        value: 3},
        {text:'Movimiento',        value: 4},
        {text:'Dañado',            value: 5},
        {text:'Mantenimiento',     value: 6},
      ]
    }
  },
  methods:{
    registrarCambioEstado(){
      this.$store.commit('activarOverlay', true);
      this.dialogo = false;
      this.$axios.put('mob/mobiliarios/estado/'+this.MOBILIARIO.id,{
        estado:      this.estado.estado,
        observacion: this.estado.observacion
      }).then((res)=>{
        this.MOBILIARIO.estado    = this.estado.estado;
        this.MOBILIARIO.historial = res.data.histo;
        this.$store.commit('mob/familias/cargar_MOBILIARIOS');
        this.$store.commit('notificacion',{texto:res.data.msj,color:'success'});
        this.estado.estado = 0;
        this.estado.observacion = ''
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 2000);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor',color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormMobCambioEstado.validate())
        this.registrarCambioEstado();
    }
  },
  computed:{
    MOBILIARIO:{
      get: function (){
        return this.$store.state.mob.familias.MOBILIARIO;
      },
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
