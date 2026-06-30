import {defineField} from 'sanity'

export const externalLinkField = defineField({
  name: 'externalLink',
  title: 'External Link',
  type: 'url',
})

export const imageWithAlt = defineField({
  name: 'image',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Short description for accessibility and SEO.',
      hidden: true,
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
})
