<template>
<v-card>
<v-toolbar flat color="grey lighten-3">
  <h5>Uso del Mobiliario</h5>
  <v-spacer></v-spacer>
  <v-btn small color="indigo" @click="dialogoNuevo = true" dark tile>Nueva Salida</v-btn>
</v-toolbar>


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
                              v-model="uso.sucursal" @change="cargarMob"
                              :loading="loadSucursales" :item-value="'id'" :items="Sucursales">
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete label="Colaborador Responsable" dense v-model="uso.colaborador_id"
                              :loading="loadColaboradores" :items="Colaboradores">
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete label="Mantenimiento" disabled v-model="uso.mantenimiento_id" dense></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-text-field label="Estado" dense value="Iniciado" disabled></v-text-field>
            </v-col>
          </v-row>

          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>Mobiliario</th>
                <th>Es Consumible</th>
                <th>Cantidad Actual</th>
                <th>Quitar</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, i) in uso.Cuerpo">
                <td>
                  <v-autocomplete dense :items="Mobs"
                                  v-model="item.data" @change="esConsumible(item)"></v-autocomplete>
                </td>
                <td>
                  <v-select dense v-model="item.is_consumible" disabled
                            :items="selectConsumibles"></v-select>
                </td>
                <td>
                  <v-text-field dense disabled v-model="item.unidad_actual"></v-text-field>
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
      </v-card>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
export default {
  name: "usos",
  data(){
    return{
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
      ]
    }
  },
  methods:{
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
    cargarMob(){
      this.Mobs = this.Mobiliarios.filter( i => i.sucursal_id === this.uso.sucursal);
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
    removeFila(key){
      this.uso.Cuerpo.splice(key, 1);
      this.uso.Cuerpo.forEach((i,cont)=>{
        i.key = cont;
      })
    }
  },
  computed:{
    MOBILIARIOS(){
      let Mobiliarios = [];
      this.$store.state.mob.familias.MOBILIARIOS.forEach((i)=>{
        Mobiliarios.push({
          text: i.nombre+' - '+i.mob_modelo.mob_marca.nombre+' - '+i.mob_modelo.nombre,
          value:   i.id+'--'+i.is_consumible+'--'+i.unidades,
          sucursal_id: i.sucursal_id,
        })
      });
      return Mobiliarios;
    },
    LOAD_MOBILIARIOS(){
      return this.$store.state.mob.familias.LOADMIBILIARIOS;
    },
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Mobiliario > Uso de Mobiliario');
    this.cargarSucursales();
    this.cargarColaboradores();
    this.$store.commit('activarOverlay', false);
    this.$store.commit('mob/familias/cargar_MOBILIARIOS');
    this.Mobiliarios = this.MOBILIARIOS;
  }
}
</script>

<style scoped>

</style>
