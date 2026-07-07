import {
  categories as fallbackCategories,
  consultationPage as fallbackConsultationPage,
  homePage as fallbackHomePage,
  portfolioPage as fallbackPortfolioPage,
  siteSettings as fallbackSiteSettings,
  type Category,
  type GalleryImage,
} from './site'
import {createClient} from '@sanity/client'

const projectId = 'mg9lwf9m'
const dataset = 'production'
const apiVersion = '2026-06-29'
const useSanity = import.meta.env.USE_SANITY !== 'false'
const studioUrl = 'https://wcashdesign.sanity.studio'

export type SanityFetchOptions = {
  preview?: boolean
  token?: string
}

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

function shouldEncodePreviewMetadata(props: {
  sourcePath?: Array<string | number>
  resultPath?: Array<string | number>
  filterDefault: (props: unknown) => boolean
}) {
  const path = [...(props.sourcePath || []), ...(props.resultPath || [])].map(String)
  const fieldName = path[path.length - 1]

  if (
    [
      '_id',
      '_type',
      '_key',
      'slug',
      'src',
      'url',
      'href',
      'link',
      'phone',
      'email',
      'instagram',
      'formspreeEndpoint',
    ].includes(fieldName)
  ) {
    return false
  }

  return props.filterDefault(props)
}

function getClient(options: SanityFetchOptions = {}) {
  const preview = Boolean(options.preview)

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !preview,
    perspective: preview ? 'drafts' : 'published',
    token: preview ? options.token : undefined,
    stega: {
      enabled: preview,
      studioUrl,
      filter: shouldEncodePreviewMetadata,
    },
  })
}

function singletonFilter(type: string, id: string, options: SanityFetchOptions = {}) {
  if (!options.preview) return `_type == "${type}" && _id == "${id}"`

  return `_type == "${type}" && _id in ["drafts.${id}", "${id}"]`
}

function preferDraftOrder(options: SanityFetchOptions = {}) {
  return options.preview ? ` | order(_id match "drafts.*" desc)` : ''
}

async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number> = {},
  options: SanityFetchOptions = {}
) {
  if (!useSanity) return null
  if (options.preview && !options.token) {
    console.warn('[Sanity] Missing preview token. Falling back to local content.')
    return null
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4500)

  try {
    return await getClient(options).fetch<T>(query, params, {
      signal: controller.signal,
    })
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

export function getSiteSettings(options: SanityFetchOptions = {}) {
  if (options.preview) return fetchSiteSettings(options)
  siteSettingsPromise ??= (async () => {
    return fetchSiteSettings(options)
  })()

  return siteSettingsPromise
}

async function fetchSiteSettings(options: SanityFetchOptions = {}) {
    const data = await sanityFetch<{
      siteTitle?: string
      siteDescription?: string
      phone?: string
      email?: string
      instagram?: string
      headerLogo?: SanityImage
      footerLogo?: SanityImage
      menuLogo?: SanityImage
      socialPreviewImage?: SanityImage
    }>(`*[${singletonFilter('siteSettings', 'site-settings', options)}]${preferDraftOrder(options)}[0]{
      siteTitle,
      siteDescription,
      phone,
      email,
      instagram,
      headerLogo{alt, "url": asset->url},
      footerLogo{alt, "url": asset->url},
      menuLogo{alt, "url": asset->url},
      socialPreviewImage{alt, "url": asset->url}
    }`, {}, options)

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
      menuLogo: imageUrl(data.menuLogo, fallbackSiteSettings.menuLogo),
      socialPreviewImage,
    }
}

export function getPortfolioPage(options: SanityFetchOptions = {}) {
  if (options.preview) return fetchPortfolioPage(options)
  portfolioPagePromise ??= (async () => {
    return fetchPortfolioPage(options)
  })()

  return portfolioPagePromise
}

async function fetchPortfolioPage(options: SanityFetchOptions = {}) {
    const data = await sanityFetch<{
      eyebrow?: string
      title?: string
      intro?: string
    }>(`*[${singletonFilter('portfolioPage', 'portfolio-page', options)}]${preferDraftOrder(options)}[0]{
      eyebrow,
      title,
      intro
    }`, {}, options)

    if (!data) return fallbackPortfolioPage

    return {
      eyebrow: data.eyebrow || fallbackPortfolioPage.eyebrow,
      title: data.title || fallbackPortfolioPage.title,
      intro: data.intro || fallbackPortfolioPage.intro,
    }
}

export function getHomePage(options: SanityFetchOptions = {}) {
  if (options.preview) return fetchHomePage(options)
  homePagePromise ??= (async () => {
    return fetchHomePage(options)
  })()

  return homePagePromise
}

async function fetchHomePage(options: SanityFetchOptions = {}) {
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
    }>(`*[${singletonFilter('homePage', 'home-page', options)}]${preferDraftOrder(options)}[0]{
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
    }`, {}, options)

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
}

type SanityCategory = {
  _id?: string
  title?: string
  shortTitle?: string
  slug?: string
  description?: string
  previewImage?: SanityImage
  gallery?: SanityImage[]
}

function resolveCategory(item: SanityCategory): Category | null {
  if (!item.title && !item.slug) return null

  const derivedSlug = item.slug || (item.title ? slugify(item.title) : '')
  const fallback = fallbackCategories.find((category) => category.slug === derivedSlug)
  const title = item.title || fallback?.title || 'Portfolio Category'
  const images = item.gallery?.map((image) => galleryImage(image, title)).filter(Boolean) || fallback?.images || []

  return {
    title,
    shortTitle: item.shortTitle || fallback?.shortTitle || title,
    slug: derivedSlug || slugify(title),
    description: item.description || fallback?.description || '',
    previewImage: imageUrl(item.previewImage, fallback?.previewImage || images[0]?.src || ''),
    images,
  }
}

export function getCategories(options: SanityFetchOptions = {}) {
  if (options.preview) return fetchCategories(options)
  categoriesPromise ??= (async () => {
    return fetchCategories(options)
  })()

  return categoriesPromise
}

async function fetchCategories(options: SanityFetchOptions = {}) {
    const data = await sanityFetch<{
      ordered?: SanityCategory[]
      all?: SanityCategory[]
    }>(`{
      "ordered": *[${singletonFilter('portfolioPage', 'portfolio-page', options)}]${preferDraftOrder(options)}[0].categoryOrder[]->{
        _id,
        title,
        shortTitle,
        "slug": slug.current,
        description,
        previewImage{alt, "src": asset->url},
        gallery[]{alt, caption, "src": asset->url}
      },
      "all": *[_type == "portfolioCategory" && hidden != true] | order(order asc, title asc) {
        _id,
        title,
        shortTitle,
        "slug": slug.current,
        description,
        previewImage{alt, "src": asset->url},
        gallery[]{alt, caption, "src": asset->url}
      }
    }`, {}, options)

    if (!data?.all?.length) return fallbackCategories

    const orderedIds = new Set((data.ordered || []).map((item) => item?._id).filter(Boolean))
    const ordered = (data.ordered || []).map(resolveCategory).filter(Boolean) as Category[]
    const unordered = data.all
      .filter((item) => !item._id || !orderedIds.has(item._id))
      .map(resolveCategory)
      .filter(Boolean) as Category[]

    return [...ordered, ...unordered]
}

export function getConsultationPage(options: SanityFetchOptions = {}) {
  if (options.preview) return fetchConsultationPage(options)
  consultationPagePromise ??= (async () => {
    return fetchConsultationPage(options)
  })()

  return consultationPagePromise
}

async function fetchConsultationPage(options: SanityFetchOptions = {}) {
    const data = await sanityFetch<{
      eyebrow?: string
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
    }>(`*[${singletonFilter('consultationPage', 'consultation-page', options)}]${preferDraftOrder(options)}[0]{
      eyebrow,
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
    }`, {}, options)

    if (!data) return fallbackConsultationPage

    return {
      ...fallbackConsultationPage,
      eyebrow: data.eyebrow || fallbackConsultationPage.eyebrow,
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
}
