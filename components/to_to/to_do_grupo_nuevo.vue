<template>
  <v-card flat>
    <v-container>
      <v-card flat class="d-flex justify-center">
        <v-card width="50%">
          <v-card-text>Los grupos es para saber a que área está relacionada la tarea. Ejemplo, contabilidad,
            facutración, apertura nueva tienda, etc...</v-card-text>
          <v-form ref="FormToDoGrupoNuevo">
            <v-divider></v-divider>
            <v-text-field v-model="GRUPO.nombre" label="Nombre del Grupo" counter
                          class="ma-2" dense :rules="[rule.req, rule.min, rule.max]"></v-text-field>
            <v-color-picker hide-canvas hide-sliders hide-mode-switch hide-inputs dot-size="15"
                            v-model="GRUPO.color"></v-color-picker>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" tile small dark @click="validarForm">Registrar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "to_do_grupo_nuevo",
  data(){
    return{
      rule: {
        req: v => !!v || 'Campo requerido',
        min: v => (v && v.length >= 2) || 'Tiene que ser mayor a 3 carácteres.',
        max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
      },
    }
  },
  computed:{
    GRUPO:{
      get: function (){
        return this.$store.state.todo.GRUPO;
      },
      set: function (val){
        return this.$store.commit('todo/asignar_GRUPO', val);
      }
    },
  },
  created() {
    this.$store.commit('todo/asignar_TITULO','Creando Nuevo Grupo');
  },
  methods:{
    editarGrupo(){
      this.$store.commit('activarOverlay', true);
      this.$axios.put('to_do/grupo/'+this.GRUPO.id,{
        color: this.GRUPO.color,
        nombre: this.GRUPO.nombre,
        id: this.GRUPO.id,
      }).then((res)=>{
        this.$store.commit('notificacion', {color:'success', texto: res.data.msj});
        this.$store.commit('todo/cambiar_VISTA', 3);
        this.$store.commit('todo/asignar_TITULO','Grupos de Tareas');
        this.$store.commit('activarOverlay', false);
        this.GRUPO.id = 0;
        this.GRUPO.tipo = 1;
        this.GRUPO.nombre = '';

      }).catch((res)=>{
        this.$store.commit('notificacion', {color:'error', texto: 'Hubo un error en el servidor'});
        this.$store.commit('activarOverlay', false);
      })
    },
    registrarGrupo(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('to_do/grupo',{
        color: this.GRUPO.color,
        nombre: this.GRUPO.nombre
      }).then((res)=>{
        this.$store.commit('notificacion', {color:'success', texto: res.data.msj});
        this.$store.commit('todo/cambiar_VISTA', 3);
        this.$store.commit('todo/asignar_TITULO','Grupos de Tareas');
        this.$store.commit('activarOverlay', false);
        this.GRUPO.nombre = '';
      }).catch((res)=>{
        this.$store.commit('notificacion', {color:'error', texto: 'Hubo un error en el servidor'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormToDoGrupoNuevo.validate()) {
        if (this.GRUPO.tipo === 1)
          this.registrarGrupo();
        else
          this.editarGrupo();
      }else
        this.$store.commit('notificacion', {color:'warning',texto:'Hay datos incompletos'});
    }
  }
}
</script>

<style scoped>

</style>
