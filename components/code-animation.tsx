"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CodeAnimationProps {
  className?: string
}

export function CodeAnimation({ className }: CodeAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  // Sample code snippets
  const codeSnippets = [
    // Neural Network in JavaScript
    [
      "// Neural Network implementation",
      "class NeuralNetwork {",
      "  constructor(inputNodes, hiddenNodes, outputNodes) {",
      "    this.inputNodes = inputNodes;",
      "    this.hiddenNodes = hiddenNodes;",
      "    this.outputNodes = outputNodes;",
      "",
      "    // Initialize weights",
      "    this.weightsIH = Matrix.random(hiddenNodes, inputNodes);",
      "    this.weightsHO = Matrix.random(outputNodes, hiddenNodes);",
      "    this.biasH = Matrix.random(hiddenNodes, 1);",
      "    this.biasO = Matrix.random(outputNodes, 1);",
      "    this.learningRate = 0.1;",
      "  }",
      "",
      "  feedforward(inputArray) {",
      "    // Convert input to matrix",
      "    let inputs = Matrix.fromArray(inputArray);",
      "",
      "    // Calculate hidden layer",
      "    let hidden = Matrix.multiply(this.weightsIH, inputs);",
      "    hidden.add(this.biasH);",
      "    hidden.map(sigmoid);",
      "",
      "    // Calculate output layer",
      "    let outputs = Matrix.multiply(this.weightsHO, hidden);",
      "    outputs.add(this.biasO);",
      "    outputs.map(sigmoid);",
      "",
      "    return outputs.toArray();",
      "  }",
      "}",
    ],
    // Sorting Algorithm
    [
      "// Quick Sort implementation",
      "function quickSort(arr, left = 0, right = arr.length - 1) {",
      "  if (left < right) {",
      "    const pivotIndex = partition(arr, left, right);",
      "    quickSort(arr, left, pivotIndex - 1);",
      "    quickSort(arr, pivotIndex + 1, right);",
      "  }",
      "  return arr;",
      "}",
      "",
      "function partition(arr, left, right) {",
      "  const pivot = arr[right];",
      "  let i = left - 1;",
      "",
      "  for (let j = left; j < right; j++) {",
      "    if (arr[j] <= pivot) {",
      "      i++;",
      "      [arr[i], arr[j]] = [arr[j], arr[i]];",
      "    }",
      "  }",
      "",
      "  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];",
      "  return i + 1;",
      "}",
      "",
      "// Example usage",
      "const unsortedArray = [5, 3, 7, 6, 2, 9];",
      "console.log(quickSort(unsortedArray));",
    ],
    // Graph Algorithm
    [
      "// Breadth-First Search implementation",
      "function bfs(graph, start) {",
      "  const queue = [start];",
      "  const visited = new Set([start]);",
      "  const result = [];",
      "",
      "  while (queue.length > 0) {",
      "    const vertex = queue.shift();",
      "    result.push(vertex);",
      "",
      "    for (const neighbor of graph[vertex]) {",
      "      if (!visited.has(neighbor)) {",
      "        visited.add(neighbor);",
      "        queue.push(neighbor);",
      "      }",
      "    }",
      "  }",
      "",
      "  return result;",
      "}",
      "",
      "// Example graph",
      "const graph = {",
      "  A: ['B', 'C'],",
      "  B: ['A', 'D', 'E'],",
      "  C: ['A', 'F'],",
      "  D: ['B'],",
      "  E: ['B', 'F'],",
      "  F: ['C', 'E']",
      "};",
      "",
      "console.log(bfs(graph, 'A'));",
    ],
  ]

  // Initialize with a random code snippet
  useEffect(() => {
    const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
    setLines(randomSnippet)
  }, [])

  // Typing animation
  useEffect(() => {
    if (currentLine < lines.length) {
      const timer = setTimeout(
        () => {
          setCurrentLine(currentLine + 1)
        },
        100 + Math.random() * 200,
      ) // Random typing speed

      return () => clearTimeout(timer)
    } else if (currentLine === lines.length && isTyping) {
      // When finished typing, wait and then start over with a new snippet
      const timer = setTimeout(() => {
        setIsTyping(false)
        setTimeout(() => {
          const nextSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
          setLines(nextSnippet)
          setCurrentLine(0)
          setIsTyping(true)
        }, 2000)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [currentLine, lines.length, isTyping])

  // Syntax highlighting (simplified)
  const highlightSyntax = (line: string) => {
    // Keywords
    line = line.replace(
      /(class|function|const|let|var|if|else|for|while|return|new|this)\b/g,
      '<span class="text-purple-400">$1</span>',
    )

    // Strings
    line = line.replace(/(['"]).*?\1/g, '<span class="text-green-400">$&</span>')

    // Numbers
    line = line.replace(/\b(\d+)\b/g, '<span class="text-yellow-400">$1</span>')

    // Comments
    line = line.replace(/\/\/.*/g, '<span class="text-gray-400">$&</span>')

    // Function calls
    line = line.replace(/(\w+)(?=\()/g, '<span class="text-blue-400">$1</span>')

    return line
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full bg-black/80 text-white font-mono text-sm overflow-auto p-6 rounded-lg", className)}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative">
        {lines.slice(0, currentLine).map((line, index) => (
          <div key={index} className="flex">
            <div className="text-gray-500 w-8 text-right mr-4">{index + 1}</div>
            <div
              className="flex-1"
              dangerouslySetInnerHTML={{
                __html: highlightSyntax(line) || "&nbsp;",
              }}
            />
          </div>
        ))}
        {isTyping && currentLine < lines.length && (
          <div className="flex">
            <div className="text-gray-500 w-8 text-right mr-4">{currentLine + 1}</div>
            <div className="flex-1">
              <span className="animate-pulse">▌</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
