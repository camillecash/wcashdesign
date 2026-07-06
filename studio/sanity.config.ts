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
const previewPath = (path: string) => `/preview${path === '/' ? '/' : path}`

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
      title: 'Live Preview',
      previewUrl: {
        initial: `${previewBaseUrl}/preview/`,
      },
      allowOrigins: [
        'https://wcashdesign.com',
        'https://www.wcashdesign.com',
        'https://wcashdesign.pages.dev',
        'https://wcashdesign.sanity.studio',
      ],
      resolve: {
        mainDocuments: [
          {
            route: '/',
            filter: `_type == "homePage" && _id == "home-page"`,
          },
          {
            route: '/preview',
            filter: `_type == "homePage" && _id == "home-page"`,
          },
          {
            route: '/preview/',
            filter: `_type == "homePage" && _id == "home-page"`,
          },
          {
            route: '/portfolio',
            filter: `_type == "portfolioPage" && _id == "portfolio-page"`,
          },
          {
            route: '/portfolio/',
            filter: `_type == "portfolioPage" && _id == "portfolio-page"`,
          },
          {
            route: '/preview/portfolio',
            filter: `_type == "portfolioPage" && _id == "portfolio-page"`,
          },
          {
            route: '/preview/portfolio/',
            filter: `_type == "portfolioPage" && _id == "portfolio-page"`,
          },
          {
            route: '/consultation',
            filter: `_type == "consultationPage" && _id == "consultation-page"`,
          },
          {
            route: '/consultation/',
            filter: `_type == "consultationPage" && _id == "consultation-page"`,
          },
          {
            route: '/preview/consultation',
            filter: `_type == "consultationPage" && _id == "consultation-page"`,
          },
          {
            route: '/preview/consultation/',
            filter: `_type == "consultationPage" && _id == "consultation-page"`,
          },
          {
            route: '/portfolio/:slug',
            filter: `_type == "portfolioCategory" && slug.current == $slug`,
            params: ({params}) => ({slug: params.slug}),
          },
          {
            route: '/portfolio/:slug/',
            filter: `_type == "portfolioCategory" && slug.current == $slug`,
            params: ({params}) => ({slug: params.slug}),
          },
          {
            route: '/preview/portfolio/:slug',
            filter: `_type == "portfolioCategory" && slug.current == $slug`,
            params: ({params}) => ({slug: params.slug}),
          },
          {
            route: '/preview/portfolio/:slug/',
            filter: `_type == "portfolioCategory" && slug.current == $slug`,
            params: ({params}) => ({slug: params.slug}),
          },
        ],
        locations: {
          siteSettings: {
            select: {},
            resolve: () => ({
              message: 'Open this page in Live Preview',
              locations: [{title: 'Preview Home Page', href: previewPath('/')}],
            }),
          },
          homePage: {
            select: {},
            resolve: () => ({
              message: 'Open this page in Live Preview',
              locations: [{title: 'Preview Home Page', href: previewPath('/')}],
            }),
          },
          portfolioPage: {
            select: {},
            resolve: () => ({
              message: 'Open this page in Live Preview',
              locations: [{title: 'Preview Portfolio Page', href: previewPath('/portfolio/')}],
            }),
          },
          consultationPage: {
            select: {},
            resolve: () => ({
              message: 'Open this page in Live Preview',
              locations: [{title: 'Preview Consultation Page', href: previewPath('/consultation/')}],
            }),
          },
          portfolioCategory: {
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => {
              const title = doc?.title || 'Portfolio category'
              const slug = doc?.slug

              return {
                message: 'Open this page in Live Preview',
                locations: [
                  {
                    title: `Preview ${title}`,
                    href: slug ? previewPath(`/portfolio/${slug}/`) : previewPath('/portfolio/'),
                  },
                ],
              }
            },
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
