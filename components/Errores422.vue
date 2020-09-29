<template>
    <div class="pt-5 pr-2 pl-2">
        <div v-for="(item, indice, index) in errores" >
            <v-alert dense outlined type="error"
                       v-for="(i,a) in item" class="pr-2">
                <span>{{item[a]}}</span>
            </v-alert>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Errores422",
        data(){
          return{
              errors: []
          }
        },
        props:{
            errores: null
        },
    }
</script>

<style scoped>

</style>
