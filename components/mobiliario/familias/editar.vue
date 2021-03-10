<template>
  <v-card flat>
    <v-container class="d-flex justify-center">
      <v-card width="50%">
        <v-toolbar color="grey lighten-5">
          <h6>Edición de Familías y Sub-familías</h6>
        </v-toolbar>
        <v-form class="ma-4" ref="MobEditarFamilia">
          <v-autocomplete :items="FAMILIAS" dense :loading="LOAD_FAMILIAS"
                          :item-value="'id'" :item-text="'nombre'"
                          loader-height="3" v-model="familia" @change="cambiarFamilia"
                          class="ma-1" label="Seleccione una Familía">
          </v-autocomplete>
          <v-text-field class="ma-1" v-model="nombre" dense counter
                        label="Nombre de la Familía" :rules="rules">
          </v-text-field>

          <v-divider></v-divider>
          <small>Sub-familías</small>
          <v-simple-table class="rowsTable">
            <template v-slot:default>
              <tbody>
              <tr  v-for="i in items">
                <td>
                  <b-form-input size="sm" v-model="i.nombre"></b-form-input>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" small tile @click="validarForm">Registrar Cambios</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "editar",
  data(){
    return{
      nombre: '',
      familia: '',
      fam_id: null,
      subs: [],
      items: [],
      rules: [
        v => !!v || 'El nombre es requerido',
        v => (v && v.length >= 2) || 'Tiene que ser mayor a 2 carácteres',
      ],
    }
  },
  computed:{
    LOAD_FAMILIAS(){
      return this.$store.state.mob.familias.LOADFAMILIAS;
    },
    FAMILIAS(){
      return this.$store.state.mob.familias.FAMILIAS;
    },
  },
  methods:{
    cambiarFamilia(){
      this.subs = this.FAMILIAS.filter(i => i.id === this.familia);
      if (this.subs){
        this.nombre = this.subs[0].nombre;
        this.fam_id = this.subs[0].id;
        console.log(this.subs)
        if (this.subs[0].subd)
          this.items = JSON.parse(this.subs[0].subd);
        else
          this.items = [];
      }
    },
    registrar(){
      this.$store.commit('activarOverlay', true);
      this.$axios.put('mob/familia/'+this.fam_id,{
        id:     this.fam_id,
        nombre: this.nombre,
        subs:   JSON.stringify(this.items)
      }).then((res)=>{
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$store.commit('mob/familias/cambiar_VISTA', 1);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto: 'Se ha producido un error en el servidor', color:'error'})
      })
    },
    validarForm(){
      if (this.$refs.MobEditarFamilia.validate)
        this.registrar();
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
