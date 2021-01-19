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
      <tr v-for="(row, n) in rows" :key="n +'tr'">
        <td v-for="(col, i) in row" :key="i + n +'td'">
          <a
            href="https://www.google.com"
            :class="{dragging}"
            @mousedown="handleMouseDown"
            @click="handleLinkClick"
            target="_blank">
            {{ col }}
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'HorizontalTable',

  props: {
    dragging: {
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
      rows: [],
      preventClick: false
    }
  },

  created () {
    for (let i = 0; i < 30; i++) {
      const row = []
      this.columns.forEach(() => row.push(this.columns[Math.floor(Math.random() * this.columns.length)]))
      this.rows.push(row)
    }
  },

  watch: {
    dragging (dragging) {
      if (dragging) {
        this.preventClick = true
      }
    }
  },

  methods: {
    handleLinkClick (e) {
      if (this.preventClick) {
        e.preventDefault()
      }
    },
    handleMouseDown () {
      this.preventClick = false
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
    border-bottom: 1px solid grey;
  }

  th {
    height: 60px;
    background-color: teal;
    color: white;
    box-sizing: border-box;
  }

  a {
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 20px;

    &.dragging {
      cursor: grabbing;
    }
  }

  tr {
    background-color: white;

    &:hover {
      background-color: rgba(teal, .5);
    }
  }
}
</style>
