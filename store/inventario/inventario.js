export const state = () => ({
    LOAD_INVENTARIO: false,
    INVENTARIO:      [],
    ARTICULO:        {},
    DIALOGOINFO:     false,
    PEPS:            [],
    LOAD_PEPS:       false,
    LOAD_STOCK:      false,
    STOCK:           []
});
export const mutations = {
    asignar_ARTICULO(state, data){
        state.ARTICULO = data;
    },
    cargartodo_INVENTARIO(state){
        state.LOAD_INVENTARIO = true;
        this.$axios.get('/2.0/articulos/').then((res)=>{
            state.INVENTARIO      = res.data.articulos;
            state.LOAD_INVENTARIO = false;
        });
    },
    cargar_PEPS(state){
        state.LOAD_PEPS = true;
        this.$axios.get('/2.0/peps/articulo/'+state.ARTICULO.id).then((res)=>{
            state.PEPS      = res.data.peps;
            state.LOAD_PEPS = false;
        });
    },
    cargar_STOCK(state){
        state.LOAD_STOCK = true;
        state.STOCK      = [];
        this.$axios.get('/2.0/inventario_sucursales/articulo/'+state.ARTICULO.id).then((res)=>{
            res.data.stocks.forEach((item)=>{
                state.STOCK.push(
                    {
                        sucursal:         item.sucursal.nombre,
                        codigo:           item.articulo.codigo_sistema,
                        stock_actual:     item.stock_actual,
                        stock_reingreso:  item.stock_reingreso,
                        stock_consignado: item.stock_consignado,
                        total:            (item.articulo.precio_costo * item.stock_actual).toFixed(2),
                        total_cons:       (item.articulo.precio_costo * item.stock_consignado).toFixed(2)
                    }
                )
            });
            state.LOAD_STOCK = false;
        });
    },
    estado_DIALOGOINFO(state, val){
        state.DIALOGOINFO = val;
    }
}
