<template>
    <div>
      <div class="d-flex">
        <v-card flat tile style="width: 95%">
          <div class="pa-2">
            <v-card tile class="pa-2" :loading="!cargarPRecio">
              <div class="row">
                <div class="col">
                  <div><span class="titleDatos">Marca</span></div>
                  <div><span class="subtitleDatos">{{data.marca}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Modelo</span></div>
                  <div><span class="subtitleDatos">{{data.modelo}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Codigo del Sistema</span></div>
                  <div><span class="subtitleDatos">{{data.marca}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Referencia</span></div>
                  <div><span class="subtitleDatos">{{data.referencia_fabricante?data.referencia_fabricante:''}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Cod. Barras</span></div>
                  <div><span class="subtitleDatos">{{data.codigo_barras?data.codigo_barras:''}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Familia</span></div>
                  <div><span class="subtitleDatos">{{data.fam}}</span></div>
                </div>
              </div>
            </v-card>
          </div>
          <div >
            <v-card class="ma-2" tile>
              <small class="ml-2">Datos para un nuevo precio</small>
              <br>
              <br>
              <v-form ref="FormVerificarMargenUtilidadAnual">
                <v-row no-gutters>
                  <v-col>
                    <v-text-field :disabled="Peps.length > 0?Precio.peps:0" v-model="Precio.peps" dense
                                  disabled label="Último precio ingresado en el peps" class="ma-2"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select v-model="Precio.imp" @change="leerImpuesto" :rules="[rules.impuesto.req]"
                              :items="Impuestos" label="Impuesto" class="ma-2" dense></v-select>
                  </v-col>
                  <v-col>
                    <v-text-field label="Precio de Costo sin Impuesto" class="ma-2" dense
                                  v-model="Precio.precio_s_i" suffix="lps"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field label="Margen de Utilidad" @keyup="validarTipoImpuesto(1)"
                                  :suffix="Precio.margenUtilidaReal+'%'" dense
                                  v-model="Precio.margenUtilidad" class="ma-2"
                                  :rules="[rules.impuesto.req, rules.impuesto.menor]"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field label="Precio Normal de Contado" @keyup.enter="validarTipoImpuesto(2)"
                                  v-model="Precio.precioContado"
                                  suffix="lps" class="ma-2" dense></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field label="Precio de Contado Online" v-model="precioOnline"
                                  suffix="lps" class="ma-2" dense></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="Precio.financiamientoAnual" :suffix="Precio.financiamientoMensual+'%'"
                                  @keyup="sacarFinanciamientoMensual" :rules="[rules.impuesto.req,rules.impuesto.m]"
                                  label="Financiamiento Anual" class="ma-2" dense></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col>
                    <v-text-field v-model="Precio.margenPrima" :suffix="Precio.margenPrima+'%'"
                                  @keyup="calcularPrima" label="Margen de Prima" class="ma-2"
                                  :rules="[rules.impuesto.req,rules.impuesto.m]" dense></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field label="Prima" disabled v-model="Precio.prima" class="ma-2"
                                  suffix="lps" dense></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field label="Descuento en LPS - Precio Normal" suffix="lps" dense
                                  class="ma-2" v-model="Precio.descuento"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field label="Maximo de meses a financiar" suffix="meses" :rules="[rules.impuesto.req,rules.impuesto.m]"
                                  v-model="Precio.maximo_meses" class="ma-2" dense></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field suffix="lps" label="Mejor Precio de Contado" disabled class="ma-2" dense
                                  :value="(parseFloat(Precio2.impuesto)+parseFloat(Precio2.margenGanancia)+parseFloat(Precio.precio_s_i)).toFixed(2) - Precio.descuento"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field suffix="lps" label="Precio de Temporada" class="ma-2"  dense
                                  v-model="Precio.precio_promocion"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-dialog ref="dialogFechaFinalPromocion" v-model="Precio.dialogoPrecioPromocio" :return-value.sync="Precio.fecha_final"
                              persistent width="290px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field label="Fecha Final Promoción" v-bind="attrs" v-on="on"
                                      v-model="Precio.fecha_final" dense class="ma-2"></v-text-field>
                      </template>
                      <v-date-picker v-model="Precio.fecha_final" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="Precio.dialogoPrecioPromocio = false">Cancelar</v-btn>
                        <v-btn text color="primary" @click="$refs.dialogFechaFinalPromocion.save(Precio.fecha_final)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col>
                    <v-text-field dense label="Precio de contado" class="ma-2"
                                  disabled  v-model="Precio.precioContado" suffix="lps"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field dense label="Cantidad de pagos" class="ma-2" @keyup="calcularCuotaPagosContado"
                                  :disabled="!data.precio_contado_pagos" v-model="Precio.pcp_pagos" suffix="pagos"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field dense label="Cuota" class="ma-2" disabled
                                  v-model="Precio.pcp_cuota" suffix="lps"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-dialog ref="dialogCantidadPagosPrecioContado" v-model="dialogoFechaPrecioC" :return-value.sync="finFechaCantPrecioContado"
                              persistent width="290px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field :label="'Fecha Final Para Venta de Contado a '+Precio.pcp_cuota+' pagos'" v-bind="attrs" v-on="on"
                                      v-model="finFechaCantPrecioContado" class="ma-2" :disabled="Precio.pcp_cuota === 0" dense></v-text-field>
                      </template>
                      <v-date-picker v-model="finFechaCantPrecioContado" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="dialogoFechaPrecioC = false">Cancelar</v-btn>
                        <v-btn text color="primary" @click="$refs.dialogCantidadPagosPrecioContado.save(finFechaCantPrecioContado)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col>
                    <v-text-field @keyup="calcularInteres" dense v-model="Precio.meses" class="ma-2"
                                  label="Probar con meses para probar interes"></v-text-field>
                  </v-col>
                  <v-col></v-col>
                  <v-col></v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="6">
                    <v-checkbox v-model="data.precio_contado_pagos" hide-details dense class="ma-2"
                                label="Agregar promoción de precio al contado con mas de un pago"></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-checkbox v-model="Precio.sin_prima" hide-details class="ma-2" label="Aceptar venta sin prima" dense></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-checkbox @change="cambiarPrecio" hide-details class="ma-2" label="Seleccionar precio del PEPS" dense></v-checkbox>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col class="d-flex justify-end">
                    <v-btn small tile color="success" @click="registrarPrecio" class="ma-2" dark>Registrar</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </div>
        </v-card>
        <v-card flat tile style="width: 5%; height: 100%">
          <div class="pa-2">
            <v-card tile>
              <v-row no-gutters><v-col class="d-flex justify-center mt-2"><small style="font-size: 8px">Acciones</small></v-col></v-row>
              <v-divider></v-divider>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip left>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab small @click="dialogoPrecioActual = true"
                             color="purple" dark icon><v-icon >mdi-tag-text</v-icon></v-btn>
                    </template>
                    <span>Datos del precio actual</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip left>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab small @click="dialogoPromo = true"
                             color="indigo" dark icon><v-icon >mdi-check-decagram-outline</v-icon></v-btn>
                    </template>
                    <span>Agregar Solo Precio de Promo</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip left>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab small color="success"  @click="dialogoCantPagos = true"
                             dark icon><v-icon>mdi-tag-plus</v-icon></v-btn>
                    </template>
                    <span>Agregar Pagos en Precio de Contado</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip left>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab small color="pink"
                             dark icon @click="dialogoPrecios = true"><v-icon>mdi-history</v-icon></v-btn>
                    </template>
                    <span>Ver todos los precios asignados</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip left>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab small color="orange"
                             dark icon><v-icon>mdi-chart-bar</v-icon></v-btn>
                    </template>
                    <span>Historial de precios</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip left>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab small color="blue"
                             dark icon><v-icon>mdi-compare-horizontal</v-icon></v-btn>
                    </template>
                    <span>Comparar historial de precios con otros aticulos</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip left>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab small color="cyan"
                             dark icon><v-icon>mdi-email-arrow-right</v-icon></v-btn>
                    </template>
                    <span>Enviar precio por correo</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip left>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab small color="teal"
                             dark icon><v-icon>mdi-whatsapp</v-icon></v-btn>
                    </template>
                    <span>Enviar por Whatsapp</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip left>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab small color="red" class="mb-2"
                             dark icon><v-icon>mdi-file-pdf-box</v-icon></v-btn>
                    </template>
                    <span>Descargar en PDF</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-card>
      </div>

      <div class="d-flex">
        <div style="width: 45%" class="pa-2">
          <v-card tile>
            <v-toolbar tile flat>
              <v-toolbar-title>Resultados del Precio</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-row no-gutters>
              <v-col>
                <table >
                  <tbody>
                  <tr>
                    <th class="bodyTrTitle">Precio de Costo</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(Precio.precio_s_i)}}</td>
                  </tr>
                  <tr >
                    <th class="bodyTrTitle">Impuesto</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(Precio2.impuesto)}}</td>
                  </tr>
                  <tr >
                    <th class="bodyTrTitle">Margen de Ganancia</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(Precio2.margenGanancia)}}</td>
                  </tr>
                  <tr >
                    <th class="bodyTrTitle">Precio de Contado</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format((parseFloat(Precio2.impuesto)+parseFloat(Precio2.margenGanancia)+parseFloat(Precio.precio_s_i)).toFixed(2))}}</td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle">Precio Temporada</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(Precio.precio_promocion)}}</td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle">Precio a Financiar</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(Precio2.precioConPrima)}}</td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle">Cuota Mensual</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(Precio2.cuota)}}</td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle">Total del Crédito</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format((Precio2.cuota * Precio.meses) + parseFloat(Precio.prima))}}</td>
                  </tr>
                  </tbody>
                </table>
              </v-col>
              <v-col>
                <table >
                  <tbody>
                  <tr>
                    <th class="bodyTrTitle"> -</th>
                    <td class="bodyTrSubTitle"></td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle">Precio con Impuesto</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(parseFloat(Precio2.impuesto) + parseFloat(Precio.precio_s_i))}}</td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle">Precio Online</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(precioOnline)}}</td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle">Mejor Precio de Contado</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format((parseFloat(Precio2.impuesto)+parseFloat(Precio2.margenGanancia)+parseFloat(Precio.precio_s_i)).toFixed(2) - Precio.descuento)}}</td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle"> Precio Contado/Cant. Pagos</th>
                    <td class="bodyTrSubTitle"></td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle">Prima Minima</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(Precio.prima)}}</td>
                  </tr>
                  <tr>
                    <th class="bodyTrTitle">Total de Intereses</th>
                    <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(Precio2.totalInteres)}}</td>
                  </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>
          </v-card>
        </div>

        <div style="width: 55%" class="pa-2">
          <v-card tile>
            <v-toolbar tile flat>
              <v-toolbar-title>Resultados del Financiamiento</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-simple-table v-if="Precio2.prueba.length > 0" class="rowsTable" height="400px">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Cuota</th>
                  <th>Saldo Antes</th>
                  <th>Capital</th>
                  <th>Intereses</th>
                  <th>Saldo Despues</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Precio2.prueba">
                  <td>{{item.pago}}</td>
                  <td>L. {{new Intl.NumberFormat().format(item.cuota)}}</td>
                  <td>L. {{new Intl.NumberFormat().format(item.antes)}}</td>
                  <td>L. {{new Intl.NumberFormat().format(item.capital)}}</td>
                  <td>L. {{new Intl.NumberFormat().format(item.intereses)}}</td>
                  <td>L. {{new Intl.NumberFormat().format(item.despues)}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </div>
      </div>


      <v-dialog v-model="dialogoPromo" width="30%">
        <v-card>
          <v-toolbar tile flat color="grey lighten-3"><v-card-title>Agregando Precio de Promo</v-card-title></v-toolbar>
          <v-form ref="FormPagoPromo">
            <br>
            <v-text-field dense label="Precio Promo" suffix="lps" class="ma-2" v-model="Precio.precio_promocion"
                          :rules="[rules.impuesto.req]"></v-text-field>
            <v-dialog ref="dialogFechaFinalPromocionAdd" v-model="Precio.dialogoPrecioPromocio" :return-value.sync="Precio.fecha_final"
                      persistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field label="Fecha Final Promoción" v-bind="attrs" v-on="on" :rules="[rules.impuesto.req]"
                              v-model="Precio.fecha_final" class="ma-2"></v-text-field>
              </template>
              <v-date-picker v-model="Precio.fecha_final" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="Precio.dialogoPrecioPromocio = false">Cancelar</v-btn>
                <v-btn text color="primary" @click="$refs.dialogFechaFinalPromocionAdd.save(Precio.fecha_final)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" tile text small dark @click="dialogoPromo = false">Cerrar</v-btn>
            <v-btn color="success" small tile dark @click="registrarPrecioPromo">Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogoCantPagos" width="35%">
        <v-card>
          <v-toolbar tile flat color="grey lighten-3"><v-card-title>Agregando Pagos a Precio de Contado</v-card-title></v-toolbar>
          <v-form class="ma-5" ref="FormCantidadPrecioContado">
            <br>
            <v-row>
              <v-col>
                <v-text-field dense label="Último Precio de Contado"
                              disabled suffix="lps" class="ma-2" :value="PrecioArticulo.length > 0 ? new Intl.NumberFormat().format(PrecioArticulo[0].precio_contado):0"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense label="Cantidad de Pagos" suffix="pagos" type="number" class="ma-2" v-model="CantidadPagosPrecioC"
                              :rules="[rules.impuesto.req]"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field class="ma-2" label="Cuota" suffix="lps" disabled
                              :value="PrecioArticulo.length > 0 && CantidadPagosPrecioC > 0 ? new Intl.NumberFormat().format((PrecioArticulo[0].precio_contado/CantidadPagosPrecioC).toFixed(2)) :0"></v-text-field>
              </v-col>
              <v-col>
                <v-dialog ref="dialogCantidadPagosPrecioContado" v-model="dialogoFechaPrecioC" :return-value.sync="finFechaCantPrecioContado"
                          persistent width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field :label="'Fecha Final Para Venta de Contado a '+CantidadPagosPrecioC+' pagos'" v-bind="attrs" v-on="on" :rules="[rules.impuesto.req]"
                                  v-model="finFechaCantPrecioContado" class="ma-2" :disabled="CantidadPagosPrecioC === 0"></v-text-field>
                  </template>
                  <v-date-picker v-model="finFechaCantPrecioContado" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialogoFechaPrecioC = false">Cancelar</v-btn>
                    <v-btn text color="primary" @click="$refs.dialogCantidadPagosPrecioContado.save(finFechaCantPrecioContado)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" tile text small dark @click="dialogoCantPagos = false">Cerrar</v-btn>
            <v-btn color="success" small tile dark @click="registrarCantidadPagosPrecioContado">Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogoPrecioActual" width="33%">
        <v-card>
          <v-toolbar tile flat><v-toolbar-title>Datos del Precio Actual</v-toolbar-title></v-toolbar>
          <v-divider></v-divider>

          <div class="pa-2">
            <table v-if="PrecioActual.length > 0">
              <tbody>
              <tr class="bodyTr">
                <th class="bodyTrTitle">Precio Costo Anterior:</th>
                <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(PrecioActual[0].precio_costo_antiguo)}}</td>
              </tr>
              <tr class="bodyTr">
                <th class="bodyTrTitle">Precio Costo Actual:</th>
                <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(PrecioActual[0].precio_costo_actual)}}</td>
              </tr>
              <tr class="bodyTr">
                <th class="bodyTrTitle">Margen de Ganancia Actual:</th>
                <td class="bodyTrSubTitle">L. {{(PrecioActual[0].precio_costo_actual * (PrecioActual[0].margen_ganancia/100)).toFixed(2)}} ({{PrecioActual[0].margen_ganancia}} %)</td>
              </tr>
              <tr class="bodyTr">
                <th class="bodyTrTitle">Impuesto:</th>
                <td class="bodyTrSubTitle">
                  L. {{new Intl.NumberFormat().format(((parseFloat(PrecioActual[0].precio_costo_actual) + parseFloat(PrecioActual[0].precio_costo_actual * (PrecioActual[0].margen_ganancia/100).toFixed(2))) * PrecioActual[0].impuesto.porcentaje).toFixed(2))}}
                  ({{PrecioActual[0].impuesto.nombre}} %)
                </td>
              </tr >
              <tr class="bodyTr">
                <th class="bodyTrTitle">Precio de Contado:</th>
                <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(PrecioActual[0].precio_contado)}}</td>
              </tr>
              <tr class="bodyTr">
                <th class="bodyTrTitle">Prima:</th>
                <td class="bodyTrSubTitle">L. {{new Intl.NumberFormat().format(PrecioActual[0].minimo_prima)}}</td>
              </tr>
              <tr class="bodyTr">
                <th class="bodyTrTitle">Financiamiento:</th>
                <td class="bodyTrSubTitle">
                  Mensual: {{(PrecioActual[0].financiamiento_anual/12).toFixed(2)}} %
                  -
                  Anual: {{PrecioActual[0].financiamiento_anual}} %
                </td>
              </tr>
              <tr class="bodyTr">
                <th class="bodyTrTitle">Fecha de Registro:</th>
                <td class="bodyTrSubTitle">{{PrecioActual[0].created_at.split('-')[2].split('T')[0]}}/{{PrecioActual[0].created_at.split('-')[1]}}/{{PrecioActual[0].created_at.split('-')[0]}}</td>
              </tr>
              <tr class="bodyTr">
                <th class="bodyTrTitle">Usuario de Registro:</th>
                <td class="bodyTrSubTitle">{{PrecioActual[0].user.usuario}}</td>
              </tr>
              </tbody>
            </table>
            <div v-else>
              <v-card-text>En este artículo aún no se han ingresado precios</v-card-text>
            </div>
          </div>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" class="ma-2" small tile dark @click="dialogoPrecioActual = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogoPrecios" width="95%">
        <v-card>
          <v-toolbar tile flat color="grey lighten-3"><v-card-title>Historico de Precios</v-card-title></v-toolbar>

          <v-card flat tile>
            <v-simple-table dense>
              <thead>
              <tr>
                <th>Precio de Costo Anterior</th>
                <th>Precio de Costo Actual</th>
                <th>Margen de Ganancia</th>
                <th>Impuesto</th>
                <th>Precio de Contado</th>
                <th>Precio de Online</th>
                <th>Prima</th>
                <th>Financiamiento</th>
                <th>Fecha de Registro</th>
                <th>Usuario</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in PrecioArticulo">
                <td>L. {{new Intl.NumberFormat().format(item.precio_costo_antiguo)}}</td>
                <td>L. {{new Intl.NumberFormat().format(item.precio_costo_actual)}}</td>
                <td>L. {{(item.precio_costo_actual * (item.margen_ganancia/100)).toFixed(2)}} ({{item.margen_ganancia}} %)</td>
                <td>
                  L. {{new Intl.NumberFormat().format(((parseFloat(item.precio_costo_actual) + parseFloat(item.precio_costo_actual * (item.margen_ganancia/100).toFixed(2))) * item.impuesto.porcentaje).toFixed(2))}}
                  ({{item.impuesto.nombre}} %)
                </td>
                <td>L. {{new Intl.NumberFormat().format(item.precio_contado)}}</td>
                <td>L. {{new Intl.NumberFormat().format(item.precio_online)}}</td>
                <td>L. {{new Intl.NumberFormat().format(item.minimo_prima)}}</td>
                <td>
                  Mensual: {{(item.financiamiento_anual/12).toFixed(2)}} %
                  -
                  Anual: {{item.financiamiento_anual}} %
                </td>
                <td>{{item.created_at.split('-')[2].split('T')[0]}}/{{item.created_at.split('-')[1]}}/{{item.created_at.split('-')[0]}}</td>
                <td>{{item.user.usuario}}</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-card>

          <v-divider></v-divider>

          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" class="ma-2" dark small tile @click="dialogoPrecios = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    mounted() {
      this.getPeps();
      this.getImpuestos();
      this.cargarPrecioArticulo()
    },
    data(){
      return{
        dialogoPrecioActual: false,
        dialogoFechaPrecioC: false,
        dialogoCantPagos: false,
        finFechaCantPrecioContado: '',
        CantidadPagosPrecioC: 0,
        dialogoPromo: false,
        PrecioArticulo: [],
        cargarPRecio: false,
        rules:{
          impuesto:{
            req: v => !!v || 'Campo Requerido',
            menor: v => v > 0 || 'Tiene que ser mayor a 0',
            m: v =>  v >= 0 || 'Dato Invalido',
          }
        },
        Peps:[],
        peps: false,
        Precio:{
          peps: '',
          selectPeps: false,
          imp: '',
          impuesto:'',
          impuesto_id: '',
          precio_s_i: this.data.precio_costo,
          margenUtilidad: '',
          precioContado: 0,
          margenUtilidaReal: '',
          financiamientoAnual:'',
          financiamientoMensual: '',
          margenPrima:'',
          prima:'',
          meses: '',
          descuento: 0,
          sin_prima: false,
          precio_contado_pagos: false,
          pcp_pagos: 0,
          pcp_cuota: 0,
          maximo_meses: 1,
          fecha_final: '',
          precio_promocion: 0,
          dialogoPrecioPromocio: false,
        },
        Precio2:{
          margenGanancia: 0,
          impuesto: 0,
          precioConPrima: 0,
          cuota: 0,
          prueba: [],
          totalInteres:0,
          totalCapital: 0
        },
        Impuestos: [],
        tipo_calcular: 0,
        precioOnline: 0,
        PrecioActual: [],
        dialogoPrecios: false
      }
    },
    methods:{
      calcularCuotaPagosContado(){
        if (this.Precio.precioContado > 0 && this.Precio.pcp_pagos > 1)
          this.Precio.pcp_cuota = (this.Precio.precioContado/this.Precio.pcp_pagos).toFixed(2);
      },
      calcularInteres(){
        let MESES  = this.Precio.meses;
        if (MESES > 0){
          this.Precio2.prueba = [];
          this.Precio2.totalInteres = 0;
          this.Precio2.totalCapital = 0
          let SALDO_FINANCIAR = this.Precio2.precioConPrima;
          let TASA_MENSUAL = this.Precio.financiamientoMensual / 100;
          let TASA = Math.pow(parseInt(1) + parseFloat(TASA_MENSUAL),-MESES);
          TASA = TASA - 1;
          TASA = TASA / TASA_MENSUAL;
          this.Precio2.cuota = (-SALDO_FINANCIAR/TASA).toFixed(2);

          console.log("saldo a Finananciar "+SALDO_FINANCIAR);
          console.log("Tasa "+TASA);

          this.probarFinanciamiento(TASA_MENSUAL, MESES);
        }

      },
      calcularPrecioContado(){
        this.Precio.margenUtilidaReal = this.Precio.margenUtilidad
        if (this.Precio.impuesto >= 0 && this.Precio.precio_s_i > 0){
          if (this.Precio.margenUtilidaReal > 0 && this.tipo_calcular === 1){
            if (this.Precio.margenUtilidaReal > 0) {
              if (this.Precio.margenUtilidaReal === 1)
                this.Precio.margenUtilidaReal = 0.0100;
              else
                this.Precio.margenUtilidaReal = (this.Precio.margenUtilidaReal / 100).toFixed(4);
            }
            this.Precio2.margenGanancia = (parseFloat(this.Precio.precio_s_i * this.Precio.margenUtilidaReal)).toFixed(4)
            let PRECIO_S_IMPUESTO = (parseFloat(this.Precio2.margenGanancia) + parseFloat(this.Precio.precio_s_i)).toFixed(4);
            this.Precio2.impuesto = (parseFloat(PRECIO_S_IMPUESTO * this.Precio.impuesto)).toFixed(4)
            let PRECIO_C_IMPUESTO = (parseFloat(this.Precio2.impuesto) + parseFloat(PRECIO_S_IMPUESTO)).toFixed(4);
            this.Precio.precioContado = PRECIO_C_IMPUESTO
          }else if (this.tipo_calcular === 2){
            let impuesto = (1 + parseFloat(this.Precio.impuesto)).toFixed(4);
            console.log(impuesto)
            this.Precio2.impuesto = (this.Precio.precioContado - (this.Precio.precioContado / impuesto).toFixed(4));
            let precioNormal = (this.Precio.precioContado - this.Precio2.impuesto).toFixed(2);
            let margenGanancia = (((precioNormal / this.Precio.precio_s_i) - 1)*100).toFixed(4);
            this.Precio2.margenGanancia = (precioNormal - this.Precio.precio_s_i).toFixed(2);
            this.Precio.margenUtilidad = margenGanancia
            this.Precio.margenUtilidaReal = (margenGanancia/100).toFixed(4);
          }
        }
      },
      calcularPrima(){
        let MARGEN_PRIMA = this.Precio.margenPrima;
        let PRECIO_CONTADO = this.Precio.precioContado;
        if (MARGEN_PRIMA >= 1){
          MARGEN_PRIMA = MARGEN_PRIMA / 100;
          this.Precio.prima = (PRECIO_CONTADO * MARGEN_PRIMA).toFixed(2)
        }else if (MARGEN_PRIMA < 1){
          this.Precio.prima = (PRECIO_CONTADO * MARGEN_PRIMA).toFixed(2)
        }
        this.Precio2.precioConPrima = (parseFloat(PRECIO_CONTADO) - parseFloat(this.Precio.prima)).toFixed(2)
        this.calcularInteres()
      },
      cambiarPrecio(){
        if (!this.Precio.selectPeps)
          this.Precio.precio_s_i = this.Precio.peps;
        else
          this.Precio.precio_s_i = this.data.precio_costo;
        this.calcularPrecioContado()
        this.calcularPrima()
      },
      cargarPrecioArticulo(){
        this.$axios.get('precio_articulos/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.PrecioArticulo = res.data.precio;
          this.PrecioActual   = this.PrecioArticulo.filter(item=>item.estado === 1);
          this.cargarPRecio = true;
        })
      },
      getImpuestos(){
        this.$axios.get('impuestos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            res.data.impuestos.forEach( (i) => {
              this.Impuestos.push({
                "text": i.nombre,
                "value"    : i.id+'-'+i.porcentaje
              })
            })
          }
        })
      },
      getPeps(){
        this.Peps = [];
        this.peps = false;
        this.$axios.get('peps/ultimo_registro/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200 && res.data.peps.length > 0){
            this.Peps = res.data.peps;
            this.Precio.peps = this.Peps[0].valor_unitario;
          }
          this.peps = true;
        })
      },
      leerImpuesto(){
        this.Precio.impuesto_id = this.Precio.imp.split('-')[0];
        this.Precio.impuesto    = this.Precio.imp.split('-')[1];
        if (this.Precio.margenUtilidad >= 0 && this.Precio.imp)
          this.calcularPrecioContado()
      },
      probarFinanciamiento(TASA_MENSUAL, T){
        let PAGOS = [];
        let antes = (parseFloat(this.Precio2.impuesto)+
            parseFloat(this.Precio2.margenGanancia)
            +parseFloat(this.Precio.precio_s_i)).toFixed(2);
        let despues =  (antes - this.Precio.prima).toFixed(2);
        let capital = 0
        PAGOS.push({
          "pago": 0,
          "cuota": this.Precio.prima,
          "antes": antes,
          "capital": capital,
          "intereses": 0,
          "despues": despues
        });
        let intereses = 0;
        for (let i = 0; i < T; i++){
          antes = despues;
          intereses = (antes * TASA_MENSUAL).toFixed(2);
          capital = (this.Precio2.cuota - intereses).toFixed(2);
          despues = (antes - capital).toFixed(2);
          PAGOS.push({
            "pago": parseInt(i) + parseInt(1),
            "cuota": this.Precio2.cuota,
            "antes": antes,
            "capital": capital,
            "intereses": intereses,
            "despues": despues
          });
          this.Precio2.totalCapital = (parseFloat(this.Precio2.totalCapital) + parseFloat(capital)).toFixed(2);
          this.Precio2.totalInteres = (parseFloat(this.Precio2.totalInteres) + parseFloat(intereses)).toFixed(2);
        }
        this.Precio2.prueba = PAGOS;
      },
      registrarCantidadPagosPrecioContado(){
        if (this.CantidadPagosPrecioC > 0 && this.finFechaCantPrecioContado){
          this.dialogoCantPagos = false;
          this.$store.commit('activarOverlay', true);
          this.$axios.post('precio_articulos/agregar_cant_pagos_pc',{
            id:       this.PrecioActual[0].id,
            cantidad: this.CantidadPagosPrecioC,
            fecha:    this.finFechaCantPrecioContado
          }).then((res)=>{
            this.$store.commit('activarOverlay', false);
            this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
            this.$store.commit('cambiarVistaPRecioArticulo', 1);
          }).catch((error)=>{
            this.$store.commit('activarOverlay', false);
            this.$store.commit('notificacion', {texto:'Hubo un error en el servidor', color:'error'});
          })
        }else
          this.$store.commit('notificacion',{texto:'Campos incompletos', color:'warning'});
      },
      registrarPrecio(){
        if (this.$refs.FormVerificarMargenUtilidadAnual.validate()){
          this.$store.commit('activarOverlay', true);
          this.$axios.put('precio_articulos/'+this.data.articulo,{
            precio_costo_antiguo: this.data.precio_costo,
            precio_costo_actual:  this.Precio.precio_s_i,
            precio_contado:       this.Precio.precioContado,
            prima:                this.Precio.prima,
            margen_ganancia:      this.Precio.margenUtilidad,
            financiamiento_anual: this.Precio.financiamientoAnual,
            impuesto:             this.Precio.impuesto_id,
            descuento:            this.Precio.descuento,
            venta_sin_prima:      this.Precio.sin_prima,
            pagos_contado:        this.Precio.pcp_pagos,
            maximo_financiacion:  this.Precio.maximo_meses,
            final_promocion:      this.Precio.fecha_final,
            precio_promocion:     this.Precio.precio_promocion,
            precio_online:        this.precioOnline
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.$store.commit('activarOverlay', false);
              Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente el nuevo precio del artículo ${this.data.nombre_articulo}.`,
                'success'
              );
              this.$store.commit('cambiarVistaPRecioArticulo', 1);
            }
          }).catch((error)=>{
            this.$store.commit('activarOverlay', false);
            this.$store.commit('notificacion',{texto:'Ha ocurrido un error en el servidor', color:'error'})
          })
        }
      },
      registrarPrecioPromo(){
        if (this.$refs.FormPagoPromo.validate()){
          this.dialogoPromo = false;
          this.$store.commit('activarOverlay', true);
          this.$axios.post('precio_articulos/agregar_promo',{
            id:           this.PrecioActual[0].id,
            precio_promo: this.Precio.precio_promocion,
            final_promo:  this.Precio.fecha_final
          }).then((res)=>{
            this.$store.commit('activarOverlay', false);
            this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
            this.$store.commit('cambiarVistaPRecioArticulo', 1);
          }).catch((error)=>{
            this.$store.commit('activarOverlay', false);
            this.$store.commit('notificacion', {texto:'Hubo un error en el servidor', color:'error'});
          })
        }else
          this.$store.commit('notificacion',{texto:'Hay campos incompletos', color:'warning'});
      },
      sacarFinanciamientoMensual(){
        let margen = this.Precio.financiamientoAnual
        if (margen < 1)
          margen = margen * 100
        this.Precio.financiamientoMensual = (margen / 12).toFixed(2)
        this.calcularInteres()
      },
      validarTipoImpuesto(tipo){
        this.tipo_calcular = tipo;
        this.calcularPrecioContado();
      }
    },
    props:{data: Object},
    name: "AsignacionPrecio"
  }
</script>

<style scoped>
.titleDatos{
  font-family: 'Rubik', sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #b2b0b0;
}
.subtitleDatos{
  font-family: 'Rubik', sans-serif;
  font-size: 11px;
  color: #aaaaaa;
}
.titleInput{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
table{
  border-collapse: collapse;
  width: 100%;
}
table tr th{
  font-family: 'Rubik', sans-serif;
  font-size: 12px;
  color: #47494e;
}
.containerInput{
  border: solid 1px #DADADA;
  padding: 2px;
  height: 30px;
}
select{
  font-size: 14px;
}
.bodyTrTitle{
  padding: 8px;
  font-family: 'Rubik', sans-serif;
}
.bodyTrSubTitle{
  color: #47494e;
  font-family: 'Rubik', sans-serif;
}
.bodyTr{
  border: solid 1px #b2b0b0;
}
</style>
