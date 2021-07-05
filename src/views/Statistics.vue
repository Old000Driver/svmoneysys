<template>
  <Layout>
    <Tabs class-prefix="types" :data-source="recordTypeList" :value.sync="types"></Tabs>
    <div class="chart-wrapper" ref="chartWrapper">
      <Chart class="chart" :options="x"/>
    </div>
    <ol v-if="groupedList.length>0">
      <li v-for="(group,index) in groupedList" :key="index">
        <h3 class="title">{{ beautify(group.title) }} <span>￥{{ group.total }}</span></h3>
        <ol>
          <li v-for="item in group.items" :key="item.id" class="record">
            <span>{{ tagString(item.tags) }}</span>
            <span class="notes">{{ item.notes }}</span>
            <span>￥{{ item.amount }}</span>
          </li>
        </ol>
      </li>
    </ol>
    <div v-else class="noResult">
      目前没有相关记录
    </div>
  </Layout>
</template>


<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import dayjs from 'dayjs';
import clone from '@/lib/clone';
import Tabs from '@/components/Tabs.vue';
import recordTypeList from '@/constants/recordTypeList';
import Chart from '@/components/Chart.vue';


@Component({
  components: {Tabs, Chart}
})
export default class Statistics extends Vue {
  tagString(tags: Tag[]) {
    return tags.length === 0 ? '无' : tags.map(t => t.name).join('，');
  }

  mounted() {
    const div = (this.$refs.chartWrapper as HTMLDivElement);
    div.scrollLeft = div.scrollWidth;
  }

  beautify(string: string) {
    const day = dayjs(string);
    const now = dayjs();
    if (day.isSame(now, 'day')) {
      return '今天';
    } else if (day.isSame(now.subtract(1, 'day'), 'day')) {
      return '昨天';
    } else if (day.isSame(now.subtract(2, 'day'), 'day')) {
      return '前天';
    } else if (day.isSame(now, 'year')) {
      return day.format('M 月 D 日');
    } else {
      return day.format('YYYY 年 M 月 D 日');
    }
  }

  get x() {
    return {
      grid: {
        left: 0,
        right: 0,
      },
      xAxis: {
        type: 'category',
        data: [
          '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
          '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
          '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
        ],
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: '#8c8c8c'
          },
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [{
        data: [
          820, 932, 901, 934, 1290, 1330, 1320,
          820, 932, 901, 934, 1290, 1330, 1320,
          820, 932, 901, 934, 1290, 1330, 1320,
          820, 932, 901, 934, 1290, 1330, 1320, 1, 2
        ],
        type: 'line',
        lineStyle: {
          color: '#47b7f5'
        },
        itemStyle: {
          color: '#47b7f5',
        },
        symbol: 'circle',
        symbolSize: 14
      }],
      tooltip: {
        show: true,
        triggerOn: 'click',
        formatter: '{c}',
        position: 'top',
        backgroundColor: '#47b7f5',
      }
    };
  }

  get recordList() {
    return (this.$store.state as RootState).recordList;
  }

  get groupedList() {
    const {recordList} = this;

    // const hashTable: { title: string, items: RecordItem[] }[];
    const newList = clone(recordList)
        .filter(r => r.type === this.types)
        .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
    console.log(newList);
    if (newList.length == 0) {
      return [] as Result;
    }
    type Result = { title: string, total?: number, items: RecordItem[] }[]
    const result: Result = [{
      title: dayjs(recordList[0].createdAt).format('YYYY-MM-DD'),
      items: [newList[0]]
    }];
    for (let i = 1; i < newList.length; i++) {
      const current = newList[i];
      const last = result[result.length - 1];
      if (dayjs(last.title).isSame(dayjs(current.createdAt), 'day')) {
        last.items.push(current);
      } else {
        result.push({title: dayjs(current.createdAt).format('YYYY-MM-DD'), items: [current]});
      }
    }
    result.map(group => {
      group.total = group.items.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
    });
    return result;
  }

  beforeCreate() {
    this.$store.commit('fetchRecords');
  }

  types = '-';
  recordTypeList = recordTypeList;
}
</script>

<style scoped lang="scss">
.chart {
  width: 430%;

  &-wrapper {
    overflow: auto;

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
}

.echarts {
  max-width: 100%;
  height: 400px;
}

.noResult {
  padding: 16px;
  text-align: center;
}

%item {
  padding: 8px 16px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.title {
  @extend %item
}

.record {
  @extend %item;
  background: white;

}

.notes {
  margin-right: auto;
  margin-left: 16px;
  color: #8c8c8c;
}

::v-deep {
  .type-tabs-item {

  }

  .interval-tabs-item {
    height: 48px;
  }
}
</style>


