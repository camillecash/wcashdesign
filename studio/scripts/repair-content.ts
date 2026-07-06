import {getCliClient} from 'sanity/cli'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {
  categories,
  consultationPage,
  homePage,
  portfolioPage,
  siteSettings,
  type GalleryImage,
} from '../../src/data/site'

const client = getCliClient({apiVersion: '2026-06-29'}).withConfig({perspective: 'raw'})
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

type SanityImageValue = {
  _type: 'image'
  alt?: string
  caption?: string
  asset?: {_type: 'reference'; _ref: string}
}

function localAssetPath(src: string) {
  return path.join(root, 'public', decodeURI(src).replace(/^\//, ''))
}

async function uploadImage(src: string, alt: string, caption?: string): Promise<SanityImageValue> {
  const filePath = localAssetPath(src)
  const buffer = await readFile(filePath)
  const asset = await client.assets.upload('image', buffer, {filename: path.basename(filePath)})

  return {
    _type: 'image',
    alt,
    ...(caption ? {caption} : {}),
    asset: {_type: 'reference', _ref: asset._id},
  }
}

async function galleryItem(image: GalleryImage, index: number, prefix: string) {
  return {
    _key: `${prefix}-${index}`,
    ...(await uploadImage(image.src, image.alt, image.caption || image.alt)),
  }
}

function isBlank(value: unknown) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
}

function hasImageAsset(value: unknown) {
  return (
    !!value &&
    typeof value === 'object' &&
    'asset' in value &&
    !!(value as {asset?: {_ref?: string}}).asset?._ref
  )
}

function setMissingText(target: Record<string, unknown>, current: Record<string, unknown> | null, values: Record<string, unknown>) {
  for (const [key, value] of Object.entries(values)) {
    if (isBlank(current?.[key])) target[key] = value
  }
}

async function patchSiteSettingsDocument(documentId: string, shouldCreate = false) {
  const current = await client.fetch<Record<string, unknown> | null>(
    `*[_type == "siteSettings" && _id == $documentId][0]`,
    {documentId}
  )

  if (!current && !shouldCreate) return false

  const set: Record<string, unknown> = {}

  setMissingText(set, current, {
    phone: siteSettings.phoneDisplay,
    email: siteSettings.email,
    instagram: siteSettings.instagram,
  })

  if (!hasImageAsset(current?.menuLogo)) {
    set.menuLogo = await uploadImage(siteSettings.squareLogo, 'WCashDesign mobile menu logo')
  }
  if (!hasImageAsset(current?.headerLogo)) {
    set.headerLogo = await uploadImage(siteSettings.logo, 'WCashDesign header logo')
  }
  if (!hasImageAsset(current?.footerLogo)) {
    set.footerLogo = await uploadImage(siteSettings.circleLogo, 'WCashDesign footer logo')
  }
  if (!hasImageAsset(current?.socialPreviewImage)) {
    set.socialPreviewImage = await uploadImage(siteSettings.socialPreviewImage, 'WCashDesign social preview')
  }

  if (shouldCreate) {
    await client.createIfNotExists({_id: documentId, _type: 'siteSettings'})
  }

  const patch = client.patch(documentId)
  if (Object.keys(set).length) patch.set(set)
  patch.unset(['favicon'])
  await patch.commit()
  return true
}

async function patchSiteSettings() {
  await patchSiteSettingsDocument('site-settings', true)

  const currentDraft = await client.fetch<Record<string, unknown> | null>(
    `*[_type == "siteSettings" && _id == "drafts.site-settings"][0]`
  )

  if (!currentDraft) {
    const published = await client.fetch<Record<string, unknown> | null>(
      `*[_type == "siteSettings" && _id == "site-settings"][0]`
    )

    if (published) {
      const {_createdAt, _updatedAt, _rev, ...document} = published
      await client.createOrReplace({
        ...document,
        _id: 'drafts.site-settings',
        _type: 'siteSettings',
      })
    }
  }

  const repairedDraft = await patchSiteSettingsDocument('drafts.site-settings')
  console.log(`✓ Repaired site settings${repairedDraft ? ' and draft' : ''}`)
}

async function patchHomePageDocument(documentId: string, shouldCreate = false) {
  const current = await client.fetch<Record<string, unknown> | null>(
    `*[_type == "homePage" && _id == $documentId][0]`,
    {documentId}
  )

  if (!current && !shouldCreate) return false

  const set: Record<string, unknown> = {}

  setMissingText(set, current, {
    heroKicker: homePage.heroKicker,
    heroTitle: homePage.heroTitle,
    heroText: homePage.heroText,
    primaryAction: homePage.primaryAction,
    secondaryAction: homePage.secondaryAction,
    aboutKicker: homePage.aboutKicker,
    aboutTitle: homePage.aboutTitle,
    aboutText: homePage.aboutText,
    contactLabel: homePage.contactLabel,
    portfolioKicker: homePage.portfolioKicker,
    portfolioTitle: homePage.portfolioTitle,
    portfolioLinkLabel: homePage.portfolioLinkLabel,
    consultationKicker: homePage.consultationKicker,
    consultationTitle: homePage.consultationTitle,
    consultationText: homePage.consultationText,
  })

  if (!Array.isArray(current?.marqueeItems) || current.marqueeItems.length === 0) {
    set.marqueeItems = homePage.marqueeItems.map((item, index) => ({
      _key: `marquee-${index}`,
      _type: 'marqueeItem',
      label: item.label,
      link: item.href,
    }))
  }

  if (!current?.aboutImage) {
    set.aboutImage = await uploadImage(homePage.aboutImage, 'Walter Cash')
  }

  if (!Array.isArray(current?.featuredImages) || current.featuredImages.length === 0) {
    const featuredImages = [
      categories[0]?.images[0],
      categories[6]?.images[0],
      categories[2]?.images[0],
      categories[1]?.images[8],
    ].filter(Boolean) as GalleryImage[]
    set.featuredImages = await Promise.all(featuredImages.map((image, index) => galleryItem(image, index, 'featured')))
  }

  if (shouldCreate) await client.createIfNotExists({_id: documentId, _type: 'homePage'})
  if (Object.keys(set).length) await client.patch(documentId).set(set).commit()

  return true
}

async function patchHomePage() {
  await patchHomePageDocument('home-page', true)

  const currentDraft = await client.fetch<Record<string, unknown> | null>(
    `*[_type == "homePage" && _id == "drafts.home-page"][0]`
  )

  if (!currentDraft) {
    const published = await client.fetch<Record<string, unknown> | null>(
      `*[_type == "homePage" && _id == "home-page"][0]`
    )

    if (published) {
      const {_createdAt, _updatedAt, _rev, ...document} = published
      await client.createOrReplace({
        ...document,
        _id: 'drafts.home-page',
        _type: 'homePage',
      })
    }
  }

  const repairedDraft = await patchHomePageDocument('drafts.home-page')
  console.log(`✓ Repaired home page${repairedDraft ? ' and draft' : ''}`)
}

async function patchPortfolioPage() {
  const current = await client.fetch<Record<string, unknown> | null>(`*[_type == "portfolioPage" && _id == "portfolio-page"][0]`)
  const set: Record<string, unknown> = {}

  setMissingText(set, current, {
    eyebrow: portfolioPage.eyebrow,
    title: portfolioPage.title,
    intro: portfolioPage.intro,
  })

  if (!Array.isArray(current?.categoryOrder) || current.categoryOrder.length === 0) {
    set.categoryOrder = categories.map((category, index) => ({
      _key: `category-${index}`,
      _type: 'reference',
      _ref: `portfolio-category-${category.slug}`,
    }))
  }

  await client.createIfNotExists({_id: 'portfolio-page', _type: 'portfolioPage'})
  if (Object.keys(set).length) await client.patch('portfolio-page').set(set).commit()
  console.log('✓ Repaired portfolio page')
}

async function patchConsultationPage() {
  const current = await client.fetch<Record<string, unknown> | null>(`*[_type == "consultationPage" && _id == "consultation-page"][0]`)
  const set: Record<string, unknown> = {}

  setMissingText(set, current, {
    eyebrow: consultationPage.eyebrow,
    title: consultationPage.title,
    intro: consultationPage.intro,
    formspreeEndpoint: siteSettings.formspreeEndpoint,
    formTitle: consultationPage.formTitle,
    nameLabel: consultationPage.nameLabel,
    contactLabel: consultationPage.contactLabel,
    projectTypeLabel: consultationPage.projectTypeLabel,
    messageLabel: consultationPage.messageLabel,
    messagePlaceholder: consultationPage.messagePlaceholder,
    submitButtonLabel: consultationPage.submitButtonLabel,
  })

  if (!Array.isArray(current?.projectTypeOptions) || current.projectTypeOptions.length === 0) {
    set.projectTypeOptions = consultationPage.projectTypeOptions
  }

  await client.createIfNotExists({_id: 'consultation-page', _type: 'consultationPage'})
  if (Object.keys(set).length) await client.patch('consultation-page').set(set).commit()
  console.log('✓ Repaired consultation page')
}

async function patchGalleryCaptions() {
  const docs = await client.fetch<Array<{_id: string; gallery?: Array<SanityImageValue & {_key?: string}>}>>(
    `*[_type == "portfolioCategory"]{_id, gallery}`
  )

  for (const doc of docs) {
    if (!Array.isArray(doc.gallery)) continue
    let changed = false
    const gallery = doc.gallery.map((item) => {
      if (!item.caption && item.alt) {
        changed = true
        return {...item, caption: item.alt}
      }
      return item
    })

    if (changed) await client.patch(doc._id).set({gallery}).commit()
  }

  console.log('✓ Repaired gallery captions')
}

async function main() {
  await patchSiteSettings()
  await patchHomePage()
  await patchPortfolioPage()
  await patchConsultationPage()
  await patchGalleryCaptions()
  console.log('Done repairing WCashDesign Sanity content.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
