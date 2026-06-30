import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {PreviewPane} from './components/PreviewPane'

const projectId = 'mg9lwf9m'
const dataset = 'production'
const previewableTypes = ['siteSettings', 'homePage', 'portfolioCategory', 'consultationPage']

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
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
