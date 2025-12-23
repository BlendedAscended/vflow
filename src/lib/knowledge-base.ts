
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

export async function getServices(): Promise<Service[]> {
    const { data, error } = await supabase
        .from('services')
        .select('*');

    if (error) {
        console.error('Error fetching services:', error);
        return [];
    }
    return data as Service[];
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
        data.forEach((item: any) => {
            contextMap[item.industry_key] = item.focus_area;
        });
    }
    return contextMap;
}
