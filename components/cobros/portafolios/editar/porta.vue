<template>
  <v-card flat>
    <v-row>
      <v-col cols="8">
        <v-card class="ma-2">
          <v-toolbar flat><v-card-title>Totales de los segmentos</v-card-title></v-toolbar>
          <v-divider></v-divider>
          <graficatotal />

          <v-card>
            <v-card-subtitle>Información de cada segmento</v-card-subtitle>
            <v-simple-table dense>
              <template>
                <thead>
                <tr>
                  <th>Nombre del Segmento</th>
                  <th>Total de Saldos</th>
                  <th>Total de Pagos Pendientes</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in TOTALES" v-if="item.id > 1 && item.id < 17">
                  <td>{{item.nombre}}</td>
                  <td>L.{{int.format(item.saldo_actual.toFixed(2))}}</td>
                  <td>L.{{int.format(item.valor_cuotas_segmento.toFixed(2))}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>

        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="ma-2">
          <v-toolbar flat>
            <v-card-title>Editando Portafolio</v-card-title>
          </v-toolbar>
          <v-btn block tile small @click="dialogoEditarUser = true" dark color="success">Cambiar Usuario</v-btn>
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

    <v-dialog width="35%" v-model="dialogoEditarUser">
      <v-card>
        <v-card-title>Asignando Nuevo Usuario</v-card-title>
        <v-divider></v-divider>
        <v-card flat tile class="ma-4 pa-4">
          <v-autocomplete dense label="Seleccionar Usuario" :loading="load_user"
                          v-model="user" :rules="[rule.req]" :items="Users"></v-autocomplete>
        </v-card>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark tile small @click="dialogoEditarUser = false" text>Cerrar</v-btn>
          <v-btn color="success" dark tile small  @click="registrarCambioUsuario">Registrar Cambio</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    TOTALES(){
      return this.$store.state.graficas.cobros.gestiones.G_SEGMENTOS;
    },
    LOAD(){
      return this.$store.state.graficas.cobros.gestiones.G_LOADTOTALESSEGMENTOS;
    }
  },
  created() {
    this.cargar_usuarios();
  },
  data(){
    return{
      dialogoEditarUser:  false,
      editar:{
        dialogo: false,
        fecha_cierre: '',
        proyeccion: 0,
        valor_cuotas: 0
      },
      int: Intl.NumberFormat(),
      rule: {
        req: v => !!v || 'Campo requerido',
      },
      user: 0,
      load_user: true,
      Users: []
    }
  },
  methods:{
    cargar_usuarios(){
      this.$axios.get('/usuarios').then((res)=>{
        this.Users = [];
        res.data.usuarios.forEach(item=>{
          this.Users.push({
            value: item.user,
            text: item.nombres+' '+item.apellidos+' - '+item.usuario
          })
        })
        this.load_user = false;
      })
    },
    registrarCambioUsuario(){
      if (this.user > 0) {
        this.dialogoEditarUser = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('cobros/portafolio/cambiar_user', {
          portafolio: this.PORTAFOLIO.id,
          user: this.user
        }).then((res) => {
          this.$store.commit('cobros/portafolios/cargar_PORTAFOLIO');
          this.$store.commit('notificacion', {texto: res.data.msj, color: 'success'});
          this.$store.commit('activarOverlay', false);
          this.$store.commit('cobros/portafolios/cambiar_VISTAPORTAFOLIO', 1);
        }).catch(error => {
          this.$store.commit('notificacion', {texto: 'Hubo un error en el servidor', color: 'error'});
          this.$store.commit('activarOverlay', false);
          this.dialogoEditarUser = true;
        });
      }
    },
    registrarProyeccion(){
      let totales = [];
      if (this.TOTALES.length > 0)
        totales = this.TOTALES;

      this.$store.commit('activarOverlay', true);
      this.$axios.post('cobros/gestion/cambiar_proyeccion',{
        portafolio:   this.$store.state.cobros.portafolios.PORTAFOLIO.id,
        fecha_cierre: this.editar.fecha_cierre,
        proyecccion:  this.editar.proyeccion,
        valor_cuota:  this.PORTAFOLIO.valor_cuotas,
        valores:      JSON.stringify(totales)
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
}
</script>

<style scoped>

</style>
