/**
 * سكريبت تحويل الصور من PNG إلى WebP لتسريع تحميل الموقع
 * يقلل حجم الصور من ~9.6MB إلى ~1MB أو أقل
 */
import sharp from 'sharp'  
import fs from 'fs'
import path from 'path'

const IMAGES_DIR = path.resolve('public/images')
const QUALITY = 80

async function optimizeImages() {
  const files = fs.readdirSync(IMAGES_DIR)
  let totalOriginal = 0
  let totalOptimized = 0

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue

    const inputPath = path.join(IMAGES_DIR, file)
    const baseName = path.basename(file, ext)
    const outputPath = path.join(IMAGES_DIR, `${baseName}.webp`)

    const originalSize = fs.statSync(inputPath).size
    totalOriginal += originalSize

    try {
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath)

      const newSize = fs.statSync(outputPath).size
      totalOptimized += newSize

      const savings = ((1 - newSize / originalSize) * 100).toFixed(1)
      console.log(`✅ ${file} → ${baseName}.webp | ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% أقل)`)
    } catch (err) {
      console.error(`❌ خطأ في ${file}:`, err.message)
    }
  }

  console.log('\n📊 الملخص:')
  console.log(`  الحجم الأصلي: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`)
  console.log(`  الحجم الجديد: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`)
  console.log(`  الوفر: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`)
}

optimizeImages()
