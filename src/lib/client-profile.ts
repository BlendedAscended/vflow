/**
 * Client Business Profile Extraction Utility
 *
 * Extracts a normalized client_business_profile from wizard_data + gbp_data.
 * This profile feeds the architect agent in Mode A (client-business-website).
 *
 * All extraction is deterministic — no LLM calls.
 */

export interface ClientService {
  name: string;
  description: string;
}

export interface ClientBusinessProfile {
  name: string;
  industry: string;
  subNiche: string;
  location: string;
  phone: string | null;
  rating: number | null;
  hours: string[];
  services: ClientService[];
  about: string;
  targetCustomers: string;
  uniqueSellingPoints: string[];
  // Industry-specific fields
  insuranceAccepted?: string;
  newPatientOffer?: string;
  emergencyHours?: boolean;
  financingAvailable?: boolean;
  languages?: string[];
  yearsInPractice?: number;
  photoUrls?: string[];
  // Legal
  practiceAreas?: string[];
  freeConsultation?: boolean;
  contingencyBasis?: boolean;
  barAdmissions?: string;
  // Restaurant
  cuisineType?: string;
  priceRange?: string;
  diningOptions?: string[];
  reservationLink?: string;
  dietaryOptions?: string[];
  // Home services
  serviceArea?: string;
  licensedInsured?: boolean;
  emergencyService?: boolean;
  brandsServiced?: string;
  warrantyOffered?: string;
  // Real estate
  transactionTypes?: string[];
  propertyTypes?: string[];
  mlsId?: string;
  // Auto
  autoServices?: string[];
  makesServiced?: string;
  loanerCars?: boolean;
  towingAvailable?: boolean;
}

// Mapping of industry-specific field keys to human-readable service labels
const DENTAL_SERVICE_LABELS: Record<string, string> = {
  general_dentistry: "General Dentistry — comprehensive exams, cleanings, and fillings for the whole family",
  cosmetic: "Cosmetic Dentistry — professional whitening, porcelain veneers, and complete smile makeovers",
  orthodontics: "Orthodontics — traditional braces, clear aligners, and retainers for all ages",
  implants: "Dental Implants — single tooth to full arch restoration with titanium posts",
  emergency: "Emergency Dental Care — same-day appointments for pain, trauma, and urgent needs",
  pediatric: "Pediatric Dentistry — gentle, compassionate care for children and teens",
  periodontics: "Periodontics — gum disease treatment, deep cleanings, and prevention",
  oral_surgery: "Oral Surgery — extractions, wisdom teeth removal, and implant placement",
  endodontics: "Endodontics — root canal therapy and tooth preservation",
  teeth_whitening: "Professional Teeth Whitening — in-office Zoom whitening and take-home kits",
  veneers: "Porcelain Veneers — custom-designed smile transformations",
  invisalign: "Invisalign — clear aligner orthodontic treatment without metal braces",
};

const LEGAL_SERVICE_LABELS: Record<string, string> = {
  personal_injury: "Personal Injury — car accidents, slip and fall, workplace injuries, wrongful death",
  family_law: "Family Law — divorce, child custody, support, and prenuptial agreements",
  criminal_defense: "Criminal Defense — DUI, drug charges, white collar, and violent crimes",
  business_law: "Business Law — formation, contracts, disputes, mergers and acquisitions",
  estate_planning: "Estate Planning — wills, trusts, powers of attorney, and probate",
  immigration: "Immigration Law — visas, green cards, citizenship, and deportation defense",
  real_estate_law: "Real Estate Law — transactions, disputes, landlord-tenant, and zoning",
  employment: "Employment Law — discrimination, wrongful termination, wage disputes, and contracts",
  bankruptcy: "Bankruptcy — Chapter 7 and Chapter 13 filings, debt relief",
  intellectual_property: "Intellectual Property — patents, trademarks, copyrights, and trade secrets",
};

const RESTAURANT_SERVICE_LABELS: Record<string, string> = {
  dine_in: "Dine-In — full-service restaurant experience with attentive table service",
  takeout: "Takeout — order ahead and pick up at your convenience",
  delivery: "Delivery — enjoy our food from the comfort of your home",
  catering: "Catering — full-service catering for events, corporate lunches, and celebrations",
  private_events: "Private Events — reserve our space for parties, receptions, and gatherings",
};

const SALON_SERVICE_LABELS: Record<string, string> = {
  haircut: "Haircut & Styling — precision cuts, blowouts, and styling for all hair types",
  color: "Hair Color — balayage, highlights, single-process, and creative color",
  extensions: "Hair Extensions — tape-in, hand-tied, and fusion extensions",
  nails: "Nail Services — manicures, pedicures, gel, and nail art",
  facials: "Facials — deep cleansing, anti-aging, and hydrating treatments",
  waxing: "Waxing — full body, facial, and Brazilian waxing",
  massage: "Massage Therapy — Swedish, deep tissue, sports, and hot stone",
  makeup: "Makeup Artistry — bridal, special event, and everyday looks",
  bridal: "Bridal Package — hair, makeup, and trials for the wedding party",
};

const HOME_SERVICES_LABELS: Record<string, string> = {
  hvac: "HVAC — heating, ventilation, and air conditioning installation and repair",
  plumbing: "Plumbing — drain cleaning, pipe repair, water heaters, and fixture installation",
  electrical: "Electrical — panel upgrades, wiring, lighting, and emergency repairs",
  roofing: "Roofing — repairs, replacement, inspections, and storm damage",
  landscaping: "Landscaping — design, lawn maintenance, hardscaping, and irrigation",
  pest_control: "Pest Control — insects, rodents, termites, and wildlife removal",
  cleaning: "Cleaning Services — residential, commercial, deep clean, and move out",
  handyman: "Handyman Services — drywall, painting, carpentry, and general repairs",
  painting: "Painting — interior, exterior, cabinets, and commercial",
  moving: "Moving Services — local, long-distance, packing, and storage",
};

const HEALTHCARE_SERVICE_LABELS: Record<string, string> = {
  primary_care: "Primary Care — annual physicals, preventive care, and chronic condition management",
  cardiology: "Cardiology — heart health, EKG, stress tests, and cholesterol management",
  dermatology: "Dermatology — skin exams, acne treatment, mole removal, and cosmetic procedures",
  orthopedics: "Orthopedics — joint pain, sports injuries, fractures, and surgery",
  pediatrics: "Pediatrics — well-child visits, immunizations, and developmental care",
  ob_gyn: "OB/GYN — prenatal care, annual exams, family planning, and menopause care",
  neurology: "Neurology — headaches, seizures, neuropathy, and movement disorders",
  psychiatry: "Psychiatry — medication management, therapy, and mental health care",
};

const REAL_ESTATE_LABELS: Record<string, string> = {
  buy: "Buyer Representation — find your perfect home with expert guidance",
  sell: "Seller Representation — strategic pricing, marketing, and negotiation",
  rent: "Rental Services — apartment and home rentals, tenant placement",
  commercial: "Commercial Real Estate — office, retail, industrial, and investment properties",
  property_management: "Property Management — tenant screening, maintenance, and rent collection",
};

const AUTO_SERVICE_LABELS: Record<string, string> = {
  repair: "Auto Repair — engine, transmission, suspension, and diagnostics",
  body_work: "Collision & Body Work — dent repair, painting, and frame straightening",
  detailing: "Detailing — full interior and exterior cleaning, waxing, and ceramic coating",
  oil_change: "Oil Change — conventional, synthetic blend, and full synthetic",
  tires: "Tires — sales, mounting, balancing, rotation, and alignment",
  brakes: "Brake Service — pad replacement, rotor resurfacing, and fluid flush",
  ac: "A/C Service — inspection, recharge, and compressor replacement",
  transmission: "Transmission — fluid service, repair, and replacement",
  diagnostics: "Diagnostics — check engine light, electrical, and computer scanning",
};

/**
 * Build a professional "About" text from available data.
 */
function buildAboutText(
  wizardData: Record<string, any>,
  gbpData: Record<string, any> | null,
  profile: Partial<ClientBusinessProfile>
): string {
  const name = profile.name || "Our business";
  const location = profile.location || "the area";
  const years = profile.yearsInPractice;
  const industry = profile.industry || "";

  let about = "";

  if (years) {
    about = `${name} has served ${location} for over ${years} years. `;
  } else {
    about = `${name} proudly serves ${location} and the surrounding communities. `;
  }

  if (profile.languages && profile.languages.length > 0) {
    about += `Our team speaks ${profile.languages.join(", ")}. `;
  }

  if (gbpData?.editorialSummary) {
    about += gbpData.editorialSummary;
  } else {
    about += `We are committed to providing exceptional ${industry} services with personalized care and attention to every client.`;
  }

  return about.trim();
}

/**
 * Infer target customer description from industry and sub-niche.
 */
function inferTargetCustomers(
  industry: string,
  subNiche: string | null,
  wizardData: Record<string, any>
): string {
  const location = wizardData.location || "the area";

  switch (industry) {
    case "dental":
      if (subNiche?.includes("pediatric")) return `parents and families seeking children's dental care in ${location}`;
      if (subNiche?.includes("ortho")) return `teens and adults seeking orthodontic treatment in ${location}`;
      return `families and professionals seeking comprehensive dental care in ${location}`;

    case "legal":
      if (subNiche?.includes("personal_injury")) return `individuals injured in accidents seeking compensation in ${location}`;
      if (subNiche?.includes("business")) return `businesses and entrepreneurs seeking legal counsel in ${location}`;
      return `individuals and businesses seeking legal representation in ${location}`;

    case "restaurant":
      return `food enthusiasts and diners in ${location}`;

    case "salon_beauty":
      return `clients seeking professional beauty and wellness services in ${location}`;

    case "home_services":
      return `homeowners and property managers in ${wizardData.serviceArea || location}`;

    case "health_medical":
      return `patients seeking quality medical care in ${location}`;

    case "real_estate":
      return `home buyers, sellers, and investors in ${location}`;

    case "auto_services":
      return `vehicle owners seeking reliable auto care in ${location}`;

    default:
      return `customers seeking ${industry} services in ${location}`;
  }
}

/**
 * Extract unique selling points from client data.
 */
function extractUSPs(profile: Partial<ClientBusinessProfile>, wizardData: Record<string, any>): string[] {
  const usps: string[] = [];

  if (profile.emergencyHours || profile.emergencyService) {
    usps.push("Same-day and emergency appointments available");
  }
  if (profile.freeConsultation) {
    usps.push("Free consultation — no obligation");
  }
  if (profile.rating && profile.rating >= 4.5) {
    usps.push(`Top-rated — ${profile.rating} stars from our clients`);
  }
  if (profile.yearsInPractice && profile.yearsInPractice >= 15) {
    usps.push(`Over ${profile.yearsInPractice} years of experience`);
  }
  if (profile.licensedInsured) {
    usps.push("Licensed, insured, and bonded");
  }
  if (profile.loanerCars) {
    usps.push("Complimentary loaner vehicles available");
  }
  if (profile.contingencyBasis) {
    usps.push("No fee unless we win your case");
  }
  if (profile.languages && profile.languages.length > 1) {
    usps.push(`Multilingual team — we speak ${profile.languages.join(", ")}`);
  }
  if (profile.newPatientOffer) {
    usps.push(profile.newPatientOffer);
  }
  if (profile.warrantyOffered) {
    usps.push(`${profile.warrantyOffered} warranty on all work`);
  }

  // Fallback if no USPs extracted
  if (usps.length === 0) {
    usps.push(`Professional ${profile.industry || ""} services in ${profile.location || "your area"}`);
    usps.push("Quality service and customer satisfaction guaranteed");
  }

  return usps;
}

/**
 * Resolve services from industry-specific questionnaire fields.
 */
function resolveServices(
  profile: Partial<ClientBusinessProfile>,
  wizardData: Record<string, any>
): ClientService[] {
  const industry = profile.industry || "";
  const services: ClientService[] = [];

  const serviceFields: Record<string, string[]> = {
    dental: ["dentalServices"],
    legal: ["practiceAreas"],
    restaurant: ["diningOptions"],
    salon_beauty: ["salonServices"],
    home_services: ["homeServices"],
    health_medical: ["specialties"],
    real_estate: ["transactionTypes"],
    auto_services: ["autoServices"],
  };

  const labelMaps: Record<string, Record<string, string>> = {
    dental: DENTAL_SERVICE_LABELS,
    legal: LEGAL_SERVICE_LABELS,
    restaurant: RESTAURANT_SERVICE_LABELS,
    salon_beauty: SALON_SERVICE_LABELS,
    home_services: HOME_SERVICES_LABELS,
    health_medical: HEALTHCARE_SERVICE_LABELS,
    real_estate: REAL_ESTATE_LABELS,
    auto_services: AUTO_SERVICE_LABELS,
  };

  const fields = serviceFields[industry];
  const labels = labelMaps[industry];

  if (!fields || !labels) {
    // Generic fallback for unlisted industries
    if (wizardData.services && Array.isArray(wizardData.services)) {
      return wizardData.services.map((s: string) => ({
        name: s,
        description: s,
      }));
    }
    return [
      { name: "Professional Services", description: `Professional ${industry} services in ${profile.location}` },
    ];
  }

  for (const field of fields) {
    const values: string[] = wizardData[field] || [];
    for (const val of values) {
      const key = val.toLowerCase().replace(/\s+/g, "_");
      const label = labels[key] || labels[val] || val;
      services.push({
        name: label.split(" — ")[0],
        description: label,
      });
    }
  }

  return services;
}

/**
 * Main extraction function.
 *
 * @param wizardData - Raw wizard answers from GrowthPlanWizard
 * @param gbpData - Google Business Profile data (optional)
 * @returns Normalized ClientBusinessProfile
 */
export function extractClientBusinessProfile(
  wizardData: Record<string, any>,
  gbpData: Record<string, any> | null
): ClientBusinessProfile {
  const industry = wizardData.industry || "";
  const subNiche = wizardData.subNiches?.[0] || null;
  const location =
    gbpData?.address ||
    wizardData.location ||
    gbpData?.formattedAddress ||
    wizardData.gbpAddress ||
    "United States";

  const profile: Partial<ClientBusinessProfile> = {
    name: wizardData.name || gbpData?.name || "Your Business",
    industry,
    subNiche: subNiche || "",
    location,
    phone: wizardData.phone || gbpData?.nationalPhoneNumber || null,
    rating: gbpData?.rating || null,
    hours: gbpData?.regularOpeningHours?.weekdayDescriptions || [],
    photoUrls: gbpData?.photos?.map((p: any) => p.name) || [],
    // Industry-specific fields — carry through from wizard
    insuranceAccepted: wizardData.insuranceAccepted,
    newPatientOffer: wizardData.newPatientOffer,
    emergencyHours: wizardData.emergencyHours || wizardData.emergencyService,
    financingAvailable: wizardData.financingAvailable,
    languages: wizardData.languages,
    yearsInPractice: wizardData.yearsInPractice,
    practiceAreas: wizardData.practiceAreas,
    freeConsultation: wizardData.freeConsultation,
    contingencyBasis: wizardData.contingencyBasis,
    barAdmissions: wizardData.barAdmissions,
    cuisineType: wizardData.cuisineType,
    priceRange: wizardData.priceRange,
    diningOptions: wizardData.diningOptions,
    reservationLink: wizardData.reservationLink,
    dietaryOptions: wizardData.dietaryOptions,
    serviceArea: wizardData.serviceArea,
    licensedInsured: wizardData.licensedInsured,
    emergencyService: wizardData.emergencyService,
    brandsServiced: wizardData.brandsServiced,
    warrantyOffered: wizardData.warrantyOffered,
    transactionTypes: wizardData.transactionTypes,
    propertyTypes: wizardData.propertyTypes,
    mlsId: wizardData.mlsId,
    autoServices: wizardData.autoServices,
    makesServiced: wizardData.makesServiced,
    loanerCars: wizardData.loanerCars,
    towingAvailable: wizardData.towingAvailable,
  };

  // Build computed fields
  profile.services = resolveServices(profile, wizardData);
  profile.targetCustomers = inferTargetCustomers(industry, subNiche, wizardData);
  profile.uniqueSellingPoints = extractUSPs(profile, wizardData);
  profile.about = buildAboutText(wizardData, gbpData, profile);

  return profile as ClientBusinessProfile;
}

/**
 * Quick check: does this wizard data qualify for Mode A (client website)?
 * Mode A qualification: industry is recognized AND wizard is for web-design intent.
 * For now, any completed wizard with industry selected qualifies.
 */
export function qualifiesForModeA(wizardData: Record<string, any>): boolean {
  return !!(wizardData.industry && wizardData.email);
}
