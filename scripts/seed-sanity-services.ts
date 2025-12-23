import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-20'
const token = process.env.SANITY_API_TOKEN // Needed for writes

if (!projectId || !dataset || !token) {
    console.error('Missing required environment variables. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN are set.')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
})

const services = [
    {
        title: "Website & app development",
        description: "Develop the central hub for your customer universe. A seamless website or app experience that forms the core of your brand's digital anatomy.",
        icon: "website",
        slug: "website-development",
        features: ["Custom Web Design", "Mobile App Development", "UI/UX Design", "Performance Optimization"]
    },
    {
        title: "Marketing & social campaigns",
        description: "Execute targeted marketing campaigns designed for maximum impact. We turn digital noise into measurable signals for business growth.",
        icon: "marketing",
        slug: "digital-marketing",
        features: ["Social Media Strategy", "PPC Advertising", "Content Marketing", "Email Campaigns"]
    },
    {
        title: "AI Assistants & Automation",
        description: "Deploy an intelligent, autonomous workforce. AI Assistants and automated workflows that handle routine tasks 24/7, freeing you to lead and innovate.",
        icon: "ai",
        slug: "ai-automation",
        features: ["Chatbot Integration", "Workflow Automation", "Data Processing", "Personalized Customer Support"]
    },
    {
        title: "Cloud, IT & Compliance",
        description: "Build the unbreachable foundation for your growth. A secure, compliant cloud architecture that ensures your entire digital ecosystem is stable, protected, and poised for scale.",
        icon: "cloud",
        slug: "cloud-solutions",
        features: ["Cloud Migration", "Cybersecurity Audit", "Compliance Management", "Infrastructure Scaling"]
    }
]

async function seedServices() {
    console.log('Seeding services...')

    for (const service of services) {
        const slug = service.slug

        // check if exists
        const existing = await client.fetch(`*[_type == "service" && slug.current == $slug][0]`, { slug })

        if (existing) {
            console.log(`Service already exists: ${service.title}`)
            continue
        }

        const doc = {
            _type: 'service',
            title: service.title,
            description: service.description,
            icon: service.icon,
            slug: { _type: 'slug', current: slug },
            features: service.features,
            active: true,
            price: 'Contact for pricing',
            showInNavigation: true,
            showInServicesSection: true,
            order: 1
        }

        try {
            await client.create(doc)
            console.log(`Created service: ${service.title}`)
        } catch (err) {
            console.error(`Failed to create service: ${service.title}`, err)
        }
    }

    console.log('Done.')
}

seedServices()
