<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns" :key="col + 'th'" ref="th">
          {{ col }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="n in 30" :key="n +'tr'">
        <td v-for="col in columns" :key="col + n +'td'">
          {{ randomWord() }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'HorizontalTable',

  props: {
    sticky: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      columns: [
        'Lorem',
        'ipsum',
        'dolor',
        'sit',
        'amet,',
        'consectetur',
        'adipisicing',
        'elit.',
        'Molestiae',
        'fuga',
        'vel',
        'nihil',
        'consequatur',
        'fugit',
        'repellendus',
        'provident',
        'nostrum',
        'obcaecati',
        'maxime',
        'unde',
        'quis',
        'corrupti',
        'consectetur,',
        'doloribus',
        'laborum',
        'pariatur',
        'ratione',
        'facilis',
        'optio',
        'quidem?'
      ],
      thWidths: [],
      tableWidth: 0
    }
  },

  methods: {
    randomWord () {
      return this.columns[Math.floor(Math.random() * this.columns.length)]
    }
  }
}
</script>

<style scoped lang="scss">
table {
  border-spacing: 0;
  box-sizing: border-box;

  td,
  th {
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid grey;
  }

  th {
    background-color: teal;
    color: white;
    box-sizing: border-box;
  }
}
</style>
