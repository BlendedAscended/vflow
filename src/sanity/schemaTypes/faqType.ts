import {defineField, defineType} from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: Rule => Rule.required().min(10).max(200)
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: Rule => Rule.required().min(20).max(1000)
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'General', value: 'general'},
          {title: 'Services', value: 'services'},
          {title: 'Pricing', value: 'pricing'},
          {title: 'Technical', value: 'technical'},
          {title: 'Support', value: 'support'}
        ]
      },
      initialValue: 'general'
    }),
    defineField({
      name: 'featured',
      title: 'Featured FAQ',
      type: 'boolean',
      description: 'Show this FAQ prominently',
      initialValue: false
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Show this FAQ on the website',
      initialValue: true
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 1
    })
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
      active: 'active'
    },
    prepare(selection) {
      const {title, subtitle, active} = selection
      return {
        title: title,
        subtitle: `${subtitle} ${active ? '✅' : '❌'}`,
      }
    }
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'question', direction: 'asc'}
      ]
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'order', direction: 'asc'}
      ]
    }
  ]
})
