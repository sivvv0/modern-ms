import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue';
import { parse, format } from '../core/index.js';

export function useMs(value: Ref<string | number> | string | number, options?: any) {
  const source = typeof value === 'object' && 'value' in value ? value : ref(value);
  
  const result = computed(() => {
    const val = source.value;
    if (typeof val === 'string') return parse(val, options);
    return format(val, options);
  });
  
  return result;
}

export function useLiveTime(formatOptions?: any) {
  const time = ref(Date.now());
  let interval: ReturnType<typeof setInterval>;
  
  onMounted(() => {
    interval = setInterval(() => {
      time.value = Date.now();
    }, 1000);
  });
  
  onUnmounted(() => {
    if (interval) clearInterval(interval);
  });
  
  return computed(() => format(time.value, formatOptions));
}

export function createMsPlugin(options?: any) {
  return {
    install(app: any) {
      app.config.globalProperties.$ms = {
        parse: (val: string) => parse(val, options),
        format: (val: number) => format(val, options)
      };
    }
  };
}
