
import { supabase } from './supabase';

export interface Service {
    id: string;
    name: string;
    description: string;
    price_range: string;
}

export interface IndustryContext {
    industry_key: string;
    focus_area: string;
}

// Keep these for type reference or fallback if needed, 
// but in a real app we might remove them to avoid duplication.
// For now, I'll comment them out to force usage of the DB.
/*
export const verbaflowServices = [ ... ];
export const industryContext = { ... };
*/

import { client } from '../sanity/lib/client';

export async function getServices(): Promise<Service[]> {
    try {
        const data = await client.fetch(`*[_type == "service" && active == true]{
            _id,
            title,
            description,
            price
        }`);
        return data.map((s: any) => ({
            id: s._id,
            name: s.title,
            description: s.description,
            price_range: s.price || 'Contact for pricing'
        }));
    } catch (error) {
        console.error('Error fetching services from Sanity:', error);
        return [];
    }
}

export async function getIndustryContext(): Promise<Record<string, string>> {
    const { data, error } = await supabase
        .from('industry_contexts')
        .select('*');

    if (error) {
        console.error('Error fetching industry contexts:', error);
        return {};
    }

    // Convert back to the object format expected by the app { key: value }
    const contextMap: Record<string, string> = {};
    if (data) {
        data.forEach((item: IndustryContext) => {
            contextMap[item.industry_key] = item.focus_area;
        });
    }
    return contextMap;
}
