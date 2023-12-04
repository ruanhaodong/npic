<template>
  <div ref="chartNode">

  </div>
</template>

<script setup lang="ts">
import { DataItem, DataItemCollectionType, Timeline, TimelineFormatLabelsFunction, TimelineOptions, moment } from "vis-timeline/standalone";
import { DataSet } from "vis-data"
import { Moment } from "moment";


const props = defineProps<{
  memories: Memory
}>()

const dataSet = new DataSet<DataItem, "id">()
const timeline = ref<Timeline>()



watchEffect(() => {

  if (!props.memories.memories) {
    dataSet.clear()
    return;
  }
  props.memories.memories.forEach((memory, index) => {
    const id = memory.age + props.memories.bornAt;
    const isNew = (dataSet.get(id) == null)


    if (memory.emoji) {
      dataSet.update({
        id,
        content: memory.emoji,
        start: moment().add(memory.age + props.memories.bornAt, 'years'),
        type: 'point'
      })
    }

    if (isNew && props.memories.memories.length > 0) {
      const min = moment().add(props.memories.memories[0].age + props.memories.bornAt, 'years')
      const max = moment().add(props.memories.memories[props.memories.memories.length - 1].age + props.memories.bornAt, 'years')
      timeline.value?.fit()

    }
  })







})



const chartNode = ref<HTMLElement>()

onMounted(() => {
  dataSet.add([])

  // Configuration for the Timeline
  var options: TimelineOptions = {
    maxHeight: "500px",
    min: moment().subtract(100, 'years').toDate(),
    start: moment().subtract(props.memories.bornAt, 'years').toDate(),
    max: moment().add(props.memories.bornAt | 500, 'years').toDate(),
    stack: true,
    showCurrentTime: false,
    // format: ({
    //   majorLabels: () => {
    //     return '公元'
    //   },
    //   minorLabels: (date: Date, scale: string, step: number) => {
    //     const t = (date as unknown as Moment)
    //     return `${t.year() - 1970}/${((t.month() + 1) + '').padStart(2, '0')}`
    //   }
    // }),

  };
  // Create a Timeline

  nextTick(() => {
    timeline.value = new Timeline(chartNode.value as HTMLElement, dataSet, options);
    dataSet.forEach(function(item) {
      console.log(item);
    });
    timeline.value?.fit()
  })

})

</script>

<style >
@tailwind base;
@tailwind components;
@tailwind utilities;


.vis-timeline {
  /* border: 2px solid purple; */
  border-radius: 10px;
  font-size: 12pt;
  background: #ffffff;
}

.vis-item {
  border-color: #003566;
  /* background-color: pink; */
  font-size: 15pt;
  color: 003566;
  box-shadow: 5px 5px 20px rgba(128, 128, 128, 0.8);
}

.vis-item,
.vis-item.vis-line {
  border-width: 3px;
}

.vis-item.vis-dot {
  border-width: 5px;
  border-radius: 5px;
  margin-top: 30px;
  margin-left: 20px;
}

.vis-item.vis-selected {
  border-color: green;
  background-color: lightgreen;
}

.vis-time-axis .vis-text {
  color: #8d99ae;
  padding-top: 10px;
  padding-left: 10px;
}

.vis-time-axis .vis-text.vis-major {
  font-weight: bold;
}

.vis-time-axis .vis-grid.vis-minor {
  border-width: 1px;
  border-color: #8d99ae;
}

.vis-time-axis .vis-grid.vis-major {
  border-width: 2px;
  border-color: #8d99ae;
}

.vis-item .vis-item-content {
  padding-right: 10px;
}

.vis-item.vis-point {
  background-color: #D5DDF6;
}

</style>