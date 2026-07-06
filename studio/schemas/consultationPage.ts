import {defineField, defineType} from 'sanity'

export const consultationPage = defineType({
  name: 'consultationPage',
  title: 'Consultation Page',
  type: 'document',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow Text', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Intro Text', type: 'text', rows: 4}),
    defineField({name: 'formTitle', title: 'Form Title', type: 'string'}),
    defineField({
      name: 'formspreeEndpoint',
      title: 'Formspree Endpoint',
      type: 'url',
      description: 'Paste the Formspree form endpoint here when ready.',
    }),
    defineField({name: 'nameLabel', title: 'Name Field Label', type: 'string'}),
    defineField({name: 'contactLabel', title: 'Contact Field Label', type: 'string'}),
    defineField({name: 'projectTypeLabel', title: 'Project Type Field Label', type: 'string'}),
    defineField({
      name: 'projectTypeOptions',
      title: 'Project Type Options',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'list'},
    }),
    defineField({name: 'messageLabel', title: 'Message Field Label', type: 'string'}),
    defineField({name: 'messagePlaceholder', title: 'Message Placeholder Text', type: 'text', rows: 2}),
    defineField({name: 'submitButtonLabel', title: 'Submit Button Text', type: 'string'}),
  ],
  preview: {
    prepare: () => ({title: 'Consultation Page'}),
  },
})
