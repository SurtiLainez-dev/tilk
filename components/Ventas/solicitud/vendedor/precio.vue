<template>
    <v-card :disabled="EstadoVista" class="pr-5 pl-5 pb-2 pt-2" flat>
        <h5>Precio</h5>
        <hr>
        <v-row no-gutters>
            <v-col>
                <v-text-field class="ma-1" dense label="Precio de contado" suffix="lps"
                              disabled v-model="Soli.precio_contado"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field class="ma-1" dense label="Prima" suffix="lps"
                              v-model="Soli.prima" @keyup="calcularCuota"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field class="ma-1" dense label="Financiamiento" suffix="lps" disabled
                              v-model="SF" ></v-text-field>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col>
                <v-text-field class="ma-1" dense label="Total de la solicitud" suffix="lps"
                              v-model="totalCredito" disabled></v-text-field>
            </v-col>
            <v-col>
                <v-text-field class="ma-1" dense label="Crédito sin prima" suffix="lps"
                              v-model="Soli.saldo_financiar" disabled></v-text-field>
            </v-col>
            <v-col>
<!--                <v-select class="ma-1" dense label="Forma de pago" :item-value="'val'" :item-text="'text'"-->
<!--                          v-model="formaPago" :items="formaPagos" @change="calcularCuota"></v-select>-->
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col>
                <v-text-field class="ma-1" dense label="Tiempo del crédito" suffix="meses" @keyup="calcularCuota"
                              v-model="Soli.tiempo"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field class="ma-1" dense label="Cantidad de pagos" suffix="pagos" disabled
                              v-model="cantPagos"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field class="ma-1" dense label="Cuota" suffix="lps"
                              v-model="Soli.cuota" disabled></v-text-field>
            </v-col>
        </v-row>
        <b-table :current-page="currentPage"
                 :per-page="perPage"
                 bordered
                 hover
                 striped
                 class="rowsTable"
                 :fields="fieldsPagos"
                 :items="DestallesPRecio.pagos"
                 caption-top
                 small>
            <template v-slot:table-caption>Pagos del crédito</template>
            <template v-slot:head(num)>#</template>
            <template v-slot:head(fecha)>Fecha de Pago</template>
            <template v-slot:head(saldo)>Saldo</template>
            <template v-slot:head(cuota)>Cuota</template>
            <template v-slot:head(saldo_a)>Saldo Restante</template>
            <template v-slot:cell(saldo)="scope">
                L {{scope.item.saldo}}
            </template>
            <template v-slot:cell(cuota)="scope">
                L {{scope.item.cuota}}
            </template>
            <template v-slot:cell(saldo_a)="scope">
                L {{scope.item.saldo_a}}
            </template>
        </b-table>
        <v-row>
            <v-col class="d-flex justify-center">
                <b-pagination v-model="currentPage"
                              :total-rows="totalRows"
                              :per-page="perPage"
                              align="fill"
                              size="sm"
                              class="my-0"
                ></b-pagination>
            </v-col>
        </v-row>
        <v-card-actions class="d-flex justify-end">
            <v-alert v-if="alertaEnvio" prominent type="warning" dense>
                <v-row align="center">
                    <v-col class="grow">
                        Cuando registres los nuevos precios, se actualizaran en la solicitud,
                        no hay recuperación del precio anterior.
                    </v-col>
                    <v-col class="shrink"><v-btn small @click="alertaEnvio = false">Cancelar</v-btn></v-col>
                    <v-col class="shrink"><v-btn @click="registrarPrecio" small>Registrar</v-btn></v-col>
                </v-row>
            </v-alert>
            <v-btn v-if="!alertaEnvio" class="ma-2" color="success" small @click="alertaEnvio = true">Enviar datos del precio</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Vue from "vue";

    export default {
        name: "precio",
        data(){
            return{
                alertaEnvio: false,
                currentPage: 1,
                totalRows: 0,
                perPage:4,
                fieldsPagos:[
                    'num','fecha','saldo','cuota','saldo_a'
                ],
                formaPagos:[
                    {text:'Semanal', val:1},
                    {text:'Quincenal', val:2},
                    {text:'Mensual', val:3},
                ],
                formaPago: 0,
                cantPagos: 0,
                pagos: 0,
                totalCredito: 0,
                SF: 0,
            }
        },
        computed:{
            EstadoVista(){
                return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
            },
            dialogo:{
                get: function () {
                    return this.$store.state.solicitud_credito.dialogoSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', val);
                }
            },
            Soli:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud;
                }
            },
            DestallesPRecio:{
                get: function () {
                    return this.$store.state.solicitud_credito.DetallesPrecio;
                }
            },
        },
        created() {
            this.$store.commit('activarOverlay', false);
            if (this.DestallesPRecio.pagos){
              this.DestallesPRecio.pagos.forEach( (i) => {
                this.totalRows++;
              });
            }else{
              this.DestallesPRecio.pagos = [];
            }

            let forma = this.Soli.forma_pago.toLowerCase();
            if (forma === 'mensual') {
                this.formaPago = 3;
                this.pagos = 1;
            }
            else if (forma === 'quincenal') {
                this.formaPago = 2;
                this.pagos = 2;
            }
            else if (forma === 'semanal') {
                this.formaPago = 1;
                this.pagos = 4;
            }

            this.SF = parseFloat(this.Soli.precio_contado) - parseFloat(this.Soli.prima);
            this.totalCredito = parseFloat(this.Soli.prima) + parseFloat(this.Soli.saldo_financiar);
            if (this.DestallesPRecio.pagos){
              this.calcularPagos();
            }
        },
        methods:{
            calcularCuota(){
                this.calcularFormaPago();
                this.calcularSaldoFinanciamiento();
                let tasaM = (this.Soli.tasa / 12).toFixed(4);
                let tasa = Math.pow(parseInt(1) + parseFloat(tasaM), parseInt(-this.Soli.tiempo));
                let cuota = 0, pagos = 0;
                tasa = tasa  - 1;
                tasa = (tasa/tasaM);
                if (this.formaPago === 1) {
                    this.Soli.cuota = ((-this.SF / tasa) / 4).toFixed(2);
                    cuota = (this.Soli.cuota * 4).toFixed(2);
                }else if (this.formaPago === 2) {
                    this.Soli.cuota = ((-this.SF / tasa) / 2).toFixed(2);
                    cuota = (this.Soli.cuota * 2).toFixed(2);
                }else if (this.formaPago === 3) {
                    this.Soli.cuota = (-this.SF / tasa).toFixed(2);
                    cuota = (this.Soli.cuota * 1).toFixed(2);
                }
                this.Soli.saldo_financiar = (cuota * this.Soli.tiempo).toFixed(2);
                this.totalCreditos();
                this.crearPagos(this.cantPagos, this.formaPago)
            },
            calcularFormaPago(){
                if (this.formaPago === 1)
                    this.pagos = 4;
                else if (this.formaPago === 2)
                    this.pagos = 2;
                else if (this.formaPago === 3)
                    this.pagos = 1;

                this.calcularPagos();
            },
            calcularSaldoFinanciamiento(){
                if (this.Soli.prima)
                    this.SF = parseFloat(this.Soli.precio_contado) - parseFloat(this.Soli.prima);
            },
            calcularPagos(){
                if (this.Soli.tiempo)
                    this.cantPagos = this.Soli.tiempo * this.pagos;
            },
            crearPagos(pagos, tipo){
                this.totalRows = 0;
                let dias= 0, saldo = this.Soli.saldo_financiar;
                console.log(this.DestallesPRecio.pagos);
                let ANTES = new Date(), cuota = this.Soli.cuota;
                this.DestallesPRecio.pagos = [];
                this.DestallesPRecio.pagos.push({
                    "num": 'prima',
                    "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
                    "saldo": (parseFloat(saldo) + parseFloat(this.Soli.prima)).toFixed(2),
                    "cuota": this.Soli.prima,
                    "saldo_a": saldo
                });
                this.totalRows++;
                if (tipo === 1 || tipo === 2){
                    if (tipo === 1){
                        dias = 7
                    }else if (tipo === 2){
                        dias = 15
                    }
                    for (let i = 0;  i < pagos; i++){
                        ANTES.setDate(ANTES.getDate() + dias);
                        this.DestallesPRecio.pagos.push({
                            "num": i+1,
                            "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
                            "saldo": saldo,
                            "cuota": cuota,
                            "saldo_a": (saldo - cuota).toFixed(2)
                        });
                        saldo = (saldo - cuota).toFixed(2);
                        this.totalRows++;
                    }
                }
                else{
                    for (let i = 0;  i < pagos; i++){
                        ANTES.setMonth(ANTES.getMonth() + 1);
                        this.DestallesPRecio.pagos.push({
                            "num": i+1,
                            "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
                            "saldo": saldo,
                            "cuota": cuota,
                            "saldo_a": (saldo - cuota).toFixed(2)
                        });
                        saldo = (saldo - cuota).toFixed(2);
                        this.totalRows++;
                    }
                }

            },
            notificacion(text, color){
                Vue.$toast.open({
                    message: text,
                    type: color,
                    position: 'bottom-left',
                    duration: 4000
                });
            },
            registrarPrecio(){
                this.dialogo = false;
                this.$store.commit('activarOverlay', true);
                let forma_pago= '';
                if (this.formaPago === 1)
                    forma_pago = 'Semanal';
                else if (this.formaPago === 2)
                    forma_pago = 'Quincenal';
                else if (this.formaPago === 3)
                    forma_pago = 'Mensual';
                this.$axios.put('solicitud_credito/precios/'+this.Soli.id,{
                    saldo_financiar: this.Soli.saldo_financiar,
                    tiempo:          this.Soli.tiempo,
                    forma_pago:      forma_pago,
                    detalles_precio: JSON.stringify(this.DestallesPRecio),
                    prima:           this.Soli.prima,
                    cuota:           this.Soli.cuota
                }).then((res)=>{
                    this.dialogo = true;
                    this.$store.commit('activarOverlay', false);
                    this.notificacion(
                        'Se ha registrado el cambio en el precio de la solicitud exitosamente',
                        'success'
                    );
                    this.alertaEnvio = false;
                }).catch((res)=>{
                    this.dialogo = true;
                    this.$store.commit('activarOverlay', true);
                    this.notificacion(
                        'Error',
                        'success'
                    );
                    this.$store.commit('activarOverlay', false);
                })
            },
            totalCreditos(){
                this.totalCredito = (parseFloat(this.Soli.prima) + parseFloat(this.Soli.saldo_financiar)).toFixed(2);
            },
        }
    }
</script>

<style scoped>

</style>
