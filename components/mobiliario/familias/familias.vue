<template>
  <v-card>
    <v-toolbar flat color="grey lighten-5">
      <h6>Familás Existentes</h6>
    </v-toolbar>
    <v-data-table dense
                  class="rowsTable"
                  :loading="LOAD_FAMILIAS"
                  :headers="header"
                  loading-text="Cargando Familías"
                  :items="FAMILIAS">
      <template v-slot:item.id="{item}">
        <v-menu v-model="menu" :nudge-width="200" offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="indigo" x-small dark v-bind="attrs" @click="infoSub(item)" v-on="on">
              Sub-familías
            </v-btn>
          </template>

          <v-card v-if="subId === item.id">
            <v-toolbar flat color="grey lighten-5">
              <h6>{{item.nombre}}</h6>
            </v-toolbar>

            <v-simple-table dense class="rowsTable">
              <template>
                <tbody>
                <tr v-for="i in JSON.parse(item.subd)">
                  <th>{{i.nombre}}</th>
                </tr>
                </tbody>
              </template>
            </v-simple-table>

            <v-card-actions class="d-flex justify-end">
              <v-btn color="warning" small dark @click="menu = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
export default {
  name: "familias",
  data(){
    return{
      subId: null,
      menu: false,
      header:[
        {text:'Nombre de la Familía', value:'nombre'},
        {text:'Código de la Familía', value:'cod'},
        {text:'Sub-familías', value:'id'},
      ]
    }
  },
  created() {
    this.$store.commit('mob/familias/cargar_FAMILIAS');
    this.$store.commit('mob/familias/cargar_MARCAS');
    this.$store.commit('mob/familias/cargar_MODELOS');
  },
  computed:{
    LOAD_FAMILIAS(){
      return this.$store.state.mob.familias.LOADFAMILIAS;
    },
    FAMILIAS(){
      return this.$store.state.mob.familias.FAMILIAS;
    }
  },
  methods:{
    infoSub(data){
      this.subId = data.id;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
