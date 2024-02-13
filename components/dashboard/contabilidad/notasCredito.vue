<template>
  <div>
    <v-list-group color="green" >
      <template v-slot:activator value="true">
        <v-tooltip top>
          <span>Notas de Crédtio</span>
          <template v-slot:activator="{on, attrs}"><v-list-item-title v-on="on" v-bind="attrs">NC</v-list-item-title></template>
        </v-tooltip>
      </template>
      <v-list-item v-if="PERMISOS.includes(416)" dense class="itemOpciones" @click="go('/contabilidad/notas_credito/proveedor/nuevo')">
        Nueva NC Proveedor
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(416)" dense class="itemOpciones" @click="go('/contabilidad/notas_credito/proveedor/')">
        NC Proveedores
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(417)" dense class="itemOpciones"  @click="anadirPestana(17, 'Aplicando Anticipo')">
        NC Cliente x Anticipo
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(417)" dense class="itemOpciones" @click="anadirPestana(16, 'Anticipos de Clientes')">
        NC Clientes
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(419)" dense class="itemOpciones" @click="anadirPestana(18, 'Validando Deposito de Clientes')">
        Validar Depósitos
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
  export default {
    name: "notasCredito",
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
    }
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
