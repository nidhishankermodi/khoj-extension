// हर साइट का search URL और product-link pattern.
// अगर कोई साइट अपना URL format बदल दे, तो सिर्फ़ यही फ़ाइल बदलनी होगी।
const enc = (q) => encodeURIComponent(q.trim()).replace(/%20/g, '+');

export const SITES = [
  {
    id: 'amazon',
    name: 'Amazon',
    color: '#FF9900',
    searchUrl: (q) => `https://www.amazon.in/s?k=${enc(q)}`,
    linkPattern: '/(?:dp|gp/product)/[A-Z0-9]{10}'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    color: '#2874F0',
    searchUrl: (q) => `https://www.flipkart.com/search?q=${enc(q)}`,
    linkPattern: 'flipkart\\.com/.+/p/itm'
  },
  {
    id: 'jiomart',
    name: 'JioMart',
    color: '#0A7CA3',
    searchUrl: (q) => `https://www.jiomart.com/search/${encodeURIComponent(q.trim())}`,
    linkPattern: 'jiomart\\.com/p/'
  },
  {
    id: 'croma',
    name: 'Croma',
    color: '#12A89D',
    searchUrl: (q) => `https://www.croma.com/searchB?q=${enc(q)}%3Arelevance&text=${enc(q)}`,
    linkPattern: 'croma\\.com/.+/p/\\d+'
  },
  {
    id: 'reliance',
    name: 'Reliance Digital',
    color: '#E42529',
    searchUrl: (q) => `https://www.reliancedigital.in/products?q=${enc(q)}`,
    linkPattern: 'reliancedigital\\.in/(?:product/|.+/p/\\d+)'
  }
];

export const siteById = (id) => SITES.find((s) => s.id === id);
