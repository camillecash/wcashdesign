import type {APIContext} from 'astro'

export function getPreviewToken(Astro: APIContext) {
  const runtimeEnv = (Astro.locals as {runtime?: {env?: Record<string, string | undefined>}}).runtime?.env

  return (
    runtimeEnv?.SANITY_API_READ_TOKEN ||
    runtimeEnv?.SANITY_READ_TOKEN ||
    runtimeEnv?.SANITY_VIEWER_TOKEN ||
    import.meta.env.SANITY_API_READ_TOKEN ||
    import.meta.env.SANITY_READ_TOKEN ||
    import.meta.env.SANITY_VIEWER_TOKEN ||
    ''
  )
}

export function previewOptions(Astro: APIContext) {
  return {preview: true, token: getPreviewToken(Astro)}
}
