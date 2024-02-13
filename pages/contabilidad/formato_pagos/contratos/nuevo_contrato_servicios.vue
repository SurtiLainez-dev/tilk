<template>
  <v-card flat tile>
    <formato_pagos :contrato="{}" :tipo="1"/>
  </v-card>
</template>

<script>
import formato_pagos from "@/components/contabilidad/formato_pagos.vue";
export default {
  name: "nuevo_contrato_servicios",
  components:{formato_pagos}
}
</script>
