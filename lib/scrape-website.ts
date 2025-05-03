import { load } from "cheerio"
import fs from "fs"
import path from "path"

/**
 * Scrapes content from a website and saves it to a JSON file
 * This is meant to be run as a script, not in the browser
 */
export async function scrapeWebsite(baseUrl: string, outputPath: string) {
  try {
    console.log(`Starting to scrape ${baseUrl}...`)

    // URLs to scrape (add more as needed)
    const urls = [
      "/",
      "/labs",
      "/about",
      "/labs/physics-pendulum",
      "/labs/chemistry-titration",
      "/labs/math-fractals",
      // Add more URLs as needed
    ]

    const websiteContent = []

    for (const url of urls) {
      console.log(`Scraping ${baseUrl}${url}...`)

      try {
        const response = await fetch(`${baseUrl}${url}`)
        const html = await response.text()

        // Parse HTML
        const $ = load(html)

        // Remove script tags, style tags, and comments
        $("script").remove()
        $("style").remove()
        $("noscript").remove()
        $("svg").remove()

        // Extract text content
        const title = $("title").text().trim()
        const metaDescription = $('meta[name="description"]').attr("content") || ""

        // Get main content (adjust selectors based on your website structure)
        const bodyText = $("main").text().trim() || $("body").text().trim()

        // Clean up text (remove extra whitespace)
        const cleanedText = bodyText.replace(/\s+/g, " ").trim()

        websiteContent.push({
          url: `${baseUrl}${url}`,
          title,
          description: metaDescription,
          content: cleanedText,
        })
      } catch (error) {
        console.error(`Error scraping ${baseUrl}${url}:`, error)
      }
    }

    // Save to JSON file
    fs.writeFileSync(path.join(process.cwd(), outputPath), JSON.stringify(websiteContent, null, 2))

    console.log(`Scraping complete. Content saved to ${outputPath}`)
  } catch (error) {
    console.error("Error scraping website:", error)
  }
}

// Example usage (uncomment to run):
// scrapeWebsite("https://virtual-labs-sbh.vercel.app", "data/website-content.json")
