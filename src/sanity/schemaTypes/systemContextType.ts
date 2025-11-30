import { defineField, defineType } from 'sanity'

export const systemContextType = defineType({
    name: 'systemContext',
    title: 'System Context',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'context',
            title: 'Context / Instructions',
            type: 'text',
            description: 'Global instructions for the chatbot to learn from.',
        }),
        defineField({
            name: 'active',
            title: 'Active',
            type: 'boolean',
            initialValue: true,
        }),
    ],
})
