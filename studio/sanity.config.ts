import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {PreviewPane} from './components/PreviewPane'

const projectId = 'mg9lwf9m'
const dataset = 'production'
const previewBaseUrl = 'https://wcashdesign.com'
const previewableTypes = ['siteSettings', 'homePage', 'portfolioPage', 'portfolioCategory', 'consultationPage']

export default defineConfig({
  name: 'wcashdesign',
  title: 'WCashDesign',
  projectId,
  dataset,
  plugins: [
    structureTool({
      defaultDocumentNode: (S, {schemaType}) => {
        if (previewableTypes.includes(schemaType)) {
          return S.document().views([S.view.form(), S.view.component(PreviewPane).title('Preview')])
        }

        return S.document()
      },
      structure: (S) => {
        const previewableDocument = (schemaType: string, documentId: string) =>
          S.document()
            .schemaType(schemaType)
            .documentId(documentId)
            .views([S.view.form(), S.view.component(PreviewPane).title('Preview')])

        return S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(previewableDocument('siteSettings', 'site-settings')),
            S.listItem()
              .title('Home Page')
              .child(previewableDocument('homePage', 'home-page')),
            S.listItem()
              .title('Portfolio Page')
              .child(previewableDocument('portfolioPage', 'portfolio-page')),
            S.listItem()
              .title('Portfolio Categories')
              .child(
                S.documentTypeList('portfolioCategory')
                  .title('Portfolio Categories')
                  .defaultOrdering([{field: 'order', direction: 'asc'}])
                  .child((documentId) => previewableDocument('portfolioCategory', documentId))
              ),
            S.listItem()
              .title('Consultation Page')
              .child(previewableDocument('consultationPage', 'consultation-page')),
          ])
      },
    }),
    presentationTool({
      previewUrl: previewBaseUrl,
      resolve: {
        locations: {
          siteSettings: {
            select: {},
            resolve: () => ({locations: [{title: 'Home', href: '/'}]}),
          },
          homePage: {
            select: {},
            resolve: () => ({locations: [{title: 'Home', href: '/'}]}),
          },
          portfolioPage: {
            select: {},
            resolve: () => ({locations: [{title: 'Portfolio', href: '/portfolio/'}]}),
          },
          consultationPage: {
            select: {},
            resolve: () => ({locations: [{title: 'Consultation', href: '/consultation/'}]}),
          },
          portfolioCategory: {
            select: {title: 'title', slug: 'slug.current'},
            resolve: ({title, slug}) => ({
              locations: [
                {
                  title: title || 'Portfolio category',
                  href: slug ? `/portfolio/${slug}/` : '/portfolio/',
                },
              ],
            }),
          },
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
