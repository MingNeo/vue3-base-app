import fs from 'node:fs'
import path from 'node:path'
import { cleanupSVG, importDirectorySync, isEmptyColor, parseColors, runSVGO } from '@iconify/tools'

interface IconifyPluginOptions {
  prefix: string
  assetsDir: string
}

export default function iconifyPlugin(options: IconifyPluginOptions) {
  const { prefix, assetsDir } = options

  return {
    name: 'vite-plugin-iconify',
    buildStart() {
      const iconSet = importDirectorySync(assetsDir, {
        prefix,
      })

      // Validate, clean up, fix palette and optimise
      iconSet.forEach((name, type) => {
        if (type !== 'icon') {
          return
        }

        const svg = iconSet.toSVG(name)
        if (!svg) {
        // Invalid icon
          iconSet.remove(name)
          return
        }

        // Clean up and optimise icons
        try {
        // Clean up icon code
          cleanupSVG(svg)

          // Assume icon is monotone: replace color with currentColor, add if missing
          // If icon is not monotone, remove this code
          parseColors(svg, {
            defaultColor: 'currentColor',
            callback: (attr, colorStr, color) => {
              return !color || isEmptyColor(color)
                ? colorStr
                : 'currentColor'
            },
          })

          // Optimise
          runSVGO(svg)
        }
        catch (err) {
        // Invalid icon
          console.error(`Error parsing ${name}:`, err)
          iconSet.remove(name)
          return
        }

        // Update icon
        iconSet.fromSVG(name, svg)
      })

      // 写入 iconify.json
      const data = iconSet.export()
      const outputPath = path.join(assetsDir, 'iconify.json')
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
    },
  }
}
