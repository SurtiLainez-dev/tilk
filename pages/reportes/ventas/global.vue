<template>
  <v-card flat>
    <v-toolbar  flat color="grey lighten-4">
      <v-icon>fa fa-chart-bar</v-icon>
      <v-card-title>Reporte de Ventas Global</v-card-title>
    </v-toolbar>
    <v-card-subtitle>Seleccionar datos para el reporte</v-card-subtitle>

    <v-toolbar flat>
      <v-form ref="FormRepVentsGlobal">
        <v-row>
          <v-col>
            <v-dialog ref="dialogFechaInicio" v-model="dialogoFechaInicio" :return-value.sync="fecha_inicio"
                      persistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field dense class="ma-2" label="Fecha de inicio" v-bind="attrs" v-on="on"
                              :rules="[rule.search.req]" v-model="fecha_inicio"></v-text-field>
              </template>
              <v-date-picker v-model="fecha_inicio" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dialogoFechaInicio = false">Cancelar</v-btn>
                <v-btn text color="primary" @click="$refs.dialogFechaInicio.save(fecha_inicio)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col>
            <v-dialog ref="dialogFechaFinal" v-model="dialogoFechaFinal" :return-value.sync="fecha_final"
                      persistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field dense class="ma-2" label="Fecha Final" v-bind="attrs" v-on="on"
                              :rules="[rule.search.req]" v-model="fecha_final"></v-text-field>
              </template>
              <v-date-picker v-model="fecha_final" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dialogoFechaFinal = false">Cancelar</v-btn>
                <v-btn text color="primary" @click="$refs.dialogFechaFinal.save(fecha_final)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col>
            <v-autocomplete :items="SUCURSALES" :item-text="'nombre'" :item-value="'id'" @change="cargarColaboradores"
                            :rules="[rule.search.req]" :loading="LOADSUCURSALES" v-model="sucursal"
                            dense class="ma-2" label="Seleccione una sucursal"></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete :loading="LOADCOLABORADORES" dense class="ma-2" :items="COLABORADORES"
                            label="Seleccione un colaborador" v-model="colaborador"></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete dense class="ma-2" :items="tipo"
                            label="Tipo de Venta" v-model="tipo_venta"></v-autocomplete>
          </v-col>
          <v-col class="d-flex justify-end align-center">
            <v-btn color="success" dark tile small @click="validarReporte">Crear Reporte</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card flat>
      <v-row>
        <v-col cols="1">

        </v-col>

        <v-col cols="11">
          <v-container>
<!--            <v-card-actions class="d-flex justify-end">-->
<!--              <v-tooltip top>-->
<!--                <template v-slot:activator="{on, attrs}">-->
<!--                  <v-btn v-on="on" v-bind="attrs" fab class="ma-2"-->
<!--                         x-small dark color="green"><v-icon>fa fa-file-excel</v-icon></v-btn>-->
<!--                </template>-->
<!--                <span>Crear Excel</span>-->
<!--              </v-tooltip>-->
<!--              <v-tooltip top>-->
<!--                <template v-slot:activator="{on, attrs}">-->
<!--                  <v-btn v-on="on" v-bind="attrs" fab class="ma-2"-->
<!--                         x-small dark color="red"><v-icon>fa fa-file-pdf</v-icon></v-btn>-->
<!--                </template>-->
<!--                <span>Crear pdf</span>-->
<!--              </v-tooltip>-->
<!--            </v-card-actions>-->

            <tabla_ventas/>
          </v-container>
        </v-col>
      </v-row>
    </v-card>

  </v-card>
</template>

<script>
import tabla_ventas from "@/components/reportes/ventas/tabla_ventas";
export default {
  name: "global",
  components:{tabla_ventas},
  computed:{
    LOADANIO(){
      return this.$store.state.reportes.ventas.global.LOADANIO;
    },
    ANIOS(){
      return this.$store.state.reportes.ventas.global.ANIOS;
    },
    LOADSUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES
    },
    LOADCOLABORADORES(){
      return this.$store.state.suc.LOAD_COLABORADORES;
    },
    COLABORADORES(){
      return this.$store.state.suc.COLABORADORES;
    }
  },
  data(){
    return{
      fecha_inicio: '',
      fecha_final: '',
      dialogoFechaInicio: false,
      dialogoFechaFinal: false,
      rule:{
        search:{
          req: v => !!v || 'Campo requerido',
        },
      },
      sucursal: '',
      anio: '',
      colaborador: null,
      tipo_venta: null,
      tipo:[
        {text:'Contado', value:1},
        {text:'Crédito', value:2},
        {text:'Todos', value:0},
      ]
    }
  },
  created() {
    this.$store.commit('suc/cargar_SUCURSALES');
  },
  methods:{
    cargarColaboradores(){
      this.$store.commit('suc/cargar_COLABORADORES', this.sucursal)
    },
    crearReporte(){
      this.$store.commit('reportes/ventas/global/cargar_DATATABLE',{
        anio: this.anio,
        fi:   this.fecha_inicio,
        ff:   this.fecha_final,
        suc:  this.sucursal,
        col:  this.colaborador,
        tipo: this.tipo_venta
      })
    },
    validarReporte(){
      if (this.$refs.FormRepVentsGlobal.validate())
        this.crearReporte();
      else
        this.$store.commit('notificacion',{texto:'Hay datos incompletos', color:'error'});
    }
  }
}
</script>

<style scoped>

</style>
