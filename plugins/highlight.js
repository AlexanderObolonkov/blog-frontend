// plugins/highlight.js
import Vue from 'vue';
import Hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

Vue.directive('highlightjs', {
  deep: true,
  bind(el, binding) {
    // On first bind, highlight all targets
    let targets = el.querySelectorAll('code');
    targets.forEach((target) => {
      if (typeof binding.value === 'string') {
        target.textContent = binding.value;
      }
      Hljs.highlightElement(target);
    });
  },
  componentUpdated(el, binding) {
    // After an update, re-fill the content and then highlight
    let targets = el.querySelectorAll('code');
    targets.forEach((target) => {
      if (typeof binding.value === 'string') {
        target.textContent = binding.value;
      }
      Hljs.highlightElement(target);
    });
  },
});
