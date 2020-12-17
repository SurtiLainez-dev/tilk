<template>
    <v-container class="d-flex justify-center">
        <div class="contenedorTable">
            <table class="rowsTable">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Detalle</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,i) in historial">
                    <td>{{i}}</td>
                    <td>{{item.fecha}}</td>
                    <td>{{item.hora}}</td>
                    <td>{{item.destalle}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </v-container>
</template>

<script>
    export default {
        props: {historial: Array},
        name: "historial"
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
        height: 400px;
        overflow-y: auto;
        width: 50%;
    }
    table thead{
        border-bottom: solid 1px #47494e;
    }
</style>
