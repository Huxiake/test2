<template>
  <div class="content">
    <!-- 单个操作 -->
    <el-button
      v-if="itemList.length === 1"
      size="medium"
      @click="handleCommand(itemList[0])"
    >
      {{ itemList[0].name }}
    </el-button>
    <!-- 多个操作 -->
    <el-dropdown v-else-if="itemList.length > 1" class="content__dropdown" trigger="click" @command="handleCommand">
      <el-button
        class="dropdownBtn"
        size="medium"
        plain
      >
        <div v-loading="itemList[0].loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="down-loading" class="dropdownBtn-name" @click.stop="() => { !name && handleCommand(itemList[0]) }">
          {{ name || itemList[0].name }}
        </div>
        <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <!-- 下拉菜单 -->
      <el-dropdown-menu v-if="itemList.length > 1" slot="dropdown" class="operate-btn">
        <el-dropdown-item v-for="(i, iIndex) in itemList.filter((i, iIndex) => name !== false || iIndex !== 0)" :key="iIndex" :command="i">
          {{ i.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'DropdownButton',
  props: {
    name: {
      // i18n字段 name字段存在时，第一个按钮为纯文本，不含操作
      type: [Boolean, String],
      default: false
    },
    items: {
      /*
        [{ name: i18n字段, type: xxx, if: true/false, path: 路由, query: 参数 }]
        path、query仅限type为_jump时有效
      */
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      itemList: []
    }
  },
  watch: {
    items() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      const { items } = this
      this.itemList = items.filter(i => i.if === undefined || i.if === true)
    },
    // 事件
    handleCommand({ type, path, query }) {
      const { row } = this.data
      this.$emit('command', { type, data: row })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: inline-block;
  vertical-align: top;
  font-weight: 400;
  &__dropdown {
    .el-button {
      padding: 4px 8px 4px 4px;
      div {
        display: inline-block;
        vertical-align: top;
      }
    }
  }
}

.dropdownBtn {
  height: 28px;
  padding: 4px 8px 4px 16px;
  font-size: 0;
  font-weight: 400;
  line-height: 22px;
  background-color: #fff;
  &:hover,
  &:focus,
  &:focus {
    background-color: rgba(53, 119, 218, .05);
  }
  &-name {
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    padding: 0 16px 0 10px;
    border-right: 1px solid #e5e8ec;
  }
  i {
    margin-top: 4px;
    margin-left: 8px;
    font-size: 12px;
  }
}
</style>

<style lang="scss">
.el-loading-mask.down-loading {
  .el-loading-spinner {
    top: 0;
    margin-top: 0;
  }
}
</style>
