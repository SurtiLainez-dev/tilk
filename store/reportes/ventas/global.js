export const state = () => ({
    VISTA: 1,
    LOAD_DATATABLE: false,
    DATATABLE: []
})

export const mutations = {
    cambio_VISTA(state, val){
        state.VISTA = val;
    },
    cargar_DATATABLE(state, data){
        state.LOAD_DATATABLE = true;
        this.$axios.get(`reportes/ventas/global/fecha_inicio=${data.fi}&fecha_final=${data.ff}&sucursal=${data.suc}&colaborador=${data.col}&tipo=${data.tipo}`).then((res)=>{
            state.DATATABLE = res.data.data;
            state.LOAD_DATATABLE = false;
        })
    }
}
