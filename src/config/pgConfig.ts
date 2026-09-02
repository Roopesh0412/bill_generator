/**
 * PG Details Configuration
 * 
 * Edit your PG details here. These permanent values are automatically
 * displayed on every generated payment receipt and PDF.
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
}

export const DEFAULT_PG_CONFIG: PGConfig = {
  // PG Name as shown on the board/banner
  pgName: "SRI GURU KOTTURESHWARA GENTS PG",

  // PG Address lines
  addressLines: [
    "Door No. 2974/10, Opp. Hotel Shoven PB,",
    "Near Rashmi Hostel, Ragavendra Badavane,",
    "Davangere - 577006, Karnataka, India"
  ],

  // Proprietor Details
  proprietorName: "Proprietor",
  proprietorPhone: "+91 98765 43210", // Update with your mobile number

  // Optional Contact Details
  email: "",
  gstin: "",

  // Logo path (Sri Guru Kottureshwara photo placed in public/assets/logo.png)
  logoUrl: "/assets/logo.png",

  // Currency symbol
  currencySymbol: "₹"
};

// Storage key for local config overrides if updated via app settings
const CONFIG_STORAGE_KEY = "pg_bill_config";

export function getPGConfig(): PGConfig {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_PG_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to load custom PG config from localStorage", e);
  }
  return DEFAULT_PG_CONFIG;
}

export function savePGConfig(config: Partial<PGConfig>): PGConfig {
  const updated = { ...getPGConfig(), ...config };
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save PG config to localStorage", e);
  }
  return updated;
}
