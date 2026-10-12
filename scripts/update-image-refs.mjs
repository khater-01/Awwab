import fs from 'fs'
import path from 'path'

const SRC_DIR = path.resolve('src')

const replacements = [
  [/\/images\/attara_spices\.png/g, '/images/attara_spices.webp'],
  [/\/images\/attara_coffee\.png/g, '/images/attara_coffee.webp'],
  [/\/images\/attara_hero\.png/g, '/images/attara_hero.webp'],
  [/\/images\/attara_oils\.png/g, '/images/attara_oils.webp'],
  [/\/images\/Magazin de condimente\.jpg/g, '/images/Magazin de condimente.webp'],
  [/\/images\/americano\.png/g, '/images/americano.webp'],
  [/\/images\/cappuccino\.png/g, '/images/cappuccino.webp'],
  [/\/images\/espresso\.png/g, '/images/espresso.webp'],
  [/\/images\/footer-coffee\.png/g, '/images/footer-coffee.webp'],
  [/\/images\/hero-coffee\.png/g, '/images/hero-coffee.webp'],
  [/\/images\/iced-coffees\.png/g, '/images/iced-coffees.webp'],
  [/\/images\/latte-art\.png/g, '/images/latte-art.webp'],
  [/\/images\/avatar\.png/g, '/images/avatar.webp'],
]

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath))
    } else if (/\.(vue|js|css)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }
  return files
}

const files = walkDir(SRC_DIR)
let totalUpdated = 0

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8')
  let changed = false
  for (const [pattern, replacement] of replacements) {
    const newContent = content.replace(pattern, replacement)
    if (newContent !== content) {
      content = newContent
      changed = true
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf-8')
    totalUpdated++
    console.log(`✅ Updated: ${path.relative(SRC_DIR, file)}`)
  }
}

console.log(`\n📊 Total files updated: ${totalUpdated}`)
