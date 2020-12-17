<template>
    <v-container>
        <v-row class="grey lighten-5">
            <v-col>
                <table class="rowsTable">
                    <tbody>
                        <tr>
                            <th>Nombre del artículo: </th>
                            <td><input type="text" disabled v-model="articulo.nombre_articulo"></td>
                        </tr>
                        <tr>
                            <th>Marca: </th>
                            <td><input type="text" disabled v-model="articulo.marca"></td>
                        </tr>
                        <tr>
                            <th>Código del sistema: </th>
                            <td><input type="text" disabled v-model="articulo.codigo_sistema"></td>
                        </tr>
                        <tr>
                            <th>Código del proveedor: </th>
                            <td><input type="text" disabled v-model="articulo.codigo_proveedor"></td>
                        </tr>
                        <tr>
                            <th>Referencia del fabricante: </th>
                            <td><input type="text" disabled v-model="articulo.referencia_fabricante"></td>
                        </tr>
                        <tr>
                            <th>Proveedor: </th>
                            <td><input type="text" disabled v-model="articulo.proveedor"></td>
                        </tr>
                    </tbody>
                </table>
            </v-col>
            <v-col>
                <table class="rowsTable">
                    <tbody>
                        <tr>
                            <th>Módelo: </th>
                            <td><input type="text" disabled v-model="articulo.modelo"></td>
                        </tr>
                        <tr>
                            <th>Familía: </th>
                            <td><input type="text" disabled v-model="articulo.familia"></td>
                        </tr>
                        <tr>
                            <th>Sub-familía: </th>
                            <td><input type="text" disabled v-model="articulo.fam"></td>
                        </tr>
                        <tr>
                            <th>Descripción: </th>
                            <td><input type="text" disabled v-model="articulo.descripcion_corta"></td>
                        </tr>
                        <tr>
                            <th>Tipo: </th>
                            <td>
                                <input v-if="articulo.is_motocicleta === 1" type="text" disabled value="Vehículo">
                                <input v-else-if="articulo.is_motocicleta === 0" type="text" disabled value="Artículo">
                            </td>
                        </tr>
                        <tr>
                            <th>Código de barras: </th>
                            <td><input type="text" disabled v-model="articulo.codigo_barras"></td>
                        </tr>
                    </tbody>
                </table>
            </v-col>
        </v-row>
        <hr>
        <small>Datos del precio</small>
        <v-row class="grey lighten-5">
            <v-col>
                <table>
                    <tbody>
                        <tr>
                            <th>Tipo de compra: </th>
                            <td>
                                <input disabled v-if="precio.s_contado" value="Contado" type="text">
                                <input disabled v-else-if="!precio.s_contado" value="Financiado" type="text">
                            </td>
                        </tr>
                        <tr>
                            <th>Precio de contado: </th>
                            <td>
                                <input disabled :value="'L '+precio.contado" type="text">
                            </td>
                        </tr>
                        <tr>
                            <th>Mínimo de prima: </th>
                            <td>
                                <input disabled :value="'L '+precio.min_prima" type="text">
                            </td>
                        </tr>
                        <tr>
                            <th>Prima acordada: </th>
                            <td>
                                <input disabled :value="'L '+precio.prima" type="text">
                            </td>
                        </tr>
                        <tr>
                            <th>Saldo a financiar: </th>
                            <td>
                                <input disabled :value="'L '+precio.saldo_nuevo" type="text">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </v-col>
            <v-col>
                <table class="rowsTable">
                    <tbody>
                    <tr>
                        <th>Total de crédito: </th>
                        <td>
                            <input disabled :value="'L '+precio.total_credito" type="text">
                        </td>
                    </tr>
                    <tr>
                        <th>Tiempo del crédito: </th>
                        <td>
                            <input disabled :value="precio.meses+' meses'" type="text">
                        </td>
                    </tr>
                    <tr>
                        <th>Cuota: </th>
                        <td>
                            <input disabled :value="'L '+precio.cuota" type="text">
                        </td>
                    </tr>
                    <tr>
                        <th>Forma de pago: </th>
                        <td>
                            <input v-if="precio.forma_pago === 1" disabled value="Semanal" type="text">
                            <input v-if="precio.forma_pago === 2" disabled value="Quincenal" type="text">
                            <input v-if="precio.forma_pago === 3" disabled value="Mensual" type="text">
                        </td>
                    </tr>
                    <tr>
                        <th>Cantidad de pagos: </th>
                        <td>
                            <input v-if="precio.forma_pago === 1" disabled :value="precio.meses * 4+' pagos'" type="text">
                            <input v-if="precio.forma_pago === 2" disabled :value="precio.meses * 2+' pagos'" type="text">
                            <input v-if="precio.forma_pago === 3" disabled :value="precio.meses+' pagos'" type="text">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </v-col>
        </v-row>
        <hr>
        <small>Observación del precio</small>
        <br>
        <br>
        <v-textarea outlined label="Observación" dense rows="4">

        </v-textarea>
        <hr>
        <v-card-actions class="d-flex justify-end">
            <v-btn small color="warning" dark @click="vistaSolicitud = 1">Volver</v-btn>
            <v-btn small color="success" dark @click="vistaSolicitud = 3">Seguir</v-btn>
        </v-card-actions>
    </v-container>
</template>

<script>
    export default {
        name: "articulo",
        props: {
            precio:   Object,
            articulo: Object
        },
        computed:{
            vistaSolicitud:{
                get:function () {
                    return this.$store.state.solicitud_credito.SolicitudCredito_vista;
                },
                set:function (val) {
                    return this.$store.commit('solicitud_credito/cambiarVista', val)
                }
            },
            Solicitud:{
                get:function () {
                    return this.$store.state.solicitud_credito.data;
                }
            }
        },
        created() {
            this.Solicitud.Precio   = this.precio;
            this.Solicitud.Articulo = this.articulo;
        }
    }
</script>

<style scoped>
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
        background-color: #F4F4F4;
    }
    .contenedorTable{
        overflow-y: auto;
        height: 200px;
    }
    table thead{
        border-bottom: solid 1px #47494e;
    }
    .select-css {
        display: block;
        font-size: 12px;
        font-weight: 400;
        color: #444;
        line-height: 1.3;
        max-width: 100%;
        box-sizing: border-box;
        border: 1px solid #aaa;
        box-shadow: 0 1px 0 1px rgba(0,0,0,.03);
        border-radius: .3em;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
        linear-gradient(to bottom, #ffffff 0%,#f7f7f7 100%);
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: .65em auto, 100%;
    }
    textarea{
        width: 100%;
        box-sizing: border-box;
        padding: 2px 10px;
        margin: 1px;
        border: 1px solid #ccc;
        border-radius: 1px;
        cursor: pointer;
    }
    textarea:hover{
        background-color: #FFF;
    }
    .rowsTable{
        cursor: pointer;
    }
</style>
