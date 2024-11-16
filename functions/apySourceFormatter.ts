// Define the mapping of sources to friendly names
const APY_SOURCE_NAMES: { [key: string]: string } = {
    'lido': 'Lido Finance',
    'aave-v3': 'Aave V3',
    'aave-v2': 'Aave V2',
    'compound-v3': 'Compound V3',
    'fraxlend': 'FraxLend',
};
  
export const getSourceDisplayName = (source: string): string => {
    const sourceLower = source.toLowerCase();
    return APY_SOURCE_NAMES[sourceLower] || source;
};