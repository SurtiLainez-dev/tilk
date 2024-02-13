<template>
  <div>
    <v-list-group color="green" >
      <template v-slot:activator value="true">
        <v-list-item-title>Proveedores</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(23)" class="itemOpciones" @click="go('/proveedores/')">
        Ver Proveedores
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(21)" class="itemOpciones" @click="anadirPestana(23, 'Proveedor Nuevo')">
        Crear Proveedor
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(22)" class="itemOpciones" @click="go('/proveedores/contactos')">
        Contactos
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/proveedores/marcas')">
        Marcas
      </v-list-item>
    </v-list-group>
    <v-list-group color="green"  v-if="PERMISOS.includes(24) || PERMISOS.includes(25)">
      <template v-slot:activator value="true">
        <v-list-item-title>Cotizaciones</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(25)" class="itemOpciones" @click="go('/proveedores/cotizaciones')">
        Ver Cotizaciones
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(24)" class="itemOpciones" @click="go('/proveedores/cotizaciones/nueva')">
        Crear Cotizacion
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
  export default {
    name: "sideProveedores",
    methods:{
      go(url){
        this.$router.push(url)
      },
      anadirPestana(key, titulo){
        let bandera = 0;
        this.Pes.forEach((item)=>{
          if (item.key === key)
            bandera++;
        });
        if (bandera === 0){
          this.$store.commit('anadirCaja', {titulo:titulo, key: key});
          this.$store.commit('cambiarTab', {val:key, tipo:false});
        }
      },

    },
    computed:{
      Pes(){
        return this.$store.state.pestana
      },
      PERMISOS(){
        let permisos = this.$store.state.permisosUser.split(',');
        let per = [];
        if (permisos.length > 1){
          permisos.forEach((item)=>{
            per.push(parseInt(item))
          })
          return per;
        }else
          return [];
      },
    },
  }
</script>

<style scoped>
  .itemOpciones{
    font-size: 10px !important;
    margin-left: 6px;
    cursor: pointer;
  }
  .itemOpciones:hover{
    background-color: #47494e;
    margin-left: 8px;
    font-size: 14px !important;
  }
</style>
