<template>
    <v-container>
        <v-stepper v-model="vistaSolicitud">
            <v-stepper-header>
                <v-stepper-step :complete="vistaSolicitud > 1" step="1">Datos del cliente</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="vistaSolicitud > 2" step="2">Datos del artículo</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="vistaSolicitud > 3" step="3">Referencias y avales</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4">Revisión</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-fab-transition style="height: 100px; position: relative">
                        <v-btn style=" margin-top: -12px; margin-left: -15px"
                               v-show="btncliente" color="warning"
                               @click="cambiarVistaCliente"
                               fab dark x-small absolute>
                            <v-icon>fa fa-arrow-left</v-icon>
                        </v-btn>
                    </v-fab-transition>
                    <div class="d-flex justify-center">
                        <cliente/>
                    </div>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <small>Datos del artículo</small>
                    <articulo  v-if="!combo" :articulo="articulo" :precio="precio"/>
                    <combo v-else :combo="articulo" :precio="precio"/>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <referencias/>
                </v-stepper-content>

                <v-stepper-content step="4">
                    <revision :combo="combo" v-if="vistaSolicitud === 4"/>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-container>
</template>

<script>
    import cliente from "./solicitud/cliente";
    import articulo from "./solicitud/articulo";
    import referencias from "./solicitud/referencias";
    import revision from "./solicitud/revision";
    import combo from "@/components/Ventas/solicitud/combo.vue";
    export default {
        components:{cliente, articulo, referencias, revision, combo},
        props:{
            precio:     Object,
            articulo:   Object,
            forma_pago: String,
            combo:      Boolean
        },
        name: "solicitud_credito",
        computed:{
            vistaSolicitud:{
                get:function () {
                    return this.$store.state.solicitud_credito.SolicitudCredito_vista;
                },
                set:function (val) {
                    return this.$store.commit('solicitud_credito/cambiarVista', val)
                }
            },
            btncliente:{
                get:function () {
                    return this.$store.state.solicitud_credito.hiddenBtnCliente;
                },
                set:function (val) {
                    return this.$store.commit('solicitud_credito/cambiarValorBtnCliente', val);
                }
            },
            vistaCliente:{
                get:function () {
                    return this.$store.state.solicitud_credito.Cliente_vista;
                },
                set: function (val) {
                    return this.$store.commit('solicitud_credito/vistaCliente', val)
                }
            },
            height:{
                get:function () {
                    return this.$store.state.solicitud_credito.height;
                },
                set: function (val) {
                    return this.$store.commit('solicitud_credito/cambiarHeight', val)
                }
            },
            width:{
                get:function () {
                    return this.$store.state.solicitud_credito.width;
                },
                set: function (val) {
                    return this.$store.commit('solicitud_credito/cambiarWifth', val)
                }
            }
        },
        created() {
            this.btncliente   = false;
            this.vistaCliente = 1;
            this.vistaSolicitud = 1;
        },
        methods:{
            cambiarVistaCliente(){
                this.height       = '300px';
                this.width        = '40%';
                this.vistaCliente = 1;
                this.btncliente   = false
            }
        }
    }
</script>

<style scoped>
  .contenedor{
      height: 200px;
      width: 100%;
      border: solid 1px #000000;
  }
</style>
