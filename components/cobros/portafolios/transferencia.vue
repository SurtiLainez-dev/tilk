<template>
  <v-card flat>
    <v-toolbar flat><v-card-title>Transferencia de Gestiones</v-card-title></v-toolbar>
    <v-divider></v-divider>
    <v-toolbar flat>
      <v-card-subtitle>Gestiones</v-card-subtitle>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field dense label="Burcar ..." class="ma-2" v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table dense :headers="header" :search="search" loading-text="Cargando datos ..."
                  :items="gestiones" :loading="loadGestiones" @click:row="abrir_dialogo">
      <template v-slot:item.saldo_actual="{item}">L {{int.format(item.saldo_actual)}}</template>
    </v-data-table>

    <v-dialog v-model="transferencia.dialogo" width="35%">
      <v-card class="pa-1">
        <v-toolbar flat color="grey lighten-3"><v-card-subtitle>Transfiriendo {{transferencia.data.titulo}} a otro portafolio</v-card-subtitle></v-toolbar>
        <v-text-field label="Portafolio Actual" dense class="pa-5"
                      :value="transferencia.data.portafolio" disabled></v-text-field>
        <v-autocomplete label="Nuevo Portafolio" class="pa-5" :items="PORTAFOLIOS" dense
                        :item-value="'id'" :item-text="'nombre'" v-model="transferencia.nuevo_portafolio"></v-autocomplete>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="warning" @click="transferencia.dialogo = false" tile small dark>Cerrar</v-btn>
          <v-btn color="success" tile small dark @click="registrarTransferencia">Crear transferencia</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "transferencia",
  data(){
    return{
      transferencia:{
        dialogo: false,
        data: {},
        nuevo_portafolio: ''
      },
      search: '',
      gestiones: [],
      loadGestiones: true,
      int: Intl.NumberFormat(),
      header: [
        {text:'Título', value:'titulo'},
        {text:'Saldo Actual Gestión', value:'saldo_actual'},
        {text:'Segmento', value:'segmento'},
        {text:'Portafolio', value:'portafolio'},
      ]
    }
  },
  computed:{
    PORTAFOLIO(){
      return this.$store.state.cobros.portafolios.PORTAFOLIO;
    },
    PORTAFOLIOS(){
      return this.$store.state.cobros.cartera.PORTAFOLIOS;
    }
  },
  created() {
    this.cargar_gestiones();
  },
  methods:{
    abrir_dialogo(data){
      this.transferencia.data    = data;
      this.transferencia.dialogo = true;
    },
    cargar_gestiones(){
      this.$axios.get('corbros/gestiones/portafolios/sucursal/'+this.PORTAFOLIO.sucursal_id).then((res)=>{
        this.gestiones = res.data.gestiones;
        this.loadGestiones = false;
      })
    },
    registrarTransferencia() {
      if (this.transferencia.nuevo_portafolio){
        this.transferencia.dialogo = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('cobros/gestiones/portafolios/transferencias',{
          portafolio_nuevo: this.transferencia.nuevo_portafolio,
          portafolio:       this.transferencia.data.porta,
          gestion:          this.transferencia.data.gestion
        }).then((res)=>{
          this.$store.commit('cobros/cartera/cargar_PORTAFOLIOS');
          this.$store.commit('cobros/cartera/cambiar_VISTA', 1);
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        }).catch((error)=> {
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion', {texto: 'Hubo un error en el servidor', color: 'error'});
        });
      }else
        this.$store.commit('notificacion',{texto:'Dato incorrecto',color:'warning'});
    }
  }
}
</script>

<style scoped>

</style>
