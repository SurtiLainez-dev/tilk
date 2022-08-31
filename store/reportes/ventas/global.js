export const state = () => ({
    VISTA: 1,
    LOAD_DATATABLE: false,
    DATATABLE: [],
    DATOS: {}
})

export const mutations = {
    cambio_VISTA(state, val){
        state.VISTA = val;
    },
    cargar_DATATABLE: function (state, data) {
        state.DATOS = data;
        state.LOAD_DATATABLE = true;
        this.$axios.get(`reportes/ventas/global/fecha_inicio=${data.fi}&fecha_final=${data.ff}&sucursal=${data.suc}&colaborador=${data.col}`).then((res) => {
            state.DATATABLE = res.data.data;
            // state.DATATABLE = [];
            // let status = false;
            // data.forEach((item) => {
            //     item.venta.facturas_contados.forEach((i, x) => {
            //         status = item.venta.facturas_contados.length > 1;
            //         state.DATATABLE.push({
            //             'data':   item,
            //             'venta':  i,
            //             'status': status
            //         })
            //     });
            // });

            state.LOAD_DATATABLE = false;
        })
    }
}
