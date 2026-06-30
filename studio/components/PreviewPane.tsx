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

export function PreviewPane() {
  const client = useClient({apiVersion: '2026-06-29'})
  const {documentId, documentType} = useDocumentPane()
  const [url, setUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const publishedId = useMemo(() => documentId.replace(/^drafts\./, ''), [documentId])
  const draftId = useMemo(() => `drafts.${publishedId}`, [publishedId])

  useEffect(() => {
    let isMounted = true

    async function resolveUrl() {
      setIsLoading(true)

      if (documentType === 'homePage' || documentType === 'siteSettings') {
        if (isMounted) {
          setUrl(withBase('/'))
          setIsLoading(false)
        }
        return
      }

      if (documentType === 'consultationPage') {
        if (isMounted) {
          setUrl(withBase('/consultation/'))
          setIsLoading(false)
        }
        return
      }

      if (documentType === 'portfolioCategory') {
        const document = await client.fetch<{title?: string; slug?: {current?: string}} | null>(
          `*[_id in [$draftId, $publishedId]] | order(_id match "drafts.*" desc)[0]{
            title,
            slug
          }`,
          {draftId, publishedId}
        )
        const slug = document?.slug?.current || (document?.title ? slugify(document.title) : '')

        if (isMounted) {
          setUrl(slug ? withBase(`/portfolio/${slug}/`) : withBase('/portfolio/'))
          setIsLoading(false)
        }
        return
      }

      if (isMounted) {
        setUrl(withBase('/'))
        setIsLoading(false)
      }
    }

    resolveUrl().catch(() => {
      if (isMounted) {
        setUrl(withBase('/'))
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [client, documentType, draftId, publishedId])

  if (isLoading || !url) {
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
        src={url}
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
