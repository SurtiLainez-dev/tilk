<template>
    <v-card>
        <v-row no-gutters>
            <v-col cols="11"><v-card-title>Seguimientos Abiertos</v-card-title></v-col>
            <v-col cols="1" class="d-flex align-center">
                <v-btn @click="cargar_seguimientos" x-small text fab><v-icon>fa fa-sync-alt</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-data-table :headers="header"
                      :loading="load"
                      :items="Seguimientos"
                      class="rowsTable"
                      @click:row="abrirSide"
                      loading-text="Cargando Seguimientos"
                      dense>
            <template v-slot:item.cliente.nombres="{item}">
                {{item.cliente.nombres}} {{item.cliente.apellidos}}
            </template>
            <template v-slot:item.estado="{item}">
                <v-chip v-if="item.estado === 1" x-small color="success" dark>Abierta</v-chip>
                <v-chip v-else x-small color="red" dark>Abierta</v-chip>
            </template>
        </v-data-table>

    </v-card>
</template>

<script>
    export default {
        name: "view_seguimientos",
        data(){
            return{
                header:[
                    {text:'Cliente', value:'cliente.nombres'},
                    {text:'Fecha Inicio', value:'fecha_inicio'},
                    {text:'Estado', value:'estado'},
                ],
                load: true,
                Seguimientos: [],
            }
        },
        created() {
            this.cargar_seguimientos();
        },
        methods:{
            cargar_seguimientos(){
                this.$axios.get('seguimiento_x_usuario/',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.Seguimientos = res.data.seguimientos
                    this.load = false
                })
            },
            abrirSide(item){
                this.$store.commit('asignarDatosSeguimiento', item);
                console.log(item);
                this.$store.commit('valorDialogo', true);
            }
        }
    }
</script>

<style scoped>
    .rowsTable{
        cursor: pointer;
    }
</style>
