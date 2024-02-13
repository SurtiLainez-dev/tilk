<template>
  <v-card flat>
    <v-toolbar flat color="grey lighten-4">
      <h5>Agregando Cuenta</h5>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-stepper  v-model="pagina">
      <v-stepper-header >
        <v-stepper-step :complete="pagina > 1" step="1">Datos del Cliente</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="pagina > 2" step="2">Detalles del Cliente</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="pagina > 3" step="3">Detalles de la Cuenta</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="4">Pagos</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card-subtitle>Datos del Cliente</v-card-subtitle>
          <v-divider></v-divider>
          <v-card flat class="d-flex justify-center">
            <v-card flat width="40%">
              <v-form ref="FormDatosCliente">
                <v-text-field class="ma-1" v-model="data.cliente.identidad"
                              @keyup.enter="cargarCliente" loader-height="4"
                              :rules="[rules.select.req, rules.identidad.some, rules.identidad.id]"
                              :loading="load.identidad" dense outlined label="Identidad del Cliente"></v-text-field>

                <v-text-field class="ma-1" v-model="data.cliente.nombres"
                              ref="inputDCNombres" @keyup.enter="$refs.inputDCApellidos.focus()"
                              :disabled="!data.disabled.cliente" :rules="[rules.select.req]"
                              dense outlined label="Nombres del Cliente"></v-text-field>

                <v-text-field class="ma-1" v-model="data.cliente.apellidos"
                              ref="inputDCApellidos" @keyup.enter="$refs.inputDCSexo.focus()"
                              :disabled="!data.disabled.cliente" :rules="[rules.select.req]"
                              dense outlined label="Apellidos del Cliente"></v-text-field>

                <v-select class="ma-1" v-model="data.cliente.sexo"
                          ref="inputDCSexo"
                          :disabled="!data.disabled.cliente" :rules="[rules.select.req]"
                          dense :items="SelectSexos" outlined label="Sexo del Cliente"></v-select>

                <v-text-field class="ma-1" v-model="data.cliente.nacionalidad"
                              :disabled="!data.disabled.cliente" :rules="[rules.select.req]"
                              dense label="Nacionalidad" outlined></v-text-field>


                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-end">
                  <v-btn color="success" dark tile small @click="validarDatosCliente">Siguiente</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-toolbar flat dense>
            <v-card-subtitle>Dirección y Telefono del Cliente</v-card-subtitle>
            <v-spacer></v-spacer>
            <v-btn color="indigo" small dark class="ma-2" tile @click="Ciudad.dialogo = true">Ciudad/Caserio/Aldea Nueva</v-btn>
            <v-btn color="indigo" small dark class="ma-2" tile @click="Colonia.dialogo = true">Colonia Nueva</v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <table>
            <thead>
            <tr>
              <th>Identidad</th>
              <th>Nombre Completo</th>
              <th>Sexo</th>
              <th>Nacionalidad</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{data.cliente.identidad}}</td>
              <td>{{data.cliente.nombres}} {{data.cliente.apellidos}}</td>
              <td v-if="data.cliente.sexo === 1 ">Masculino</td>
              <td v-else>Femenino</td>
              <td>{{data.cliente.nacionalidad}}</td>
            </tr>
            </tbody>
          </table>
          <v-form ref="FormDetallesCliente">
            <v-card flat class="ma-1">
              <v-card-subtitle>Dirreción del Cliente</v-card-subtitle>
              <v-simple-table style="width: 99%" dense class="rowsTable">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>Departamento</th>
                    <th>Municipio</th>
                    <th>Ciudad/Aldea/Caserio</th>
                    <th>Colonia</th>
                    <th style="border-right: solid #b2b0b0 1px;">Dirección Completa</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in data.direcciones">
                    <td style="width: 15%">
                      <v-autocomplete v-model="item.departamento" :rules="[rules.select.req]"
                                      @change="cargarMunicipio(item)" outlined dense
                                      :disabled="item.key < logns.direcciones"
                                      :items="DEPARTAMENTOS" :item-text="'nombre'" :item-value="'id'">
                      </v-autocomplete>
                    </td>
                    <td style="width: 15%">
                      <v-autocomplete :items="item.Municipios" v-model="item.municipio"
                                      :disabled="item.key < logns.direcciones"
                                      :rules="[rules.select.req]" dense
                                      :item-text="'nombre'" :item-value="'id'" outlined
                                      @change="cargarCiudades(item)">
                      </v-autocomplete>
                    </td>
                    <td style="width: 20%">
                      <v-autocomplete :items="item.Ciudades" v-model="item.ciudad"
                                      :disabled="item.key < logns.direcciones"
                                      :rules="[rules.select.req]" outlined
                                      @change="cargarColonias(item)" dense
                                      :item-text="'nombres'" :item-value="'id'">
                      </v-autocomplete>
                    </td>
                    <td style="width: 20%">
                      <v-autocomplete :items="item.Colonias" :rules="[rules.select.req]"
                                      v-model="item.colonia" outlined
                                      :disabled="item.key < logns.direcciones" dense
                                      :item-text="'nombre'" :item-value="'id'">
                      </v-autocomplete>
                    </td>
                    <td style="border-right: solid #b2b0b0 1px;">
                      <v-textarea v-model="item.detalle" counter
                                  :rules="[rules.select.req, rules.detalle.min, rules.detalle.max]"
                                  :rows="2" dense outlined>
                      </v-textarea>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <br>
              <v-card-subtitle>Telefono del Cliente</v-card-subtitle>
              <v-simple-table style="width: 99%" class="rowsTable" dense>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>Detalle</th>
                    <th>Cod.</th>
                    <th style="border-right: solid #b2b0b0 1px;">Teléfono</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in data.telefonos">
                    <td style="width: 40%">
                      <v-text-field dense :disabled="item.key < logns.telefonos" outlined counter
                                    :rules="[rules.select.req, rules.detalleTelefono.min]"
                                    v-model="item.detalle"></v-text-field>
                    </td>
                    <td style="width: 20%">
                      <v-text-field dense :disabled="item.key < logns.telefonos" outlined counter
                                    :rules="[rules.select.req]"
                                    v-model="item.area"></v-text-field>
                    </td>
                    <td style="border-right: solid #b2b0b0 1px;">
                      <v-text-field dense :disabled="item.key < logns.telefonos" outlined counter
                                    :rules="[rules.select.req, rules.num.min, rules.num.max, rules.num.tel]"
                                    v-model="item.num"></v-text-field>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" @click="pagina = 1" dark tile small >Volver</v-btn>
            <v-btn color="success" dark tile small @click="validarDetallesCliente">Siguiente</v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card-subtitle>Detalles del Pago</v-card-subtitle>
          <table>
            <thead>
            <tr>
              <th>Identidad</th>
              <th>Nombre Completo</th>
              <th>Sexo</th>
              <th>Nacionalidad</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{data.cliente.identidad}}</td>
              <td>{{data.cliente.nombres}} {{data.cliente.apellidos}}</td>
              <td v-if="data.cliente.sexo === 1 ">Masculino</td>
              <td v-else>Femenino</td>
              <td>{{data.cliente.nacionalidad}}</td>
            </tr>
            </tbody>
          </table>
          <v-form ref="FormDetallesPrecio">
            <v-card-subtitle>Datos del Artículo</v-card-subtitle>
            <v-divider></v-divider>
            <v-row no-gutters>
              <v-col cols="4">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-text-field v-on="on" v-bind="attrs" v-model="data.articulo.nombre"
                                  :rules="[rules.select.req]" dense class="mt-1"
                                  outlined label="Artículo" @keyup.enter="dialogo.articulos = true">
                    </v-text-field>
                  </template>
                  <span>Enter para expandir los artículos</span>
                </v-tooltip>
              </v-col>
              <v-col>
                <v-text-field class="ma-1" dense disabled v-model="data.articulo.familia"
                              outlined label="Familía" :rules="[rules.select.req]">
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense class="ma-1" v-model="data.articulo.serie" :rules="[rules.select.req]" @keyup.enter="fabricarSerie"
                              outlined label="Serie del Fabricante" hint="Para fabricar presione enter" persistent-hint>
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense outlined :rules="[rules.select.req]" class="mt-1"
                              v-model="data.articulo.color" label="Color">
                </v-text-field>
              </v-col>
            </v-row>
            <v-card-subtitle>Datos del Precio</v-card-subtitle>
            <v-divider></v-divider>
            <v-row no-gutters >
              <v-col>
                <v-text-field dense class="mt-1" label="Total Inicial del Crédito"
                              @change="calcularCuota" @keyup.enter="$refs.inputPrima.focus()"
                              prefix="L" :rules="[rules.select.req, rules.moneda.num]"
                              outlined v-model="data.cuenta.total_inicial"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense class="ma-1" label="Prima" prefix="L"
                              ref="inputPrima" @keyup.enter="$refs.inputFormaPago.focus()"
                              :rules="[rules.select.req, rules.moneda.num]"
                              @change="calcularCuota"
                              outlined v-model="data.cuenta.prima"></v-text-field>
              </v-col>
              <v-col>
                <v-select dense outlined label="Forma de Pago"
                          ref="inputFormaPago" @keyup.enter="$refs.inputCuotas.focus()"
                          v-model="data.cuenta.forma_pago"
                          class="ma-1" :items="selectFormaPago" :rules="[rules.select.req]">
                </v-select>
              </v-col>
              <v-col>
                <v-text-field dense class="ma-1" label="# de Cuotas" @change="calcularCuota"
                              @keyup.enter="$refs.inputEstadoCuenta.focus()"
                              v-model="data.cuenta.cuotas" ref="inputCuotas"
                              outlined :rules="[rules.select.req, rules.moneda.num]">
                </v-text-field>
              </v-col>
              <v-col>
                <v-select dense class="mt-1" label="Estado de la Cuenta"
                          @keyup.enter="$refs.inputSaldoCapital.focus()"
                          :items="selectEstadoCuenta" ref="inputEstadoCuenta"
                          outlined v-model="data.cuenta.estado" :rules="[rules.select.req]">
                </v-select>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field prefix="L" class="mt-1" :rules="[rules.select.req, rules.moneda.num]"
                              @keyup.enter="$refs.inputSaldoMora.focus()"
                              @change="calcularSaldoCapital"
                              hint="Es el saldo actual de la cuenta sin mora" persistent-hint
                              v-model="data.cuenta.saldo_capital" ref="inputSaldoCapital"
                              dense outlined label="Saldo Capital">
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense outlined label="Saldo en Mora" class="ma-1"
                              @change="calcularSaldoCapital"
                              :rules="[rules.moneda.num]" ref="inputSaldoMora"
                              @keyup.enter="$refs.inputSaldoActualCuenta.focus()"
                              prefix="L" v-model="data.cuenta.saldo_mora">
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field prefix="L" class="ma-1" :rules="[rules.select.req, rules.moneda.num]"
                              @keyup.enter="$refs.inputTotalAbonado.focus()"
                              v-model="data.cuenta.saldo_actual" ref="inputSaldoActualCuenta"
                              dense outlined label="Saldo Actual de la Cuenta">
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense outlined label="Total Abonado" prefix="L"
                              v-model="data.cuenta.total_abonado" ref="inputTotalAbonado"
                              @keyup.enter="$refs.inputCuota.focus()"
                              hint="Abonado a Capital e Intereses(mora no)" persistent-hint
                              class="ma-1" :rules="[rules.select.req, rules.moneda.num]"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense outlined label="Cuota" class="mt-1"
                              v-model="data.cuenta.couta" ref="inputCuota"
                              @keyup.enter="dialogo.fechaPrima = true"
                              prefix="L" :rules="[rules.select.req, rules.moneda.num]">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-dialog ref="dialogoFechaPrima" :return-value.sync="data.cuenta.fecha_prima" persistent
                          width="290px" v-model="dialogo.fechaPrima">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="data.cuenta.fecha_prima" label="Fecha de la Prima"
                                  :rules="[rules.select.req]" dense class="ma-1"
                                  readonly v-bind="attrs" v-on="on" outlined>
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="data.cuenta.fecha_prima" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn tile small dark color="orange" @click="dialogo.fechaPrima = false">Cerrar</v-btn>
                    <v-btn tile small color="indigo" class="text-white"
                           @click="saveFechaPrima" :disabled="!data.cuenta.fecha_prima">Seleccionar</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <v-col>
                <v-dialog ref="dialogoFechaVencimiento" :return-value.sync="data.cuenta.fecha_vencimiento" persistent
                          width="290px" v-model="dialogo.fechaVencimiento">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="data.cuenta.fecha_vencimiento" label="Fecha de Vencimiento"
                                  persistent-hint hint="Último Pago de la Cuenta"
                                  :rules="[rules.select.req]" dense class="ma-1"
                                  readonly v-bind="attrs" v-on="on" outlined></v-text-field>
                  </template>
                  <v-date-picker v-model="data.cuenta.fecha_vencimiento" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn tile small dark color="orange" @click="dialogo.fechaVencimiento = false">Cerrar</v-btn>
                    <v-btn tile small color="indigo" class="text-white"
                           @click="saveFechaVencimiento" :disabled="!data.cuenta.fecha_vencimiento">Seleccionar</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <v-col>
                <v-select dense class="ma-1" outlined :rules="[rules.select.req]"
                          v-model="data.cuenta.sucursal" :item-value="'id'"
                          :loading="load.sucursales" loader-height="3"
                          @change="cargarColaboradores"
                          :items="Sucursales" :item-text="'nombre'" label="Sucursal de Venta">
                </v-select>
              </v-col>
              <v-col>
                <v-autocomplete dense class="ma-1" outlined :rules="[rules.select.req]"
                                v-model="data.cuenta.colaborador"
                                :loading="load.colaboradores" loader-height="3"
                                :items="Colaboradores" label="Colaborador">
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" @click="pagina = 2" dark tile small >Volver</v-btn>
            <v-btn color="success" dark tile small @click="validarDetallesPrecio">Siguiente</v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-card-actions class="d-flex justify-end">
            <v-btn small tile color="orange" dark @click="pagina = 3" >Volver</v-btn>
          </v-card-actions>
          <table>
            <thead>
            <tr>
              <th colspan="2">Identidad</th>
              <th colspan="2">Nombre Completo</th>
              <th>Sexo</th>
              <th>Nacionalidad</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td colspan="2">{{data.cliente.identidad}}</td>
              <td colspan="2">{{data.cliente.nombres}} {{data.cliente.apellidos}}</td>
              <td v-if="data.cliente.sexo === 1 ">Masculino</td>
              <td v-else>Femenino</td>
              <td>{{data.cliente.nacionalidad}}</td>
            </tr>
            </tbody>
            <thead>
            <tr>
              <th>Total Inicial</th>
              <th>Prima</th>
              <th>Forma de Pago</th>
              <th># Cuotas</th>
              <th>Estado de la Cuenta</th>
              <th>Saldo Capital</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>L. {{int.format(data.cuenta.total_inicial)}}</td>
              <td>L. {{int.format(data.cuenta.prima)}}</td>
              <td v-if="data.cuenta.estado === 1">Semanal</td>
              <td v-else-if="data.cuenta.estado === 2">Quincenal</td>
              <td v-else-if="data.cuenta.estado === 3">Mensual</td>
              <td>{{data.cuenta.cuotas}}</td>
              <td v-if="data.cuenta.estado === 1">Al Día</td>
              <td v-else-if="data.cuenta.estado === 2">Mora</td>
              <td>L. {{int.format(data.cuenta.saldo_capital)}}</td>
            </tr>
            </tbody>
            <thead>
            <tr>
              <th>Saldo en Mora</th>
              <th>Saldo Actual</th>
              <th>Total Abonado</th>
              <th>Cuota</th>
              <th>Fecha de Prima</th>
              <th>Fecha Vencimiento</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>L. {{int.format(data.cuenta.saldo_mora)}}</td>
              <td>L. {{int.format(data.cuenta.saldo_actual)}}</td>
              <td>L. {{int.format(data.cuenta.total_abonado)}}</td>
              <td>L. {{int.format(data.cuenta.couta)}}</td>
              <td>{{data.cuenta.fecha_prima.split('-')[2]}}/{{data.cuenta.fecha_prima.split('-')[1]}}/{{data.cuenta.fecha_prima.split('-')[0]}}</td>
              <td>{{data.cuenta.fecha_vencimiento.split('-')[2]}}/{{data.cuenta.fecha_vencimiento.split('-')[1]}}/{{data.cuenta.fecha_vencimiento.split('-')[0]}}</td>
            </tr>
            </tbody>
          </table>
          <pagos_ingreso_cuenta_manual :revision="revision" :data="data"/>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-dialog v-model="dialogo.articulos" width="90%">
      <v-card class="pa-5">
        <v-toolbar flat color="grey lighten-4">
          <h5>Artículos Existentes</h5>
          <v-spacer></v-spacer>
          <v-text-field dense label="Buscar Artículo" v-model="searchArticulo"></v-text-field>
        </v-toolbar>
        <v-data-table :headers="headerArticulo"
                      class="rowsTable"
                      @click:row="addArticulo"
                      :loading="load.articulos"
                      loading-text="Cargando Inventario"
                      :search="searchArticulo"
                      :items="articulos"
                      dense>
          <template v-slot:item.id="{item}">
            <v-btn color="success" class="ma-1" dark fab tile x-small>
              <v-icon>fa fa-arrow-right</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-divider></v-divider>
        <v-card-title class="d-flex justify-end">
          <v-btn color="orange" tile small dark @click="dialogo.articulos = false">Cerrar</v-btn>
        </v-card-title>
      </v-card>
    </v-dialog>

    <v-dialog v-model="Ciudad.dialogo" width="30%">
      <v-card>
        <v-row class="grey lighten-5" no-gutters>
          <v-col cols="11">
            <v-card-title>Nueva ciudad/caserio/aldea </v-card-title>
          </v-col>
        </v-row>
        <v-form ref="FormCiudadNueva"  class="pl-5 pr-5">
          <v-select label="Seleccione un departamento" :items="DEPARTAMENTOS"
                    :rules="[Ciudad.rules.r.req]" @change="loadMunicipios"
                    :item-value="'id'" :item-text="'nombre'"
                    v-model="Ciudad.departamento">
          </v-select>
          <v-autocomplete label="Seleccione un municipio" v-model="Ciudad.municipio"
                          :item-value="'id'" :item-text="'nombre'"
                          :rules="[Ciudad.rules.r.req]"
                          :items="Municipios">
          </v-autocomplete>
          <v-text-field v-model="Ciudad.nombre" counter
                        :rules="[Ciudad.rules.r.req, Ciudad.rules.r.min, Ciudad.rules.r.max]"
                        label="Nombre de la ciudad/caserio/aldea" ></v-text-field>
          <v-select label="Tipo" :items="Ciudad.tipo_data"
                    :rules="[Ciudad.rules.r.req]"
                    v-model="Ciudad.tipo"></v-select>
        </v-form>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="warning" small @click="Ciudad.dialogo = false" dark>Cerrar</v-btn>
          <v-btn color="success" small @click="validarFormCiudad" dark>Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="Colonia.dialogo" width="30%">
      <v-card>
        <v-row class="grey lighten-5" no-gutters>
          <v-col cols="11">
            <v-card-title>Nueva colonia </v-card-title>
          </v-col>
        </v-row>
        <v-form ref="FormColoniaNueva"  class="pl-5 pr-5">
          <v-select label="Seleccione un departamento" :items="DEPARTAMENTOS"
                    :rules="[Ciudad.rules.r.req]"
                    :item-value="'id'" :item-text="'nombre'" v-model="Ciudad.departamento"
                    @change="loadMunicipios">
          </v-select>
          <v-autocomplete label="Seleccione un municipio" v-model="Ciudad.municipio"
                          :item-value="'id'" :item-text="'nombre'" @change="loadCiudades"
                          :rules="[Ciudad.rules.r.req]" :items="Municipios">
          </v-autocomplete>
          <v-autocomplete label="Seleccione una ciudad/aldea/caserio" v-model="Colonia.ciudad"
                          :item-value="'id'" :item-text="'nombres'"
                          :rules="[Ciudad.rules.r.req]"
                          :items="Ciudades">
          </v-autocomplete>
          <v-text-field v-model="Colonia.nombre" counter
                        :rules="[Ciudad.rules.r.req, Ciudad.rules.r.min, Ciudad.rules.r.max]"
                        label="Nombre de la colonia" >
          </v-text-field>

        </v-form>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="warning" small @click="Ciudad.dialogo = false" dark>Cerrar</v-btn>
          <v-btn color="success" small @click="validarFormColonia" dark>Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
import Vue from "vue";
import pagos_ingreso_cuenta_manual from "@/components/tablas/cuentas/pagos_ingreso_cuenta_manual.vue";
export default {
  name: "pestana_venta_manual",
  components:{pagos_ingreso_cuenta_manual},
  data(){
    return{
      pagina: 1,
      validarDatos: false,
      int: Intl.NumberFormat(),
      articulos: [],
      Ciudad:{
        rules:{
          r:{
            req: v => !!v || 'Campo requerido',
            min:v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
            max:v => (v && v.length <= 60) || 'Tiene que ser menor o igual a 60 carácteres.',
          }
        },
        dialogo:   false,
        departamento: '',
        municipio:    '',
        nombre:       '',
        tipo:         '',
        tipo_data: [
          {text:'Caserio', value:'Caserio'},
          {text:'Ciudad', value:'Ciudad'},
          {text:'Aldea', value:'Aldea'}
        ]
      },
      Ciudades: [],
      Colaboradores:[],
      Colonia:{
        nombre: '',
        ciudad: '',
        dialogo: false
      },
      currentPage: 1,
      data:{
        disabled: {
          cliente: false,
          cuerpo:  true
        },
        articulo:{
          id: null,
          nombre: '',
          familia: '',
          color:   'CS',
          serie:   ''
        },
        cliente:{
          id: null,
          nombres: '',
          apellidos: '',
          identidad: '',
          sexo: '',
          nacionalidad: 'Hondureña'
        },
        direcciones:[],
        telefonos: [],
        cuenta:{
          saldo_capital: 0,
          total_inicial: 0,
          prima: 0,
          tiempo: 0,
          cuotas: 0,
          estado: '',
          saldo_actual: 0,
          total_abonado: 0,
          saldo_mora: 0,
          couta: 0,
          forma_pago: 3,
          fecha_prima:'',
          fecha_vencimiento: '',
          sucursal: '',
          colaborador: '',
        },
        pagos: []
      },
      dialogo:{
        articulos: false,
        fechaPrima: false,
        fechaVencimiento: false
      },
      headerArticulo:[
        {text: 'Nombre del Artículo', value:'nombre_articulo'},
        {text: 'Módelo', value:'modelo'},
        {text: 'Código del Proveedor', value:'codigo_proveedor'},
        {text: 'Familía', value:'sub_familia_articulo.familia_articulo.nombre'},
        {text: 'Sub-familía', value:'sub_familia_articulo.nombre'},
        {text: 'Marca', value:'marca.nombre'},
        {text: 'Proveedor', value:'marca.proveedor.nombre'},
        {text: 'Seleccionar', value:'id'},
      ],
      headerPagos:[
        'fecha_pago',
        {key: 'detalle',stickyColumn: true, isRowHeader: true, variant: 'light'},
        'pago_inicial',
        'total_abonado',
        'saldo_cap',
        'mora',
        'total_pago',
        'saldo_actual',
        'is_mora',
        'estao',
        'inicio_mora',
        'dias_mora',
        'revisado',
      ],
      load:{
        identidad: false,
        articulos: false,
        sucursales: false,
        colaboradores: false
      },
      logns:{
        direcciones:0,
        telefonos: 0
      },
      Municipios: [],
      perPage:25,
      searchArticulo: 'FINANCIAMI',
      selectEstadoCuenta:[
        {text:'Al día', value:1},
        {text:'Mora', value:2},
      ],
      selectEstado:[
        {text:'Sin Mora Actual', value:0},
        {text:'Mora', value:1},
      ],
      selectFormaPago:[
        {text:'Semanal', value:1},
        {text:'Quincenal', value:2},
        {text:'Mensual', value:3},
      ],
      selectPago:[
        {text:'Al día', value:1},
        {text:'Mora', value:2},
        {text:'Cancelado', value:3},
        {text:'Condonado', value:4},
      ],
      SelectSexos:[
        {text: 'Masculino', value: 1},
        {text: 'Femenino', value: 2},
      ],
      Sucursales: [],
      revision:{
        sis:{
          revisados: 0,
          mora:      0
        },
        user:{
          revisados: 0,
          mora:      0,
          saldo_actual: 0
        }
      },
      rules: {
        check:{
          check: value => value === true || value == 1 || 'Falta Revisarlo'
        },
        revision:{
          revisados: value => this.revision.sis.revisados === value || this.revision.user.revisados +' de '+this.revision.sis.revisados+' revisados',
          saldo_actual: value => parseFloat(this.data.cuenta.saldo_actual) === parseFloat(value) || 'Saldo actual de la cuenta: L '+this.data.cuenta.saldo_actual+' - Saldo de actual de los pagos: L '+value,
          saldo_mora:   value => this.data.cuenta.saldo_mora == value || 'Saldo en mora de la cuenta: L '+this.data.cuenta.saldo_mora+' - Saldo en mora de los pagos: L'+ value
        },
        moneda:{
          num: v => (v.length === 0 || v < 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Carácter invalído'
        },
        select: {
          req: v => !!v || 'Campo requerido',
        },
        detalle:{
          min: v => (v && v.length >= 40) || 'Tiene que ser mayor a 40 carácteres.',
          max: v => (v && v.length <= 250) || 'Tiene que ser menor o igual a 250 carácteres.',
        },
        identidad: {
          some:v => (v.length === 0 || v.length === 13 || v.length === 14) || 'Tiene que ser de 13 o 14 carácteres.',
          id: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Identidad no válida, tienes datos diferentes a números'
        },
        num: {
          min:v => (v && v.length >= 8) || 'Tiene que ser mayor O igual a 8 números.',
          max:v => (v && v.length <= 20) || 'Tiene que ser menor o igual a 20 números.',
          tel: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Campo no válido, tienes datos diferentes a números'
        },
        detalleTelefono:{
          min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
          max: v => (v && v.length <= 25) || 'Tiene que ser menor o igual a 25 carácteres.',
        }
      },
      totalRows: 1
    }
  },
  computed:{
    DEPARTAMENTOS(){
      return this.$store.state.direcciones.DEPARTAMENTOS;
    },
    MUNICIPIOS(){
      return this.$store.state.direcciones.MUNICIPIOS;
    },
    DISTRITOS(){
      return this.$store.state.direcciones.DISTRITOS;
    },
    COLONIAS(){
      return this.$store.state.direcciones.COLONIAS;
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Ventas > Nueva Venta Manual');
    this.data.direcciones.push({
      departamento: '',
      municipio:    '',
      ciudad:       '',
      colonia:      '',
      detalle:      '',
      key:          this.data.direcciones.length,
      Municipios:   [],
      Ciudades:     [],
      Colonias:     [],
    });
    this.data.telefonos.push({
      num:     '',
      detalle: 'Telefono '+(parseInt(this.data.telefonos.length) + parseInt(1)),
      areA:    '504',
      key:     this.data.telefonos.length
    });
    this.cargarInventario();
    this.cargarSucursales();
  },
  methods:{
    addArticulo(data){
      this.data.articulo.id      = data.id;
      this.data.articulo.nombre  = data.nombre_articulo;
      this.data.articulo.familia = data.sub_familia_articulo.familia_articulo.nombre;
      this.dialogo.articulos     = false;
    },
    agregarPago(p_i, t_p, t_a, s_a, f_p, d){
      this.data.pagos.push({
        pago_inicial:  p_i,
        total_pago:    t_p,//
        total_abonado: t_a,//
        saldo_actual:  s_a,//
        is_mora:       '',//
        inicio_mora:   '',//
        fecha_pago:    f_p,//
        estao:        '',
        dias_mora:     0,//
        detalle:       d,//
        revisado:      false,//
        mora:          0,//,
        dialogo:       false,
        key:           this.data.pagos.length,
        dialogoMora:   false,
        saldo_cap:     p_i
      })
    },
    calcularCuota(){
      if (this.data.cuenta.total_inicial > 0 && this.data.cuenta.prima > 0 && this.data.cuenta.cuotas > 0)
        this.data.cuenta.couta = ((this.data.cuenta.total_inicial - this.data.cuenta.prima)/this.data.cuenta.cuotas).toFixed(2)

      // this.calcularFechaVencimiento();
      this.calcularTotalAbonado();
    },
    calcularDiasMora(data){
      let f = new Date();
      let fecha1 = new Date(f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate()).getTime();
      let fecha2 = new Date(data.inicio_mora).getTime();
      let diff   = fecha1 - fecha2;
      data.dias_mora = diff/(1000*60*60*24)
    },
    calcularFechaVencimiento(){
      if (this.data.cuenta.fecha_prima){
        console.log('fecha de la prima: '+this.data.cuenta.fecha_prima)
        console.log('Cuotas: '+this.data.cuenta.cuotas);
        let fecha = new Date(this.data.cuenta.fecha_prima+'T00:00:00');
        fecha.setMonth(fecha.getMonth() + parseInt(this.data.cuenta.cuotas));
        console.log('Fecha setteada: '+fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getDate())
        this.data.cuenta.fecha_vencimiento = fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getDate();
      }
    },
    calcularPagos(){
      if (this.data.cuenta.forma_pago === 1)
        return this.data.cuenta.cuotas * 4;
      else if (this.data.cuenta.forma_pago === 2)
        return this.data.cuenta.cuotas * 2;
      else if (this.data.cuenta.forma_pago === 3)
        return this.data.cuenta.cuotas
    },
    calcularSaldoCapital(){
      if (this.data.cuenta.saldo_capital > 0 && this.data.cuenta.saldo_mora > 0)
        this.data.cuenta.saldo_actual = (parseFloat(this.data.cuenta.saldo_capital) + parseFloat(this.data.cuenta.saldo_mora)).toFixed(2)

      this.calcularTotalAbonado();
    },
    calcularTotalAbonado(){
      if (this.data.cuenta.total_inicial > 0 && this.data.cuenta.saldo_capital > 0)
        this.data.cuenta.total_abonado = (parseFloat(this.data.cuenta.total_inicial) - parseFloat(this.data.cuenta.saldo_capital)).toFixed(2);
    },
    cargarCiudades(data){
      console.log(data.municipio)
      data.Ciudades = this.DISTRITOS.filter(muni => muni.municipio_id === data.municipio);
    },
    cargarCliente(){
      if (this.data.cliente.identidad.length === 13){
        this.data.disabled.cliente = false;
        this.load.identidad        = true;
        this.data.direcciones      = [];
        this.$axios.get('cliente_segumiento/'+this.data.cliente.identidad).then((res)=>{
          if (res.data.cliente){
            this.data.cliente.id           = res.data.cliente.id;
            this.data.cliente.nombres      = res.data.cliente.nombres;
            this.data.cliente.apellidos    = res.data.cliente.apellidos;
            this.data.cliente.sexo         = res.data.cliente.sexo;
            this.data.cliente.nacionalidad = res.data.cliente.nacionalidad;
            if (res.data.cliente.direcciones) {
              this.data.direcciones = JSON.parse(res.data.cliente.direcciones);
              this.logns.direcciones = this.data.direcciones.length;
            }
            if (res.data.cliente.telefonos) {
              this.data.telefonos = JSON.parse(res.data.cliente.telefonos);
              this.logns.telefonos           = this.data.telefonos.length;
            }
            this.distribuirDirecciones();
            this.load.identidad = false;
            this.notificacion('Se cargaron las direcciones del cliente','success');
            this.notificacion('Se cargaron los telefonos del cliente',  'success');
          }else{
            this.notificacion('El cliente no existe, tienes que ingresar sus datos','error')
            this.load.identidad = false;
            this.data.telefonos = [];
            this.data.direcciones.push({
              departamento: '',
              municipio:    '',
              ciudad:       '',
              colonia:      '',
              detalle:      '',
              key:          this.data.direcciones.length,
              Municipios:   [],
              Ciudades:     [],
              Colonias:     [],
            });
            this.data.telefonos.push({
              num:     '',
              detalle: 'Telefono '+(parseInt(this.data.telefonos.length) + parseInt(1)),
              key: this.data.telefonos.length
            })
            this.logns.direcciones     = 0;
            this.logns.telefonos       = 0;
            this.data.disabled.cliente = true;
            this.$refs.inputDCNombres.focus();
          }
        })
      }else{
        this.notificacion('Identidad incorrecta','error');
      }
    },
    cargarColaboradores(){
      this.load.colaboradores = true;
      this.$axios.get('colaboradores_suc/'+this.data.cuenta.sucursal).then((res)=>{
        res.data.col.forEach((i)=>{
          this.Colaboradores.push({
            text: i.nombres+ ' '+ i.apellidos,
            value: i.id
          })
        })
        this.load.colaboradores = false;
      })
    },
    cargarColonias(data){
      data.Colonias = this.COLONIAS.filter(ciudad => ciudad.ciudade_id === data.ciudad)
    },
    cargarInventario(){
      this.load.articulos = true;
      this.$axios.get('/2.0/articulos/').then((res)=>{
        this.articulos = res.data.articulos;
        this.load.articulos = false;
      })
    },
    cargarMunicipio(data){
      data.Municipios = this.MUNICIPIOS.filter(depto => depto.departamento_id === data.departamento);
    },
    cargarSucursales(){
      this.load.sucursales = true;
      this.$axios.get('sucursales').then((res)=>{
        this.Sucursales = res.data.suc;
        this.load.sucursales = false;
      });
    },
    copiarSaldoPagado(data){
      data.total_abonado = data.pago_inicial;
      this.sumarTotalPago(data)
    },
    contPagosRevisados(data){
      console.log(data.revisado)
      data.revisado = !data.revisado;
      console.log(data.revisado)
      if (data.revisado)
        this.revision.user.revisados++;
      else
        this.revision.user.revisados--;
    },
    crearPagos(){
      if (this.$refs.FormNuevaCuentaManual.validate()){
        this.revision.sis.revisados = 0;
        this.revision.user.saldo_actual = 0;
        this.data.pagos = [];
        this.revision.user.mora = 0;
        this.revision.user.revisados = 0;
        let pagos = this.calcularPagos();
        let fecha = new Date(this.data.cuenta.fecha_prima);
        for (let i = 0; i <= pagos; i++){
          if (i === 0){
            this.agregarPago(this.data.cuenta.prima, this.data.cuenta.prima, 0,
                this.data.cuenta.prima, this.data.cuenta.fecha_prima, 'Pago Inicial - Prima')
          }else{
            fecha = this.sumarDias(fecha);
            this.agregarPago(this.data.cuenta.couta, this.data.cuenta.couta, 0,
                this.data.cuenta.couta,
                fecha.getDate()+'-'+(fecha.getMonth()+ 1)+'-'+fecha.getFullYear(), 'Cuota #'+(i));

          }
          this.revision.sis.revisados++;
        }
        this.totalRows = this.data.pagos.length;
      }
    },
    distribuirDirecciones(){
      this.data.direcciones.forEach((i)=>{
        this.cargarMunicipio(i);
        this.cargarCiudades(i);
        this.cargarColonias(i);
      })
    },
    fabricarSerie(){
      this.$store.commit('activarOverlay', true);
      this.$axios.get('/2.0/fabricar_serie').then((res)=>{
        this.data.articulo.serie = res.data.serie;
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Se fabricó una serie', color:'success'});
      })
    },
    formatDate (date, tipo) {
      if (tipo === 1){
        let [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      }else{
        let [year, month, day] = date.split('/');
        return `${year}-${month}-${day}`;
      }
    },
    guardarCiudad(){
      this.Ciudad.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('ciudades',{
        municipio: this.Ciudad.municipio,
        nombre:    this.Ciudad.nombre,
        tipo:      this.Ciudad.tipo
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        Vue.$toast.open({
          message: `se ha registrado exitosamente ${this.Ciudad.nombre} como ${this.Ciudad.tipo}.`,
          type: 'success',
          position: 'bottom-left',
          duration: 4000
        });
        this.Ciudad.nombre = '';
        this.Ciudad.municipio = '';
        this.$store.commit('direcciones/cargar_DISTRITOS');
        this.$store.commit('direcciones/cargar_DEPARTAMENTOS');
        this.$store.commit('direcciones/cargar_MUNICIPIOS');
        this.$store.commit('direcciones/cargar_COLONIAS');
      })
    },
    guardarColonia(){
      this.Colonia.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('colonias',{
        ciudad_id: this.Colonia.ciudad,
        nombre:    this.Colonia.nombre,
      }).then((res)=>{
        this.$store.commit('direcciones/cargar_COLONIAS')
        this.$store.commit('activarOverlay', false);
        Vue.$toast.open({
          message: `se ha registrado exitosamente la colonia/barrio ${this.Colonia.nombre}.`,
          type: 'success',
          position: 'bottom-left',
          duration: 4000
        });
        this.Colonia.nombre = '';
        this.Colonia.municipio = '';
      })
    },
    loadMunicipios(){
      this.Municipios = this.MUNICIPIOS.filter(depto => depto.departamento_id === this.Ciudad.departamento)
    },
    loadCiudades(){
      this.Ciudades = this.DISTRITOS.filter(muni => muni.municipio_id === this.Ciudad.municipio);
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    registrarCliente(){
      this.$store.commit('activarOverlay', true);
      if (this.data.disabled.cliente){
        this.$axios.post('cuenta/nueva/manual/cliente',{
          identidad:    this.data.cliente.identidad,
          nombres:      this.data.cliente.nombres,
          apellidos:    this.data.cliente.apellidos,
          sexo:         this.data.cliente.sexo,
          nacionalidad: this.data.cliente.nacionalidad,
          direcciones:  JSON.stringify(this.data.direcciones),
          telefonos:    JSON.stringify(this.data.telefonos),
          rtn:          ''
        }).then((res)=>{
          this.notificacion(res.data.msj,'success');
          this.registrarCuenta(res.data.cliente_id);
        }).catch((error)=>{
          if (error.response.status === 422)
            this.notificacion('El cliente ya existe','error');
          else
            this.notificacion('Hubo un error inesperado en el servidor','eror');

          this.$store.commit('activarOverlay', false)
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false)
        })
      }else{
        this.registrarCuenta(this.data.cliente.id);
      }
    },
    registrarCuenta(cliente){
      this.data.pagos.forEach((item)=>{
        item.fecha_pago = item.fecha_pago.split('-')[2]+'-'+item.fecha_pago.split('-')[1]+item.fecha_pago.split('-')[0]
      })
      this.$axios.post('cuenta/nueva/manual/articulo',{
        articulo_id:       this.data.articulo.id,
        serie:             this.data.articulo.serie,
        color:             this.data.articulo.color,
        sucursal:          this.data.cuenta.sucursal,

        precio_inicial:    this.data.cuenta.total_inicial,
        cliente_id:        cliente,
        colaborador_id:    this.data.cuenta.colaborador,
        saldo_actual:      this.data.cuenta.saldo_actual,
        num_cuota:         this.data.cuenta.cuotas,
        identidad:         this.data.cliente.identidad,
        saldo_mora:        this.data.cuenta.saldo_mora,
        total_abonado:     this.data.cuenta.total_abonado,
        total:             this.data.cuenta.total_inicial,
        estado_cuenta:     this.data.cuenta.estado,

        fecha_vencimiento: this.data.cuenta.fecha_vencimiento,
        fecha_prima:       this.data.cuenta.fecha_prima,
        tasa_anual:        0.5,
        cuota:             this.data.cuenta.couta,
        forma_pago:        this.data.cuenta.forma_pago,
        prima:             this.data.cuenta.prima,
        financiamiento:    0.0,

        pagos:             this.data.pagos
      }).then((res)=>{
        this.notificacion(res.data.msj,'success');
        this.$store.commit('activarOverlay', false)
        this.$store.commit('quitarPestanaKey',15)
      }).catch((error)=>{
        this.notificacion('Hubo un error inesperado al crear la cuenta','error');
        this.$store.commit('activarOverlay', false)
      })
    },
    saveFechaPrima() {
      this.$refs.dialogoFechaPrima.save(this.data.cuenta.fecha_prima);
      this.calcularFechaVencimiento();
      this.dialogo.fechaPrima = false;
    },
    saveFechaVencimiento(){
      this.$refs.dialogoFechaVencimiento.save(this.data.cuenta.fecha_vencimiento);
      this.dialogo.fechaVencimiento = false;
    },
    sumarDias(fecha){
      let dias = 0;
      if(this.data.cuenta.forma_pago !== 3){
        if (this.data.cuenta.forma_pago === 1)
          dias = 7;
        else if (this.data.cuenta.forma_pago === 2)
          dias = 15;

        fecha.setDate(fecha.getDate() + dias);
        return fecha;
      }else{
        fecha.setMonth(fecha.getMonth() + 1);
        return  fecha;
      }

    },
    sumarSaldoActual(){
      this.data.pagos.forEach((i)=>{
        if (i.saldo_actual)
          this.revision.user.saldo_actual = (parseFloat(this.revision.user.saldo_actual) + parseFloat(i.saldo_actual)).toFixed(2);
      })
    },
    sumarTotalMora(data){
      this.revision.user.mora = 0;
      this.data.pagos.forEach((i)=>{
        if (i.mora > 0 && i.total_abonado >= 0 && i.total_abonado < i.total_pago && i.saldo_actual > 0) {
          this.revision.user.mora = parseFloat(this.revision.user.mora) + parseFloat(i.mora);
          data.is_mora = 1;
          data.estao  = 3;
        }else{
          data.is_mora = 0;
        }
      })

    },
    sumarTotalPago(data){
      this.revision.user.saldo_actual = 0;
      if (!isNaN(data.mora) || data.mora > 0) {
        data.total_pago = parseFloat(data.mora) + parseFloat(data.pago_inicial);
      }

      if (!isNaN(data.total_abonado) && !isNaN(data.total_pago) || data.total_abonado > 0 && data.total_pago > 0) {
        data.saldo_actual = (parseFloat(data.total_pago) - parseFloat(data.total_abonado)).toFixed(2);
        data.saldo_cap =    (parseFloat(data.pago_inicial) - parseFloat(data.total_abonado)).toFixed(2);
      }

      this.sumarSaldoActual();

      if (data.saldo_actual === 0){
        data.estao = 3;
      }

      this.sumarTotalMora(data);
    },
    validarDatosCliente(){
      if (this.$refs.FormDatosCliente.validate())
        this.pagina = 2;
      else
        this.notificacion('Datos invalidos', 'warning');
    },
    validarDetallesCliente(){
      if (this.$refs.FormDetallesCliente.validate())
        this.pagina = 3;
      else
        this.notificacion('Datos invalidos', 'warning');
    },
    validarDetallesPrecio(){
      if (this.$refs.FormDetallesPrecio.validate())
        this.pagina = 4;
      else
        this.notificacion('Datos invalidos', 'warning');
    },
    validarFormCiudad(){
      if (this.$refs.FormCiudadNueva.validate())
        this.guardarCiudad()
    },
    validarFormColonia(){
      if (this.$refs.FormColoniaNueva.validate())
        this.guardarColonia()
    },
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
}

table thead tr th{
  padding: 5px;
  font-size: 14px;
  border-left: solid #b2b0b0 1px;
  border-top: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 12px;
  cursor: pointer;
}
table tbody tr td table{
  width: 80%;
}
table tbody tr td table thead tr th{
  font-size: 10px;
  padding: 2px;
}
table tbody tr td table tbody tr td{
  font-size: 9px;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>
