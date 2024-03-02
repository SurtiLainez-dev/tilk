
<template>
    <v-container class="mt-0">
        <v-row justify="center">
            <v-col cols="12" >
                <v-card tile flat>
                    <v-card-text>
                       
                        <v-form @submit.prevent="submitForm">
                            <!-- Primer conjunto de campos -->
                            <v-actions-card class="d-flex justify-end align-self-start ml-auto">
                                <v-btn type="submit" color="success" tile class="ma-2">Guardar Cambios</v-btn>
                            </v-actions-card>
                            <v-divider></v-divider>
                            <v-row no-gutters>
                               
                                <v-col>
                                    <v-text-field v-model="formData.cod" label="Codigo"
                                     disabled  dense class="ma-2"></v-text-field>
                                </v-col>
                               
                                <v-col>
                                    <v-text-field v-model="formData.total" label="Total Inicial" prefix="L" dense class="ma-2" type="number" required></v-text-field>
                                </v-col>
                                <v-col >
                                    <v-text-field v-model="formData.saldo_actual" prefix="L" label="Saldo actual" type="number" required dense class="ma-2"></v-text-field>
                                </v-col>
                                <v-col>
                                <v-select v-model="formData.estado" :items="opcionesEstado" label="Estado" required dense class="ma-2"></v-select>
                                </v-col>
                                <v-col>
                                    <v-text-field v-model="formData.tasa_mora" prefix="%" label="Tasa de mora" type="number" required  dense class="ma-2"></v-text-field>
                                </v-col>
                            </v-row>

                            <!-- Tercer conjunto de campos -->
                            <v-row no-gutters>
                               
                                <v-col v-if="codSegmentoOptions.length > 0">
    <v-select v-model="formData.cod_segmento_id" label="Cod_segmento_id" disabled :items="codSegmentoOptions" dense class="ma-2"></v-select>
</v-col>
                                <v-col >
                                    <v-select v-model="formData.cod_portafolio_id" disabled label="Cob_portafolio_id" :items="codPortafolioOptions" required dense class="ma-2"></v-select>

                                </v-col>

                                 <v-col>
                                    <v-text-field v-model="formData.pagando" prefix="L" label="Pagando" type="number" required dense class="ma-2"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field v-model="formData.saldo_actual_cap" prefix="L" label="Saldo actual Capital" 
                                    type="number" required dense class="ma-2"></v-text-field>
                                </v-col>
                                <v-col >
                                    <v-text-field v-model="formData.total_abonado_capital" label="Total Abonado Capital"
                                     prefix="L" type="number" required  dense class="ma-2"></v-text-field>
                                </v-col> 

                            </v-row>

                         
                            <v-row no-gutters>
                                <v-col >
                                    <v-text-field v-model="formData.total_abonado" label="Total abonado" 
                                    prefix="L" type="number" required  dense class="ma-2"></v-text-field>
                                </v-col>
                                <v-col >
                                    <v-text-field v-model="formData.mora" label="Mora" prefix="L" required  dense class="ma-2"></v-text-field>
                                </v-col>
                                <v-col >
                                    <v-text-field v-model="formData.cuota" label="Cuota" prefix="L" type="number" required  dense class="ma-2"></v-text-field>
                                </v-col>
                                <v-col >
                                    <v-text-field v-model="formData.dis_mora" label="Dias de mora" type="number" required   dense class="ma-2"  ></v-text-field>
                                </v-col>
                            </v-row>

                    
                        </v-form>
                        <v-divider></v-divider>
                        <!--tabla  
                        -->
                        <tabla_de_pagos :num-cuotas="formData.num_cuotas" @nuevo-pago-agregado="handleNuevoPagoAgregado"></tabla_de_pagos>

                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

</template>

<script>
    import { mapState } from 'vuex';
    import tabla_de_pagos from "@/components/Ventas/cuentas/tabla_de_pagos";
    export default {
        components:{
            tabla_de_pagos
        },
        data() {
            return {
                formData: {
                    tipo_venta: '',
                    cod: '',
                    cliente_id: '',
                    colaborador_id: '',
                    total: '',
                    saldo_actual: '',
                    estado: null,
                    num_cuotas: '',
                    is_aceptado: '',
                    estado_cuenta: '',
                    tasa_mora: '',
                    finalizacion_garantia: '',
                    estado_garantia: null,
                    sucursal_id: '',
                    facturada: '',
                    descuento: '',
                    is_segunda: null,
                    comentarios: '',
                    estado_articulo: '',
                    cob_segmento_id: '',
                    cob_portafolio_id: '',
                    archivos_gestion: '',
                    gestiones: '',
                    proxima_gestion: '',
                    pagando: '',
                    saldo_actual_cap: '',
                    revision_documentos: '',
                    usuarios: '',
                    is_combo: '',
                    combo_id: '',
                    total_abonado_capital: '',
                    total_abonado: '',
                    mora: '',
                    cuota: '',
                    forma_pago: '',
                    fecha_prima: '',
                    fecha_vencimiento: '',
                    prima: '',
                    dias_mora: '',
                    saldo_financiar: '',

                }, opcionesEstado: [
                { text: 'Al día', value: 1 },
                { text: 'En mora', value: 2 },
                { text: 'Cancelar', value: 3 }
            	],opcionesEstadoGarantia: [
                { text: 'Sí', value: true },
                { text: 'No', value: false }
                ],issegunda:[
                { text: 'Sí', value: true },
                { text: 'No', value: false }
                ],iscombo:[
                { text: 'Sí', value: true },
                { text: 'No', value: false }
               
                ], codSegmentoOptions: [], 
                   codPortafolioOptions: [],
            };
        }, computed: {
            ...mapState({
                venta: state => state.cuentas.CUENTA,
            }),
        }, mounted() {
            // Asigna los datos de la venta a formData cuando el componente se monta
            this.fillFormData();
            this.formData.cod_portafolio_id = this.codPortafolioOptions[0].value;
            this.formData.cod_segmento_id = this.codSegmentoOptions[0].value; 
        },

        methods: {
            //rellena el formularios con los datos de venta
            
            fillFormData() {

                console.log('Datos enviados:', this.formData);

                this.formData.tipo_venta = this.venta.tipo_venta;
                this.formData.cod = this.venta.cod;
                this.formData.cliente_id = this.venta.cliente_id;
                this.formData.colaborador_id = this.venta.colaborador_id;
                this.formData.total = this.venta.total;
                this.formData.saldo_actual = this.venta.saldo_actual;
                this.formData.estado = this.venta.estado;
                this.formData.num_cuotas = this.venta.num_cuotas;
                this.formData.is_aceptado = this.venta.is_aceptado;
                this.formData.estado_cuenta = this.venta.estado_cuenta;
                this.formData.tasa_mora = this.venta.tasa_mora;
                this.formData.finalizacion_garantia = this.venta.finalizacion_garantia;
                this.formData.estado_garantia = this.venta.estado_garantia;
                this.formData.sucursal_id = this.venta.sucursal.nombre;
                this.formData.facturada = this.venta.facturada;
                this.formData.descuento = this.venta.descuento;
                this.formData.is_segunda = this.venta.is_segunda;
                this.formData.comentarios = this.venta.comentarios;
                this.formData.estado_articulo = this.venta.estado_articulo;
                this.codSegmentoOptions = [{ text: this.venta.cob_segmento.nombre, value: this.venta.cob_segmento.id }];
    this.codPortafolioOptions = [{ text: this.venta.cob_portafolio.nombre, value: this.venta.cob_portafolio.id }];

    // Asignar los nombres seleccionados a formData
    this.formData.cod_portafolio_nombre = this.venta.cob_portafolio.nombre;
    this.formData.cod_segmento_nombre = this.venta.cob_segmento.nombre;
                this.formData.archivos_gestion = this.venta.archivos_gestion;
                this.formData.gestiones = this.venta.gestiones;
                this.formData.proxima_gestion = this.venta.proxima_gestion;
                this.formData.pagando = this.venta.pagando;
                this.formData.saldo_actual_cap = this.venta.saldo_actual_cap;

                this.formData.revision_documentos = this.venta.revision_documentos;
                this.formData.usuarios = this.venta.usuarios;
                if (this.venta.is_combo === true) {
                    this.formData.is_combo = true;
                    } else {
                    this.formData.is_combo = false;
                    }
                this.formData.combo_id = this.venta.combo_id;
                this.formData.total_abonado_capital = this.venta.total_abonado_capital;
                this.formData.total_abonado = this.venta.total_abonado;
                this.formData.mora = this.venta.mora;
                this.formData.cuota = this.venta.cuota;
                this.formData.forma_pago = this.venta.forma_pago;
                this.formData.fecha_prima = this.venta.fecha_prima;
                this.formData.fecha_vencimiento = this.venta.fecha_vencimiento;
                this.formData.prima = this.venta.prima;
                this.formData.dias_mora = this.venta.dias_mora;
                this.formData.saldo_financiar = this.venta.saldo_financiar;
                this.formData.saldo_venta_financiera = this.venta.saldo_venta_financiera;
                this.$forceUpdate();
            },agregarNuevoPago() {
    // Incrementar el número de cuotas
    this.formData.num_cuotas++;

    // Crear un nuevo pago con campos vacíos
    const nuevoPago = {
        venta_id: this.formData.cod, // Asigna el ID de la venta
        pago_inicial: '',
        total_pago: '',
        total_abonado: '',
        saldo_actual: '',
        detalle: '',
        is_mora: 0,
        mora: '',
        interes: '',
        fecha_pago: '',
        is_cobro_mora: 0,
        estado: 1, // Por defecto, establecer el estado como 'Al día'
        dias_mora: '',
        dias_gracia: '',
        saldo_cap: ''
    };

    // Agregar el nuevo pago a la lista
    this.items.push(nuevoPago);
},  handleNuevoPagoAgregado() {
        // Incrementar num_cuotas y actualizar formData
        this.formData.num_cuotas++;
    },
            submitForm() {

                axios.put(`/url_para_actualizar_ventas/${this.$store.state.cuentas.CUENTA.id}`, this.formData)
                    .then(response => {
                        console.log('Respuesta del servidor:', response.data);

                    })
                    .catch(error => {
                        console.error('Error al enviar el formulario:', error);

                    });
            },
        }
    };
</script>
