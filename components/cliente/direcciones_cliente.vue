<template>
  <v-card flat>
    <v-container fluid>

      <v-data-iterator :items="Direcciones" :page="page"
                       :items-per-page.sync="itemsPerPage" hide-default-footer>

        <template v-slot:default="props">
          <v-row>
            <v-col v-for="item in props.items" :key="item.name"
                cols="12" sm="6" md="4" lg="4">
              <v-card class="rowsTable">
                <v-row no-gutters>
                  <v-col class="pa-2 d-flex align-center" cols="8">
                    <h6 class="subheading font-weight-bold">
                      Dirección {{ (parseInt(item.key) + 1) }}
                    </h6>
                  </v-col>
                  <v-col cols="4" class="pa-2">
                    <v-btn fab x-small color="orange" class="text-white" tile  @click="habilitarBtnEnvio = true"
                           :disabled="longDirecciones <= item.key">
                      <v-icon>fa fa-edit</v-icon>
                    </v-btn>
                    <v-btn fab x-small color="red" class="text-white" @click="removeDireccion(item.key)"
                           tile :disabled="item.key < longDirecciones">
                      <v-icon>fa fa-times</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-container>
                  <v-form :ref="'FormDireccionescliente'">
                    <v-select :items="DEPARTAMENTOS" v-model="item.departamento"
                              label="Departamento" :rules="[rules.select.req]" dense
                              @change="cargarMunicipio(item)" :disabled="item.key < longDirecciones"
                              :item-text="'nombre'" :item-value="'id'">
                    </v-select>
                    <v-autocomplete :items="item.Municipios" v-model="item.municipio"
                                    :disabled="item.key < longDirecciones" :rules="[rules.select.req]"
                                    label="Municipio" @change="cargarCiudades(item)" dense
                                    :item-text="'nombre'" :item-value="'id'">
                    </v-autocomplete>
                    <v-autocomplete :items="item.Ciudades" v-model="item.ciudad"
                                    :disabled="item.key < longDirecciones" :rules="[rules.select.req]"
                                    label="Ciudad/Aldea/Caserio" @change="cargarColonias(item)" dense
                                    :item-text="'nombres'" :item-value="'id'">
                    </v-autocomplete>

                    <v-autocomplete :items="item.Colonias" :rules="[rules.select.req]"
                                    v-model="item.colonia" label="Colonia"
                                    :disabled="item.key < longDirecciones" dense
                                    :item-text="'nombre'" :item-value="'id'">
                    </v-autocomplete>
                    <v-textarea v-model="item.detalle" counter
                                :rules="[rules.select.req, rules.detalle.min, rules.detalle.max]"
                                label="Detalle,Colonia,Ciudad,Departamento"></v-textarea>
                  </v-form>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Cantidad de direcciones por página</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn dark text color="primary"
                    class="ml-2" v-bind="attrs" v-on="on">
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                    v-for="(number, index) in itemsPerPageArray"
                    :key="index"
                    @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <span class="mr-4grey--text">Página {{ page }} de {{ numberOfPages }}</span>
            <v-btn fab dark color="blue darken-3" x-small
                   class="mr-1" @click="formerPage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab dark color="blue darken-3" x-small
                class="ml-1" @click="nextPage" >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>

      </v-data-iterator>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="indigo" small tile dark @click="addDirecciones">
          <v-icon left>fa fa-plus</v-icon>
          Agregar Dirección
        </v-btn>
        <v-btn color="success" small :disabled="!habilitarBtnEnvio" @click="validarDirecciones"
               tile class="text-white">Guardar Direcciones</v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "direcciones_cliente",
  computed:{
    numberOfPages () {
      return Math.ceil(this.Direcciones.length / this.itemsPerPage)
    },
    CLIENTE: function (){
      get: {
        return this.$store.state.cliente.CLIENTE;
      }
    },
    DEPARTAMENTOS(){
      return this.$store.state.direcciones.DEPARTAMENTOS;
    },
    MUNICIPIOS(){
      return this.$store.state.direcciones.MUNICIPIOS;
    },
    DISTRITOS(){
      return this.$store.state.direcciones.DISTRITOS;
    },
    COLONIAS(){
      return this.$store.state.direcciones.COLONIAS;
    }
  },
  data(){
    return{
      Direcciones: [],
      longDirecciones: 0,
      itemsPerPage: 3,
      page: 1,
      itemsPerPageArray: [3, 6],
      habilitarBtnEnvio: false,
      rules: {
        select: {
          req: v => !!v || 'Campo requerido',
        },
        detalle:{
          min: v => (v && v.length >= 40) || 'Tiene que ser mayor a 40 carácteres.',
          max: v => (v && v.length <= 250) || 'Tiene que ser menor o igual a 250 carácteres.',
        }
      }
    }
  },
  created() {
    if (JSON.parse(this.CLIENTE.direcciones)) {
      this.Direcciones = JSON.parse(this.CLIENTE.direcciones);
      this.longDirecciones = this.Direcciones.length;
      this.distribuirDirecciones();
    }else{
      this.longDirecciones = 0
    }
  },
  methods:{
    addDirecciones(){
      this.Direcciones.push({
        key: this.Direcciones.length,
        ciudad:       0,
        colonia:      0,
        detalle:      'Detalle/Colonia/Ciudad/Departamento',
        departamento: 0,
        Municipios:   null,
        Colonias:     null,
        Ciudades:     null,
      })
      this.habilitarBtnEnvio = true;
    },
    cargarCiudades(data){
      console.log(data.municipio)
      data.Ciudades = this.DISTRITOS.filter(muni => muni.municipio_id === data.municipio);
    },
    cargarColonias(data){
      data.Colonias = this.COLONIAS.filter(ciudad => ciudad.ciudade_id === data.ciudad)
    },
    cargarMunicipio(data){
      data.Municipios = this.MUNICIPIOS.filter(depto => depto.departamento_id === data.departamento);
    },
    distribuirDirecciones(){
      this.Direcciones.forEach((i)=>{
        this.cargarMunicipio(i);
        this.cargarCiudades(i);
        this.cargarColonias(i);
      })
    },
    enviarDirecciones(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('perfil_cliente/edit/direcciones',{
        id: this.CLIENTE.id,
        direcciones: JSON.stringify(this.Direcciones)
      }).then((res)=>{
        this.habilitarBtnEnvio   = false;
        this.CLIENTE.direcciones = JSON.stringify(this.Direcciones);
        this.longDirecciones     = this.Direcciones.length;
        this.$store.commit('activarOverlay', false);
        this.notificacion(res.data.msj, 'success');
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion('Ocurrio un error','error');
      })
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    removeDireccion(key){
      let item = 0;
      this.Direcciones.splice(key, 1);
      this.Direcciones.forEach( (i) => {
        i.key = item;
        item++;
      })
      if (this.longDirecciones >= this.Direcciones.length)
        this.habilitarBtnEnvio = false;
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    validarDirecciones(){
      let bandera = 0;
      this.Direcciones.forEach( (i, cont) =>{
        if (!this.$refs.FormDireccionescliente[cont].validate())
          bandera++
      })

      if (bandera === 0)
        this.enviarDirecciones();
      else
        this.notificacion('Hacen falta datos en las direcciones','error');

    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
