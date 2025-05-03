"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import { z } from "zod"

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({})
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({})

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (loginErrors[name]) {
      setLoginErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (signupErrors[name]) {
      setSignupErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    try {
      loginSchema.parse(loginData)
  
      const res = await fetch("https://15eb-2401-4900-7084-3f05-4c2d-447c-ba96-7f06.ngrok-free.app/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        setLoginErrors({ form: data.detail || "Invalid credentials" })
      } else {
        // Save tokens to localStorage (or cookie)
        localStorage.setItem("accessToken", data.access)
        localStorage.setItem("refreshToken", data.refresh)
  
        router.push("/student-dashboard")
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message
          }
        })
        setLoginErrors(formattedErrors)
      } else {
        setLoginErrors({ form: "An unexpected error occurred" })
      }
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      signupSchema.parse(signupData)

      // Simulate signup (replace with actual registration)
      // For demo purposes, we'll just redirect to dashboard
      setTimeout(() => {
        router.push("/student-dashboard")
      }, 1500)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message
          }
        })
        setSignupErrors(formattedErrors)
      } else {
        setSignupErrors({ form: "An unexpected error occurred" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/student-dashboard" })
    } catch (error) {
      console.error("Google sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="your_username"
                        value={loginData.username}
                        onChange={handleLoginChange}
                        className={loginErrors.username ? "border-destructive" : ""}
                      />
                      {loginErrors.username && <p className="text-sm text-destructive">{loginErrors.username}</p>}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className={loginErrors.password ? "border-destructive" : ""}
                      />
                      {loginErrors.password && <p className="text-sm text-destructive">{loginErrors.password}</p>}
                    </div>

                    {loginErrors.form && <p className="text-sm text-destructive">{loginErrors.form}</p>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={signupData.name}
                        onChange={handleSignupChange}
                        className={signupErrors.name ? "border-destructive" : ""}
                      />
                      {signupErrors.name && <p className="text-sm text-destructive">{signupErrors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        name="username"
                        type="text"
                        placeholder="your_username"
                        value={signupData.username}
                        onChange={handleSignupChange}
                        className={signupErrors.username ? "border-destructive" : ""}
                      />
                      {signupErrors.username && <p className="text-sm text-destructive">{signupErrors.username}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        className={signupErrors.password ? "border-destructive" : ""}
                      />
                      {signupErrors.password && <p className="text-sm text-destructive">{signupErrors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        className={signupErrors.confirmPassword ? "border-destructive" : ""}
                      />
                      {signupErrors.confirmPassword && (
                        <p className="text-sm text-destructive">{signupErrors.confirmPassword}</p>
                      )}
                    </div>

                    {signupErrors.form && <p className="text-sm text-destructive">{signupErrors.form}</p>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-muted-foreground mt-2">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}