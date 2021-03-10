<template>
<v-card>
  <v-toolbar color="grey lighten-5">
    <h6>Crear Nuevo Modelo de Mobiliario</h6>
  </v-toolbar>
  <v-form ref="FormModModelo" class="ma-5">
    <v-row no-gutters>
      <v-col>
        <v-autocomplete dense label="Familía" :items="FAMILIAS" v-model="mod.familia_id"
                        class="ma-2" :loading="LOAD_FAMILIAS" loader-height="3" :rules="rulesRequired"
                        :item-text="'nombre'" :item-value="'id'" @change="cambiarSubs">
        </v-autocomplete>
      </v-col>
      <v-col>
        <v-autocomplete dense label="Sub-amilía" :item-value="'nombre'" :item-text="'nombre'"
                        :items="Subs" class="ma-2" v-model="mod.sub_f" :rules="rulesRequired">
        </v-autocomplete>
      </v-col>
      <v-col>
        <v-autocomplete dense label="Marca" class="ma-2" :items="MARCAS" :item-text="'nombre'"
                        v-model="mod.marca_id" :item-value="'id'" :loading="LOAD_MARCAS"
                        loader-height="3" :rules="rulesRequired">
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-text-field dense label="Nombre del Modelo" class="ma-2" counter
                      v-model="mod.nombre" :rules="rulesRequired">
        </v-text-field>
      </v-col>
      <v-col>
        <v-select label="Es un Componente" class="ma-2" dense :items="select"
                  @change="estadoComponente"
                  v-model="mod.is_componente" :rules="rulesRequired">
        </v-select>
      </v-col>
    </v-row>

    <v-toolbar dense flat color="grey lighten-4">
      <h6>Ficha Técnica</h6>
      <v-spacer></v-spacer>
      <v-btn color="indigo" dark small tile @click="addDetalle">Agregar Detalle</v-btn>
    </v-toolbar>
    <v-simple-table class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Detalle</th>
          <th>Quitar</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="item in detallesTecnicos">
            <td>
              <v-text-field dense v-model="item.nombre" label="Nombre"></v-text-field>
            </td>
            <td>
              <v-text-field dense v-model="item.detalle" label="Detalle"></v-text-field>
            </td>
            <td>
              <v-btn fab tile width="25" height="25" @click="removeDetalle(item.key)"
                     dark color="red"><v-icon>fa fa-times</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-toolbar dense flat color="grey lighten-4" >
      <h6>Componentes del Modelo</h6>
      <v-spacer></v-spacer>
      <v-btn color="indigo" class="text-white" small tile :disabled="mod.is_componente !== 1"
             @click="addComponente">Agregar Componente</v-btn>
    </v-toolbar>
    <v-simple-table class="rowsTable" :disabled="mod.is_componente !== 1">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Nombre del Componente</th>
          <th>Quitar</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in Componentes">
          <td>
            <v-text-field dense v-model="item.nombre" label="Nombre"></v-text-field>
          </td>
          <td>
            <v-btn fab tile width="25" height="25" @click="removoeComponente(item.key)"
                   dark color="red"><v-icon>fa fa-times</v-icon></v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

  </v-form>
  <v-divider></v-divider>

  <v-card-actions class="d-flex justify-end">
    <v-btn color="success" small tile @click="validarForm">Registrar Modelo</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
export default {
  name: "nuevo_mod",
  data(){
    return{
      select:[
        {text:'Es componente', value:1},
        {text:'No es componente', value:0},
      ],
      Familias: [],
      Marcas:   [],
      Subs:     [],
      rules: [
        v => !!v || 'El nombre es requerido',
        v => (v && v.length >= 2) || 'Tiene que ser mayor a 2 carácteres',
      ],
      rulesRequired:[
        v => !!v || v === 0 || 'El nombre es requerido',
      ],
      mod:{
        marca_id:      '',
        ficha_tecnica: [],
        is_componente: 0,
        familia_id:    '',
        sub_f:         '',
        nombre:        ''
      },
      detallesTecnicos:[],
      Componentes:[]
    }
  },
  computed:{
    LOAD_MARCAS(){
      return this.$store.state.mob.familias.LOADMARCAS;
    },
    MARCAS(){
      return this.$store.state.mob.familias.MARCAS;
    },
    LOAD_FAMILIAS(){
      return this.$store.state.mob.familias.LOADFAMILIAS;
    },
    FAMILIAS(){
      return this.$store.state.mob.familias.FAMILIAS;
    }
  },
  methods:{
    addComponente(){
      this.Componentes.push({
        nombre: '',
        key:    this.Componentes.length
      })
    },
    addDetalle(){
      this.detallesTecnicos.push({
        key:     this.detallesTecnicos.length,
        nombre:  '',
        detalle: ''
      })
    },
    cambiarSubs(){
      let sub = this.FAMILIAS.filter(i => i.id === this.mod.familia_id);
      let subs = []
      if (sub[0].subd) {
        subs = JSON.parse(sub[0].subd);
      }else
        subs = [];

      this.Subs = subs;
      console.log(this.Subs)
    },
    estadoComponente(){
      if (this.mod.is_componente === 0)
        this.Componentes = [];
    },
    registrarModelo(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('mob/modelos',{
        marca_id:      this.mod.marca_id,
        ficha:         JSON.stringify(this.detallesTecnicos),
        is_componente: this.mod.is_componente,
        componentes:   JSON.stringify(this.Componentes),
        familia_id:    this.mod.familia_id,
        sub_f:         this.mod.sub_f,
        nombre:        this.mod.nombre
      }).then((res)=>{
        this.$store.commit('mob/familias/cargar_MODELOS');
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
        setTimeout(()=>{
          this.$store.commit('mob/familias/cambiar_VISTA', 6);
          this.$store.commit('activarOverlay', false);
        },4500);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    removoeComponente(fila){
      let item = 0;
      this.Componentes.splice(fila, 1)
      this.Componentes.forEach( (i) => {
        i.key = item;
        item++;
      })
    },
    removeDetalle(fila){
      let item = 0;
      this.detallesTecnicos.splice(fila, 1)
      this.detallesTecnicos.forEach( (i) => {
        i.key = item;
        item++;
      })
    },
    validarForm(){
      if (this.$refs.FormModModelo.validate())
        this.registrarModelo();
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
