<template>
  <v-card flat >
    <v-container class="d-flex justify-center">
      <v-card width="50%">
        <v-toolbar color="grey lighten-5">
          <h6>Nueva Sub-familías</h6>
        </v-toolbar>
        <v-form class="ma-4" ref="MobEditarFamilia">
          <v-autocomplete :items="FAMILIAS" dense :loading="LOAD_FAMILIAS"
                          loader-height="3" :rules="rulesN"
                          v-model="familia" @change="cambiarFamilia" class="ma-1"
                          label="Seleccione una Familía">
          </v-autocomplete>
          <v-text-field class="ma-1" v-model="nombre" disabled dense counter
                        label="Nombre de la Familía" :rules="rulesN">
          </v-text-field>
          <v-text-field class="ma-1" v-model="sub" dense :rules="rules"
                        counter label="Nombre de la Sub-familía">
          </v-text-field>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" tile small dark @click="validarForm">Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "nueva_sub",
  data(){
    return{
      sub: '',
      nombre: '',
      familia: '',
      fam_id:  null,
      rules: [
        v => !!v || 'El nombre es requerido',
        v => (v && v.length >= 2) || 'Tiene que ser mayor a 2 carácteres',
      ],
      rulesN:[
        v => !!v || 'El nombre es requerido',
      ]
    }
  },
  created() {
    this.$store.commit('activarOverlay', false);
  },
  computed:{
    LOAD_FAMILIAS(){
      return this.$store.state.mob.familias.LOADFAMILIAS;
    },
    FAMILIAS(){
      let familias = [];
      if (this.$store.state.mob.familias.FAMILIAS)
        this.$store.state.mob.familias.FAMILIAS.forEach((i)=>{
          familias.push({
            text:  i.nombre,
            value: i.nombre+'-'+i.id
          })
        })
      return familias;
    }
  },
  methods:{
    cambiarFamilia(){
      this.nombre = this.familia.split('-')[0];
      this.fam_id = this.familia.split('-')[1];
    },
    registrar(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('mob/familia/sub_familia',{
        fam_id: this.fam_id,
        nombre: this.sub
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
      if (this.$refs.MobEditarFamilia.validate())
        this.registrar();
    }
  }
}
</script>

<style scoped>

</style>
