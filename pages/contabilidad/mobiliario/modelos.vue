<template>
<v-card flat class="ma-2">
  <v-toolbar flat color="grey lighten-3">
    <h5>{{titulo}}</h5>
  </v-toolbar>

  <v-row>
    <v-col cols="2">
      <v-card width="256" class="mx-auto ma-1">
        <v-navigation-drawer permanent>
          <v-list dense nav>
            <v-list-item v-for="item in items" :key="item.titulo" link @click="cambiarDatosMenu(item)">
              <v-list-item-content>
                <v-list-item-title>{{ item.titulo }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

        </v-navigation-drawer>
      </v-card>
    </v-col>

    <v-col>
      <v-card class="ma-1">
        <familias      v-if="VISTA === 1"/>
        <nueva-familia v-else-if="VISTA === 2"/>
        <editar        v-else-if="VISTA === 3"/>
        <nueva_sub     v-else-if="VISTA === 4"/>
        <marcas        v-else-if="VISTA === 5"/>
        <modelo        v-else-if="VISTA === 6"/>
        <nuevo_mod     v-else-if="VISTA === 7"/>
      </v-card>
    </v-col>

  </v-row>
</v-card>
</template>

<script>
import nuevaFamilia from "../../../components/mobiliario/familias/nuevaFamilia";
import familias     from "../../../components/mobiliario/familias/familias";
import editar       from "../../../components/mobiliario/familias/editar";
import nueva_sub    from "../../../components/mobiliario/familias/nueva_sub";
import marcas       from "../../../components/mobiliario/familias/marcas";
import nuevo_mod    from "../../../components/mobiliario/modelos/nuevo_mod";
import modelos      from "../../../components/mobiliario/modelos/index";
export default {
  name: "modelos",
  components:{
    nuevaFamilia,
    familias,
    editar,
    nueva_sub,
    marcas,
    nuevo_mod,
    modelo: modelos
  },
  data(){
    return{
      titulo: 'Familías',
      items:[
        {titulo:'Familías',           val: 1},
        {titulo:'Nueva Familía',      val: 2},
        {titulo:'Editar Familía',     val: 3},
        {titulo:'Nueva Sub-familía',  val: 4},
        {titulo:'Marcas',             val: 5},
        {titulo:'Modelos',            val: 6},
        {titulo:'Nuevo Modelo',       val: 7},
      ]
    }
  },
  computed:{
    VISTA:{
      get: function (){
        return this.$store.state.mob.familias.VISTA;
      },
      set: function (val){
        this.$store.commit('mob/familias/cambiar_VISTA', val)
      }
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Mobiliario > Familías');
    this.VISTA = 1;
  },
  methods:{
    cambiarDatosMenu(data){
      this.titulo = data.titulo;
      this.VISTA  = data.val
      console.log(data)
    },
  }
}
</script>

<style scoped>

</style>
