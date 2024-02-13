export const state = () => ({
    DIVISAS: [],
    LOADDIVISAS: false,
    DIVISA: {}
})

export const mutations = {
    cargarMonedas(state){
        if (state.DIVISAS.length === 0){
            state.LOADDIVISAS = false;
            this.$axios.get('contabilidad/formato_pago/divisas').then((res)=>{
                state.DIVISA      = res.data.divisas.find(({actual_sistema})=> actual_sistema === 1);
                state.DIVISAS     = res.data.divisas;
                let date          = new Date();
                let fecha         = date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()
                date              = new Date(fecha);
                let date2         = undefined;
                state.DIVISAS.forEach((item)=>{
                    if (item.actual_sistema === 0){
                        date2 = new Date(item.fecha_actualizado);
                        if (date > date2){
                            this.$axios({
                                url: `https://api.getgeoapi.com/v2/currency/convert?api_key=40490b9963a9a3a0c3c8504d76a8344817c1ce02&from=${item.abre}&to=${state.DIVISA.abre}&amount=1`,
                                method: 'get'
                            }).then((res)=>{
                                item.cambio = res.data.rates.HNL.rate
                                this.$axios.post('contabilidad/formato_pago/divisa',{
                                    cambio: res.data.rates.HNL.rate,
                                    id: item.id
                                })
                            })
                        }
                    }
                })
            })
        }
    }
}
