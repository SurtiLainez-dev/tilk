<template>
    <v-card class="pr-2 pl-2 pb-2 pt-2" flat>
        <h5>Inicio</h5>
        <hr>
        <v-container>
            <v-row>
                <v-col>
                    <v-card class="pl-2 pr-2 pb-2 pt-2" color="pink" dark>
                        <strong>Código:</strong>
                        <br>
                        <small><strong>{{Soli.codigo}}</strong></small>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="pl-2 pr-2 pb-2 pt-2" dark color="cyan accent-4">
                        <strong>Creador por:</strong>
                        <br>
                        <small><strong>{{Soli.user.colaborador.nombres}} {{Soli.user.colaborador.apellidos}}</strong></small>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card color="deep-orange" dark class="pl-2 pr-2 pt-2 pb-2">
                        <strong>Estado:</strong>
                        <br>
                        <small v-if="Soli.estado === 1"><strong>Pendiente</strong></small>
                        <small v-else-if="Soli.estado === 2"><strong>Revisión de documentos</strong></small>
                        <small v-else-if="Soli.estado === 3"><strong>Rechazada</strong></small>
                        <small v-else-if="Soli.estado === 4"><strong>Aprobado</strong></small>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="pl-2 pr-2 pt-2 pb-2" width="100%" color="grey lighten-2">
                        <v-row no-gutters><v-col><small><strong>Nombre del cliente</strong></small></v-col></v-row>
                        <v-row no-gutters><v-col><small>{{Soli.cliente.nombres}} {{Soli.cliente.apellidos}}</small></v-col></v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="pl-2 pr-2 pt-2 pb-2" width="100%" color="grey lighten-2">
                        <v-row no-gutters><v-col><small><strong>Descripción del artículo</strong></small></v-col></v-row>
                        <v-row no-gutters v-if="Soli.is_combo === 1"><v-col><small>{{Soli.combo.nombre}}</small></v-col></v-row>
                        <v-row no-gutters v-else><v-col><small>{{Soli.articulo.descripcion_corta}}</small></v-col></v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="pl-2 pr-2 pt-2 pb-2" width="100%" color="grey lighten-2">
                        <v-row no-gutters><v-col><small><strong>Crédito</strong></small></v-col></v-row>
                        <v-row no-gutters><v-col><small>L {{parseFloat(Soli.saldo_financiar) + parseFloat(Soli.prima)}}</small></v-col></v-row>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="pl-2 pr-2 pt-2 pb-2" width="100%" color="grey lighten-2">
                        <v-row no-gutters><v-col><small><strong>Prima</strong></small></v-col></v-row>
                        <v-row no-gutters><v-col><small>L {{Soli.prima}}</small></v-col></v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="pl-2 pr-2 pt-2 pb-2" width="100%" color="grey lighten-2">
                        <v-row no-gutters><v-col><small><strong>Referencias</strong></small></v-col></v-row>
                        <v-row no-gutters ><v-col><small>{{JSON.parse(Soli.referencias).length}}</small></v-col></v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="pl-2 pr-2 pt-2 pb-2" width="100%" color="grey lighten-2">
                        <v-row no-gutters><v-col><small><strong>Avales</strong></small></v-col></v-row>
                        <v-row no-gutters><v-col><small>{{Soli.aval_solicituds.length}}</small></v-col></v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
    export default {
        name: "inicio",
        computed:{
            Soli:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud;
                }
            },
        }
    }
</script>

<style scoped>

</style>
