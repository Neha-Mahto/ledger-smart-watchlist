export interface SymbolDefinition {
  symbol: string;
  name: string;
  sector: string;
  basePrice: number;
  prevClose: number;
  baseVolume: number;
}

export const SYMBOL_UNIVERSE: SymbolDefinition[] = [
  // --- RECENT HIGH-PROFILE IPOs & FINTECH ---
  { symbol: 'GROWW', name: 'Billionbrains Garage Ventures Ltd (Groww)', sector: 'Fintech', basePrice: 165.50, prevClose: 162.00, baseVolume: 85000 },
  { symbol: 'SWIGGY', name: 'Swiggy Limited', sector: 'Consumer Tech', basePrice: 425.80, prevClose: 418.00, baseVolume: 65000 },
  { symbol: 'ETERNAL', name: 'Eternal Limited (formerly Zomato)', sector: 'Consumer Tech', basePrice: 285.40, prevClose: 280.00, baseVolume: 95000 },
  { symbol: 'PAYTM', name: 'One97 Communications Ltd (Paytm)', sector: 'Fintech', basePrice: 840.20, prevClose: 830.00, baseVolume: 45000 },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd (Nykaa)', sector: 'Consumer Tech', basePrice: 215.60, prevClose: 212.00, baseVolume: 38000 },
  { symbol: 'POLICYBZR', name: 'PB Fintech Ltd (Policybazaar)', sector: 'Fintech', basePrice: 1720.00, prevClose: 1690.00, baseVolume: 28000 },
  { symbol: 'HYUNDAI', name: 'Hyundai Motor India Ltd', sector: 'Auto', basePrice: 1850.00, prevClose: 1840.00, baseVolume: 32000 },
  { symbol: 'JIOFIN', name: 'Jio Financial Services Ltd', sector: 'Fintech', basePrice: 345.50, prevClose: 340.00, baseVolume: 78000 },

  // --- BANKING & FINANCIAL SERVICES ---
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking', basePrice: 1640.00, prevClose: 1630.00, baseVolume: 95000 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking', basePrice: 1220.75, prevClose: 1210.00, baseVolume: 88000 },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', basePrice: 815.40, prevClose: 810.00, baseVolume: 92000 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', sector: 'Banking', basePrice: 1780.00, prevClose: 1765.00, baseVolume: 42000 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', sector: 'Banking', basePrice: 1185.00, prevClose: 1170.00, baseVolume: 58000 },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', sector: 'Banking', basePrice: 1420.00, prevClose: 1405.00, baseVolume: 35000 },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Banking', basePrice: 255.40, prevClose: 252.00, baseVolume: 64000 },
  { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Banking', basePrice: 112.50, prevClose: 110.00, baseVolume: 82000 },
  { symbol: 'FEDERALBNK', name: 'The Federal Bank Ltd', sector: 'Banking', basePrice: 195.20, prevClose: 192.00, baseVolume: 48000 },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd', sector: 'Banking', basePrice: 74.80, prevClose: 73.50, baseVolume: 89000 },
  { symbol: 'CANBK', name: 'Canara Bank', sector: 'Banking', basePrice: 108.60, prevClose: 106.50, baseVolume: 56000 },
  { symbol: 'AUBANK', name: 'AU Small Finance Bank Ltd', sector: 'Banking', basePrice: 645.00, prevClose: 638.00, baseVolume: 22000 },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd', sector: 'Banking', basePrice: 202.50, prevClose: 199.00, baseVolume: 34000 },

  // --- IT & TECHNOLOGY ---
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', sector: 'IT', basePrice: 4240.00, prevClose: 4200.00, baseVolume: 52000 },
  { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT', basePrice: 1880.50, prevClose: 1865.00, baseVolume: 74000 },
  { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'IT', basePrice: 525.20, prevClose: 520.00, baseVolume: 46000 },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', sector: 'IT', basePrice: 1760.00, prevClose: 1745.00, baseVolume: 39000 },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd', sector: 'IT', basePrice: 1580.00, prevClose: 1560.00, baseVolume: 31000 },
  { symbol: 'LTIM', name: 'LTIMindtree Ltd', sector: 'IT', basePrice: 5850.00, prevClose: 5780.00, baseVolume: 18000 },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd', sector: 'IT', basePrice: 5120.00, prevClose: 5050.00, baseVolume: 14000 },
  { symbol: 'COFORGE', name: 'Coforge Ltd', sector: 'IT', basePrice: 6850.00, prevClose: 6760.00, baseVolume: 11000 },
  { symbol: 'MPHASIS', name: 'Mphasis Ltd', sector: 'IT', basePrice: 2940.00, prevClose: 2900.00, baseVolume: 15000 },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Ltd', sector: 'IT', basePrice: 7450.00, prevClose: 7380.00, baseVolume: 9500 },

  // --- AUTOMOBILE & ANCILLARIES ---
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Auto', basePrice: 975.00, prevClose: 960.00, baseVolume: 62000 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', sector: 'Auto', basePrice: 12450.00, prevClose: 12300.00, baseVolume: 18000 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', sector: 'Auto', basePrice: 2750.00, prevClose: 2710.00, baseVolume: 38000 },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd', sector: 'Auto', basePrice: 9850.00, prevClose: 9720.00, baseVolume: 16000 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', sector: 'Auto', basePrice: 5420.00, prevClose: 5360.00, baseVolume: 14000 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd (Royal Enfield)', sector: 'Auto', basePrice: 4850.00, prevClose: 4790.00, baseVolume: 12000 },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company Ltd', sector: 'Auto', basePrice: 2480.00, prevClose: 2440.00, baseVolume: 22000 },
  { symbol: 'BHARATFORG', name: 'Bharat Forge Ltd', sector: 'Auto', basePrice: 1420.00, prevClose: 1400.00, baseVolume: 19000 },
  { symbol: 'SONACOMS', name: 'Sona BLW Precision Forgings', sector: 'Auto', basePrice: 680.00, prevClose: 670.00, baseVolume: 24000 },
  { symbol: 'MOTHERSON', name: 'Samvardhana Motherson International', sector: 'Auto', basePrice: 188.40, prevClose: 185.00, baseVolume: 54000 },

  // --- ENERGY, OIL & POWER ---
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy', basePrice: 2980.00, prevClose: 2950.00, baseVolume: 98000 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', sector: 'Energy', basePrice: 242.50, prevClose: 240.00, baseVolume: 65000 },
  { symbol: 'NTPC', name: 'NTPC Ltd', sector: 'Energy', basePrice: 395.40, prevClose: 390.00, baseVolume: 72000 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp of India Ltd', sector: 'Energy', basePrice: 328.60, prevClose: 324.00, baseVolume: 68000 },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corp Ltd', sector: 'Energy', basePrice: 348.20, prevClose: 342.00, baseVolume: 42000 },
  { symbol: 'IOC', name: 'Indian Oil Corp Ltd', sector: 'Energy', basePrice: 168.50, prevClose: 166.00, baseVolume: 51000 },
  { symbol: 'GAIL', name: 'GAIL (India) Ltd', sector: 'Energy', basePrice: 215.80, prevClose: 212.00, baseVolume: 39000 },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd', sector: 'Energy', basePrice: 435.20, prevClose: 428.00, baseVolume: 74000 },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy Ltd', sector: 'Energy', basePrice: 1780.00, prevClose: 1750.00, baseVolume: 36000 },
  { symbol: 'ADANIPOWER', name: 'Adani Power Ltd', sector: 'Energy', basePrice: 650.00, prevClose: 640.00, baseVolume: 82000 },
  { symbol: 'SUZLON', name: 'Suzlon Energy Ltd', sector: 'Energy', basePrice: 72.40, prevClose: 70.80, baseVolume: 120000 },

  // --- FMCG & RETAIL ---
  { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', basePrice: 495.00, prevClose: 490.00, baseVolume: 88000 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG', basePrice: 2780.00, prevClose: 2750.00, baseVolume: 42000 },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd', sector: 'FMCG', basePrice: 2520.00, prevClose: 2490.00, baseVolume: 16000 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', sector: 'FMCG', basePrice: 5640.00, prevClose: 5580.00, baseVolume: 14000 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd', sector: 'FMCG', basePrice: 1180.00, prevClose: 1165.00, baseVolume: 26000 },
  { symbol: 'DABUR', name: 'Dabur India Ltd', sector: 'FMCG', basePrice: 625.00, prevClose: 618.00, baseVolume: 22000 },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd', sector: 'FMCG', basePrice: 1340.00, prevClose: 1320.00, baseVolume: 19000 },
  { symbol: 'MARICO', name: 'Marico Ltd', sector: 'FMCG', basePrice: 645.00, prevClose: 638.00, baseVolume: 24000 },
  { symbol: 'COLPAL', name: 'Colgate-Palmolive (India) Ltd', sector: 'FMCG', basePrice: 3250.00, prevClose: 3210.00, baseVolume: 11000 },
  { symbol: 'VARUN', name: 'Varun Beverages Ltd (PepsiCo)', sector: 'FMCG', basePrice: 595.00, prevClose: 585.00, baseVolume: 64000 },
  { symbol: 'TRENT', name: 'Trent Ltd (Westside & Zudio)', sector: 'Retail', basePrice: 7120.00, prevClose: 6980.00, baseVolume: 42000 },
  { symbol: 'DMART', name: 'Avenue Supermarts Ltd (DMart)', sector: 'Retail', basePrice: 4780.00, prevClose: 4720.00, baseVolume: 25000 },

  // --- PHARMA & HEALTHCARE ---
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', sector: 'Pharma', basePrice: 1780.00, prevClose: 1755.00, baseVolume: 42000 },
  { symbol: 'CIPLA', name: 'Cipla Ltd', sector: 'Pharma', basePrice: 1540.00, prevClose: 1520.00, baseVolume: 28000 },
  { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories Ltd", sector: 'Pharma', basePrice: 6850.00, prevClose: 6780.00, baseVolume: 15000 },
  { symbol: 'DIVISLAB', name: "Divi's Laboratories Ltd", sector: 'Pharma', basePrice: 4890.00, prevClose: 4820.00, baseVolume: 19000 },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd', sector: 'Healthcare', basePrice: 6750.00, prevClose: 6680.00, baseVolume: 16000 },
  { symbol: 'MANKIND', name: 'Mankind Pharma Ltd', sector: 'Pharma', basePrice: 2450.00, prevClose: 2410.00, baseVolume: 21000 },
  { symbol: 'MAXHEALTH', name: 'Max Healthcare Institute Ltd', sector: 'Healthcare', basePrice: 890.00, prevClose: 875.00, baseVolume: 32000 },
  { symbol: 'LUPIN', name: 'Lupin Ltd', sector: 'Pharma', basePrice: 2150.00, prevClose: 2110.00, baseVolume: 24000 },
  { symbol: 'ZYDUSLIFE', name: 'Zydus Lifesciences Ltd', sector: 'Pharma', basePrice: 1180.00, prevClose: 1160.00, baseVolume: 28000 },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Ltd', sector: 'Pharma', basePrice: 3380.00, prevClose: 3320.00, baseVolume: 12000 },

  // --- METALS & MINING ---
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', sector: 'Metals', basePrice: 154.20, prevClose: 152.00, baseVolume: 92000 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', sector: 'Metals', basePrice: 945.00, prevClose: 932.00, baseVolume: 44000 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd', sector: 'Metals', basePrice: 685.00, prevClose: 672.00, baseVolume: 51000 },
  { symbol: 'COALINDIA', name: 'Coal India Ltd', sector: 'Metals', basePrice: 485.40, prevClose: 478.00, baseVolume: 64000 },
  { symbol: 'VEDL', name: 'Vedanta Ltd', sector: 'Metals', basePrice: 462.00, prevClose: 454.00, baseVolume: 78000 },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd', sector: 'Metals', basePrice: 980.00, prevClose: 965.00, baseVolume: 32000 },
  { symbol: 'NMDC', name: 'NMDC Ltd', sector: 'Metals', basePrice: 235.40, prevClose: 231.00, baseVolume: 48000 },
  { symbol: 'SAIL', name: 'Steel Authority of India Ltd', sector: 'Metals', basePrice: 138.50, prevClose: 135.00, baseVolume: 56000 },

  // --- TELECOM & DEFENSE ---
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom', basePrice: 1580.00, prevClose: 1560.00, baseVolume: 62000 },
  { symbol: 'IDEA', name: 'Vodafone Idea Ltd', sector: 'Telecom', basePrice: 14.20, prevClose: 13.80, baseVolume: 250000 },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd', sector: 'Defense', basePrice: 4680.00, prevClose: 4590.00, baseVolume: 42000 },
  { symbol: 'BEL', name: 'Bharat Electronics Ltd', sector: 'Defense', basePrice: 295.40, prevClose: 290.00, baseVolume: 74000 },
  { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders Ltd', sector: 'Defense', basePrice: 4250.00, prevClose: 4150.00, baseVolume: 35000 },

  // --- INFRASTRUCTURE, REALTY & OTHERS ---
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', sector: 'Infrastructure', basePrice: 3640.00, prevClose: 3600.00, baseVolume: 38000 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', sector: 'Conglomerate', basePrice: 3080.00, prevClose: 3040.00, baseVolume: 46000 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd', sector: 'Infrastructure', basePrice: 1480.00, prevClose: 1460.00, baseVolume: 52000 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', sector: 'Cement', basePrice: 11250.00, prevClose: 11100.00, baseVolume: 14000 },
  { symbol: 'GRASIM', name: 'Grasim Industries Ltd', sector: 'Cement', basePrice: 2680.00, prevClose: 2640.00, baseVolume: 19000 },
  { symbol: 'TITAN', name: 'Titan Company Ltd (Tanishq)', sector: 'Consumer Goods', basePrice: 3480.00, prevClose: 3440.00, baseVolume: 28000 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', sector: 'Consumer Goods', basePrice: 3120.00, prevClose: 3080.00, baseVolume: 24000 },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Ltd (Fevicol)', sector: 'Chemicals', basePrice: 3150.00, prevClose: 3110.00, baseVolume: 16000 },
  { symbol: 'DLF', name: 'DLF Ltd', sector: 'Realty', basePrice: 845.00, prevClose: 832.00, baseVolume: 34000 },
  { symbol: 'LODHA', name: 'Macrotech Developers Ltd (Lodha)', sector: 'Realty', basePrice: 1240.00, prevClose: 1220.00, baseVolume: 21000 },
  { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd (IndiGo)', sector: 'Aviation', basePrice: 4450.00, prevClose: 4380.00, baseVolume: 26000 },
  { symbol: 'IRCTC', name: 'Indian Railway Catering & Tourism Corp', sector: 'Services', basePrice: 925.00, prevClose: 910.00, baseVolume: 42000 },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', sector: 'Consumer Tech', basePrice: 285.40, prevClose: 280.00, baseVolume: 95000 },
  { symbol: 'POLICYBAZAAR', name: 'PB Fintech Ltd', sector: 'Fintech', basePrice: 1720.00, prevClose: 1690.00, baseVolume: 28000 }
];

/**
 * Intelligent Search & Ranking Helper
 * Matches query against symbol, company name, and sector.
 * Ranks results in strict order:
 * 1. Exact symbol match
 * 2. Symbol starts-with match
 * 3. Symbol contains match
 * 4. Company name contains match
 * 5. Sector contains match
 */
export function searchSymbols(query: string, universe: SymbolDefinition[] = SYMBOL_UNIVERSE): SymbolDefinition[] {
  if (!query || query.trim().length === 0) return universe;

  const q = query.trim().toLowerCase();

  const exactSymbolMatch: SymbolDefinition[] = [];
  const symbolStartsWith: SymbolDefinition[] = [];
  const symbolContains: SymbolDefinition[] = [];
  const nameContains: SymbolDefinition[] = [];
  const sectorContains: SymbolDefinition[] = [];

  const matchedSet = new Set<string>();

  universe.forEach((item) => {
    const sym = item.symbol.toLowerCase();
    const name = item.name.toLowerCase();
    const sector = item.sector.toLowerCase();

    if (sym === q) {
      exactSymbolMatch.push(item);
      matchedSet.add(item.symbol);
    } else if (sym.startsWith(q)) {
      symbolStartsWith.push(item);
      matchedSet.add(item.symbol);
    } else if (sym.includes(q)) {
      symbolContains.push(item);
      matchedSet.add(item.symbol);
    } else if (name.includes(q)) {
      nameContains.push(item);
      matchedSet.add(item.symbol);
    } else if (sector.includes(q)) {
      sectorContains.push(item);
      matchedSet.add(item.symbol);
    }
  });

  return [
    ...exactSymbolMatch,
    ...symbolStartsWith,
    ...symbolContains,
    ...nameContains,
    ...sectorContains
  ];
}
