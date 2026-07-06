import {defineField, defineType} from 'sanity'

const hiddenImageAlt = defineField({
  name: 'alt',
  title: 'Alt Text',
  type: 'string',
  hidden: true,
})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      hidden: true,
    }),
    defineField({name: 'phone', title: 'Phone Number', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'instagram', title: 'Instagram URL', type: 'url'}),
    defineField({
      name: 'headerLogo',
      title: 'Header Logo',
      type: 'image',
      options: {hotspot: false},
      fields: [hiddenImageAlt],
    }),
    defineField({
      name: 'footerLogo',
      title: 'Footer Logo',
      type: 'image',
      options: {hotspot: false},
      fields: [hiddenImageAlt],
    }),
    defineField({
      name: 'menuLogo',
      title: 'Hamburger Menu Logo',
      type: 'image',
      description: 'Current logo shown at the top of the mobile hamburger menu.',
      options: {hotspot: false},
      fields: [hiddenImageAlt],
    }),
    defineField({
      name: 'socialPreviewImage',
      title: 'Social Preview Image',
      type: 'image',
      options: {hotspot: false},
      fields: [hiddenImageAlt],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
