<template>
<v-card>
  <GmapMap
      :center="{lat:10, lng:10}"
      :zoom="7"
      map-type-id="terrain"
      style="width: 500px; height: 300px"
  >
    <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :title="m.title"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
    ></gmap-marker>
  </GmapMap>
</v-card>
</template>

<script>

export default {
  name: "mapa",
  props: {
    latitude: Number,
    longitude: Number,
    title: String
  },
  created() {

  },
  data(){
    return{
      center: {lat: this.latitude, lng: this.longitude},
      markers: [{
        position: {lat: this.latitude, lng: this.longitude},
        title: this.title
      }]
    }
  },
}
</script>

<style scoped>

</style>

