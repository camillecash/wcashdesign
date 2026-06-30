import {defineField, defineType} from 'sanity'

const hiddenImageAlt = defineField({
  name: 'alt',
  title: 'Alt Text',
  type: 'string',
  hidden: true,
})

export const portfolioCategory = defineType({
  name: 'portfolioCategory',
  title: 'Portfolio Category',
  type: 'document',
  orderings: [
    {
      title: 'Manual order',
      name: 'manualOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'shortTitle', title: 'Short Title', type: 'string'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      hidden: true,
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      description: 'This is the image used on the portfolio overview card. Change it without changing the full gallery.',
      fields: [hiddenImageAlt],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      description: 'Drag images to reorder. Add or delete images as needed. The website keeps the layout polished automatically.',
      of: [
        {
          title: 'Gallery Image',
          type: 'image',
          fields: [
            hiddenImageAlt,
            defineField({name: 'caption', title: 'Caption', type: 'string'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      hidden: true,
    }),
    defineField({
      name: 'hidden',
      title: 'Hide this category',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'previewImage',
    },
  },
})
