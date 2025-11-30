import { defineField, defineType } from 'sanity'

export const chatLogType = defineType({
    name: 'chatLog',
    title: 'Chat Log',
    type: 'document',
    fields: [
        defineField({
            name: 'sessionId',
            title: 'Session ID',
            type: 'string',
        }),
        defineField({
            name: 'messages',
            title: 'Messages',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'role', type: 'string', title: 'Role' },
                        { name: 'content', type: 'text', title: 'Content' },
                        { name: 'timestamp', type: 'datetime', title: 'Timestamp' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'sessionId',
            subtitle: 'createdAt',
        },
    },
})
