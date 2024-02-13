<template>
<v-card>
  <v-toolbar flat tile>
    <v-card-title>Acreedores</v-card-title>
    <v-tooltip top>
      <template v-slot:activator="{on, attrs}">
        <v-btn color="indigo" @click="$store.commit('contabilidad/acreedores/cargarACREEDORES')"
               text fab small v-on="on" v-bind="attrs" icon><v-icon>mdi-reload</v-icon></v-btn>
      </template>
      <span>Recargar Acreedores</span>
    </v-tooltip>
    <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn color="indigo" @click="$store.commit('contabilidad/acreedores/setDIALOGO', true)"
                 text fab small v-on="on" v-bind="attrs" icon><v-icon>fa fa-plus</v-icon></v-btn>
        </template>
        <span>Agregar Acreedor</span>
      </v-tooltip>
  </v-toolbar>

  <v-data-table :headers="headers" dense :items="ACREEDORES" @click:row="capturarAcreedor"
                loading-text="Cargando acreedores ..." :loading="LOAD_ACREEDORES">
    <template v-slot:item.id="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn color="success" x-small
                 text fab v-on="on" v-bind="attrs" icon><v-icon>fa fa-plus</v-icon></v-btn>
        </template>
        <span>Agregar Cuenta de Banco</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn color="pink" x-small
                 text fab v-on="on" v-bind="attrs" icon><v-icon>fa fa-eye</v-icon></v-btn>
        </template>
        <span>Ver Cuentas de Banco</span>
      </v-tooltip>
    </template>
  </v-data-table>

  <form_acreedor_nuevo :id="id"/>
</v-card>
</template>

<script>
import form_acreedor_nuevo from "@/components/contabilidad/form_acreedor_nuevo.vue";
export default {
  name: "acreedores",
  components:{form_acreedor_nuevo},
  computed:{
    ACREEDORES(){
      return this.$store.state.contabilidad.acreedores.ACREEDORES;
    },
    LOAD_ACREEDORES(){
      return this.$store.state.contabilidad.acreedores.LOAD_ACREEDORES;
    }
  },
  data(){
    return{
      id: null,
      headers:[
        {text:'Nombre del Acreedor', value:'nombre'},
        {text:'Identifación', value:'identificacion'},
        {text:'Cod. CC', value:'cc.cod'},
        {text:'Acciones', value:'id'},
      ],
      Acreedor: {}
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Acreedores');
    this.$store.commit('contabilidad/acreedores/cargarACREEDORES');
  },
  methods:{
    capturarAcreedor(data){
      this.id = data.id;
      this.$store.commit('contabilidad/acreedores/setNOMBRE', data.nombre);
      this.$store.commit('contabilidad/acreedores/setIDENTIFICACION', data.identificacion);
      this.$store.commit('contabilidad/acreedores/aetTipo', 2);
      this.$store.commit('contabilidad/acreedores/setDIALOGO', true);
    }
  }
}
</script>

<style scoped>

</style>
