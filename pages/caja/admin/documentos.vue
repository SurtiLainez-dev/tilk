<template>
<v-card>
  <v-toolbar color="grey lighten-4" flat>
    <h5>Directrices de Impresión</h5>
    <v-spacer></v-spacer>
    <v-btn color="indigo" small @click="dialogo = true" tile dark>Agregar Nueva Directríz</v-btn>
  </v-toolbar>
  <v-data-table dense
                class="rowsTable"
                :loading="load"
                loading-text="Cargando Directrices"
                :items="Directrices"
                :headers="header">
    <template v-slot:item.sucursal.abreviatura="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <span v-on="on" v-bind="attrs">{{item.sucursal.abreviatura}}</span>
        </template>
        <span>{{item.sucursal.nombre}}</span>
      </v-tooltip>
    </template>
    <template v-slot:item.cai="{item}">
      <v-tooltip top >
        <template v-slot:activator="{on, atts}">
          <span v-if="item.cai" v-on="on" v-bind="atts">{{item.cai.substr(0,2)}} ...</span>
        </template>
        <span>{{item.cai}}</span>
      </v-tooltip>
    </template>
    <template v-slot:item.tipo="{item}">
      <v-chip x-small color="orange" dark v-if="item.tipo === 1">Recibos</v-chip>
      <v-chip x-small color="indigo" dark v-else-if="item.tipo === 2">F. Contado</v-chip>
      <v-chip x-small color="indigo" dark v-else-if="item.tipo === 3">F. Crédito</v-chip>
    </template>
    <template v-slot:item.estado="{item}">
      <v-chip x-small color="success" dark v-if="item.estado === 1">Activo</v-chip>
      <v-chip x-small color="orange" dark v-else>Vencido</v-chip>
    </template>
  </v-data-table>

  <v-dialog width="40%" v-model="dialogo">
    <v-card class="pa-5">
      <v-card-title>Formulario de Nuevas Directrices</v-card-title>
      <v-divider></v-divider>
      <v-form ref="FormDirectrices">
        <v-row no-gutters>
          <v-col>
            <v-text-field dense label="Código Post Contador" v-model="Directriz.codigo_post_contado"
                          class="ma-2" :rules="[rule.contadorI.req]" counter></v-text-field>
          </v-col>
          <v-col>
            <v-autocomplete dense label="Sucursal" :items="Sucursales" :loading="loadSucursales"
                      :item-value="'id'" :rules="[rule.contadorI.req]" v-model="Directriz.sucursal"
                      :item-text="'nombre'" class="ma-2"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field class="ma-2" v-model="Directriz.contador_inicial" counter
                          :rules="[rule.contadorI.req, rule.contadorI.num, rule.contadorI.igual]"
                          dense label="Contador Inicial"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field class="ma-2" dense v-model="Directriz.contador_final"
                          :rules="[rule.contadorI.req, rule.contadorI.num, rule.contadorI.igual]"
                          label="Contador Final" counter></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-dialog ref="dialogoFI" :return-value.sync="Directriz.fecha_emision" persistent
                      width="290px" v-model="dialogoFechaInicial">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="Directriz.fecha_emision" label="Fecha de Emisión"
                              prepend-icon="mdi-calendar"
                              readonly v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="Directriz.fecha_emision" scrollable>
                <v-spacer></v-spacer>
                <v-btn tile small dark color="orange" @click="dialogoFechaInicial = false">Cerrar</v-btn>
                <v-btn tile small color="indigo" class="text-white"
                       @click="saveFI" :disabled="!Directriz.fecha_emision">Seleccionar</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col>
            <v-dialog ref="dialogoFF" :return-value.sync="Directriz.fecha_final" persistent
                      width="290px" v-model="dialogoFechaFinal">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="Directriz.fecha_final" label="Fecha de Finalización"
                              prepend-icon="mdi-calendar"
                              readonly v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="Directriz.fecha_final" scrollable>
                <v-spacer></v-spacer>
                <v-btn tile small dark color="orange" @click="dialogoFechaFinal = false">Cerrar</v-btn>
                <v-btn tile small color="indigo" class="text-white"
                       @click="saveFF" :disabled="!Directriz.fecha_final">Seleccionar</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-select dense :items="SelectTipo" label="Tipo de Documento"
                      :rules="[rule.contadorI.req]"
                      v-model="Directriz.tipo" class="ma-2"></v-select>
          </v-col>
          <v-col>
            <v-text-field dense class="ma-2" label="Inicio del Contador"
                          :rules="[rule.contadorI.req, rule.contadorI.num, rule.contadorI.igual]"
                          v-model="Directriz.inicio_contador"></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field dense class="ma-2" label="CAI" counter v-model="Directriz.cai"></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-card-text>Código: {{Directriz.codigo_post_contado}}{{Directriz.inicio_contador}}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn small tile color="orange" dark @click="dialogo = false">Cerrar</v-btn>
        <v-btn small tile color="success" dark @click="validarForm">Agregar Directríz</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "documentos",
  data(){
    return{
      Directrices: [],
      header:[
        {text: 'Sucursal', value:'sucursal.abreviatura'},
        {text: 'Contador Inicial', value:'contador_inicial'},
        {text: 'Contador_Final', value:'contador_final'},
        {text: 'Código Post Contador', value:'codigo_post_contador'},
        {text: 'F. Emisión', value:'fecha_emision'},
        {text: 'F. Final', value:'fecha_final'},
        {text: 'Estado', value:'estado'},
        {text: 'CAI', value:'cai'},
        {text: 'Usuario', value:'user.usuario'},
        {text: 'Inicio del Contador', value:'inicio_contador'},
        {text: 'Contador Actual', value:'contador_actual'},
        {text: 'Tipo', value:'tipo'},
      ],
      loadSucursales: false,
      load: false,
      dialogo: false,
      SelectTipo:[
        {text:'Recibos de Clientes', value:1},
        {text:'Facturas de Contado', value:2},
        {text:'Facturas de Crédito', value:3},
      ],
      rule: {
        contadorI: {
          req: v => !!v || 'Campo requerido',
          igual: v => (v && v.length === 8) || 'Tiene que ser igual a 8 carácteres.',
          num: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Campo no válido, tienes datos diferentes a números'
        },
        post:{
          igual: v => (v && v.length === 11) || 'Tiene que ser igual a 11 carácteres.',
        },
      },
      dialogoFechaInicial: false,
      dialogoFechaFinal:   false,
      Sucursales:[],
      Directriz:{
        sucursal: '',
        contador_inicial: '',
        contador_final:   '',
        codigo_post_contado:   '',
        fecha_emision:         '',
        fecha_final:           '',
        cai:                   '',
        tipo:                  0,
        inicio_contador:       '',
      }
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Administrador > Cajas > Documentos de Impresión');
    this.cargarDirectrices();
    this.cargarSucursales();
  },
  methods:{
    cargarDirectrices(){
      this.load = true;
      this.$axios.get('cajas/configuracion/impresion').then((res)=>{
        this.Directrices = res.data.directrices;
        this.load = false;
      })
    },
    cargarSucursales(){
      this.loadSucursales = true;
      this.$axios.get('sucursales').then((res)=>{
        this.Sucursales = res.data.suc;
        this.loadSucursales = false;
      })
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    storeDirectriz(){
      let th = this.Directriz
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cajas/configuracion/impresion',{
        sucursal_id:      th.sucursal,
        contador_inicial: th.contador_inicial,
        contador_final:   th.contador_final,
        codigo_post:      th.codigo_post_contado,
        fecha_emision:    th.fecha_emision,
        fecha_final:      th.fecha_final,
        cai:              th.cai,
        tipo:             th.tipo,
        inicio_contador:  th.inicio_contador
      }).then((res)=>{
        this.cargarDirectrices();
        this.notificacion(res.data.msj, 'success');
        th.sucursal         = '';
        th.contador_final   = '';
        th.contador_inicial = '';
        th.fecha_final      = '';
        th.fecha_emision    = '';
        th.tipo             = '';
        th.cai              = '';
        th.inicio_contador  = '';
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 3500)
      }).catch((error)=>{
        this.dialogo = true;
        this.notificacion('Ocurrió un error al ingresar los datos',{error});
      })
    },
    saveFF(){
      this.$refs.dialogoFF.save(this.Directriz.fecha_final);
      this.dialogoFechaFinal = false;
    },
    saveFI () {
      this.$refs.dialogoFI.save(this.Directriz.fecha_emision);
      this.dialogoFechaInicial = false;
    },
    validarForm(){
      if (this.$refs.FormDirectrices.validate())
        if (this.Directriz.tipo === 2){
          if (this.Directriz.cai.length === 37 && this.Directriz.fecha_emision && this.Directriz.fecha_final){
            this.storeDirectriz();
          }else{
            this.notificacion('Hay datos faltantes.','error');
          }
        }else{
          this.storeDirectriz();
        }
      else
        this.notificacion('Hay datos faltantes.','error');
    }
  },
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
