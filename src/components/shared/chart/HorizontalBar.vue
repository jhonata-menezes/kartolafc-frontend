<script>
import { HorizontalBar } from 'vue-chartjs'

export default HorizontalBar.extend({
  props: ['data', 'options'],

  mounted: function () {
    this.renderChart(this.data, this.options)
  }
})
</script>

<style>

</style>

