import type {APIRoute} from 'astro'
import {createClient} from '@sanity/client'
import {getPreviewToken} from '../../utils/preview'

export const prerender = false

const client = createClient({
  projectId: 'mg9lwf9m',
  dataset: 'production',
  apiVersion: '2026-06-29',
  useCdn: false,
  perspective: 'raw',
})

export const GET: APIRoute = async (context) => {
  const token = getPreviewToken(context)

  const payload: Record<string, unknown> = {
    ok: false,
    tokenPresent: Boolean(token),
    tokenLength: token ? token.length : 0,
    checkedAt: new Date().toISOString(),
  }

  try {
    const documents = await client.withConfig({token}).fetch<
      Array<{
        _id: string
        _updatedAt?: string
        heroText?: string
        aboutTitle?: string
      }>
    >(
      `*[_type == "homePage" && _id in ["drafts.home-page", "home-page"]] | order(_id match "drafts.*" desc) {
        _id,
        _updatedAt,
        heroText,
        aboutTitle
      }`
    )

    payload.ok = true
    payload.documentIds = documents.map((document) => document._id)
    payload.selectedDocumentId = documents[0]?._id || null
    payload.selectedUpdatedAt = documents[0]?._updatedAt || null
    payload.selectedHeroTextStart = documents[0]?.heroText?.slice(0, 120) || null
    payload.selectedAboutTitle = documents[0]?.aboutTitle || null
  } catch (error) {
    payload.error = error instanceof Error ? error.message : String(error)
  }

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}
