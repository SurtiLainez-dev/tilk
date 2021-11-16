<template>
  <v-card>
    <v-card-text>Datos de la caja chica</v-card-text>
    <v-row no-gutters>
      <v-col>
        <v-text-field label="Fecha Asignaada" dense class="ma-3" disabled
                      :value="CH?CH.fecha_asignacion:'Cargando'" :loading="LOADCH"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Fecha Cierre" dense class="ma-3" disabled
                      :value="CH?CH.fecha_finalizacion:'Cargando'" :loading="LOADCH"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Total Inicial" dense class="ma-3" disabled suffix="lps"
                      :value="CH?CH.total_inicial:'Cargando'" :loading="LOADCH"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Total Actual" dense class="ma-3" disabled suffix="lps"
                      :value="CH?CH.total_actual:'Cargando'" :loading="LOADCH"></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="4">
        <v-card class="ma-2">
          <v-card-text>Registrar nuevo gasto</v-card-text>
          <v-divider></v-divider>
          <v-form ref="FormNuevoGasto">
            <v-text-field class="ma-2" dense label="Detalle del gasto" counter
                          v-model="gasto.detaalle" :rules="[rule.pago.req]"></v-text-field>
            <v-autocomplete class="ma-2" dense label="Seleccionar gasto" :items="TIPOGASTOS" :rules="[rule.pago.req]"
                            :item-value="'id'" :item-text="'nombre'" v-model="gasto.gasto"></v-autocomplete>
            <v-text-field class="ma-2" dense label="Total del gasto" suffix="lps"
                          v-model="gasto.total" :rules="[rule.pago.req]"></v-text-field>
            <v-file-input class="ma-2" dense label="Documento escaneado" accep="image/*, .pdf" v-model="gasto.file"></v-file-input>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" dark tile small @click="validarForm">Registrar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card class="ma-2">
          <v-card-text>Gastos de la caja</v-card-text>
          <v-divider></v-divider>
          <v-data-table dense :headers="headerG" :items-per-page="5" :loading="LOADCH" :items="GASTOS">
            <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="ma-2 pb-5">
      <v-card-text>Historial de la caja chica</v-card-text>
      <v-data-table class="pb-5" dense :headers="header" :items="HISTORIAL">
        <template v-slot:item.saldo_ant="{item}">L. {{int.format(item.saldo_ant)}}</template>
        <template v-slot:item.saldo_transaccion="{item}">L. {{int.format(item.saldo_transaccion)}}</template>
        <template v-slot:item.saldo_actual="{item}">L. {{int.format(item.saldo_actual)}}</template>
        <template v-slot:item.tipo="{item}">
          <span v-if="item.tipo === 0">+</span>
          <span v-else-if="item.tipo === 1">-</span>
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "caja_chica",
  data(){
    return{
      int: new Intl.NumberFormat(),
      header:[
        {text:'Tipo de Gasto', value:'gasto.tipo_gasto.nombre'},
        {text:'Detalle', value:'observacion'},
        {text:'Tipo', value:'tipo'},
        {text:'Saldo Ant.', value:'saldo_ant'},
        {text:'Total', value:'saldo_transaccion'},
        {text:'Saldo Act.', value:'saldo_actual'},
      ],
      headerG:[
        {text:'#', value:'num'},
        {text:'Tipo de Gasto', value:'gasto'},
        {text:'Total', value:'total'},
      ],
      gasto:{
        total:    0,
        gasto:    '',
        detaalle: '',
        file:     null
      },
      rule:{
        pago:{
          req: v => !!v || 'Campo requerido',
          max: v => v.length <= 200 || 'Ingresar máximo 200 carácteres',
        },
      },
    }
  },
  created() {
    this.$store.commit('caja/cargar_CAJACHICA');
  },
  computed:{
    CH(){
      return this.$store.state.caja.CAJACHICA;
    },
    LOADCH(){
      return this.$store.state.caja.LOAD_CAJACHICA;
    },
    TIPOGASTOS(){
      return this.$store.state.caja.TIPOGASTOS;
    },
    GASTOS(){
      return this.$store.state.caja.GASTOS;
    },
    HISTORIAL(){
      return this.$store.state.caja.HISTORIALCAJACHICA;
    }
  },
  methods:{
    registrarGasto() {
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      data.append('file', this.gasto.file);
      data.append('gasto', this.gasto.gasto);
      data.append('detalle', this.gasto.detaalle);
      data.append('total',   this.gasto.total);
      data.append('caja_id', this.CH.id);
      this.$axios({
        method: 'post',
        url:    'contabilidad/caja_chica/gasto',
        data:   data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.gasto.gasto    = '';
        this.gasto.total    = 0;
        this.gasto.file     = null;
        this.gasto.detaalle = '';
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('caja/cargar_CAJACHICA');
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    validarForm(){
      if (this.$refs.FormNuevoGasto.validate())
        this.registrarGasto();
    }
  }
}
</script>

<style scoped>

</style>
