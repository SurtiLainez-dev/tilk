<template>
    <div>
        <v-list-group>
            <template v-slot:activator value="true">
                <v-tooltip top>
                    <span>Seguimientos de Prospectos</span>
                    <template v-slot:activator="{on, attrs}"><v-list-item-title v-on="on" v-bind="attrs">Seguimientos de Prospectos</v-list-item-title></template>
                </v-tooltip>
            </template>
            <v-list-item class="itemOpciones" @click="go('/inicio/seguimientos/')">
                Todos los Seguimientos
            </v-list-item>
            <v-list-item class="itemOpciones" @click="go('/inicio/seguimientos/abiertos')">
                Seguimientos Abiertos
            </v-list-item>
            <v-list-item class="itemOpciones" @click="go('/inicio/seguimientos/cerrados')">
                Seguimientos Cerrados
            </v-list-item>
        </v-list-group>
        <v-list-group>
            <template v-slot:activator value="true">
                <v-tooltip top>
                    <span>Otras gestiones</span>
                    <template v-slot:activator="{on, attrs}"><v-list-item-title v-on="on" v-bind="attrs">Otras gestiones</v-list-item-title></template>
                </v-tooltip>
            </template>
            <v-list-item class="itemOpciones" @click="go('/inicio/otras_gestiones/solicitudes_credito')">
                Solicitudes de crédito
            </v-list-item>
            <v-list-item class="itemOpciones" @click="go('/inicio/otras_gestiones/ventas')">
              Ver ventas
            </v-list-item>
        </v-list-group>
    </div>
</template>

<script>
    export default {
        name: "sideSeguimientos",
        methods:{
            go(url){
                this.$router.push(url)
            }
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
