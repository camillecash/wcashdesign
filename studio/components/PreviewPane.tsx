import {useEffect, useMemo, useState} from 'react'
import {Card, Flex, Spinner, Text} from '@sanity/ui'
import {useClient} from 'sanity'
import {useDocumentPane} from 'sanity/structure'

const previewBaseUrl = import.meta.env.SANITY_STUDIO_PREVIEW_URL || 'https://wcashdesign.com'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function withBase(path: string) {
  return new URL(path, previewBaseUrl).toString()
}

function previewPath(path: string) {
  return `/preview${path === '/' ? '/' : path}`
}

export function PreviewPane() {
  const client = useClient({apiVersion: '2026-06-29'})
  const {displayed, documentId, documentType, schemaType, value} = useDocumentPane()
  const [url, setUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const publishedId = useMemo(() => documentId.replace(/^drafts\./, ''), [documentId])
  const draftId = useMemo(() => `drafts.${publishedId}`, [publishedId])
  const activeType = documentType || value?._type || displayed?._type || schemaType?.name
  const refreshKey = useMemo(() => JSON.stringify(displayed || value || {}), [displayed, value])
  const iframeUrl = useMemo(() => {
    if (!url) return null

    const nextUrl = new URL(url)
    nextUrl.searchParams.set('_previewRefresh', String(Date.now()))
    return nextUrl.toString()
  }, [refreshKey, url])

  useEffect(() => {
    let isMounted = true

    async function resolveUrl() {
      setIsLoading(true)

      if (activeType === 'homePage' || activeType === 'siteSettings') {
        if (isMounted) {
          setUrl(withBase(previewPath('/')))
          setIsLoading(false)
        }
        return
      }

      if (activeType === 'portfolioPage') {
        if (isMounted) {
          setUrl(withBase(previewPath('/portfolio/')))
          setIsLoading(false)
        }
        return
      }

      if (activeType === 'consultationPage') {
        if (isMounted) {
          setUrl(withBase(previewPath('/consultation/')))
          setIsLoading(false)
        }
        return
      }

      if (activeType === 'portfolioCategory') {
        const openDocument = (displayed || value) as {title?: string; slug?: {current?: string}} | null
        const openSlug = openDocument?.slug?.current
        const openTitle = openDocument?.title

        if (openSlug || openTitle) {
          if (isMounted) {
            setUrl(withBase(previewPath(`/portfolio/${openSlug || slugify(openTitle || '')}/`)))
            setIsLoading(false)
          }
          return
        }

        const document = await client.fetch<{title?: string; slug?: {current?: string}} | null>(
          `*[_id in [$draftId, $publishedId]] | order(_id asc)[0]{
            title,
            slug
          }`,
          {draftId, publishedId}
        )
        const slug = document?.slug?.current || (document?.title ? slugify(document.title) : '')

        if (isMounted) {
          setUrl(slug ? withBase(previewPath(`/portfolio/${slug}/`)) : withBase(previewPath('/portfolio/')))
          setIsLoading(false)
        }
        return
      }

      if (publishedId.startsWith('portfolio-category-')) {
        const slug = publishedId.replace(/^portfolio-category-/, '')
        if (isMounted) {
          setUrl(withBase(previewPath(`/portfolio/${slug}/`)))
          setIsLoading(false)
        }
        return
      }

      if (isMounted) {
        setUrl(withBase(previewPath('/')))
        setIsLoading(false)
      }
    }

    resolveUrl().catch(() => {
      if (isMounted) {
        setUrl(withBase(previewPath('/')))
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [activeType, client, displayed, draftId, publishedId, value])

  if (isLoading || !iframeUrl) {
    return (
      <Flex align="center" justify="center" height="fill">
        <Spinner muted />
      </Flex>
    )
  }

  return (
    <Card height="fill" tone="transparent">
      <iframe
        title="Website preview"
        src={iframeUrl}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '70vh',
          border: 0,
          background: '#fff',
        }}
      />
      <Card padding={3} tone="transparent">
        <Text size={1} muted>
          Preview URL: {url}
        </Text>
      </Card>
    </Card>
  )
}
