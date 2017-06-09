<script>
import { Line } from 'vue-chartjs'

export default Line.extend({
  props: ['data', 'options'],
  mounted: function () {
    this.renderChart(this.data, this.options)
  }
})
</script>

<style>

</style>

