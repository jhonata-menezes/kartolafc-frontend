<script>
import { Bar } from 'vue-chartjs'

export default Bar.extend({
  props: ['data', 'options'],

  mounted: function () {
    this.renderChart(this.data, this.options)
  }
})
</script>

<style>

</style>

