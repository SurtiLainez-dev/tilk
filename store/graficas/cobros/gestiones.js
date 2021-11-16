export const state = () => ({
    G_TOTALESSEGMENTOS: [],
    G_LOADTOTALESSEGMENTOS: false
})

export const mutations = {
    cargar_TOTALES_SEGMENTOS(state, id){
        state.G_LOADTOTALESSEGMENTOS = true;
        let int = Intl.NumberFormat();
        this.$axios.get(`cobros/postafolio/${id}/calcular_valor_cuotas`).then((res)=>{
            state.G_TOTALESSEGMENTOS = [];
            if (res.data.totales){
                res.data.totales.forEach((i)=>{
                    state.G_TOTALESSEGMENTOS.push([
                        i.nombre, i.total
                    ]);
                });
            }
            state.G_LOADTOTALESSEGMENTOS = false;
        })
    }
}
