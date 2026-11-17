// One-time export of the Figma design into design/, so agents implement it from the
// repository instead of calling Figma (free plans allow only a few API calls a month).
// The whole export costs three Figma API calls. Figma renders heavy JPGs, so they are
// re-encoded at quality 80: about five times smaller with no visible difference.
//
//   npm run design:export        (token in FIGMA_TOKEN or in .env.local)
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const fileKey = process.argv[2]
const token = process.env.FIGMA_TOKEN
const outDir = path.resolve('design')
const framesDir = path.join(outDir, 'frames')
const imagesDir = path.join(outDir, 'images')
const variablesFile = path.resolve('src/styles/_variables.scss')

if (!fileKey) {
  console.error('Usage: node scripts/figma-export.mjs <figma-file-key>')
  process.exit(1)
}

if (!token) {
  console.error(
    'FIGMA_TOKEN is not set.\n' +
      'Figma → Settings → Security → Personal access tokens → "File content: read".\n' +
      'Put it into .env.local as FIGMA_TOKEN=... (the file is git-ignored).',
  )
  process.exit(1)
}

const api = async (endpoint) => {
  const response = await fetch(`https://api.figma.com/v1/${endpoint}`, {
    headers: { 'X-Figma-Token': token },
  })

  if (response.status === 429) {
    const retryAfter = response.headers.get('retry-after')
    throw new Error(
      `Figma rate limit reached. Retry after ${retryAfter ?? 'some'} seconds.`,
    )
  }
  if (!response.ok) {
    throw new Error(`Figma API ${response.status}: ${await response.text()}`)
  }

  return response.json()
}

const round = (value) => Math.round(value * 100) / 100

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')

// Colors from _variables.scss, so the spec can point agents at existing variables.
const readColorVariables = async () => {
  const source = await readFile(variablesFile, 'utf8')
  const variables = []

  for (const [, name, value] of source.matchAll(
    /--(color-[\w-]+):\s*([^;]+);/g,
  )) {
    const hex = value.match(/^#([0-9a-f]{6})$/i)
    const rgba = value.match(/^rgba?\(([^)]+)\)$/i)

    if (hex) {
      const int = parseInt(hex[1], 16)
      variables.push({
        name,
        rgba: [int >> 16, (int >> 8) & 255, int & 255, 1],
      })
    } else if (rgba) {
      const [r, g, b, a = 1] = rgba[1].split(',').map(Number)
      variables.push({ name, rgba: [r, g, b, a] })
    }
  }

  return variables
}

const colorVariables = await readColorVariables()

const toColor = ({ r, g, b, a }, opacity = 1) => {
  const channels = [r, g, b].map((channel) => Math.round(channel * 255))
  const alpha = round(a * opacity)
  const css =
    alpha < 1
      ? `rgba(${channels.join(', ')}, ${alpha})`
      : `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`
  const variable = colorVariables.find(
    ({ rgba }) =>
      rgba[0] === channels[0] &&
      rgba[1] === channels[1] &&
      rgba[2] === channels[2] &&
      Math.abs(rgba[3] - alpha) < 0.02,
  )

  return variable
    ? { color: css, variable: `var(--${variable.name})` }
    : { color: css }
}

const usage = { colors: new Map(), text: new Map(), images: new Map() }

const count = (map, key, value) => {
  const entry = map.get(key) ?? { ...value, uses: 0 }
  entry.uses += 1
  map.set(key, entry)
}

const toPaints = (paints = []) =>
  paints
    .filter((paint) => paint.visible !== false)
    .map((paint) => {
      if (paint.type === 'SOLID') {
        const color = toColor(paint.color, paint.opacity)
        count(usage.colors, color.color, color)
        return color
      }
      if (paint.type.startsWith('GRADIENT')) {
        return {
          gradient: paint.type.replace('GRADIENT_', '').toLowerCase(),
          stops: paint.gradientStops.map((stop) => ({
            ...toColor(stop.color, paint.opacity),
            position: round(stop.position),
          })),
        }
      }
      const result = {
        type: paint.type.toLowerCase(),
        scaleMode: paint.scaleMode,
      }
      if (paint.imageRef) {
        // The file path is filled in once the image is downloaded.
        const uses = usage.images.get(paint.imageRef) ?? []
        usage.images.set(paint.imageRef, [...uses, result])
      }
      return result
    })

const leafTypes = new Set([
  'VECTOR',
  'BOOLEAN_OPERATION',
  'STAR',
  'LINE',
  'ELLIPSE',
  'REGULAR_POLYGON',
])

const simplify = (node, origin) => {
  const result = { name: node.name, type: node.type.toLowerCase() }
  const box = node.absoluteBoundingBox

  if (box) {
    result.x = round(box.x - origin.x)
    result.y = round(box.y - origin.y)
    result.width = round(box.width)
    result.height = round(box.height)
  }

  if (node.layoutMode && node.layoutMode !== 'NONE') {
    result.layout = {
      direction: node.layoutMode.toLowerCase(),
      gap: node.itemSpacing ?? 0,
      padding: [
        node.paddingTop ?? 0,
        node.paddingRight ?? 0,
        node.paddingBottom ?? 0,
        node.paddingLeft ?? 0,
      ],
      justify: node.primaryAxisAlignItems?.toLowerCase(),
      align: node.counterAxisAlignItems?.toLowerCase(),
      wrap: node.layoutWrap === 'WRAP' || undefined,
    }
  }

  const fills = toPaints(node.fills)
  if (fills.length) result.fills = fills

  const strokes = toPaints(node.strokes)
  if (strokes.length) {
    result.strokes = strokes
    result.strokeWeight = node.strokeWeight
  }

  if (node.rectangleCornerRadii) result.radius = node.rectangleCornerRadii
  else if (node.cornerRadius) result.radius = node.cornerRadius

  if (node.opacity !== undefined && node.opacity < 1) {
    result.opacity = round(node.opacity)
  }

  const effects = (node.effects ?? []).filter((effect) => effect.visible)
  if (effects.length) {
    result.effects = effects.map((effect) => ({
      type: effect.type.toLowerCase(),
      radius: effect.radius,
      offset: effect.offset,
      spread: effect.spread,
      ...(effect.color && toColor(effect.color)),
    }))
  }

  if (node.type === 'TEXT') {
    const style = node.style ?? {}
    const font = {
      family: style.fontFamily,
      size: style.fontSize,
      weight: style.fontWeight,
      lineHeight: style.lineHeightPx && round(style.lineHeightPx),
      letterSpacing: style.letterSpacing
        ? round(style.letterSpacing)
        : undefined,
      align: style.textAlignHorizontal?.toLowerCase(),
      case: style.textCase?.toLowerCase(),
    }
    result.text = node.characters
    result.font = font
    count(
      usage.text,
      `${font.family} ${font.weight} ${font.size}/${font.lineHeight}`,
      { ...font, sample: node.characters.slice(0, 40) },
    )
  }

  if (node.children && !leafTypes.has(node.type)) {
    const children = node.children
      .filter((child) => child.visible !== false)
      .map((child) => simplify(child, origin))
    if (children.length) result.children = children
  }

  return result
}

// Top-level frames of every page; sections are opened, their frames exported.
const collectFrames = (document) => {
  const frames = []
  const slugs = new Set()

  const visit = (node, page, prefix) => {
    if (node.visible === false) return
    if (node.type === 'SECTION') {
      const sectionPrefix = `${prefix}--${slugify(node.name)}`
      node.children?.forEach((child) => visit(child, page, sectionPrefix))
      return
    }
    if (!['FRAME', 'COMPONENT', 'COMPONENT_SET'].includes(node.type)) return

    const base = `${prefix}--${slugify(node.name) || slugify(node.id)}`
    let slug = base
    for (let i = 2; slugs.has(slug); i += 1) slug = `${base}-${i}`
    slugs.add(slug)

    frames.push({ node, page: page.name, slug })
  }

  document.children.forEach((page) =>
    page.children?.forEach((child) => visit(child, page, slugify(page.name))),
  )

  return frames
}

const fetchBuffer = async (url) => {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`Download failed (${response.status}): ${url}`)
  return Buffer.from(await response.arrayBuffer())
}

// Pictures with transparency stay PNG, everything else becomes JPG.
const saveImage = async (buffer, basePath) => {
  const image = sharp(buffer).resize({ width: 1600, withoutEnlargement: true })
  const { isOpaque } = await image.stats()
  const extension = isOpaque ? 'jpg' : 'png'
  const encoded = !isOpaque
    ? image.png({ compressionLevel: 9 })
    : image.jpeg({ quality: 80, mozjpeg: true })
  await encoded.toFile(`${basePath}.${extension}`)
  return extension
}

console.log('Reading the Figma file…')
const file = await api(`files/${fileKey}`)
const frames = collectFrames(file.document)

if (!frames.length) {
  console.error('No top-level frames found in the file.')
  process.exit(1)
}

console.log(`Rendering ${frames.length} frames…`)
const { images } = await api(
  `images/${fileKey}?format=jpg&scale=1&ids=${frames.map(({ node }) => node.id).join(',')}`,
)

const specs = frames.map(({ node }) =>
  simplify(node, node.absoluteBoundingBox ?? { x: 0, y: 0 }),
)

console.log(`Downloading ${usage.images.size} images used in the frames…`)
const { meta } = await api(`files/${fileKey}/images`)

for (const directory of [framesDir, imagesDir]) {
  await rm(directory, { recursive: true, force: true })
  await mkdir(directory, { recursive: true })
}

for (const [ref, paints] of usage.images) {
  if (!meta.images[ref]) continue
  const extension = await saveImage(
    await fetchBuffer(meta.images[ref]),
    path.join(imagesDir, ref),
  )
  paints.forEach((paint) => (paint.image = `images/${ref}.${extension}`))
}

const rendered = new Set()

for (const [index, { node, slug }] of frames.entries()) {
  await writeFile(
    path.join(framesDir, `${slug}.json`),
    JSON.stringify(specs[index], null, 2) + '\n',
  )
  if (images[node.id]) {
    await sharp(await fetchBuffer(images[node.id]))
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(framesDir, `${slug}.jpg`))
    rendered.add(slug)
  } else {
    console.warn(`Figma did not render "${node.name}", image skipped.`)
  }
}

const byUses = (map) => [...map.values()].sort((a, b) => b.uses - a.uses)
await writeFile(
  path.join(outDir, 'tokens.json'),
  JSON.stringify(
    { colors: byUses(usage.colors), typography: byUses(usage.text) },
    null,
    2,
  ) + '\n',
)

const rows = frames.map(({ node, page, slug }) => {
  const box = node.absoluteBoundingBox ?? {}
  return `| ${page} | ${node.name} | ${round(box.width)}×${round(box.height)} | ${rendered.has(slug) ? `[image](frames/${slug}.jpg)` : '—'} | [json](frames/${slug}.json) |`
})

await writeFile(
  path.join(outDir, 'README.md'),
  `# Design export

Generated by \`npm run design:export\` from [Figma](https://www.figma.com/design/${fileKey}).
Figma file version: ${file.version}, last modified ${file.lastModified}.
Do not edit by hand: re-run the export instead.

- \`frames/<name>.jpg\` — how the frame looks, 1×.
- \`frames/<name>.json\` — layers with positions relative to the frame, sizes, auto layout,
  colors, radii, effects and text styles. \`variable\` points at an existing CSS variable.
- \`images/\` — original pictures used in the design: covers, avatars, backgrounds.
  A layer's \`fills[].image\` gives the path, for example \`images/<ref>.jpg\`.
- \`tokens.json\` — every color and text style used in the design, most used first.

| Page | Frame | Size | Image | Spec |
| ---- | ----- | ---- | ----- | ---- |
${rows.join('\n')}
`,
)

console.log(`Done: ${frames.length} frames written to design/.`)
