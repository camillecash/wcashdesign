import {createClient} from '@sanity/client'
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

const projectId = 'mg9lwf9m'
const dataset = 'production'
const apiVersion = '2026-06-29'
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

if (!token) {
  throw new Error(
    'Missing Sanity write token. Run this as SANITY_AUTH_TOKEN="your-token" pnpm run sanity:seed'
  )
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

function localAssetPath(src: string) {
  if (/^https?:\/\//.test(src)) {
    throw new Error(`Seed script expects local files, but received remote URL: ${src}`)
  }

  return path.join(root, 'public', decodeURI(src).replace(/^\//, ''))
}

async function uploadImage(src: string, alt: string) {
  const filePath = localAssetPath(src)
  const buffer = await readFile(filePath)
  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(filePath),
  })

  return {
    _type: 'image',
    alt,
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  }
}

async function galleryItem(image: GalleryImage, index: number, prefix: string) {
  return {
    _key: `${prefix}-${index}`,
    ...(await uploadImage(image.src, image.alt)),
    caption: image.caption,
  }
}

async function main() {
  console.log('Seeding WCashDesign content into Sanity…')

  await client.createOrReplace({
    _id: 'site-settings',
    _type: 'siteSettings',
    siteTitle: siteSettings.title,
    siteDescription: siteSettings.description,
    phone: siteSettings.phoneDisplay,
    email: siteSettings.email,
    instagram: siteSettings.instagram,
    headerLogo: await uploadImage(siteSettings.logo, 'WCashDesign header logo'),
    footerLogo: await uploadImage(siteSettings.circleLogo, 'WCashDesign footer logo'),
    menuLogo: await uploadImage(siteSettings.squareLogo, 'WCashDesign mobile menu logo'),
    socialPreviewImage: await uploadImage(siteSettings.socialPreviewImage, 'WCashDesign social preview'),
  })
  console.log('✓ Site settings')

  const featuredImages = [
    categories[0]?.images[0],
    categories[6]?.images[0],
    categories[2]?.images[0],
    categories[1]?.images[8],
  ].filter(Boolean) as GalleryImage[]

  await client.createOrReplace({
    _id: 'home-page',
    _type: 'homePage',
    heroKicker: homePage.heroKicker,
    heroTitle: homePage.heroTitle,
    heroText: homePage.heroText,
    primaryAction: homePage.primaryAction,
    primaryActionLink: homePage.primaryActionLink,
    secondaryAction: homePage.secondaryAction,
    secondaryActionLink: homePage.secondaryActionLink,
    featuredImages: await Promise.all(
      featuredImages.map((image, index) => galleryItem(image, index, 'featured'))
    ),
    marqueeItems: homePage.marqueeItems.map((item, index) => ({
      _key: `marquee-${index}`,
      label: item.label,
      link: item.href,
    })),
    aboutKicker: homePage.aboutKicker,
    aboutTitle: homePage.aboutTitle,
    aboutText: homePage.aboutText,
    aboutImage: await uploadImage(homePage.aboutImage, 'Walter Cash'),
    contactLabel: homePage.contactLabel,
    portfolioKicker: homePage.portfolioKicker,
    portfolioTitle: homePage.portfolioTitle,
    portfolioLinkLabel: homePage.portfolioLinkLabel,
    consultationKicker: homePage.consultationKicker,
    consultationTitle: homePage.consultationTitle,
    consultationText: homePage.consultationText,
  })
  console.log('✓ Home page')

  await client.createOrReplace({
    _id: 'consultation-page',
    _type: 'consultationPage',
    eyebrow: consultationPage.eyebrow,
    title: consultationPage.title,
    intro: consultationPage.intro,
    formspreeEndpoint: siteSettings.formspreeEndpoint,
    formTitle: consultationPage.formTitle,
    nameLabel: consultationPage.nameLabel,
    contactLabel: consultationPage.contactLabel,
    projectTypeLabel: consultationPage.projectTypeLabel,
    projectTypeOptions: consultationPage.projectTypeOptions,
    messageLabel: consultationPage.messageLabel,
    messagePlaceholder: consultationPage.messagePlaceholder,
    submitButtonLabel: consultationPage.submitButtonLabel,
  })
  console.log('✓ Consultation page')

  await client.createOrReplace({
    _id: 'portfolio-page',
    _type: 'portfolioPage',
    eyebrow: portfolioPage.eyebrow,
    title: portfolioPage.title,
    intro: portfolioPage.intro,
    categoryOrder: categories.map((category, index) => ({
      _key: `category-${index}`,
      _type: 'reference',
      _ref: `portfolio-category-${category.slug}`,
    })),
  })
  console.log('✓ Portfolio page')

  for (const [index, category] of categories.entries()) {
    await client.createOrReplace({
      _id: `portfolio-category-${category.slug}`,
      _type: 'portfolioCategory',
      title: category.title,
      shortTitle: category.shortTitle,
      slug: {
        _type: 'slug',
        current: category.slug,
      },
      description: category.description,
      order: index + 1,
      hidden: false,
      previewImage: await uploadImage(category.previewImage, `${category.title} preview image`),
      gallery: await Promise.all(
        category.images.map((image, imageIndex) => galleryItem(image, imageIndex, category.slug))
      ),
    })
    console.log(`✓ ${category.title}`)
  }

  console.log('Done. Refresh Sanity Studio to see the seeded content.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
