<template>
  <v-container class="pl-2 pr-2">
    <v-card>
      <v-progress-linear v-if="cargando" color="green" indeterminate></v-progress-linear>
      <v-card-title>Catálogo Contable de Surtidora Laínez</v-card-title>
      <v-divider></v-divider>
      <v-list>
        <v-list-group v-for="nivel1 in TiposCuentas">
          <template v-slot:activator>
            <v-list-item-title>{{nivel1.nombre}}</v-list-item-title>
          </template>

          <v-list-group v-for="nivel2 in nivel1.cuentas" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{nivel2.nombre}}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-group v-for="nivel3 in nivel2.cuenta" no-action sub-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{nivel3.nombre}}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-group v-for="nivel4 in nivel3.cuentas" no-action sub-group>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{nivel4.nombre}}</v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item v-for="bit in Bitacoras" link v-if="bit.referencia === nivel4.referencia">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item-title @click="go(bit.url)"
                        v-on="on" v-bind="attrs" v-text="'- '+bit.nombre"></v-list-item-title>
                    </template>
                    <span>ir a {{bit.nombre}}</span>
                  </v-tooltip>
                </v-list-item>

              </v-list-group>

            </v-list-group>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    name: "index",
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Catálogo Contable');
      this.cargarTipos();
    },
    data(){
      return{
        TiposCuentas: [],
        Bitacoras: null,
        cargando: true,
      }
    },
    methods:{
      go(url){
        console.log(url)
        this.$router.replace({path: url})
      },
      cargarTipos(){
        this.$axios.get('catalogo/tipos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.TiposCuentas = res.data.cuentas
            this.Bitacoras    = res.data.bitacoras
            this.cargando = false
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
