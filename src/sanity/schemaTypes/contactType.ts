import { defineField, defineType } from 'sanity'

export const contactType = defineType({
    name: 'contact',
    title: 'Contact Submissions',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            type: 'string',
        }),
        defineField({
            name: 'email',
            type: 'string',
        }),
        defineField({
            name: 'subject',
            type: 'string',
        }),
        defineField({
            name: 'message',
            type: 'text',
        }),
        defineField({
            name: 'status',
            type: 'string',
            options: {
                list: [
                    { title: 'New', value: 'new' },
                    { title: 'Read', value: 'read' },
                    { title: 'Replied', value: 'replied' },
                ],
                layout: 'radio',
            },
            initialValue: 'new',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'email',
        },
    },
})
