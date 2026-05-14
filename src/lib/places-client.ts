const PLACES_API_BASE = "https://places.googleapis.com/v1/places";
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

function getHeaders(fieldMask: string) {
  return {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY || "",
    "X-Goog-FieldMask": fieldMask,
  };
}

export interface PlaceSuggestion {
  placeId: string;
  text: string;
  structuredFormat?: {
    mainText: string;
    secondaryText: string;
  };
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  types: string[];
  primaryType: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  phoneNumber?: string;
  websiteUri?: string;
  photos?: { name: string; widthPx: number; heightPx: number }[];
  regularOpeningHours?: {
    weekdayDescriptions: string[];
    openNow?: boolean;
  };
}

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  if (!API_KEY) {
    throw new Error("GOOGLE_PLACES_API_KEY not configured");
  }

  const res = await fetch(`${PLACES_API_BASE}:autocomplete`, {
    method: "POST",
    headers: getHeaders("suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat"),
    body: JSON.stringify({
      input: query,
      languageCode: "en",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Places autocomplete error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const suggestions = data.suggestions || [];

  return suggestions
    .filter((s: any) => s.placePrediction)
    .map((s: any) => ({
      placeId: s.placePrediction.placeId,
      text: s.placePrediction.text?.text || "",
      structuredFormat: s.placePrediction.structuredFormat
        ? {
            mainText: s.placePrediction.structuredFormat.mainText?.text || "",
            secondaryText: s.placePrediction.structuredFormat.secondaryText?.text || "",
          }
        : undefined,
    }))
    .slice(0, 5);
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  if (!API_KEY) {
    throw new Error("GOOGLE_PLACES_API_KEY not configured");
  }

  const fieldMask = [
    "id",
    "displayName",
    "formattedAddress",
    "types",
    "primaryType",
    "rating",
    "userRatingCount",
    "priceLevel",
    "nationalPhoneNumber",
    "websiteUri",
    "photos",
    "regularOpeningHours",
  ].join(",");

  const res = await fetch(`${PLACES_API_BASE}/${placeId}`, {
    method: "GET",
    headers: getHeaders(fieldMask),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Places details error: ${res.status} ${text}`);
  }

  const data = await res.json();

  return {
    placeId: data.id || placeId,
    name: data.displayName?.text || "",
    address: data.formattedAddress || "",
    types: data.types || [],
    primaryType: data.primaryType || "",
    rating: data.rating,
    userRatingCount: data.userRatingCount,
    priceLevel: data.priceLevel,
    phoneNumber: data.nationalPhoneNumber,
    websiteUri: data.websiteUri,
    photos: (data.photos || []).map((p: any) => ({
      name: p.name,
      widthPx: p.widthPx,
      heightPx: p.heightPx,
    })),
    regularOpeningHours: data.regularOpeningHours
      ? {
          weekdayDescriptions: data.regularOpeningHours.weekdayDescriptions || [],
          openNow: data.regularOpeningHours.openNow,
        }
      : undefined,
  };
}

export function getPhotoUrl(photoName: string, maxWidthPx = 800): string {
  if (!API_KEY) return "";
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}`;
}
