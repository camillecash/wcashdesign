import {useEffect, useMemo, useState} from 'react'
import {Badge, Box, Button, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {useClient} from 'sanity'
import {StateLink} from 'sanity/router'

const editableTypes = ['siteSettings', 'homePage', 'portfolioPage', 'portfolioCategory', 'consultationPage']

type DraftDocument = {
  _id: string
  _type: string
  _updatedAt?: string
  title?: string
  siteTitle?: string
  shortTitle?: string
  slug?: string
}

const query = `*[_id in path("drafts.**") && _type in $types] | order(_updatedAt desc) {
  _id,
  _type,
  _updatedAt,
  title,
  siteTitle,
  shortTitle,
  "slug": slug.current
}`

function publishedId(id: string) {
  return id.replace(/^drafts\./, '')
}

function structurePanes(document: DraftDocument) {
  if (document._type === 'portfolioCategory') {
    return [[{id: 'portfolioCategory'}], [{id: publishedId(document._id)}]]
  }

  switch (document._type) {
    case 'siteSettings':
      return [[{id: 'siteSettings'}]]
    case 'homePage':
      return [[{id: 'homePage'}]]
    case 'portfolioPage':
      return [[{id: 'portfolioPage'}]]
    case 'consultationPage':
      return [[{id: 'consultationPage'}]]
    default:
      return [[{id: publishedId(document._id)}]]
  }
}

function typeLabel(type: string) {
  switch (type) {
    case 'siteSettings':
      return 'Site Settings'
    case 'homePage':
      return 'Home Page'
    case 'portfolioPage':
      return 'Portfolio Page'
    case 'portfolioCategory':
      return 'Portfolio Category'
    case 'consultationPage':
      return 'Consultation Page'
    default:
      return type
  }
}

function documentTitle(document: DraftDocument) {
  if (document._type === 'siteSettings') return 'Site Settings'
  if (document._type === 'homePage') return 'Home Page'
  if (document._type === 'portfolioPage') return 'Portfolio Page'
  if (document._type === 'consultationPage') return 'Consultation Page'

  return document.title || document.shortTitle || document.slug || 'Untitled'
}

export function UnpublishedChangesPane() {
  const client = useClient({apiVersion: '2026-07-07'})
  const rawClient = useMemo(() => client.withConfig({perspective: 'raw'}), [client])
  const [documents, setDocuments] = useState<DraftDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadDrafts() {
    setLoading(true)
    setError(null)

    try {
      const nextDocuments = await rawClient.fetch<DraftDocument[]>(query, {types: editableTypes})
      setDocuments(nextDocuments)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load unpublished changes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDrafts()
  }, [rawClient])

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Flex align="center" justify="space-between" gap={3}>
          <Stack space={2}>
            <Text size={2} weight="semibold">
              Unpublished Changes
            </Text>
            <Text muted size={1}>
              Draft pages and categories that are different from the live website.
            </Text>
          </Stack>
          <Button disabled={loading} fontSize={1} mode="ghost" onClick={loadDrafts} text="Refresh" />
        </Flex>

        {loading && (
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text muted size={1}>
              Looking for drafts…
            </Text>
          </Flex>
        )}

        {error && (
          <Card padding={3} radius={2} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        )}

        {!loading && !error && documents.length === 0 && (
          <Card border padding={4} radius={3}>
            <Stack space={3}>
              <Text weight="semibold">No unpublished changes</Text>
              <Text muted size={1}>
                When you edit a page and Sanity autosaves it as a draft, it will show up here.
              </Text>
            </Stack>
          </Card>
        )}

        {!loading && !error && documents.length > 0 && (
          <Stack space={3}>
            {documents.map((document) => (
              <Card
                as={StateLink}
                border
                key={document._id}
                padding={3}
                radius={3}
                state={{panes: structurePanes(document)}}
                tone="positive"
              >
                <Flex align="center" justify="space-between" gap={3}>
                  <Stack space={2}>
                    <Text weight="semibold">{documentTitle(document)}</Text>
                    <Text muted size={1}>
                      {typeLabel(document._type)}
                    </Text>
                  </Stack>
                  <Badge tone="caution">Draft</Badge>
                </Flex>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
