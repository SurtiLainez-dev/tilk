

export const state = () => ({
    MIS_VENTAS:        [],
    LOAD_MIS_VENTAS:   false,
    DATA_VENTA:        null,
    ID_VENTA:          null,
    DATOS_CARD:        [],
    VENTAS:            [],
    VENTAS_PENDIENTES: [],
    IS_MOTO:           false,
    DATA_COMPONENTES:  [],
    DATA_REGALIAS:     [],
    IS_ACEPTADA:       0
})

export const mutations = {
    cargar_MIS_VENTAS(state){
        state.LOAD_MIS_VENTAS = true;
        this.$axios.get('mis_ventas').then((res)=>{
            state.MIS_VENTAS      = res.data.ventas;
            state.LOAD_MIS_VENTAS = false;
        })
    },
    asignar_ID_VENTA(state, id){
        state.ID_VENTA = id;
    },
    cargar_DATA_VENTA(state){
        state.LOAD_MIS_VENTAS  = true;
        state.DATA_COMPONENTES = [];
        state.DATA_REGALIAS    = [];
        this.$axios.get('venta/'+state.ID_VENTA).then((res)=>{
            state.DATA_VENTA      = res.data.venta;

            let TipoVenta = '', EstadoVenta = '', AceptadoPorFacturacion = '';
            if (state.DATA_VENTA.tipo_venta === 1)
                TipoVenta = 'Contado';
            else if (state.DATA_VENTA.tipo_venta === 2)
                TipoVenta =  'Crédito';

            if (state.DATA_VENTA.estado === 1)
                EstadoVenta = 'Al día';
            else if (state.DATA_VENTA.estado === 2)
                EstadoVenta = 'Mora';
            else if (state.DATA_VENTA.estado === 3)
                EstadoVenta = 'Cancelada';
            else if (state.DATA_VENTA.estado === 4)
                EstadoVenta = 'Pendiente Aprobación';

            if (state.DATA_VENTA.is_aceptado === 1)
                AceptadoPorFacturacion = 'Sí';
            else if (state.DATA_VENTA.is_aceptado === 2)
                AceptadoPorFacturacion = 'No';
            else if (state.DATA_VENTA.is_aceptado === 3)
                AceptadoPorFacturacion = 'Pendiente';

            state.DATOS_CARD = [
                {titulo: 'Nombre del cliente',        texto: state.DATA_VENTA.cliente.nombres+' '+ state.DATA_VENTA.cliente.apellidos},
                {titulo: 'Nombre del vendedor',       texto: state.DATA_VENTA.colaborador.nombres+' '+state.DATA_VENTA.colaborador.apellidos},
                {titulo: 'Sucursal de venta',         texto: state.DATA_VENTA.colaborador.sucursal.nombre},
                {titulo: 'Tipo de venta',             texto: TipoVenta},
                {titulo: 'Estado de venta',           texto: EstadoVenta},
                {titulo: 'Código de venta',           texto: state.DATA_VENTA.cod},
                {titulo: 'Aceptado por facturación',  texto: AceptadoPorFacturacion},
                {titulo: 'Total de la venta',         texto: 'L. '+state.DATA_VENTA.total},
                {titulo: 'Número de Cuotas',          texto: state.DATA_VENTA.num_cuotas+' cuotas'},
                {titulo: 'Artículo',                  texto: state.DATA_VENTA.remision_articulo.articulo.nombre_articulo},
                {titulo: 'Código del sistema',        texto: state.DATA_VENTA.remision_articulo.articulo.codigo_sistema},
                {titulo: 'Marca',                     texto: state.DATA_VENTA.remision_articulo.articulo.marca.nombre},
            ]

            state.IS_MOTO = state.DATA_VENTA.remision_articulo.articulo.is_motocicleta === 1;

            let stock_reingreso = 0, stock_nuevo = 0;
            state.DATA_VENTA.remision_articulo.articulo.articulo_compuestos.forEach( (item) => {
                if (item.inventario_compuestos){
                    item.inventario_compuestos.forEach( (i) => {
                        if (i.sucursal_id === state.DATA_VENTA.colaborador.sucursal_id){
                            console.log(i)
                            stock_nuevo     = i.stock_nuevo;
                            stock_reingreso =  i.stock_reingreso;
                            console.log(stock_reingreso)
                            console.log(stock_nuevo)
                        }
                    });
                }

                state.DATA_COMPONENTES.push({
                    detalle:          item.detalle,
                    codigo:           item.codigo,
                    salida:           false,
                    id_articulo:      item.id,
                    stock_nuevo:      stock_nuevo,
                    stock_reingreso:  stock_reingreso
                })
                stock_nuevo     = 0;
                stock_reingreso = 0;
            })

            state.DATA_VENTA.regalias_ventas.forEach( (item) => {
                state.DATA_REGALIAS.push({
                    articulo:    item.articulo.nombre_articulo+' - '+item.articulo.descripcion_corta,
                    articulo_id: item.articulo_id,
                    codigo:      item.articulo.codigo_sistema,
                    estado:      item.estado,
                    salida:      false
                })

            })

            state.IS_ACEPTADA = state.DATA_VENTA.is_aceptado !== 2 || state.DATA_VENTA.estado === 4;

            state.LOAD_MIS_VENTAS = false;
        })
    },
    cargar_VENTAS(state){

    },
    cargar_VENTAS_PENDIENTES(state){
        state.LOAD_MIS_VENTAS = true;
        this.$axios.get('ventas_pendientes').then((res)=>{
            state.VENTAS_PENDIENTES = res.data.ventas;
            state.LOAD_MIS_VENTAS = false;
        })
    }
}
