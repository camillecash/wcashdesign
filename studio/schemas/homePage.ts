import {defineField, defineType} from 'sanity'

const hiddenImageAlt = defineField({
  name: 'alt',
  title: 'Alt Text',
  type: 'string',
  hidden: true,
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({name: 'heroKicker', title: 'Hero Kicker', type: 'string'}),
    defineField({name: 'heroTitle', title: 'Hero Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'heroText', title: 'Hero Text', type: 'text', rows: 4}),
    defineField({name: 'primaryAction', title: 'Primary Button Text', type: 'string'}),
    defineField({name: 'primaryActionLink', title: 'Primary Button Link', type: 'string'}),
    defineField({name: 'secondaryAction', title: 'Secondary Button Text', type: 'string'}),
    defineField({name: 'secondaryActionLink', title: 'Secondary Button Link', type: 'string'}),
    defineField({
      name: 'featuredImages',
      title: 'Hero Featured Images',
      type: 'array',
      description: 'Images shown in the animated hero collage.',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [hiddenImageAlt],
        },
      ],
    }),
    defineField({
      name: 'marqueeItems',
      title: 'Moving Service Links',
      type: 'array',
      description: 'Words in the moving strip. Each can link to a portfolio category or page.',
      of: [
        defineField({
          name: 'marqueeItem',
          title: 'Service Link',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Text', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'link', title: 'Link', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({name: 'aboutKicker', title: 'About Eyebrow Text', type: 'string'}),
    defineField({name: 'aboutTitle', title: 'About Title', type: 'string'}),
    defineField({name: 'aboutText', title: 'About Text', type: 'text', rows: 5}),
    defineField({
      name: 'aboutImage',
      title: 'About Image',
      type: 'image',
      options: {hotspot: true},
      fields: [hiddenImageAlt],
    }),
    defineField({name: 'contactLabel', title: 'Contact Links Label', type: 'string'}),
    defineField({name: 'portfolioKicker', title: 'Portfolio Eyebrow Text', type: 'string'}),
    defineField({name: 'portfolioTitle', title: 'Portfolio Section Title', type: 'text', rows: 2}),
    defineField({name: 'portfolioLinkLabel', title: 'Portfolio Link Text', type: 'string'}),
    defineField({name: 'consultationKicker', title: 'Bottom Consultation Eyebrow Text', type: 'string'}),
    defineField({name: 'consultationTitle', title: 'Bottom Consultation Title', type: 'string'}),
    defineField({name: 'consultationText', title: 'Bottom Consultation Text', type: 'text', rows: 3}),
  ],
  preview: {
    prepare: () => ({title: 'Home Page'}),
  },
})
