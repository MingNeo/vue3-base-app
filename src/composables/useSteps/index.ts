import type { Ref } from 'vue'

interface Step {
  title: string
  value?: any
  [x: string]: any
}

export default function useSteps(steps: Step[] = [], defaultCurrentSetp: Ref<any>) {
  const showSteps = ref(steps)
  const stepsMap = computed(() => arrayToObject(steps, 'value', (v, index) => ({ ...v, index })))
  const currentKey = ref(defaultCurrentSetp?.value || steps[0].value)
  const currentIndex = ref(stepsMap.value[currentKey.value]?.index || 0)

  watch(() => defaultCurrentSetp.value, (val: any) => {
    currentKey.value = val
    currentIndex.value = stepsMap.value[val]?.index
  })

  const next = () => {
    currentIndex.value++
    currentKey.value = stepsMap.value[steps[currentIndex.value]?.value]?.index
  }

  const prev = () => {
    currentIndex.value--
    currentKey.value = stepsMap.value[steps[currentIndex.value]?.value]?.index
  }

  const goTo = ({ value, index }: { value?: string, index?: number }) => {
    value && (currentKey.value = value)
    index && (currentIndex.value = index)
  }

  const isBefore = computed(() => currentIndex.value > 0)
  const isAfter = computed(() => currentIndex.value < steps.length - 1)
  const current = computed(() => stepsMap.value[currentKey.value])

  return {
    steps: showSteps,
    currentKey,
    currentIndex,
    current,
    isBefore,
    isAfter,
    next,
    prev,
    goTo,
  }
}
