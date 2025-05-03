"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, ArrowRight, Trophy, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Quiz, QuizQuestion } from "@/lib/mock-student-data"

interface GamifiedQuizzesProps {
  quizzes: Quiz[]
  loading: boolean
}

export function GamifiedQuizzes({ quizzes, loading }: GamifiedQuizzesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<string | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filter || quiz.category.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setQuizCompleted(false)
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    })
  }

  const goToNextQuestion = () => {
    if (activeQuiz && currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Calculate score
      let correctAnswers = 0
      activeQuiz?.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswerIndex) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / activeQuiz!.questions.length) * 100)
      setQuizScore(score)
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setActiveQuiz(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setQuizCompleted(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "physics":
        return "bg-blue-500"
      case "chemistry":
        return "bg-purple-500"
      case "mathematics":
        return "bg-green-500"
      case "computer science":
        return "bg-cyan-500"
      case "biology":
        return "bg-rose-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">Gamified Quizzes</h2>
        <p className="text-white/70">Test your knowledge with interactive quizzes based on your completed labs.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search quizzes..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Filter className="mr-2 h-4 w-4" />
              {filter ? `Filter: ${filter}` : "Filter"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black/90 backdrop-blur-lg border border-white/10 text-white">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter(null)}>
              All Categories
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter("physics")}>
              Physics
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter("chemistry")}>
              Chemistry
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter("mathematics")}>
              Mathematics
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-white/10 cursor-pointer"
              onClick={() => setFilter("computer science")}
            >
              Computer Science
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter("biology")}>
              Biology
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="bg-black/30 backdrop-blur-sm border border-white/10">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-3/4 bg-white/10 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-white/10" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full bg-white/10 mb-2" />
                  <Skeleton className="h-4 w-3/4 bg-white/10 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-white/10" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full bg-white/10" />
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="bg-black/30 backdrop-blur-sm border border-white/10 h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-xl">{quiz.title}</CardTitle>
                      <CardDescription className="text-white/70">Based on: {quiz.relatedLab}</CardDescription>
                    </div>
                    <Badge className={`${getCategoryColor(quiz.category)}`}>{quiz.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <div className="space-y-4">
                    <p className="text-white/80">{quiz.description}</p>

                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                        {quiz.xpReward} XP
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {quiz.questions.length} questions
                      </div>
                    </div>

                    {quiz.bestScore > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-white/70">Best Score</span>
                          <span className="text-sm font-medium text-white">{quiz.bestScore}%</span>
                        </div>
                        <Progress
                          value={quiz.bestScore}
                          className="h-2"
                          indicatorClassName={
                            quiz.bestScore >= 80
                              ? "bg-emerald-500"
                              : quiz.bestScore >= 60
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => startQuiz(quiz)}
                  >
                    {quiz.bestScore > 0 ? "Retake Quiz" : "Start Quiz"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70">No quizzes found matching your search criteria.</p>
        </div>
      )}

      {/* Quiz Dialog */}
      <Dialog open={!!activeQuiz} onOpenChange={(open) => !open && resetQuiz()}>
        <DialogContent className="bg-black/90 backdrop-blur-lg border border-white/10 text-white max-w-2xl">
          {activeQuiz && !quizCompleted ? (
            <>
              <DialogHeader>
                <DialogTitle>{activeQuiz.title}</DialogTitle>
                <DialogDescription className="text-white/70">
                  Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="mb-4">
                  <Progress value={((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100} className="h-2" />
                </div>

                <QuizQuestionComponent
                  question={activeQuiz.questions[currentQuestionIndex]}
                  selectedAnswer={selectedAnswers[currentQuestionIndex]}
                  onSelectAnswer={(answerIndex) => handleAnswerSelect(currentQuestionIndex, answerIndex)}
                />
              </div>

              <DialogFooter>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={goToNextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  {currentQuestionIndex < activeQuiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </DialogFooter>
            </>
          ) : quizCompleted ? (
            <>
              <DialogHeader>
                <DialogTitle>Quiz Completed!</DialogTitle>
              </DialogHeader>

              <div className="py-8 text-center">
                <div className="mb-6">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-pulse"></div>
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-black/50 border-4 border-indigo-500">
                      <span className="text-4xl font-bold text-white">{quizScore}%</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-medium text-white mb-2">
                  {quizScore >= 80 ? "Excellent work!" : quizScore >= 60 ? "Good job!" : "Keep practicing!"}
                </h3>

                <p className="text-white/70 mb-6">
                  You answered{" "}
                  {
                    activeQuiz.questions.filter(
                      (_, index) => selectedAnswers[index] === activeQuiz.questions[index].correctAnswerIndex,
                    ).length
                  }{" "}
                  out of {activeQuiz.questions.length} questions correctly.
                </p>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    onClick={resetQuiz}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => {
                      setQuizCompleted(false)
                      setCurrentQuestionIndex(0)
                      setSelectedAnswers({})
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface QuizQuestionProps {
  question: QuizQuestion
  selectedAnswer?: number
  onSelectAnswer: (index: number) => void
}

function QuizQuestionComponent({ question, selectedAnswer, onSelectAnswer }: QuizQuestionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">{question.question}</h3>

      <div className="space-y-3">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            className={`w-full text-left p-4 rounded-lg border transition-colors ${
              selectedAnswer === index
                ? "bg-indigo-500/20 border-indigo-500"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
            onClick={() => onSelectAnswer(index)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  selectedAnswer === index ? "bg-indigo-500" : "bg-white/10"
                }`}
              >
                <span className="text-sm">{String.fromCharCode(65 + index)}</span>
              </div>
              <span className="text-white">{answer}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
