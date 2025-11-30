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
            name: 'source',
            title: 'Source',
            type: 'string',
            initialValue: 'Contact Form',
            options: {
                list: [
                    { title: 'Contact Form', value: 'Contact Form' },
                    { title: 'Growth Plan', value: 'Growth Plan' },
                ],
            },
        }),
        // Growth Plan Specific Fields
        defineField({
            name: 'industry',
            type: 'string',
            hidden: ({ document }) => document?.source !== 'Growth Plan',
        }),
        defineField({
            name: 'stage',
            type: 'string',
            hidden: ({ document }) => document?.source !== 'Growth Plan',
        }),
        defineField({
            name: 'challenges',
            type: 'array',
            of: [{ type: 'string' }],
            hidden: ({ document }) => document?.source !== 'Growth Plan',
        }),
        defineField({
            name: 'goals',
            type: 'array',
            of: [{ type: 'string' }],
            hidden: ({ document }) => document?.source !== 'Growth Plan',
        }),
        defineField({
            name: 'teamSize',
            type: 'string',
            hidden: ({ document }) => document?.source !== 'Growth Plan',
        }),
        defineField({
            name: 'budget',
            type: 'string',
            hidden: ({ document }) => document?.source !== 'Growth Plan',
        }),
        defineField({
            name: 'timeline',
            type: 'string',
            hidden: ({ document }) => document?.source !== 'Growth Plan',
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
        defineField({
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'email',
        },
    },
})
