<template>
  <v-card flat>
    <v-row>
      <v-col cols="8">
        <v-card class="ma-2">
          <v-toolbar flat><v-card-title>Totales de los segmentos</v-card-title></v-toolbar>
          <v-divider></v-divider>
          <graficatotal />

        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="ma-2">
          <v-toolbar flat>
            <v-card-title>Editando Portafolio</v-card-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-form ref="FormEditarPortafolio">
            <v-dialog ref="dialogoFechaCierre" :return-value.sync="editar.fecha_cierre" persistent
                      width="290px" v-model="editar.dialogo">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="editar.fecha_cierre" label="Fecha de cierre del portafolio" dense class="ma-5"
                              v-bind="attrs" v-on="on" :rules="[rule.req]">
                </v-text-field>
              </template>
              <v-date-picker v-model="editar.fecha_cierre" scrollable>
                <v-spacer></v-spacer>
                <v-btn tile small dark color="orange" @click="editar.dialogo = false">Cerrar</v-btn>
                <v-btn tile small color="indigo" class="text-white"
                       @click="$refs.dialogoFechaCierre.save(editar.fecha_cierre)">Seleccionar</v-btn>
              </v-date-picker>

            </v-dialog>

            <v-text-field label="Proyección de abonos" dense class="ma-5" :rules="[rule.req]"
                          v-model="editar.proyeccion" suffix="lps"></v-text-field>
            <v-text-field label="Total de cuotas a la fecha" dense class="ma-5" :rules="[rule.req]"
                          disabled :value="PORTAFOLIO.valor_cuotas" suffix="lps"></v-text-field>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" dark tile small @click="validarForm">Registrar Cambios</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import graficatotal from "@/components/cobros/portafolios/editar/graficatotal";


export default {
  components:{graficatotal},
  name: "porta",
  computed:{
    PORTAFOLIO(){
      return this.$store.state.cobros.portafolios.PORTAFOLIO;
    },
  },
  data(){
    return{
      editar:{
        dialogo: false,
        fecha_cierre: '',
        proyeccion: 0,
        valor_cuotas: 0
      },
      rule: {
        req: v => !!v || 'Campo requerido',
      },
    }
  },
  methods:{
    registrarProyeccion(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cobros/gestion/cambiar_proyeccion',{
        portafolio:   this.$store.state.cobros.portafolios.PORTAFOLIO.id,
        fecha_cierre: this.editar.fecha_cierre,
        proyecccion:  this.editar.proyeccion,
        valor_cuota:  this.PORTAFOLIO.valor_cuotas
      }).then((res)=>{
        this.$store.commit('cobros/portafolios/cargar_PORTAFOLIO');
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$store.commit('cobros/portafolios/cambiar_VISTAPORTAFOLIO', 1);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormEditarPortafolio.validate())
        this.registrarProyeccion();
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
