import {defineField, defineType} from 'sanity'

export const portfolioPage = defineType({
  name: 'portfolioPage',
  title: 'Portfolio Page',
  type: 'document',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow Text', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'text', rows: 2, validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Intro Text', type: 'text', rows: 3}),
  ],
  preview: {
    prepare: () => ({title: 'Portfolio Page'}),
  },
})
