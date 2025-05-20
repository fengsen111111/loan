<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import CanvasFlowchart from 'canvas-flowchart'

export default {
  name: 'Flowchart',
  props: {
    userName: String,
    currentNode: String,
    steps: Array
  },
  setup(props) {
    const canvasRef = ref(null)

    onMounted(() => {
      drawFlowchart()
    })

    function drawFlowchart() {
      const canvas = canvasRef.value
      if (!canvas) return

      const flowchart = new CanvasFlowchart(canvas, {
        data: {
          nodes: generateNodes(),
          edges: generateEdges()
        },
        style: {
          node: {
            borderColor: getNodeBorderColor,
            borderWidth: 2
          },
          nodeText: {
            textColor: '#333'
          }
        },
        arrowhead: 'arrow'
      })

      flowchart.draw()
    }

    function generateNodes() {
      const nodes = [
        { id: 'start', text: 'Start' },
        ...props.steps.map((step, index) => ({ id: `step${index}`, text: step })),
        { id: 'end', text: 'End' }
      ]

      // Highlight current node
      const currentNodeIndex = props.steps.findIndex((step) => step === props.currentNode)
      if (currentNodeIndex !== -1) {
        nodes[currentNodeIndex + 1].current = true // +1 to skip 'start'
      }

      return nodes
    }

    function generateEdges() {
      const edges = [
        { from: 'start', to: 'step0' },
        ...props.steps.map((_, index) => ({
          from: `step${index}`,
          to: `step${index + 1}`
        })),
        { from: `step${props.steps.length - 1}`, to: 'end' }
      ]

      return edges
    }

    function getNodeBorderColor(node) {
      return node.current ? 'blue' : '#ccc' // 根据当前节点高亮
    }

    return {
      canvasRef,
      drawFlowchart
    }
  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}
</style>
