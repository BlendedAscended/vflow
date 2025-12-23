
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
// Fallback to .env if .env.local doesn't exist or misses keys
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define data locally so this script is standalone
const verbaflowServices = [
    {
        id: "website-development",
        name: "Website Development",
        description: "Custom high-performance websites, landing pages, and web applications built with Next.js and React.",
        price_range: "$3,000 - $15,000"
    },
    {
        id: "digital-marketing",
        name: "Digital Marketing",
        description: "SEO, PPC (Google Ads), and Social Media Marketing strategies to drive traffic and generate leads.",
        price_range: "$1,500 - $8,000/mo"
    },
    {
        id: "ai-automation",
        name: "AI Automation",
        description: "Custom AI chatbots, workflow automation (Zapier/Make), and internal tool development to save time.",
        price_range: "$2,000 - $10,000"
    },
    {
        id: "cloud-solutions",
        name: "Cloud Solutions",
        description: "Secure cloud infrastructure setup, migration, and management on AWS/GCP/Azure.",
        price_range: "$1,000 - $5,000/mo"
    },
    {
        id: "trade-services",
        name: "Trade & Home Services",
        description: "Access to a vetted network of 500+ specialized trade businesses in Virginia, DC, and Maryland (Bathroom, Kitchen, HVAC, Plumbing, etc.).",
        price_range: "Market Price"
    }
];

const industryContext = {
    retail: "Focus on E-commerce conversion, cart abandonment, and customer LTV.",
    service: "Focus on local SEO, lead generation, and automated booking.",
    healthcare: "Focus on patient trust, HIPAA compliance, and appointment scheduling.",
    tech: "Focus on product-market fit, user onboarding, and scalable infrastructure.",
    realestate: "Focus on personal branding, lead nurturing, and virtual tours.",
    other: "Focus on digital presence, operational efficiency, and customer acquisition."
};

async function seed() {
    console.log('🌱 Starting seed...');

    // 1. Seed Services
    console.log('Migrating Services...');
    for (const service of verbaflowServices) {
        const { error } = await supabase
            .from('services')
            .upsert({
                id: service.id,
                name: service.name,
                description: service.description,
                price_range: service.price_range
            });

        if (error) console.error(`Error inserting service ${service.id}:`, error.message);
        else console.log(`✓ Inserted/Updated: ${service.name}`);
    }

    // 2. Seed Industry Contexts
    console.log('\nMigrating Industry Contexts...');
    for (const [key, focusArea] of Object.entries(industryContext)) {
        const { error } = await supabase
            .from('industry_contexts')
            .upsert({
                industry_key: key,
                focus_area: focusArea
            });

        if (error) console.error(`Error inserting industry ${key}:`, error.message);
        else console.log(`✓ Inserted/Updated: ${key}`);
    }

    console.log('\n✨ Database seeding completed!');
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
