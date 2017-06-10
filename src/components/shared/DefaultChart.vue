<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default Line.extend({
  mixins: [reactiveProp],

  props: ['data', 'options'],

  mounted: function () {
    this.renderChart(this.chartData, this.options)
  }
})
</script>

<style>

</style>

