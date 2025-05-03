"use client"

import type React from "react"

import { useState } from "react"
import { User, Settings, BookOpen, Award, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="p-6 border-r border-white/10">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/20">
              <Image src="/avatars/user-avatar.png" alt="User Avatar" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-medium text-white mb-1">Alex Johnson</h3>
            <p className="text-white/60 mb-6">Student</p>

            <nav className="w-full space-y-2">
              <NavItem
                icon={<User className="h-5 w-5" />}
                label="Profile"
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
              <NavItem
                icon={<BookOpen className="h-5 w-5" />}
                label="My Labs"
                active={activeTab === "labs"}
                onClick={() => setActiveTab("labs")}
              />
              <NavItem
                icon={<Award className="h-5 w-5" />}
                label="Achievements"
                active={activeTab === "achievements"}
                onClick={() => setActiveTab("achievements")}
              />
              <NavItem
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                active={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
              />
              <div className="pt-4 mt-4 border-t border-white/10">
                <NavItem
                  icon={<LogOut className="h-5 w-5" />}
                  label="Logout"
                  active={false}
                  onClick={() => console.log("Logout")}
                />
              </div>
            </nav>
          </div>
        </div>

        <div className="col-span-3 p-6">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "labs" && <LabsTab />}
          {activeTab === "achievements" && <AchievementsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
        active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
      {active && <ChevronRight className="h-4 w-4 ml-auto" />}
    </button>
  )
}

function ProfileTab() {
  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-6">Profile</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ProfileField label="Full Name" value="Alex Johnson" />
            <ProfileField label="Email" value="alex.johnson@example.com" />
            <ProfileField label="Role" value="Student" />
            <ProfileField label="Institution" value="University of Science" />
          </div>

          <div className="space-y-4">
            <ProfileField label="Member Since" value="January 2023" />
            <ProfileField label="Labs Completed" value="24" />
            <ProfileField label="Achievements" value="12" />
            <ProfileField label="Subscription" value="Premium" />
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <h3 className="text-xl font-light text-white mb-4">Bio</h3>
          <p className="text-white/70">
            Physics student with a passion for quantum mechanics and astrophysics. I use Virtual Labs to explore complex
            concepts and prepare for my research projects.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-white/50 text-sm">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  )
}

function LabsTab() {
  const recentLabs = [
    { id: 1, title: "Simple Pendulum Experiment", date: "2 days ago", progress: 100 },
    { id: 2, title: "Neural Network Visualization", date: "1 week ago", progress: 85 },
    { id: 3, title: "Acid-Base Titration", date: "2 weeks ago", progress: 100 },
    { id: 4, title: "Fractal Explorer", date: "1 month ago", progress: 70 },
  ]

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-6">My Labs</h2>

      <div className="space-y-4">
        {recentLabs.map((lab) => (
          <div key={lab.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-medium">{lab.title}</h3>
              <span className="text-white/50 text-sm">{lab.date}</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${lab.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-white/70 text-sm">{lab.progress}% complete</span>
              <Link
                href={`/labs/resume/${lab.id}`}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
              >
                Resume <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/labs" className="text-blue-400 hover:text-blue-300 flex items-center">
          Browse all labs <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}

function AchievementsTab() {
  const achievements = [
    { id: 1, title: "Physics Pioneer", description: "Complete 10 physics labs", completed: true },
    { id: 2, title: "Chemistry Whiz", description: "Achieve perfect score in 5 chemistry labs", completed: true },
    { id: 3, title: "Math Master", description: "Complete all mathematics labs", completed: false, progress: 70 },
    {
      id: 4,
      title: "Biology Explorer",
      description: "Explore all cell structures in the Cell Explorer lab",
      completed: true,
    },
    {
      id: 5,
      title: "CS Genius",
      description: "Train a neural network with 95% accuracy",
      completed: false,
      progress: 50,
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-6">Achievements</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`border rounded-lg p-4 ${
              achievement.completed ? "border-green-500/30 bg-green-500/5" : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${achievement.completed ? "bg-green-500/20" : "bg-white/10"}`}>
                <Award className={`h-5 w-5 ${achievement.completed ? "text-green-400" : "text-white/50"}`} />
              </div>
              <div>
                <h3 className="text-white font-medium">{achievement.title}</h3>
                <p className="text-white/70 text-sm">{achievement.description}</p>

                {!achievement.completed && achievement.progress && (
                  <div className="mt-2">
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-white/30" style={{ width: `${achievement.progress}%` }}></div>
                    </div>
                    <p className="text-white/50 text-xs mt-1">{achievement.progress}% progress</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-6">Settings</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-light text-white mb-4">Account</h3>
          <div className="space-y-4">
            <SettingsField label="Email Notifications" type="toggle" checked={true} />
            <SettingsField label="Two-Factor Authentication" type="toggle" checked={false} />
            <SettingsField label="Public Profile" type="toggle" checked={true} />
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <h3 className="text-xl font-light text-white mb-4">Appearance</h3>
          <div className="space-y-4">
            <SettingsField label="Theme" type="select" options={["Dark", "Light", "System"]} value="Dark" />
            <SettingsField
              label="Accent Color"
              type="select"
              options={["Blue", "Purple", "Green", "Pink"]}
              value="Blue"
            />
            <SettingsField label="Animations" type="toggle" checked={true} />
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <h3 className="text-xl font-light text-white mb-4">Privacy</h3>
          <div className="space-y-4">
            <SettingsField label="Share Usage Data" type="toggle" checked={false} />
            <SettingsField label="Allow Cookies" type="toggle" checked={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsField({
  label,
  type,
  checked,
  options,
  value,
}: {
  label: string
  type: "toggle" | "select"
  checked?: boolean
  options?: string[]
  value?: string
}) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-white">{label}</p>

      {type === "toggle" && (
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? "bg-blue-500" : "bg-white/20"}`}>
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </div>
      )}

      {type === "select" && options && (
        <select className="bg-white/10 border border-white/20 rounded-md px-3 py-1 text-white">
          {options.map((option) => (
            <option key={option} value={option} selected={option === value}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
