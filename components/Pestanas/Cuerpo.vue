<template>
    <div>
      <v-tabs background-color="primary" dark >
        <keep-alive>
          <v-tab v-for="item in pes" :to="item.url">
            {{ item.titulo }}
          </v-tab>
        </keep-alive>
      </v-tabs>
    </div>
</template>

<script>
    export default {
      name: "Cuerpo",
      props: {ruta: String},
      created() {
        this.$router.replace({path:this.ruta})
      },
      computed:{
        pes(){
          return this.$store.state.pestanas
        }
      },
    }
</script>

<style scoped>

</style>
