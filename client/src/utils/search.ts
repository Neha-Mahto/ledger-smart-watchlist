import { SimulatedSymbolInfo } from '../types';

/**
 * Client-Side Ranked Search Engine
 * Case-insensitive substring match across symbol, company name, AND sector.
 * Ranks in strict order:
 * 1. Exact symbol match
 * 2. Symbol starts-with
 * 3. Symbol contains
 * 4. Company name contains
 * 5. Sector contains
 */
export function rankSymbolSearch(query: string, symbols: SimulatedSymbolInfo[]): SimulatedSymbolInfo[] {
  if (!query || query.trim().length === 0) return symbols;

  const q = query.trim().toLowerCase();

  const exactSymbolMatch: SimulatedSymbolInfo[] = [];
  const symbolStartsWith: SimulatedSymbolInfo[] = [];
  const symbolContains: SimulatedSymbolInfo[] = [];
  const nameContains: SimulatedSymbolInfo[] = [];
  const sectorContains: SimulatedSymbolInfo[] = [];

  symbols.forEach((item) => {
    const sym = item.symbol.toLowerCase();
    const name = item.name.toLowerCase();
    const sector = item.sector.toLowerCase();

    if (sym === q) {
      exactSymbolMatch.push(item);
    } else if (sym.startsWith(q)) {
      symbolStartsWith.push(item);
    } else if (sym.includes(q)) {
      symbolContains.push(item);
    } else if (name.includes(q)) {
      nameContains.push(item);
    } else if (sector.includes(q)) {
      sectorContains.push(item);
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
