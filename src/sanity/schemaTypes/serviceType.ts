import {defineField, defineType} from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Service Description',
      type: 'text',
      validation: Rule => Rule.required().min(10).max(200)
    }),
    defineField({
      name: 'icon',
      title: 'Icon Type',
      type: 'string',
      options: {
        list: [
          {title: 'Website Development', value: 'website'},
          {title: 'Marketing', value: 'marketing'},
          {title: 'AI & Automation', value: 'ai'},
          {title: 'Cloud & IT', value: 'cloud'},
          {title: 'Analytics', value: 'analytics'},
          {title: 'Support', value: 'support'},
          {title: 'Custom', value: 'custom'}
        ]
      },
      initialValue: 'website'
    }),
    defineField({
      name: 'price',
      title: 'Starting Price',
      type: 'string',
      description: 'e.g., "Starting at $2,500" or "Contact for pricing"'
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of key features or benefits'
    }),
    defineField({
      name: 'ctaText',
      title: 'Call-to-Action Text',
      type: 'string',
      initialValue: 'Learn More'
    }),
    defineField({
      name: 'ctaLink',
      title: 'Call-to-Action Link',
      type: 'string',
      description: 'URL or anchor link (e.g., #contact)'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Service',
      type: 'boolean',
      description: 'Highlight this service',
      initialValue: false
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 1
    }),
    defineField({
      name: 'active',
      title: 'Active Service',
      type: 'boolean',
      description: 'Show this service on the website',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
      media: 'icon'
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle || 'No pricing set'
      }
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'}
      ]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    }
  ]
})
