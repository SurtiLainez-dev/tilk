<template>
    <v-card width="60%" :loading="load">
        <div class="contenedorTable d-flex justify-center pt-2" >
            <table class="rowsTable">
                <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Artículo</th>
                    <th>Estado</th>
                    <th>Fecha de inicio</th>
                    <th>Usuario</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Seguimientos" @click="abrirSide(item)">
                    <td>{{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
                    <td>{{item.articulo.nombre_articulo}}</td>
                    <td v-if="item.estado === 1">
                        <v-chip x-small color="green lighten-1" dark>Abierto</v-chip>
                    </td>
                    <td v-else-if="item.estado === 0">
                        <v-chip x-small color="red" dark>Cerrado sin exito</v-chip>
                    </td>
                    <td v-else-if="item.estado === 2">
                        <v-chip x-small color="green darken-3" dark>Vendido</v-chip>
                    </td>
                    <td>{{item.fecha_inicio.split('-')[2]}}/{{item.fecha_inicio.split('-')[1]}}/{{item.fecha_inicio.split('-')[0]}}</td>
                    <td>{{item.user.usuario}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </v-card>
</template>

<script>
    export default {
        name: "tabla",
        props: {tipo:Number},
        data(){
            return{
                header:[
                    {text:'Cliente', value:'cliente.nombres'},
                    {text:'Fecha Inicio', value:'fecha_inicio'},
                    {text:'Estado', value:'estado'},
                ],
            }
        },
        created() {
            this.$store.commit('cargarSeguimeintos', this.tipo)
        },
        computed:{
            Seguimientos(){
                return this.$store.state.Seguimientos;
            },
            load(){
                return this.$store.state.loadSeguimiento;
            }
        },
        methods:{
            abrirSide(item){
                this.$store.commit('asignarDatosSeguimiento', item);
                console.log(item);
                this.$store.commit('valorDialogo', true);
            },
        }
    }
</script>

<style scoped>
    .rowsTable{
        cursor: pointer;
    }
    table{
        width: 95%;
    }
    table tbody{
        font-size: 12px;
    }
    table tbody tr td input[type=text], select{
        width: 100%;
        box-sizing: border-box;
        padding: 2px 10px;
        margin: 1px;
        border: 1px solid #ccc;
        border-radius: 1px;
        cursor: pointer;
    }
    table tbody tr td input:hover{
        background-color: #FFF !important;
    }
    table tbody tr:hover{
        background-color: #cccccc;
    }
    .contenedorTable{
        height: 600px;
        overflow-y: auto;
    }
    table thead{
        border-bottom: solid 1px #47494e;
    }
</style>
