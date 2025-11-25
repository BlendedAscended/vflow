'use server'

import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../../sanity/env'

export async function submitContact(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string || 'New Contact Form Submission'
    const message = formData.get('message') as string

    if (!name || !email) {
        return { success: false, message: 'Name and email are required' }
    }

    try {
        const token = process.env.SANITY_API_TOKEN

        if (!token) {
            console.error('Missing SANITY_API_TOKEN')
            return { success: false, message: 'Configuration error: Missing API token' }
        }

        const client = createClient({
            projectId,
            dataset,
            apiVersion,
            token,
            useCdn: false,
        })

        await client.create({
            _type: 'contact',
            name,
            email,
            subject,
            message: message || 'No message provided',
            status: 'new',
            submittedAt: new Date().toISOString(),
        })

        return { success: true, message: 'Thank you! Your message has been sent.' }
    } catch (error) {
        console.error('Error submitting contact form:', error)
        return { success: false, message: 'Something went wrong. Please try again later.' }
    }
}
