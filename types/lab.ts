export interface Lab {
  id: string
  slug: string
  title: string
  description: string
  category: "physics" | "chemistry" | "mathematics" | "biology" | "computer"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  thumbnail: string
  learningObjectives: string[]
  prerequisites: string
  instructions: {
    title: string
    description: string
  }[]
  resources: {
    title: string
    url: string
  }[]
  relatedLabs: {
    slug: string
    title: string
    thumbnail: string
    category: string
  }[]
}
