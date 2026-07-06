import {defineField, defineType} from 'sanity'

export const portfolioPage = defineType({
  name: 'portfolioPage',
  title: 'Portfolio Page',
  type: 'document',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow Text', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'text', rows: 2, validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Intro Text', type: 'text', rows: 3}),
    defineField({
      name: 'categoryOrder',
      title: 'Portfolio Category Order',
      type: 'array',
      description: 'Drag categories to change the order on the Home page and Portfolio page. Add a category here after creating it.',
      of: [{type: 'reference', to: [{type: 'portfolioCategory'}]}],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Portfolio Page'}),
  },
})
