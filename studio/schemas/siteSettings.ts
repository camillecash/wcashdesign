import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'siteTitle', title: 'Site Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'siteDescription', title: 'Site Description', type: 'text', rows: 3}),
    defineField({name: 'phone', title: 'Phone Number', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'instagram', title: 'Instagram URL', type: 'url'}),
    defineField({
      name: 'headerLogo',
      title: 'Header Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    defineField({
      name: 'footerLogo',
      title: 'Footer Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    defineField({
      name: 'socialPreviewImage',
      title: 'Social Preview Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
