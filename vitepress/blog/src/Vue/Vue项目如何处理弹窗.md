```vue
<!-- Modal.vue -->
<template>
  <div v-if="visible" class="modal">
    <div class="modal-header">
      <h3>{{ title }}</h3>
      <button @click="close">X</button>
    </div>
    <div class="modal-body">
      {{ content }}
    </div>
    <div class="modal-footer">
      <button @click="confirm">确认</button>
      <button @click="close">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: String,
    content: String
  },
  emits: ['update:visible', 'confirm'],
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    confirm() {
      this.$emit('confirm');
      this.close();
    }
  }
};
</script>

<style scoped>
/* 样式省略 */
</style>


// modalFactory.js
import Modal from './Modal.vue';

export function createModal(options) {
  return {
    render(h) {
      return h(Modal, {
        props: {
          visible: options.visible,
          title: options.title,
          content: options.content
        },
        on: {
          'update:visible': (value) => {
            options.visible = value;
          },
          confirm: options.onConfirm
        }
      });
    }
  };
}
<!-- ParentComponent.vue -->
<template>
  <div>
    <button @click="showModal1 = true">显示弹窗1</button>
    <button @click="showModal2 = true">显示弹窗2</button>
    <button @click="showModal3 = true">显示弹窗3</button>

    <component :is="modal1"></component>
    <component :is="modal2"></component>
    <component :is="modal3"></component>
  </div>
</template>

<script>
import { createModal } from './modalFactory';

export default {
  data() {
    return {
      showModal1: false,
      showModal2: false,
      showModal3: false
    };
  },
  computed: {
    modal1() {
      return createModal({
        visible: this.showModal1,
        title: '弹窗1',
        content: '弹窗1内容',
        onConfirm: this.onConfirm1
      });
    },
    modal2() {
      return createModal({
        visible: this.showModal2,
        title: '弹窗2',
        content: '弹窗2内容',
        onConfirm: this.onConfirm2
      });
    },
    modal3() {
      return createModal({
        visible: this.showModal3,
        title: '弹窗3',
        content: '弹窗3内容',
        onConfirm: this.onConfirm3
      });
    }
  },
  methods: {
    onConfirm1() {
      console.log('确认弹窗1');
    },
    onConfirm2() {
      console.log('确认弹窗2');
    },
    onConfirm3() {
      console.log('确认弹窗3');
    }
  }
};
</script>










// modalService.js
import Modal from './Modal.vue';
import { createApp } from 'vue';

let modalInstance = null;

export function showModal(options) {
  if (modalInstance) {
    modalInstance.remove();
  }

  const app = createApp(Modal, {
    ...options,
    onClose: () => {
      modalInstance.unmount();
      modalInstance = null;
    }
  });

  modalInstance = app.mount(document.createElement('div'));
  document.body.appendChild(modalInstance.$el);
}

export function hideModal() {
  if (modalInstance) {
    modalInstance.unmount();
    modalInstance.$el.remove();
    modalInstance = null;
  }
}


// AnyComponent.vue
<template>
  <button @click="openModal1">显示弹窗1</button>
  <button @click="openModal2">显示弹窗2</button>
  <!-- 更多按钮 -->
</template>

<script>
import { showModal } from './modalService';

export default {
  methods: {
    openModal1() {
      showModal({
        title: '弹窗1',
        content: '弹窗1内容',
        onConfirm: this.onConfirm1
      });
    },
    openModal2() {
      showModal({
        title: '弹窗2',
        content: '弹窗2内容',
        onConfirm: this.onConfirm2
      });
    },
    // 更多方法
    onConfirm1() {
      console.log('确认弹窗1');
      hideModal();
    },
    onConfirm2() {
      console.log('确认弹窗2');
      hideModal();
    },
    // 更多确认方法
  }
};
</script>
```