<template>
<v-card flat tile>
  <v-stepper v-model="vista" vertical>

    <v-stepper-step color="success" :complete="vista > 1" step="1">
      Datos del Precio
      <small>Precio de la solicitúd</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card color="grey lighten-3" class="mb-12 mx-auto" height="680" flat tile>
        <v-row no-gutters>
          <v-col cols="10">
            <v-card-title>Formulario del Precio</v-card-title>
          </v-col>
          <v-col cols="2" class="d-flex justify-end">
            <v-tooltip left>
              <template v-slot:activator="{on, attrs}">
                <v-btn small fab color="indigo" class="ma-2" dark icon v-on="on"
                       v-bind="attrs"><v-icon>fa fa-info</v-icon></v-btn>
              </template>
              <span>Información sobre el precio</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-form ref="FormPrecioSolicitud">
          <v-row no-gutters>
            <v-col>
              <v-text-field outlined class="ma-2" dense label="Precio de Contado" v-model="Precio.contado"
                            @keyup.enter="calcularMinimoPrima" @keyup.tab="calcularMinimoPrima" suffix="lps"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field outlined  class="ma-2" dense label="Minimo de Prima" v-model="Precio.minimo_prima"
                            disabled :suffix="(Precio.procentaje_prima * 100).toFixed(2)+'%'"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field outlined  class="ma-2" dense label="Saldo" v-model="Precio.saldo" disabled suffix="lps"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field outlined  class="ma-2" dense label="Prima Propuesta por el Cliente" v-model="Precio.prima_cliente"
                            suffix="lps" @keyup.enter="calcularCuota" @keyup.tab="calcularCuota"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field outlined  class="ma-2" disabled dense v-model="Precio.saldo_a_financiar" label="Saldo a Financiar" suffix="lps"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-select outlined  dense class="ma-2" label="Forma de Pago" :items="formaPagos" @change="calcularCuota"
                        v-model="Precio.forma_pago"></v-select>
            </v-col>
            <v-col>
              <v-text-field  outlined class="ma-2" dense label="Maximo Financiación" v-model="Precio.maximo_financiamiento" disabled suffix="meses"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field outlined  class="ma-2" dense label="Cantidad de Meses" @keyup.enter="calcularCuota"
                            v-model="Precio.meses" suffix="meses" @keyup.tab="calcularCuota"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field outlined  class="ma-2" v-model="Precio.cuota" dense label="Cuota por Pago" disabled suffix="lps"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field outlined  class="ma-2" v-model="Precio.total_credito_c_prima" dense label="Total del Crédito" disabled suffix="lps"></v-text-field>
            </v-col>
          </v-row>
          <small class="ml-4">Tabla de pagos</small>
          <v-card flat tile height="380" color="grey lighten-3" class="overflow-auto">
            <v-simple-table class="grey lighten-3" dense>
              <template v-slot:default>
                <thead>
                <tr>
                  <th># Pago</th>
                  <th>Fecha de Pago</th>
                  <th>Saldo</th>
                  <th>Cuota</th>
                  <th>Saldo Restante</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Precio.pagos">
                  <th>{{item.num}}</th>
                  <th>{{item.fecha}}</th>
                  <th>L. {{int.format(item.saldo)}}</th>
                  <th>L. {{int.format(item.cuota)}}</th>
                  <th>L. {{int.format(item.saldo_a)}}</th>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-form>
      </v-card>
      <v-card flat tile>
        <v-card-actions class="d-flex justify-end">
          <v-btn v-if="Precio.pagos.length > 0 && this.Precio.prima_cliente > 0 && this.Precio.meses > 0 && this.Precio.meses <= this.Precio.maximo_financiamiento"
                 small tile color="success" @click="vista = 2">
            Siguiente Paso</v-btn>
        </v-card-actions>
      </v-card>
    </v-stepper-content>

    <v-stepper-step color="success" :complete="vista > 2" step="2">
      Datos del Bien Inmueble
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card color="grey lighten-3" class="mb-12 mx-auto" height="350" flat tile>
        <small>Detalles del Bien Inmueble</small>
        <v-simple-table class="grey lighten-3" dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th style="width: 5%">#</th>
              <th style="width: 85%">Detalles del Bien Inmueble</th>
              <th style="width: 10%">Quitar</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in Articulo">
              <td>{{item.key + 1}}</td>
              <td>
                <v-text-field v-model="item.detalle" dense></v-text-field>
              </td>
              <td>
                <v-btn fab x-small text color="red" icon @click="removeDetalleArticulo(item.key)"><v-icon>fa fa-times</v-icon></v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>

      <v-card flat tile>
        <v-card-actions class="d-flex justify-end">
          <v-btn small tile color="orange" @click="vista = 1" dark>Volver</v-btn>
          <v-btn v-if="Articulo.length > 0" small tile color="success" dark @click="vista = 3">Siguiente Paso</v-btn>
        </v-card-actions>
      </v-card>
    </v-stepper-content>

    <v-stepper-step color="success" :complete="vista > 3" step="3">
      Datos del Cliente
      <small>{{Cliente.nombres}} {{Cliente.apellidos}}</small>
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card color="grey lighten-4" class="mb-12 mx-auto overflow-auto" height="850">
        <v-progress-linear indeterminate v-if="loadIdentidad"></v-progress-linear>
        <v-row no-gutters>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">*Identidad del Cliente</small></v-col></v-row>
            <v-row no-gutters><input v-model="Cliente.identidad" @keyup.enter="validarIdentidad" type="text"></v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">*Nombres del Cliente</small></v-col></v-row>
            <v-row no-gutters><input v-model="Cliente.nombres" type="text"></v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">*Apellidos del Cliente</small></v-col></v-row>
            <v-row no-gutters><input v-model="Cliente.apellidos" type="text"></v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">Correo Electronico</small></v-col></v-row>
            <v-row no-gutters><input v-model="Cliente.email" type="text"></v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">Rtn del Cliente</small></v-col></v-row>
            <v-row no-gutters><input v-model="Cliente.rtn" type="text"></v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">Sexo</small></v-col></v-row>
            <v-row no-gutters>
              <select class="select-css" v-model="Cliente.sexo">
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
              </select>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">*Fecha de Nacimiento</small></v-col></v-row>
            <v-row no-gutters><input v-model="Cliente.fecha_nacimiento" type="date"></v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">*Trabaja</small></v-col></v-row>
            <v-row no-gutters>
              <select class="select-css" v-model="Cliente.is_trabaja" >
                <option value="1">Si</option>
                <option value="2">No</option>
              </select>
            </v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">*Lugar de Trabajo</small></v-col></v-row>
            <v-row no-gutters><input v-model="Cliente.lugar_trabajo" type="text"></v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">*Salario</small></v-col></v-row>
            <v-row no-gutters><input v-model="Cliente.salario" type="text"></v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">*Nacionalidad</small></v-col></v-row>
            <v-row no-gutters><input v-model="Cliente.nacionalidad" type="text"></v-row>
          </v-col>
          <v-col class="ma-2">
            <v-row no-gutters><v-col><small class="input-laber">*Casa Propia</small></v-col></v-row>
            <v-row no-gutters>
              <select class="select-css" v-model="Cliente.is_casa">
                <option value="1">Si</option>
                <option value="2">No</option>
              </select>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="ma-2" v-for="(item, index) in Cliente.detalles" v-if="index < 6">
            <v-row no-gutters><small class="input-laber">{{item.detalle}}</small></v-row>
            <v-row no-gutters>
              <v-col>
                <input v-if="item.select === 2" type="text" v-model="item.val">
                <select v-else-if="item.select === 1" class="select-css" v-model="item.val">
                  <option v-for="i in item.datos" :value="i">{{i}}</option>
                </select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="ma-2" v-for="(item, index) in Cliente.detalles" v-if="index > 5">
            <v-row no-gutters><small class="input-laber">{{item.detalle}}</small></v-row>
            <v-row no-gutters>
              <v-col>
                <input v-if="item.select === 2" type="text" v-model="item.val">
                <select v-else-if="item.select === 1" class="select-css" v-model="item.val">
                  <option v-for="i in item.datos" :value="i">{{i}}</option>
                </select>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="ma-2" v-for="item in 2"></v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row no-gutters>
          <v-col cols="5" class="ma-2">
            <small>Telefonos</small>
            <v-btn fab x-small color="success" @click="addTelefonos" text><v-icon>fa fa-plus</v-icon></v-btn>
            <table class="rowsTable">
              <thead>
              <tr>
                <th>Detalle</th>
                <th>Cod.</th>
                <th>Número</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Cliente.telefonos">
                <td><input type="text" v-model="item.detalle"></td>
                <td><input type="text" v-model="item.area"></td>
                <td><input type="text" v-model="item.num"></td>
                <td>
                  <v-btn color="red" width="20px" height="20px"
                         @click="removeTelefono(item.key)"
                         fab x-small text><v-icon size="15">fa fa-times</v-icon></v-btn>
                </td>
              </tr>
              </tbody>
            </table>
          </v-col>
          <v-col >
            <small>Archivos del cliente</small>
            <v-btn fab x-small color="success" @click="addArchivos" text><v-icon>fa fa-plus</v-icon></v-btn>
            <table class="rowsTable disabled">
              <thead>
              <tr>
                <th>Nombre del archivo</th>
                <th class="d-flex justify-center">Estado</th>
                <th>Archivo</th>
                <th>*</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Cliente.archivos">
                <td><input type="text" v-model="item.detalle"></td>
                <td class="d-flex justify-center">
                  <v-icon v-if="item.status" color="success">fa fa-check</v-icon>
                  <v-icon v-else color="red">fa fa-times</v-icon>
                </td>
                <td v-if="item.status === 1 || item.status">
                  <v-btn @click="verDocumento(item.dir)" fab height="25px" width="20px" text color="red">
                    <v-icon size="15">fa fa-file-pdf</v-icon>
                  </v-btn>
                </td>
                <td v-else-if="item.status === 0 || !item.status">
                  <v-row no-gutters>
                    <v-col cols="11">
                      <b-form-file browse-text="Buscar" v-model="item.file" @change="cambiarEstadoFile(item)"
                                   :placeholder="'buscar '+item.detalle" accept="application/pdf" size="sm">
                      </b-form-file>
                    </v-col>
                    <v-col v-if="item.file" cols="1" class="d-flex justify-center">
                      <v-btn fab height="24px" width="24px" text @click="item.file = null">
                        <v-icon size="15px">fa fa-trash-alt</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </td>
                <td>
                  <span v-if="item.num === 1">Sí</span>
                  <span v-if="item.num === 2">No</span>
                </td>
                <td>
                  <v-btn color="red" width="20px" height="20px"
                         @click="removeArchivos(item.key)"
                         fab x-small text><v-icon size="15">fa fa-times</v-icon></v-btn>
                </td>
              </tr>
              </tbody>
            </table>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-row no-gutters class="contenedorTable">
          <v-col class="ma-2">
            <small>Direcciones</small>
            <v-btn fab x-small color="success" @click="addDirecciones" text><v-icon>fa fa-plus</v-icon></v-btn>
            <b-spinner v-if="loadDireccion" variant="success" type="grow" small></b-spinner>
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn color="success" fab @click="Ciudad.dialogo = true"
                       x-small text v-on="on" v-bind="attrs">
                  <v-icon>fa fa-city</v-icon>
                </v-btn>
              </template>
              <span>Crear ciudad/aldea/caserio</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn color="success" fab x-small @click="Colonia.dialogo = true"
                       text v-on="on" v-bind="attrs">
                  <v-icon>fa fa-building</v-icon>
                </v-btn>
              </template>
              <span>Crear colonia</span>
            </v-tooltip>

            <table>
              <thead>
              <tr>
                <th>Departamento</th>
                <th>Municipio</th>
                <th>Ciudad/Aldea/Caserio</th>
                <th>Colonia</th>
                <th>Detalle</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Cliente.direcciones">
                <td width="15%">
                  <v-autocomplete v-model="item.departamento" @change="cargarMunicipios(item)" :item-text="'nombre'"
                                  :items="Departamentos" :item-value="'id'" dense outlined></v-autocomplete>
                </td>
                <td width="15%">
                  <v-autocomplete v-model="item.municipio" :items="item.Municipios" :item-value="'id'" dense
                                  outlined @change="cargarCiudades(item)" :item-text="'nombre'"></v-autocomplete>
                </td>
                <td width="20%">
                  <v-autocomplete v-model="item.ciudad" :items="item.Ciudades" :item-value="'id'" dense
                                  outlined  @change="cargarColonias(item)" :item-text="'nombre'"></v-autocomplete>
                </td>
                <td width="20%">
                  <v-autocomplete v-model="item.colonia" :items="item.Colonias" :item-value="'id'" dense
                                  outlined :item-text="'nombre'"></v-autocomplete>
                </td>
                <td width="28%">
                  <v-textarea rows="2" style="font-size: 10px; padding: 1px" outlined v-model="item.detalle"></v-textarea>
                </td>
                <td width="2%">
                  <v-btn width="20px" height="20px" @click="removeDireccion(item.key)"
                         color="red" fab text>
                    <v-icon size="15">fa fa-times</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </table>
          </v-col>
        </v-row>

      </v-card>
      <v-card flat tile>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark tile small @click="vista = 2">Volver</v-btn>
          <b-spinner variant="success" v-if="Cliente.subiendo" small type="grow"></b-spinner>
          <v-btn color="success" :disabled="Cliente.subiendo" tile v-if="Cliente.exists" small @click="validarDatosCliente">Editar cliente</v-btn>
          <v-btn color="success" :disabled="Cliente.subiendo" tile v-else-if="!Cliente.exists" small @click="validarDatosCliente">Registrar cliente</v-btn>
          <v-btn color="success" :disabled="!registro" small tile @click="vista = 4">Siguiente paso</v-btn>
        </v-card-actions>
      </v-card>
    </v-stepper-content>

    <v-stepper-step color="success" :complete="vista > 4" step="4">
      Referencias y Avales
    </v-stepper-step>

    <v-stepper-content step="4">

      <v-card flat tile color="grey lighten-4" class="mb-12 mx-auto overflow-auto pa-5 ma-5" height="550">
        <v-row no-gutters>
          <v-col cols="11" class="pa-5">
            <v-simple-table dense class="grey lighten-4">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre Completo</th>
                  <th>Cod. Area</th>
                  <th>Telefono</th>
                  <th>Parentesco</th>
                  <th>Dirección</th>
                  <th>Nuevo</th>
                  <th>Quitar</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Solicitud.referencias">
                  <th width="2%">
                    {{parseInt(item.key) + parseInt(1)}}
                  </th>
                  <td width="25%">
                    <input type="text" v-model="item.nombre">
                  </td>
                  <td width="10%">
                    <input type="text" v-model="item.area">
                  </td>
                  <td width="10%">
                    <input type="text" v-model="item.telefono">
                  </td>
                  <td width="14%">
                    <input type="text" v-model="item.parentesco">
                  </td>
                  <td width="30%">
                    <input type="text" v-model="item.direccion"/>
                  </td>
                  <td width="5%" class="text-center">
                    <input type="checkbox" v-model="item.nuevo" disabled/>
                  </td>
                  <td width="4%" class="text-center">
                    <v-btn fab @click="removeReferencia(item.key)" x-small color="red" width="20px" height="20px" dark>
                      <v-icon size="15">fa fa-times</v-icon>
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider></v-divider>
            <small>Agenda del cliente</small>
            <small>Puedes copiar cualquier informacion de esta agenda presionado las teclas (Ctrl + C).</small>
            <small>Para pegar la información solo presion las teclas (Ctrl + V)</small>
            <v-simple-table dense class="grey lighten-4">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Detalle</th>
                  <th>Telefono</th>
                  <th>+ Info</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Cliente.telefonos">
                  <td><input type="text" :value="item.detalle"></td>
                  <td><input type="text" :value="item.num"></td>
                  <td v-if="item.info">
                    <input v-if="item.info.dir" type="text" :value="item.info.dir">
                    <input v-else type="text" value="-----" disabled>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider></v-divider>
            <small>Avales</small>
            <v-simple-table class="grey lighten-4" dense>
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Identidad</th>
                  <th>Nombres</th>
                  <th>Apellido</th>
                  <th>Sexo</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Solicitud.avales">
                  <td width="20%">
                    <v-row no-gutters>
                      <v-col cols="10">
                        <input type="text"  v-model="item.identidad" @keyup.enter="buscarlienteAval(item)">
                      </v-col>
                      <v-col cols="2" class="d-flex align-center justify-center">
                        <b-spinner v-if="item.load"  variant="success" type="grow" small></b-spinner>
                      </v-col>
                    </v-row>
                  </td>
                  <td width="25%">
                    <input type="text" :disabled="item.exist" v-model="item.nombres">
                  </td>
                  <td width="25%">
                    <input type="text" :disabled="item.exist" v-model="item.apellidos">
                  </td>
                  <td width="20%">
                    <select class="select-css" :disabled="item.exist" v-model="item.sexo">
                      <option value="1">Masculino</option>
                      <option value="2">Femenino</option>
                    </select>
                  </td>
                  <td width="7%">
                    <v-tooltip top>
                      <template v-slot:activator="{on, attrs}">
                        <v-btn color="red" class="ma-1" height="22px" width="22px"
                               @click="dialogoFiles = true"
                               fab v-on="on" v-bind="attrs" x-small>
                          <v-icon size="15" color="white">fa fa-file-pdf</v-icon>
                        </v-btn>
                      </template>
                      <span>Ver documentos del cliente</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{on, attrs}">
                        <v-btn color="indigo" class="ma-1" height="22px" @click="guardarAval(item)"
                               width="22px" fab v-on="on" v-bind="attrs" x-small>
                          <v-icon size="15" color="white">fa fa-save</v-icon>
                        </v-btn>
                      </template>
                      <span>Guardar cliente</span>
                    </v-tooltip>

                  </td>
                  <td width="3%">
                    <v-btn fab @click="removeAval(item.key)" x-small color="red" width="22px" height="22px" dark>
                      <v-icon size="15">fa fa-times</v-icon>
                    </v-btn>
                  </td>

                  <v-dialog v-model="dialogoFiles" width="60%">
                    <v-card>
                      <v-card-title class="grey lighten-2">Documentos de {{item.nombres}} {{item.apellidos}}</v-card-title>
                      <v-container class="d-flex justify-center grey lighten-5">
                        <table class="rowsTable">
                          <thead>
                          <tr>
                            <th>Nombre del archivo</th>
                            <th class="d-flex justify-center">Estado</th>
                            <th>Archivo</th>
                            <th>*</th>
                            <th></th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="i in item.archivos">
                            <td width="30%"><input type="text" v-model="i.detalle"></td>
                            <td class="d-flex justify-center">
                              <v-icon v-if="i.status" color="success">fa fa-check</v-icon>
                              <v-icon v-else color="red">fa fa-times</v-icon>
                            </td>
                            <td v-if="i.status === 1 || i.status">
                              <v-btn @click="verDocumento(i.dir)" fab height="25px" width="20px" text color="red">
                                <v-icon size="15">fa fa-file-pdf</v-icon>
                              </v-btn>
                            </td>
                            <td v-else-if="i.status === 0 || !i.status">
                              <v-row no-gutters>
                                <v-col cols="11">
                                  <b-form-file browse-text="Buscar" v-model="i.file" @change="cambiarEstadoFile(i)"
                                               :placeholder="'buscar '+i.detalle" accept="application/pdf" size="sm">
                                  </b-form-file>
                                </v-col>
                                <v-col v-if="i.file" cols="1" class="d-flex justify-center">
                                  <v-btn fab height="24px" width="24px" text @click="i.file = null">
                                    <v-icon size="15px">fa fa-trash-alt</v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </td>
                            <td>
                              <span v-if="i.num === 1">Sí</span>
                              <span v-if="i.num === 2">No</span>
                            </td>
                            <td>
                              <v-btn width="20px" height="20px" @click="removeArchivos(i.key, item)"
                                     text fab color="red">
                                <v-icon size="15">fa fa-times</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </v-container>
                      <v-divider></v-divider>
                      <v-card-actions class="d-flex justify-end">
                        <v-btn color="success" @click="addArchivosAval(item)" small dark>Agregar Fila</v-btn>
                        <v-btn color="warning" @click="dialogoFiles = false" small dark>Cerrar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col>
            <v-row no-gutters>
              <v-col class="d-flex justify-center"><v-tooltip left>
                <template v-slot:activator="{on, attrs}">
                  <v-btn v-on="on" v-bind="attrs" @click="addReferecias" class="ma-2"
                         color="green" dark fab x-small icon><v-icon>fa fa-plus</v-icon></v-btn>
                </template>
                <span>Aregar Referencia</span>
              </v-tooltip></v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-center">
                <v-tooltip left>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn v-on="on" v-bind="attrs" @click="addAvales" color="green" class="ma-2"
                           dark fab x-small icon><v-icon>fa fa-plus</v-icon></v-btn>
                  </template>
                  <span>Aregar Aval</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

      <v-card flat tile>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark tile small @click="vista = 3">Volver</v-btn>
          <v-btn color="indigo" dark tile small @click="validarDatos">Validar</v-btn>
          <v-btn color="success" :disabled="!validadoRef" small tile @click="vista = 5">Siguiente paso</v-btn>
        </v-card-actions>
      </v-card>
    </v-stepper-content>

    <v-stepper-step color="success" :complete="vista > 5" step="5">
      Revisión de Datos
    </v-stepper-step>

    <v-stepper-content step="5">
      <v-card flat tile color="grey lighten-4" class="mb-12 mx-auto overflow-auto pa-5 ma-5" height="900">
        <v-card-subtitle>Detalles del Precio</v-card-subtitle>
        <v-divider></v-divider>
        <v-simple-table dense class="grey lighten-4">
          <template v-slot:default>
            <thead>
            <tr>
              <th>Prima</th>
              <th>Cuota</th>
              <th>Total del Credito</th>
              <th>Meses</th>
              <th>Forma de Pago</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>L. {{int.format(Precio.prima_cliente)}}</td>
              <td>L. {{int.format(Precio.cuota)}}</td>
              <td>L. {{int.format(Precio.total_credito_c_prima)}}</td>
              <td>{{Precio.meses}} meses</td>
              <td>
                <span v-if="Precio.forma_pago === 1">Semanal</span>
                <span v-else-if="Precio.forma_pago === 2">Quincenal</span>
                <span v-else-if="Precio.forma_pago === 3">Mensual</span>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-simple-table class="grey lighten-4" dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th># Pago</th>
              <th>Fecha de Pago</th>
              <th>Saldo</th>
              <th>Cuota</th>
              <th>Saldo Restante</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in Precio.pagos">
              <th>{{item.num}}</th>
              <th>{{item.fecha}}</th>
              <th>L. {{int.format(item.saldo)}}</th>
              <th>L. {{int.format(item.cuota)}}</th>
              <th>L. {{int.format(item.saldo_a)}}</th>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-divider></v-divider>
        <v-card-subtitle>Detalles del Bien</v-card-subtitle>
        <v-divider></v-divider>
        <v-simple-table dense class="grey lighten-4">
          <template v-slot:default>
            <thead>
            <tr>
              <th>Detalles</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in Articulo">{{item.detalle}}</tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-divider></v-divider>
        <v-card-subtitle>Datos del Cliente</v-card-subtitle>
        <v-divider></v-divider>
        <v-row class="grey lighten-3">
          <v-col>
            <small>Datos del cliente</small>
            <v-divider></v-divider>
            <v-simple-table class="grey lighten-4" dense>
              <template v-slot:default>
                <tbody>
                <tr>
                  <th>Identidad: </th>
                  <td>{{Cliente.identidad}}</td>
                </tr>
                <tr>
                  <th>Nombre completo: </th>
                  <td>{{Cliente.nombres}} {{Cliente.apellidos}}</td>
                </tr>
                <tr>
                  <th>Fecha de nacimiento:</th>
                  <td v-if="Cliente.fecha_nacimiento">{{Cliente.fecha_nacimiento.split('-')[2]}}/{{Cliente.fecha_nacimiento.split('-')[1]}}/{{Cliente.fecha_nacimiento.split('-')[0]}}</td>
                </tr>
                <tr>
                  <th>Sexo:</th>
                  <td v-if="Cliente.sexo === 1">Masculino</td>
                  <td v-else-if="Cliente.sexo === 2">Femenino</td>
                </tr>
                <tr>
                  <th>E-mail:</th>
                  <td>{{Cliente.email}}</td>
                </tr>
                <tr>
                  <th>Nacionalidad:</th>
                  <td>{{Cliente.nacionalidad}}</td>
                </tr>
                <tr>
                  <th>Trabaja:</th>
                  <td v-if="Cliente.is_trabaja === 0">No</td>
                  <td v-else-if="Cliente.is_trabaja === 1">Si</td>
                </tr>
                <tr>
                  <th>Lugar de trabajo:</th>
                  <td>{{Cliente.empresa_trabaja}}</td>
                </tr>
                <tr>
                  <th>Ingreso:</th>
                  <td>L. {{Cliente.salario}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col>
            <small>Telefonos</small>
            <v-divider></v-divider>
            <v-simple-table class="grey lighten-4" dense>
              <template v-slot:default>
                <tbody>
                <tr v-for="item in Cliente.telefonos">
                  <th>{{item.detalle}}</th>
                  <td>{{item.num}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col>
            <small>Detalles del cliente</small>
            <v-divider></v-divider>
            <v-simple-table class="grey lighten-4" dense>
              <template v-slot:default>
                <tbody>
                <tr v-for="item in Cliente.detalles">
                  <th>{{item.detalle}}</th>
                  <td>{{item.val}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-subtitle>Referencias y Avales</v-card-subtitle>
        <v-divider></v-divider>
        <v-row class="grey lighten-3">
          <v-col>
            <small>Referencias</small>
            <v-divider></v-divider>
            <table class="rowsTable">
              <thead>
              <tr>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Relación</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Solicitud_Referencias">
                <td>{{item.nombre}}</td>
                <td>{{item.telefono}}</td>
                <td>{{item.parentesco}}</td>
              </tr>
              </tbody>
            </table>
          </v-col>
          <v-col>
            <small>Avales</small>
            <v-divider></v-divider>
            <table class="rowsTable">
              <thead>
              <tr>
                <th>Identidad</th>
                <th>Nombre completo</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="Solicitud_Avales" v-for="item in Solicitud_Avales">
                <td>{{item.identidad}}</td>
                <td>{{item.nombres}} {{item.apellidos}}</td>
              </tr>
              </tbody>
            </table>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-autocomplete v-model="colaborador"
                        label="Enviar a" :item-text="'nombre'" :item-value="'id'"
                        :items="Colaboradores">
        </v-autocomplete>
      </v-card>

      <v-card flat tile>
        <v-card-actions class="d-flex justify-end">
          <v-btn tile :disabled="!registrado" @click="dialogoArchivo = true" small>Abrir envío del archivo</v-btn>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn fab class="ma-2" v-on="on" :disabled="!registrado"
                     v-bind="attrs" @click="solicitarClave" small text>
                <v-icon>fa fa-print</v-icon>
              </v-btn>
            </template>
            <span>Imprimir solicitúd de crédito</span>
          </v-tooltip>
          <v-btn class="ma-2" tile color="success" @click="registrar" small>
            Enviar solicitúd
          </v-btn>
          <v-btn class="ma-2" tile color="warning" @click="this.$store.commit('surticredito/surticredito/cambiar_VISTA', 1)"
                 small>
            Cerrar
          </v-btn>
          <v-btn v-if="!registrado" class="ma-2" tile text color="warning" @click="vista = 3"
                 small>
            Volver
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog v-model="dialogoArchivo" width="30%">
        <v-card>
          <v-card-title class="grey lighten-5">Subir solicitúd firmada</v-card-title>
          <v-form ref="FormArchivoSolicitudCredito" class="pl-5 pr-5">
            <v-file-input label="Solicitúd firmada" accept="application/pdf" v-model="file"></v-file-input>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="warning" small @click="dialogoArchivo = false">Cerrar</v-btn>
              <v-btn color="success" small @click="validarformFile">Registrar</v-btn>
            </v-card-actions>
          </v-form>

        </v-card>
      </v-dialog>
    </v-stepper-content>

  </v-stepper>
</v-card>
</template>

<script>
import Vue from "vue";
import referencias from "@/components/Ventas/solicitud/referencias.vue";
import {ipcRenderer} from "electron";
export default {
  name: "creando_solicitud",
  props:{
    producto: Object
  },
  components:{
    referencias
  },
  data(){
    return{
      dialogoArchivo: false,
      file: null,
      colaborador: null,
      dialogoFiles: false,
      validadoRef: false,
      loadIdentidad: false,
      int: Intl.NumberFormat(),
      vista: 1,
      formaPagos:[
        {text:'Semanal', value:1},
        {text:'Quincenal', value:2},
        {text:'Mensual', value:3},
      ],
      Articulo:[{
          key: 0,
          detalle: ''
        }],
      Precio:{
        contado:               0,
        minimo_prima:          0,
        saldo:                 0,
        saldo_a_financiar:     0,
        prima_cliente:         0,
        forma_pago:            0,
        maximo_financiamiento: 0,
        meses:                 0,
        cuota:                 0,
        total_credito_c_prima: 0,
        pagos:                 [],
        procentaje_prima:      0,
        tasa_anual:            0,
      },
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
      Colonia:{
        nombre: '',
        ciudad: '',
        dialogo: false
      },
      loadDireccion: false,
      Departamentos: [],
      Colaboradores:  [],
      registrado: false,
      soli: null
    }
  },
  computed:{
    Solicitud:{
      get:function () {
        return this.$store.state.solicitud_credito.data;
      }
    },
    Cliente:{
      get:function () {
        return this.$store.state.solicitud_credito.Cliente;
      }
    },
    registro:{
      get: function(){
        return this.$store.state.solicitud_credito.Cliente.registro;
      },
      set: function () {
        this.$store.commit('solicitud_credito/cambiarValorRegistro')
      }
    },
    Solicitud_Referencias(){
      return this.$store.state.solicitud_credito.data.referencias;
    },
    Solicitud_Avales(){
      return this.$store.state.solicitud_credito.data.avales;
    },
    user(){
      return this.$store.state.usuario;
    },
  },
  created() {
    this.Cliente.registro = false;
    this.Cliente.identidad = ''
    this.calcularPorcentajePrima(this.producto.precio_activo);
    this.cargarDepartamentos();
    this.cargarColaboradores();
  },
  methods:{
    actualizarClienteAval(item){
      this.$store.commit('activarOverlay', true);
      let data = new FormData(), cont=0;
      for (let i in item.archivos){
        if (item.archivos[i].file && !item.status) {
          data.append(`file_cliente[${cont}]`, item.archivos[i].file);
          cont++;
        }
      }

      data.append('id',               item.id);
      data.append('nombres',          item.nombres.toUpperCase());
      data.append('apellidos',        item.apellidos.toUpperCase());
      data.append('archivos',         JSON.stringify(item.archivos));

      this.$axios({
        method:'post',
        url:'clientes/edit',
        data:data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        item.id = res.data.cliente;
        let archivos = res.data.files;
        item.archivos = [];
        archivos.forEach( (i)=>{
          item.archivos.push({
            dir: i.dir,
            detalle: i.detalle,
            num:     i.num,
            status:  i.status,
            key:     i.key,
            file:    null,
            estado:  i.estado
          })
        });
        this.$store.commit('notificacion',{
            texto: `Datos actualizados del aval ${parseInt(item.key) + parseInt(1)}`,
            color:'success'})
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
    addArchivos(){
      this.Cliente.archivos.push({
        dir:     '',
        detalle: '',
        num:     1,
        status:  false,
        key:     this.Cliente.archivos.length,
        file:    null
      })
    },
    addArchivosAval(item){
      item.archivos.push({
        dir:     '',
        detalle: '',
        num:     1,
        status:  false,
        key:     item.archivos.length,
        file:    null
      })
    },
    addAvales(){
      this.Solicitud.avales.push({
        "id":        null,
        "identidad": null,
        "nombres":   '',
        "apellidos": '',
        "sexo":      '',
        "archivos":  [],
        "key":       this.Solicitud.avales.length,
        "exist":     true,
        "save":      false,
        "load":      false,
        "files":     false,
        "Contfiles": 0
      })
    },
    addDirecciones(){
      this.Cliente.direcciones.push({
        'departamento': '',
        'municipio':    '',
        'ciudad':       '',
        'colonia':      '',
        'detalle':      '',
        'key':          this.Cliente.direcciones.length,
        'Municipios':   [],
        'Ciudades':     [],
        'Colonias':     [],
      })
    },
    addReferecias(){
      this.Solicitud.referencias.push({
        "nombre":     '..',
        "telefono":   '00',
        "parantesco": '..',
        "direccion":  '..',
        "area":       '504',
        "estado":     false,
        "key":        this.Solicitud.referencias.length,
        "comentario": '..'
      })
    },
    addTelefonos(){
      this.Cliente.telefonos.push({
        'detalle':       'Telefono '+(parseInt(1) + parseInt(this.Cliente.telefonos.length)),
        'num':           '',
        'area':          '504',
        'key':           this.Cliente.telefonos.length
      })
    },
    anadirDetalleArticulo(){
      this.Articulo.push({
        key: this.Articulo.length,
        detalle: ''
      })
    },
    buscarcliente(){
      let th = this.Cliente;
      this.loadIdentidad = true;
      this.$axios.get('cliente_segumiento/'+th.identidad)
          .then((res)=>{
            if (res.data.cliente){
              this.loadIdentidad = false;
              let cl = res.data.cliente;
              th.exists    = true;
              th.id        = cl.id;
              th.nombres   = cl.nombres;
              th.apellidos = cl.apellidos;
              th.email     = cl.email;
              th.rtn       = cl.rtn;
              th.sexo      = cl.sexo;
              th.fecha_nacimiento = cl.fecha_nacimiento;

              let telefono = [];
              let area = '';
              if (cl.telefonos) {
                JSON.parse(cl.telefonos).forEach(item=>{
                  if (!item.area){
                    if(item.num.length === 8)
                      area = '504';
                    else area = '';
                    telefono.push({
                      key: item.key,
                      num: item.num,
                      detalle: item.detalle,
                      area: area
                    })
                  }else telefono.push(item)
                });
                th.telefonos = telefono;
              }else
                th.telefonos = [];
              th.fecha_nacimiento = cl.fecha_nacimiento;
              th.is_trabaja       = cl.is_trabaja;
              th.empresa_trabaja  = cl.empresa_trabaja;
              if (cl.salario)
                th.salario = cl.salario;
              else
                th.salario = 0;
              if (cl.nacionalidad)
                th.nacionalidad     = cl.nacionalidad;
              th.is_casa          = cl.is_casa;
              if (cl.detalles){
                th.detalles     = JSON.parse(cl.detalles)
              }else{
                th.detalles     = [
                  {detalle: 'Estado civil',             val:'', select: 1, datos:['Soletr@','Casad@', 'Unión libre']},
                  {detalle: 'Nombre del conyugue',      val:'', select: 2, datos:[]},
                  {detalle: 'Hijos',                    val:'', select: 1, datos:['Sí','No']},
                  {detalle: 'Cantidad de hijos',        val:'', select: 2, datos:[]},
                  {detalle: 'Cantidad de dependientes', val:'', select: 2, datos:[]},
                  {detalle: 'Tipo de vivienda',         val:'', select: 1, datos:['Casa propia','Casa Familiar','Condiminio de apartamentos','apartamento','Guarderia']},
                  {detalle: 'Otros ingresos',           val:'', select: 2, datos:[]},
                  {detalle: 'Total de otros ingresos',  val:'', select: 2, datos:[]},
                  {detalle: 'Contrato laboral',         val:'', select: 1, datos:['Sí','No']},
                  {detalle: 'Tiempo laborando',         val:'', select: 2, datos:[]},
                ]
              }
              if (cl.archivos){
                th.archivos     = JSON.parse(cl.archivos);
                this.cantArchivos = parseInt(JSON.parse(cl.archivos).length) - 1;
              }else{
                th.archivos     = [
                  {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                  {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                  {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                  {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                  {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
                ];
                this.cantArchivos = 4
              }
              if (cl.direcciones){
                th.direcciones = JSON.parse(cl.direcciones);
                this.cargarDirecciones(th.direcciones);
              }else{
                th.direcciones = [];
              }
              th.exists = true;
              th.registro = true;
            }
            else {
              th.exists = false;
              let cl = res.data.cliente;
              th.nombres          = '';
              th.apellidos        = '';
              th.email            = '';
              th.rtn              = '';
              th.sexo             = '';
              th.fecha_nacimiento = '';
              th.is_trabaja       = '';
              th.empresa_trabaja  = '';
              th.salario          = 0;
              th.is_casa          = '';
              th.detalles         = [
                {detalle: 'Estado civil',             val:'', select: 1, datos:['Soletr@','Casad@', 'Unión libre']},
                {detalle: 'Nombre del conyugue',      val:'', select: 2, datos:[]},
                {detalle: 'Hijos',                    val:'', select: 1, datos:['Sí','No']},
                {detalle: 'Cantidad de hijos',        val:'', select: 2, datos:[]},
                {detalle: 'Cantidad de dependientes', val:'', select: 2, datos:[]},
                {detalle: 'Tipo de vivienda',         val:'', select: 1, datos:['Casa propia','Casa Familiar','Condiminio de apartamentos','apartamento','Guarderia']},
                {detalle: 'Otros ingresos',           val:'', select: 2, datos:[]},
                {detalle: 'Total de otros ingresos',  val:'', select: 2, datos:[]},
                {detalle: 'Contrato laboral',         val:'', select: 1, datos:['Sí','No']},
                {detalle: 'Tiempo laborando',         val:'', select: 2, datos:[]},
              ];
              th.archivos         = [
                {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
              ];
              th.telefonos        = [];
              th.direcciones      = [];
            }
            this.loadIdentidad = false;
            this.btncliente = true;
          }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo error al cargar los datos. Presiona ENTER nuevamente',color:'error'});
        this.loadIdentidad = false;
      })
    },
    buscarlienteAval(item){
      item.load = true;
      this.$axios.get('cliente_segumiento/'+item.identidad)
          .then((res)=>{
            if (res.data.cliente){
              item.id        = res.data.cliente.id;
              item.nombres   = res.data.cliente.nombres;
              item.apellidos = res.data.cliente.apellidos;
              item.sexo      = res.data.cliente.sexo;
              item.exist     = true;
              if (res.data.cliente.archivos){
                item.archivos     = JSON.parse(res.data.cliente.archivos);
                item.Contfiles    = parseInt(JSON.parse(res.data.cliente.archivos).length) - 1;
              }else{
                item.archivos     = [
                  {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                  {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                  {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                  {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                  {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
                ];
                item.Contfiles = 4
              }
            }else{
              item.exist     = false;
              item.nombres   = '';
              item.apellidos = '';
              item.sexo      = '';
              item.save      = true;
              item.archivos     = [
                {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
                {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
                {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
                {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
                {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
              ];
              item.Contfiles = 4
              Vue.$toast.open({
                message: `El cliente con identidad ${item.identidad} no existe.`,
                type: 'warning',
                position: 'bottom-left',
                duration: 4000
              });
              Vue.$toast.open({
                message: `Campos del aval habilitados para crearlo.`,
                type: 'success',
                position: 'bottom-left',
                duration: 4000
              });
            }
            item.files = true;
            item.load  = false
          })
    },
    calcularCuota(){
      if (this.Precio.prima_cliente > 0){
        this.Precio.saldo_a_financiar = (this.Precio.contado - this.Precio.prima_cliente).toFixed(2)
        if (this.Precio.meses > 0){
          let MESES = this.Precio.meses;
          if (MESES <= this.Precio.maximo_financiamiento){
            let TASA_MENSUAL = this.Precio.tasa_anual / 12;
            let TASA = Math.pow(parseInt(1) + parseFloat(TASA_MENSUAL), -MESES);
            TASA = TASA - 1;
            TASA = TASA / TASA_MENSUAL;
            let pagos = 0;
            if (this.Precio.forma_pago === 1) {
              pagos = this.Precio.meses * 4;
              this.Precio.cuota = (-this.Precio.saldo_a_financiar / TASA).toFixed(2);
              this.Precio.cuota = (this.Precio.cuota / 4).toFixed(2)
            }else if (this.Precio.forma_pago === 2) {
              pagos = this.Precio.meses * 2;
              this.Precio.cuota = (-this.Precio.saldo_a_financiar / TASA).toFixed(2);
              this.Precio.cuota = (this.Precio.cuota / 2).toFixed(2)
            }else if (this.Precio.forma_pago === 3) {
              pagos = this.Precio.meses;
              this.Precio.cuota = (-this.Precio.saldo_a_financiar / TASA).toFixed(2);
            }
            this.Precio.total_credito        = (this.Precio.cuota * pagos).toFixed(2)
            this.Precio.total_credito_c_prima = ((this.Precio.cuota * pagos) + parseFloat(this.Precio.prima_cliente)).toFixed(2);

            this.crearPagos(pagos);
          }
        }
      }
    },
    cargarCiudades: function (item) {
      this.loadDireccion = true;
      item.Ciudades = [];
      this.$axios.get('/ciudades/'+item.municipio,{
        headers:{
          'Authorization': 'Bearer '+ this.$store.state.token
        }
      }).then((res)=>{
        res.data.ciudades.forEach((i)=>{
          item.Ciudades.push({
            id: i.id,
            nombre: i.nombres+' - '+i.tipo
          })
        })
        this.loadDireccion = false;
      })
    },
    cargarColaboradores(){
      this.$axios.get('/colaboradores_2').then((res)=>{
        res.data.colaboradores.forEach( (i) => {
          if (i.usuarios){
            this.Colaboradores.push({
              "nombre": i.nombres+' '+i.apellidos,
              "id":  i.usuarios.id
            });
          }
        });
      })
    },
    cargarColonias: function (item) {
      this.loadDireccion = true;
      this.$axios.get('/colonias/'+item.ciudad,{
        headers:{
          'Authorization': 'Bearer '+ this.$store.state.token
        }
      }).then((res)=>{
        item.Colonias = res.data.colonias;
        this.loadDireccion = false;
      })
    },
    cargarDepartamentos(){
      this.$axios.get('/departamentos',{
        headers:{
          'Authorization': 'Bearer '+ this.$store.state.token
        }
      }).then((res)=>{
        this.Departamentos = res.data.depto
      })
    },
    cargarDirecciones(direcciones){
      direcciones.forEach( (i) => {
        console.log(i)
        this.cargarMunicipios(i);
        this.cargarCiudades(i);
        this.cargarColonias(i)
      })
    },
    cargarMunicipios: function (item) {
      this.loadDireccion = true;
      this.$axios.get('/municipios/'+item.departamento,{
        headers:{
          'Authorization': 'Bearer '+ this.$store.state.token
        }
      }).then((res)=>{
        item.Municipios = res.data.municipios;
        this.loadDireccion = false;
      })
    },
    calcularMinimoPrima(){
      if (this.Precio.contado > 0){
        this.Precio.minimo_prima  = (this.Precio.contado * this.Precio.procentaje_prima).toFixed(2);
        this.Precio.saldo         = (this.Precio.contado - this.Precio.minimo_prima).toFixed(2)
        this.Precio.prima_cliente = this.Precio.minimo_prima;
      }
    },
    calcularPorcentajePrima(precio){
      let precio_contado                = precio.precio_contado;
      let minimo_prima                  = precio.minimo_prima;
      this.Precio.procentaje_prima      = (minimo_prima/precio_contado).toFixed(2);
      this.Precio.tasa_anual            = (precio.financiamiento_anual/100).toFixed(2);
      this.Precio.maximo_financiamiento = precio.maximo_financiacion;
    },
    cambiarEstadoFile(item){
      item.estado = 1;
    },
    enviarDatos(){
      if (this.Cliente.exists)
        this.$store.commit('solicitud_credito/editarCliente');
      else
        this.$store.commit('solicitud_credito/crearCliente');

      this.Cliente.exists = true;
    },
    crearPagos(pagos){
      let dias= 0, saldo = this.Precio.total_credito;
      let ANTES = new Date(), cuota = this.Precio.cuota;

      this.Precio.pagos = [];
      if(this.Precio.prima_cliente > 0){
        this.Precio.pagos.push({
          "num": 'prima',
          "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
          "saldo": this.Precio.total_credito_c_prima,
          "cuota": this.Precio.prima_cliente,
          "saldo_a": saldo
        });
      }

      for (let i = 0;  i < pagos; i++){
        ANTES.setMonth(ANTES.getMonth() + 1);
        this.Precio.pagos.push({
          "num": 'Letra '+(i+1),
          "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
          "saldo": saldo,
          "cuota": cuota,
          "saldo_a": (saldo - cuota).toFixed(2)
        });
        saldo = (saldo - cuota).toFixed(2);
        this.totalRows++;
      }
    },
    guardarAval(item){
      if (item.identidad) {
        if (this.validarCliente(item) && this.validarArchivos(item)) {
          if (item.exist){
            this.actualizarClienteAval(item)
          }else{
            this.registrarClienteAval(item)
          }
        }
      }else {
        this.$store.commit('notificacion',{texto:`No se ha buscado un aval en la fila ${parseInt(item.key) + parseInt(1)}`, color:'error'})
      }
    },
    print(clave){
      let url = this.$axios.defaults.baseURL+'documentos/ventas/solicitud_credito/usuario='+this.user+'/solicitud='+this.soli+'/'+clave
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
      this.dialogoArchivo = true;
    },
    registrar(){
      let codigo = this.producto.codigo_sistema;

      if (this.colaborador){
        let forma_pago = '';
        if (this.Precio.forma_pago === 1)
          forma_pago = 'Semanal';
        else if (this.Precio.forma_pago === 2)
          forma_pago = 'Quincenal';
        else if (this.Precio.forma_pago === 3)
          forma_pago = 'Mensual';

        let precio = {
          cuota: this.Precio.cuota,
          meses: this.Precio.meses,
          pagos: this.Precio.pagos,
          prima: this.Precio.prima_cliente,
          saldo: (this.Precio.contado - this.Precio.prima_cliente).toFixed(2),
          pagosT: 0,
          contado: this.Precio.contado,
          S_contado: false,
          min_prima: this.Precio.minimo_prima,
          forma_pago: this.Precio.forma_pago,
          observacion: this.Articulo,
          saldo_nuevo: (this.Precio.contado - this.Precio.prima_cliente).toFixed(2),
          total_credito: (this.Precio.total_credito_c_prima - this.Precio.prima_cliente).toFixed(2),
          financiamiento: this.Precio.tasa_anual,
          venta_sin_prima: false,
          prom_cant_cuotas: 0,
          prom_precio_contado: false,
          total_financiamiento: this.Precio.total_credito_c_prima,
          maximo_financiamiento: this.Precio.maximo_financiamiento
        }
        this.$store.commit('activarOverlay', true);
        this.$axios.post('solicitud_credito',{
          user:               this.colaborador,
          cliente_id:         this.Cliente.id,
          cod_sistema:        codigo,
          saldo_financiar:    parseFloat(this.Precio.saldo_a_financiar),
          tasa:               this.Precio.tasa_anual,
          tiempo:             parseInt(this.Precio.meses),
          forma_pago:         forma_pago,
          detalles_precio:    JSON.stringify(precio),
          referencias:        JSON.stringify(this.Solicitud_Referencias),
          precio_contado:     this.Precio.contado,
          prima:              this.Precio.prima_cliente,
          observacion_precio: this.Articulo[0].detalle,
          avales:             JSON.stringify(this.Solicitud_Avales),
          cuota:              this.Precio.cuota,
          combo:              false,
          financiera:         true
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.soli       = res.data.solicitud;
          this.registrado = true;
          this.$store.commit('notificacion',{texto:'La solicitud se ha registrado exitosamente',color:'success'});
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })
      }else{
        this.$store.commit('notificacion',{texto:'Tienes que seleccionar a quien se lo envias',color:'warning'});
      }
    },
    registrarClienteAval(item){
      this.$store.commit('activarOverlay', true);
      let data = new FormData(), cont = 0;
      for (let i in item.archivos){
        if (item.archivos[i].file) {
          data.append(`file_cliente[${cont}]`, item.archivos[i].file);
          cont++;
        }
      }
      data.append('nombres',          item.nombres.toUpperCase());
      data.append('apellidos',        item.apellidos.toUpperCase());
      data.append('identidad',        item.identidad);
      data.append('sexo',             item.sexo);
      data.append('archivos',         JSON.stringify(item.archivos));

      this.$axios({
        method:'post',
        url:'clientes',
        data:data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        item.id       = res.data.cliente;
        let archivos  = res.data.files;
        item.archivos = [];
        item.exist    = true;
        archivos.forEach( (i)=>{
          item.archivos.push({
            dir: i.dir,
            detalle: i.detalle,
            num:     i.num,
            status:  i.status,
            key:     i.key,
            file:    null,
            estado:  i.estado
          })
        });
        this.$store.commit('notificacion',{texto:`El aval de la fila ${parseInt(item.key) + parseInt(1)} se ha registrado`,color:'success'})
      }).catch((res)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
    removeArchivos(fila){
      let cont = 0;
      if (fila > this.cantArchivos){
        this.Cliente.archivos.splice(fila,1);
        this.Cliente.archivos.forEach( (i) => {
          i.key = cont;
          cont++;
        })
      }
    },
    removeAval(fila){
      let cont = 0;
      this.Solicitud.avales.splice(fila, 1);
      this.Solicitud.avales.forEach( (i) => {
        i.key = cont;
        cont++;
      })
    },
    removeDetalleArticulo(fila){
      let cont = 0;
      if (this.Articulo.length > 1){
        this.Articulo.splice(fila,1);
        this.Articulo.forEach( (i) => {
          i.key = cont;
          cont++;
        })
      }
    },
    removeDireccion(fila){
      let item = 0;
      this.Cliente.direcciones.splice(fila, 1)
      this.Cliente.direcciones.forEach( (i) => {
        i.key = item;
        item++;
      })
    },
    removeTelefono(fila){
      let item = 0;
      this.Cliente.telefonos.splice(fila, 1);
      this.Cliente.telefonos.forEach( (i) => {
        i.key = item;
        i.detalle = 'Telefono '+(parseInt(item) + parseInt(1));
        item++;
      })
    },
    removeReferencia(fila){
      let cont = 0;
      if (fila > 3){
        this.Solicitud.referencias.splice(fila, 1);
        this.Solicitud.referencias.forEach( (i) => {
          i.key = cont;
          cont++;
        })
      }
    },
    terminacionRegistro(){
      this.dialogoArchivo = false;
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      data.append('id', this.Solicitud);
      data.append('file', this.file);
      this.$axios.post('subir_solicitud_credito',data)
          .then((res)=>{
            this.$store.commit('surticredito/surticredito/cambiar_VISTA', 1);
            this.Solicitud_Avales = [];
            this.$store.commit('notificacion',{texto:'El archivo se ha registrado exitosamente', color:'success'});
            this.$store.commit('notificacion',{texto:'Tienes que esperar respuesta de faturación para proseguir con la venta',color:'success'});
            this.$store.commit('activarOverlay', false);
          })
    },
    validarArchivos(){
      let contador = 0, long = 0;
      this.Cliente.archivos.forEach( (i) => {
        if (i.num === 1 && !i.status){
          long++;
          if (i.detalle.length > 2 && i.file)
            contador ++;
        }
      });

      if (long === contador){
        return true
      }else{
        Vue.$toast.open({
          message: `Hay datos incompletos en los archivos.`,
          type: 'warning',
          position: 'bottom-left',
          duration: 4000
        });
        return  false;
      }
    },
    validarAvales(){
      let avl = this.Solicitud.avales;
      let bandera = avl.length, cont = 0;
      avl.forEach( (i)=> {
        if (i.id)
          cont++;
        else
          this.$store.commit('notificacion',{texto:`Hace falta registrar los datos del aval ${parseInt(i.key) + parseInt(1)}`,
              color:'warning'})
      });

      return bandera === cont;
    },
    solicitarClave(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.$store.commit('notificacion',{texto:'Cargando inventario', color:'success'});
        this.print(res.data.clave)
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'danger'});
      })
    },
    validarCliente(item){
      let cont = 0, bandera = 4;
      let regexId = RegExp("^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$");
      if (item.identidad.length === 13 && regexId.test(item.identidad))
        cont++;
      else
        this.$store.commit('notificacion',{texto:`La identidad es obligatoria en el aval ${parseInt(item.key) + parseInt(1)}.`,color:'warning'});

      if (item.nombres.length >= 3)
        cont++;
      else
        this.$store.commit('notificacion',{texto:`Los nombres son obligatorios en el aval ${parseInt(item.key) + parseInt(1)}.`,color:'warning'});

      if (item.apellidos.length >= 3)
        cont++;
      else
        this.$store.commit('notificacion',{texto:`Los apellidos son obligatorios en el aval ${parseInt(item.key) + parseInt(1)}.`,color:'warning'});

      if (item.sexo)
        cont++;
      else
        this.$store.commit('notificacion',{texto:`el sexo es obligatorio en el aval ${parseInt(item.key) + parseInt(1)}`,color:'warning'});

      return bandera === cont;
    },
    validarDatos(){
      if (this.Solicitud.referencias.length > 2) {
        if (this.validarReferencias() && this.validarAvales())
          this.validadoRef = true;
      }else
        this.$store.commit('notificacion',{texto: 'Tienes que agregar al menos 3 referencias', color:'warning'})

    },
    validarDatosCliente(){
      if (this.validarInformacion() && this.validarTelefonos() && this.validarArchivos() && this.validarDirecciones()){
        this.enviarDatos();
      }
    },
    validarDirecciones(){
      let contador = 0, long = this.Cliente.direcciones.length;
      if (long > 0){
        this.Cliente.direcciones.forEach( (i)=>{
          if (i.colonia && i.detalle)
            contador++
        });
        if (contador === long)
          return true;
        else{
          Vue.$toast.open({
            message: `Hay datos incompletos en las direcciones.`,
            type: 'warning',
            position: 'bottom-left',
            duration: 4000
          });
          return false;
        }
      }else{
        Vue.$toast.open({
          message: `Tiene que ingresa mínimo una dirección.`,
          type: 'warning',
          position: 'bottom-left',
          duration: 4000
        });
        return false;
      }
    },
    validarformFile(){
      if (this.file)
        this.terminacionRegistro();
      else
        this.$store.commit('notificacion',{texto:'Datos incompletos',color:'error'});
    },
    validarIdentidad(){
      this.buscarcliente();
    },
    validarInformacion(){
      let contador = 10, cont= 0, th = this.Cliente;
      let regexId = RegExp("^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$");
      if (th.identidad.length === 13 && regexId.test(th.identidad))
        cont++;
      else
        this.$store.commit('notificacion',{texto:'La identidad es obligatoria.', color:'warning'});

      if (th.salario && th.salario >= 0)
        cont++;
      else
        this.$store.commit('notificacion',{texto:'El salario es obligatorio, puede ser 0 o mayor a 0.', color:'warning'});


      if (th.nombres.length >= 3)
        cont++;
      else
        this.$store.commit('notificacion',{texto:'Los nombres son obligatorios.', color:'warning'});

      if (th.apellidos.length >= 3)
        cont++;
      else
        this.$store.commit('notificacion',{texto:'Los apellidos son obligatorios.', color:'warning'});

      if (th.nombres.length >= 3)
        cont++;
      else
        this.$store.commit('notificacion',{texto:'Los nombres son obligatorios.', color:'warning'});

      if (th.sexo)
        cont++;
      else
        this.$store.commit('notificacion',{texto:'el sexo es obligatorio',color:'warning'});

      let regexFecha = new RegExp("^(\\d{4})[\\/\\-](0?[1-9]|1[012])[\\/\\-](0?[1-9]|[12][0-9]|3[01])$");
      if (regexFecha.test(th.fecha_nacimiento))
        cont++;
      else
        this.$store.commit('notificacion',{texto:'La fecha de nacimiento es obligatoria.',color:'warning'});

      if (th.is_trabaja == 0 || th.is_trabaja == 1)
        cont++;
      else
        this.$store.commit('notificacion',{texto:'Especificar si el solicitante trabaja.',color:'warning'});

      if (th.nacionalidad)
        cont++;
      else
        this.$store.commit('notificacion',{texto:'La nacionalidad es obligatoria obligatorio.',color:'warning'});

      if (th.is_casa == 0 || th.is_casa == 1)
        cont++;
      else
        this.$store.commit('notificacion',{texto:'Especificar si el solicitante tiene casa es obligatorio.',color:'warning'});

      return contador === cont;
    },
    validarReferencias(){
      let ref = this.Solicitud.referencias;
      let bandera = ref.length, contador = 0, cont = 0;
      let telefonos = [];
      ref.forEach((i) => {
        telefonos = this.Cliente.telefonos.filter(item=>item.num == i.telefono);
        i.nuevo = telefonos.length === 0;

        cont = 0;
        if (i.nombre.length > 5)
          cont++;
        else
          this.$store.commit('notificacion', {texto:`Completa el nombre de la referencia ${parseInt(i.key) + parseInt(1)}`,
              color:'warning'})

        if (i.telefono.length >= 8 || i.telefono.length <= 10)
          cont++;
        else
          this.$store.commit('notificacion', {texto:`El telefono de la referencia ${parseInt(i.key) + parseInt(1)} no es valido`,
              color:'warning'})

        if (i.parentesco.length >= 3)
          cont++;
        else
          this.$store.commit('notificacion', {texto:`El parentesco de la referencia ${parseInt(i.key) + parseInt(1)} es obligatoria`,
              color:'warning'});

        if (i.direccion.length > 10)
          cont++;
        else
          this.$store.commit('notificacion', {texto:`La dirección de la referencia ${parseInt(i.key) + parseInt(1)} es obligatoria`,
              color:'warning'});

        if (cont === 4)
          contador++
      });

      return contador === bandera;

    },
    validarTelefonos(){
      let contador = 0, long = this.Cliente.telefonos.length;
      if (long > 0){
        this.Cliente.telefonos.forEach( (i)=>{

          if (i.detalle.length > 0 && (i.num.length === 8 || i.num.length === 10 || i.num.length === 9) && i.area.length === 3)
            contador++
        });
        if (contador === long)
          return true;
        else {
          Vue.$toast.open({
            message: `Hay datos incompletos en los telefonos.`,
            type: 'warning',
            position: 'bottom-left',
            duration: 4000
          });
          return  false;
        }
      }else{
        Vue.$toast.open({
          message: `Tiene que ingresar mínimo un telefono.`,
          type: 'warning',
          position: 'bottom-left',
          duration: 4000
        });
        return false
      }
    },
  }
}
</script>

<style scoped>
.input-laber{
  font-size: 8px;
}
input[type=text], select, input[type=date]{
  width: 100%;
  box-sizing: border-box;
  padding: 2px 10px;
  margin: 1px;
  border: 1px solid #ccc;
  border-radius: 1px;
  cursor: pointer;
  background-color: #ffffff;
}
.select-css {
  display: block;
  //font-size: 12px;
  //font-weight: 400;
  //color: #444;
  //line-height: 1.3;
  //max-width: 100%;
  //box-sizing: border-box;
  //border: 1px solid #aaa;
  //box-shadow: 0 1px 0 1px rgba(0,0,0,.03);
  //border-radius: .3em;
  //-moz-appearance: none;
  //-webkit-appearance: none;
  //appearance: none;
  //background-color: #fff;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
  linear-gradient(to bottom, #ffffff 0%,#f7f7f7 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
}
</style>
