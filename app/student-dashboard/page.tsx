"use client"

import { mockStudentData } from "@/lib/mock-student-data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { CompletedLabs } from "@/components/dashboard/completed-labs"
import { UpcomingLabs } from "@/components/dashboard/upcoming-labs"
import { StudyStreak } from "@/components/dashboard/study-streak"
import { TimeSpentChart } from "@/components/dashboard/time-spent-chart"
import { LearningPath } from "@/components/dashboard/learning-path"
import { PerformanceInsights } from "@/components/dashboard/performance-insights"
import { GradeDistribution } from "@/components/dashboard/grade-distribution"

export default function StudentDashboard() {
  // Create default data for components that need it
  const timeSpentData = [
    { week: "Week 1", hours: 5 },
    { week: "Week 2", hours: 7 },
    { week: "Week 3", hours: 3 },
    { week: "Week 4", hours: 8 },
  ]

  const learningPathData = [
    {
      id: "physics-101",
      title: "Physics 101",
      progress: 65,
      modules: [
        { name: "Introduction to Physics", completed: true },
        { name: "Mechanics", completed: true },
        { name: "Thermodynamics", completed: false },
        { name: "Electromagnetism", completed: false },
      ],
      nextLab: {
        id: "thermodynamics-lab",
        title: "Thermodynamics Lab",
        image: "/physics-lab.jpg",
      },
    },
    {
      id: "chemistry-basics",
      title: "Chemistry Basics",
      progress: 30,
      modules: [
        { name: "Atomic Structure", completed: true },
        { name: "Chemical Bonding", completed: false },
        { name: "Reactions", completed: false },
      ],
      nextLab: {
        id: "chemical-bonding-lab",
        title: "Chemical Bonding Lab",
        image: "/chemistry-lab.jpg",
      },
    },
  ]

  const gradeData = [
    { grade: "A", count: 12 },
    { grade: "B", count: 8 },
    { grade: "C", count: 5 },
    { grade: "D", count: 2 },
    { grade: "F", count: 1 },
  ]

  const performanceData = [
    { subject: "Physics", score: 85 },
    { subject: "Chemistry", score: 72 },
    { subject: "Biology", score: 90 },
    { subject: "Mathematics", score: 78 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
   

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <DashboardOverview student={mockStudentData} />
          <StudyStreak streakData={mockStudentData?.streakData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <TimeSpentChart timeSpentData={timeSpentData} />
          <GradeDistribution grades={gradeData} />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <LearningPath pathData={learningPathData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <PerformanceInsights performanceData={performanceData} />
          <CompletedLabs completedLabs={mockStudentData?.completedLabs || []} />
        </div>

        <div className="mt-6">
          <UpcomingLabs labs={mockStudentData?.upcomingLabs || []} />
        </div>
      </div>
    </div>
  )
}
