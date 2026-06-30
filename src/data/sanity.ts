import {
  categories as fallbackCategories,
  consultationPage as fallbackConsultationPage,
  homePage as fallbackHomePage,
  portfolioPage as fallbackPortfolioPage,
  siteSettings as fallbackSiteSettings,
  type Category,
  type GalleryImage,
} from './site'

const projectId = 'mg9lwf9m'
const dataset = 'production'
const apiVersion = '2026-06-29'
const useSanity = import.meta.env.USE_SANITY !== 'false'
const queryEndpoint = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`

export type ResolvedSiteSettings = typeof fallbackSiteSettings
export type ResolvedHomePage = typeof fallbackHomePage & {
  aboutImageAlt?: string
  featuredImages?: GalleryImage[]
}
export type ResolvedConsultationPage = typeof fallbackConsultationPage & {
  formspreeEndpoint?: string
}
export type ResolvedPortfolioPage = typeof fallbackPortfolioPage

type SanityImage = {
  src?: string
  url?: string
  alt?: string
  caption?: string
}

async function sanityFetch<T>(query: string, params: Record<string, string | number> = {}) {
  if (!useSanity) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4500)

  try {
    const url = new URL(queryEndpoint)
    url.searchParams.set('query', query)
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(`$${key}`, JSON.stringify(value)))

    const response = await fetch(url, {
      headers: {Accept: 'application/json'},
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Sanity request failed: ${response.status} ${response.statusText}`)
    }

    const body = (await response.json()) as {result: T}
    return body.result
  } catch (error) {
    console.warn('[Sanity] Falling back to local content:', error instanceof Error ? error.message : error)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return fallbackSiteSettings.phoneHref
  return digits.length === 10 ? `tel:+1${digits}` : `tel:+${digits}`
}

function imageUrl(image: SanityImage | null | undefined, fallback: string) {
  return image?.url || image?.src || fallback
}

function galleryImage(image: SanityImage, fallbackAlt: string): GalleryImage | null {
  const src = imageUrl(image, '')
  if (!src) return null
  return {
    src,
    alt: image.alt || fallbackAlt,
    caption: image.caption,
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

let siteSettingsPromise: Promise<ResolvedSiteSettings> | undefined
let homePagePromise: Promise<ResolvedHomePage> | undefined
let portfolioPagePromise: Promise<ResolvedPortfolioPage> | undefined
let categoriesPromise: Promise<Category[]> | undefined
let consultationPagePromise: Promise<ResolvedConsultationPage> | undefined

export function getSiteSettings() {
  siteSettingsPromise ??= (async () => {
    const data = await sanityFetch<{
      siteTitle?: string
      siteDescription?: string
      phone?: string
      email?: string
      instagram?: string
      headerLogo?: SanityImage
      footerLogo?: SanityImage
      menuLogo?: SanityImage
      favicon?: SanityImage
      socialPreviewImage?: SanityImage
    }>(`*[_type == "siteSettings" && _id == "site-settings"][0]{
      siteTitle,
      siteDescription,
      phone,
      email,
      instagram,
      headerLogo{alt, "url": asset->url},
      footerLogo{alt, "url": asset->url},
      menuLogo{alt, "url": asset->url},
      favicon{alt, "url": asset->url},
      socialPreviewImage{alt, "url": asset->url}
    }`)

    if (!data) return fallbackSiteSettings

    const phone = data.phone || fallbackSiteSettings.phoneDisplay
    const socialPreviewImage = imageUrl(data.socialPreviewImage, fallbackSiteSettings.socialPreviewImage)

    return {
      ...fallbackSiteSettings,
      title: data.siteTitle || fallbackSiteSettings.title,
      description: data.siteDescription || fallbackSiteSettings.description,
      phoneDisplay: phone,
      phoneHref: phoneHref(phone),
      email: data.email || fallbackSiteSettings.email,
      instagram: data.instagram || fallbackSiteSettings.instagram,
      logo: imageUrl(data.headerLogo, fallbackSiteSettings.logo),
      circleLogo: imageUrl(data.footerLogo, fallbackSiteSettings.circleLogo),
      squareLogo: imageUrl(data.menuLogo, fallbackSiteSettings.squareLogo),
      favicon: imageUrl(data.favicon, fallbackSiteSettings.favicon),
      socialPreviewImage,
    }
  })()

  return siteSettingsPromise
}

export function getPortfolioPage() {
  portfolioPagePromise ??= (async () => {
    const data = await sanityFetch<{
      eyebrow?: string
      title?: string
      intro?: string
    }>(`*[_type == "portfolioPage" && _id == "portfolio-page"][0]{
      eyebrow,
      title,
      intro
    }`)

    if (!data) return fallbackPortfolioPage

    return {
      eyebrow: data.eyebrow || fallbackPortfolioPage.eyebrow,
      title: data.title || fallbackPortfolioPage.title,
      intro: data.intro || fallbackPortfolioPage.intro,
    }
  })()

  return portfolioPagePromise
}

export function getHomePage() {
  homePagePromise ??= (async () => {
    const data = await sanityFetch<{
      heroKicker?: string
      heroTitle?: string
      heroText?: string
      primaryAction?: string
      primaryActionLink?: string
      secondaryAction?: string
      secondaryActionLink?: string
      aboutTitle?: string
      aboutText?: string
      marqueeItems?: Array<{label?: string; link?: string}>
      aboutKicker?: string
      featuredImages?: SanityImage[]
      aboutImage?: SanityImage
      contactLabel?: string
      portfolioKicker?: string
      portfolioTitle?: string
      portfolioLinkLabel?: string
      consultationKicker?: string
      consultationTitle?: string
      consultationText?: string
    }>(`*[_type == "homePage" && _id == "home-page"][0]{
      heroKicker,
      heroTitle,
      heroText,
      primaryAction,
      primaryActionLink,
      secondaryAction,
      secondaryActionLink,
      marqueeItems[]{label, link},
      aboutKicker,
      aboutTitle,
      aboutText,
      contactLabel,
      portfolioKicker,
      portfolioTitle,
      portfolioLinkLabel,
      consultationKicker,
      consultationTitle,
      consultationText,
      featuredImages[]{alt, "src": asset->url},
      aboutImage{alt, "src": asset->url}
    }`)

    if (!data) return fallbackHomePage

    const featuredImages =
      data.featuredImages?.map((image) => galleryImage(image, 'Featured WCashDesign work')).filter(Boolean) || []

    return {
      ...fallbackHomePage,
      heroKicker: data.heroKicker || fallbackHomePage.heroKicker,
      heroTitle: data.heroTitle || fallbackHomePage.heroTitle,
      heroText: data.heroText || fallbackHomePage.heroText,
      primaryAction: data.primaryAction || fallbackHomePage.primaryAction,
      primaryActionLink: data.primaryActionLink || fallbackHomePage.primaryActionLink,
      secondaryAction: data.secondaryAction || fallbackHomePage.secondaryAction,
      secondaryActionLink: data.secondaryActionLink || fallbackHomePage.secondaryActionLink,
      marqueeItems:
        data.marqueeItems
          ?.filter((item) => item.label)
          .map((item) => ({label: item.label!, href: item.link || '#'})) || fallbackHomePage.marqueeItems,
      aboutKicker: data.aboutKicker || fallbackHomePage.aboutKicker,
      aboutTitle: data.aboutTitle || fallbackHomePage.aboutTitle,
      aboutText: data.aboutText || fallbackHomePage.aboutText,
      aboutImage: imageUrl(data.aboutImage, fallbackHomePage.aboutImage),
      aboutImageAlt: data.aboutImage?.alt || 'Walter Cash',
      featuredImages,
      contactLabel: data.contactLabel || fallbackHomePage.contactLabel,
      portfolioKicker: data.portfolioKicker || fallbackHomePage.portfolioKicker,
      portfolioTitle: data.portfolioTitle || fallbackHomePage.portfolioTitle,
      portfolioLinkLabel: data.portfolioLinkLabel || fallbackHomePage.portfolioLinkLabel,
      consultationKicker: data.consultationKicker || fallbackHomePage.consultationKicker,
      consultationTitle: data.consultationTitle || fallbackHomePage.consultationTitle,
      consultationText: data.consultationText || fallbackHomePage.consultationText,
    }
  })()

  return homePagePromise
}

export function getCategories() {
  categoriesPromise ??= (async () => {
    const data = await sanityFetch<
      Array<{
        title?: string
        shortTitle?: string
        slug?: string
        description?: string
        previewImage?: SanityImage
        gallery?: SanityImage[]
      }>
    >(`*[_type == "portfolioCategory" && hidden != true] | order(order asc, title asc) {
      title,
      shortTitle,
      "slug": slug.current,
      description,
      previewImage{alt, "src": asset->url},
      gallery[]{alt, caption, "src": asset->url}
    }`)

    if (!data?.length) return fallbackCategories

    return data
      .filter((item) => item.title || item.slug)
      .map((item) => {
        const derivedSlug = item.slug || (item.title ? slugify(item.title) : '')
        const fallback = fallbackCategories.find((category) => category.slug === derivedSlug)
        const title = item.title || fallback?.title || 'Portfolio Category'
        const images =
          item.gallery?.map((image) => galleryImage(image, title)).filter(Boolean) || fallback?.images || []

        return {
          title,
          shortTitle: item.shortTitle || fallback?.shortTitle || title,
          slug: derivedSlug || slugify(title),
          description: item.description || fallback?.description || '',
          previewImage: imageUrl(item.previewImage, fallback?.previewImage || images[0]?.src || ''),
          images,
        }
      })
  })()

  return categoriesPromise
}

export function getConsultationPage() {
  consultationPagePromise ??= (async () => {
    const data = await sanityFetch<{
      title?: string
      intro?: string
      formTitle?: string
      formspreeEndpoint?: string
      nameLabel?: string
      contactLabel?: string
      projectTypeLabel?: string
      projectTypeOptions?: string[]
      messageLabel?: string
      messagePlaceholder?: string
      submitButtonLabel?: string
    }>(`*[_type == "consultationPage" && _id == "consultation-page"][0]{
      title,
      intro,
      formTitle,
      formspreeEndpoint,
      nameLabel,
      contactLabel,
      projectTypeLabel,
      projectTypeOptions,
      messageLabel,
      messagePlaceholder,
      submitButtonLabel
    }`)

    if (!data) return fallbackConsultationPage

    return {
      ...fallbackConsultationPage,
      title: data.title || fallbackConsultationPage.title,
      intro: data.intro || fallbackConsultationPage.intro,
      formTitle: data.formTitle || fallbackConsultationPage.formTitle,
      formspreeEndpoint: data.formspreeEndpoint || fallbackSiteSettings.formspreeEndpoint,
      nameLabel: data.nameLabel || fallbackConsultationPage.nameLabel,
      contactLabel: data.contactLabel || fallbackConsultationPage.contactLabel,
      projectTypeLabel: data.projectTypeLabel || fallbackConsultationPage.projectTypeLabel,
      projectTypeOptions: data.projectTypeOptions?.length
        ? data.projectTypeOptions
        : fallbackConsultationPage.projectTypeOptions,
      messageLabel: data.messageLabel || fallbackConsultationPage.messageLabel,
      messagePlaceholder: data.messagePlaceholder || fallbackConsultationPage.messagePlaceholder,
      submitButtonLabel: data.submitButtonLabel || fallbackConsultationPage.submitButtonLabel,
    }
  })()

  return consultationPagePromise
}
