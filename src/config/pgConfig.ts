/**
 * PG Details Configuration
 * 
 * Default permanent details for Sri Guru Kottureshwara Gents PG.
 * Users opening the link can also customize or edit any of these
 * directly in the browser via the "Edit Details" settings.
 */
export interface PGConfig {
  pgName: string;
  addressLines: string[];
  proprietorName: string;
  proprietorPhone: string;
  email?: string;
  gstin?: string;
  logoUrl: string;
  currencySymbol: string;
  receiptTitle: string;
  seal: {
    title: string;
    road: string;
    cityPin: string;
    mob: string;
    customImageUrl?: string;
  };
}

export const DEFAULT_PG_CONFIG: PGConfig = {
  // PG Name
  pgName: "SRI GURU KOTTURESHWARA GENTS PG",

  // PG Address lines
  addressLines: [
    "Door No. 2974/10, Opp. Hotel Shoven PB,",
    "Near Rashmi Hostel, Ragavendra Badavane,",
    "Davangere - 577006, Karnataka, India"
  ],

  // Proprietor Details (from receipt book)
  proprietorName: "Kottresh C",
  proprietorPhone: "9986231979",

  email: "",
  gstin: "",

  // Logo (centered at the top)
  logoUrl: "/assets/logo.png",

  // Currency
  currencySymbol: "₹",

  // Document Title
  receiptTitle: "RENT RECEIPT",

  // Official Seal text (from rubber stamp photo)
  seal: {
    title: "Sri Gurukottureshwara Gents PG",
    road: "Rashmi Hostel Road,",
    cityPin: "Davangere-577006",
    mob: "Mob : 9986231979",
    customImageUrl: ""
  }
};

const CONFIG_STORAGE_KEY = "pg_bill_config";

export function getPGConfig(): PGConfig {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_PG_CONFIG,
        ...parsed,
        seal: { ...DEFAULT_PG_CONFIG.seal, ...(parsed.seal || {}) }
      };
    }
  } catch (e) {
    console.error("Failed to load PG config from localStorage", e);
  }
  return DEFAULT_PG_CONFIG;
}

export function savePGConfig(config: Partial<PGConfig>): PGConfig {
  const current = getPGConfig();
  const updated: PGConfig = {
    ...current,
    ...config,
    seal: {
      ...current.seal,
      ...(config.seal || {})
    }
  };
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save PG config to localStorage", e);
  }
  return updated;
}

export function resetPGConfigToDefaults(): PGConfig {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to reset PG config", e);
  }
  return DEFAULT_PG_CONFIG;
}
