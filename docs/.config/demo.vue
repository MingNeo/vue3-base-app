<template>
  <div
    class="demo-block"
    :class="blockClass">
    <div class="source">
      <div v-if="$slots.default">
        <slot></slot>
      </div>
      <component v-else :is="demoComp" v-bind="$attrs.props"></component>
    </div>
    <div class="meta" ref="meta">
      <div
        class="demo-block-control"
        @click="isExpanded = !isExpanded">
        <span>{{ controlText }}</span>
      </div>
      <div class="description" v-if="$attrs.desc">
        {{ $attrs.desc }}
      </div>
      <div class="highlight hljs">
        <slot name="highlight">
          <pre><code class="language-html"  v-html="codeHtml"></code></pre>
        </slot>
      </div>
    </div>
    <div
      class="demo-block-control"
      @click="isExpanded = !isExpanded">
      <span>{{ controlText }}</span>
    </div>
  </div>
</template>

<script >
  import hljs from 'highlight.js';
  import 'highlight.js/styles/atom-one-dark.css';

  export default {
    props: {
      src: '',
    },
    data() {
      return {
        codeHtml: '',
        demoComp: null,
        hovering: false,
        isExpanded: false,
        scrollParent: null
      };
    },

    computed: {
      lang() {
        return this.$route.path.split('/')[1];
      },

      blockClass() {
        return `demo-${ this.lang }`;
      },

      controlText() {
        return this.isExpanded ? '收起代码' : '展开代码';
      },

      codeArea() {
        return this.$el.getElementsByClassName('meta')[0];
      },

      codeAreaHeight() {
        if (this.$el.getElementsByClassName('description').length > 0) {
          return this.$el.getElementsByClassName('description')[0].clientHeight +
            this.$el.getElementsByClassName('highlight')[0].clientHeight + 20;
        }
        return this.$el.getElementsByClassName('highlight')[0].clientHeight;
      }
    },

    watch: {
      isExpanded(val) {
        this.codeArea.style.height = val ? `${ this.codeAreaHeight }px` : '0';
      }
    },

    created() {
      if(this.src) {
        import(/* @vite-ignore */this.src).then(result => {
          this.demoComp = result.default
        })
        import(/* @vite-ignore */`${this.src}?raw`).then(result => {
          this.codeHtml =  hljs.highlight(result.default, { language: 'html' }).value
        })
      }
    },
  };
</script>

<style lang="scss">
.demo-block {
  border: solid 1px #ebebeb;
  border-radius: 3px;
  transition: .2s;
  margin-bottom: 20px;

  &.hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
  }

  code {
    font-family: Menlo, Monaco, Consolas, Courier, monospace;
  }

  .demo-button {
    float: right;
  }

  .source {
    background: #f4f4f4;
    padding: 20px;
  }

  .meta {
    background-color: #fafafa;
    border-top: solid 1px #eaeefb;
    overflow: hidden;
    height: 0;
    transition: height .2s;
  }

  .description {
    padding: 20px;
    box-sizing: border-box;
    border: solid 1px #ebebeb;
    border-radius: 3px;
    font-size: 14px;
    line-height: 22px;
    color: #666;
    word-break: break-word;
    margin: 10px;
    background-color: #fff;

    p {
      margin: 0;
      line-height: 26px;
    }

    code {
      color: #5e6d82;
      background-color: #141516;
      margin: 0 4px;
      display: inline-block;
      padding: 1px 5px;
      font-size: 12px;
      border-radius: 3px;
      height: 18px;
      line-height: 18px;
    }
  }

  .highlight {
    padding: 20px;

    pre {
      margin: 0;
    }

    code.hljs {
      margin: 0;
      border: none;
      max-height: none;
      border-radius: 0;

      &::before {
        content: none;
      }
    }
  }

  .demo-block-control {
    border-top: solid 1px #eaeefb;
    height: 44px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    margin-top: -1px;
    // color: #d3dce6;
    color: #409EFF;
    cursor: pointer;
    position: relative;

    i {
      font-size: 16px;
      line-height: 44px;
      transition: .3s;
    }

    >span {
      position: absolute;
      font-size: 14px;
      line-height: 44px;
      transition: .3s;
      display: inline-block;
    }

    &:hover {
      color: #409EFF;
      background-color: #f9fafc;
    }
  }
}
</style>