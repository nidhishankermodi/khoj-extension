// UI translations. Default: English. नई भाषा जोड़ने के लिए LANGS और STRINGS में एक entry डालें।
// जो key किसी भाषा में न हो, वह English से ली जाती है।

export const LANGS = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'हिन्दी' },
  { id: 'mr', name: 'मराठी' },
  { id: 'gu', name: 'ગુજરાતી' },
  { id: 'bn', name: 'বাংলা' },
  { id: 'ta', name: 'தமிழ்' },
  { id: 'te', name: 'తెలుగు' },
  { id: 'kn', name: 'ಕನ್ನಡ' },
  { id: 'pa', name: 'ਪੰਜਾਬੀ' }
];
export const DEFAULT_LANG = 'en';

const STRINGS = {
  en: {
    appName: 'Khoj', tagline: 'Search once, compare every store',
    openTab: '⤢ Open in tab', openTabTitle: 'Open on a bigger screen', language: 'Language',
    descLabel: 'What are you looking for?', descHint: "(write it the way you'd say it)",
    descPlaceholder: 'e.g. Samsung 5G phone, 8GB RAM, 128GB, 50MP camera, under 20000',
    filters: 'Filters', filtersHint: "(leave blank — we'll pick them up from what you wrote)",
    category: 'Category', catMobile: 'Mobile phones', catAny: 'Anything',
    brand: 'Brand', any: 'Any', ram: 'RAM (at least)', storage: 'Storage (at least)',
    budgetFrom: 'Budget from (₹)', budgetTo: 'Budget up to (₹)', noLimit: 'No limit',
    only5g: '5G only', sitesAria: 'Stores to search',
    search: '🔍 Search', searching: 'Searching…', stop: 'Stop',
    understood: 'Understood:', noFilter: 'No filters', searchedAs: '· Searched stores for:',
    priceUpTo: 'up to {p}', priceAbove: 'above {p}',
    stLoading: 'Searching…', stOk: '✓ {n} found', stEmpty: 'Nothing found', stBlocked: 'Blocked by site (captcha)',
    viewOnSite: 'View on site ↗', verifyOnSite: 'Open & verify ↗',
    summary: '<b>{n}</b> results · cheapest <b>{p}</b>', noResults: 'No results',
    sortLabel: 'Sort', sortPriceAsc: 'Price: low → high', sortPriceDesc: 'Price: high → low',
    sortMatch: 'Best match', sortRating: 'Rating', sortDiscount: 'Biggest discount',
    onlyMatch: 'Only matching specs', hideAcc: 'Hide covers/accessories', hideAds: 'Hide sponsored',
    bestDeal: 'Best deal ✓', bestDealTitle: 'Lowest price among phones with all your specs',
    ad: 'Ad', off: '{n}% off', ratings: '{n} ratings',
    specOk: 'Found', specUnknown: 'Not mentioned in title', specNo: 'Not found',
    emptyFiltered: 'Nothing left after filters — raise the budget or untick "Only matching specs".',
    emptyNone: 'No store returned results. Try the "View on site" links above.',
    footer: 'Prices are read live from each store — check on the site before you buy.',
    errPickSite: 'Pick at least one store', errWriteSomething: 'First tell us what you need 🙂',
    errMoreDetail: 'Add a bit more detail — like a brand or model',
    errCancelled: 'Stopped', errNewSearch: 'A new search started', errWindowClosed: 'Search window was closed', errGeneric: 'Error'
  },
  hi: {
    appName: 'खोज', tagline: 'एक बार लिखें, हर साइट पर ढूँढें',
    openTab: '⤢ पूरे टैब में', openTabTitle: 'बड़ी स्क्रीन पर खोलें', language: 'भाषा',
    descLabel: 'क्या चाहिए?', descHint: '(जो मन में है, वैसे ही लिखें)',
    descPlaceholder: 'जैसे: Samsung 5G phone, 8GB RAM, 128GB, 50MP camera, 20000 तक',
    filters: 'फ़िल्टर', filtersHint: '(खाली छोड़ें तो ऊपर लिखे से अपने-आप समझ लेगा)',
    category: 'कैटेगरी', catMobile: 'मोबाइल फ़ोन', catAny: 'कुछ भी',
    brand: 'ब्रांड', any: 'कोई भी', ram: 'RAM (कम से कम)', storage: 'Storage (कम से कम)',
    budgetFrom: 'बजट से (₹)', budgetTo: 'बजट तक (₹)', noLimit: 'कोई सीमा नहीं',
    only5g: 'सिर्फ़ 5G', sitesAria: 'किन साइट्स पर खोजें',
    search: '🔍 खोजें', searching: 'खोज रहे हैं…', stop: 'रोकें',
    understood: 'समझा गया:', noFilter: 'कोई filter नहीं', searchedAs: '· साइट्स पर खोजा:',
    priceUpTo: '{p} तक', priceAbove: '{p} से ऊपर',
    stLoading: 'खोज रहे हैं…', stOk: '✓ {n} नतीजे', stEmpty: 'कुछ नहीं मिला', stBlocked: 'साइट ने रोका (captcha)',
    viewOnSite: 'साइट पर देखें ↗', verifyOnSite: 'खोलकर verify करें ↗',
    summary: '<b>{n}</b> नतीजे · सबसे सस्ता <b>{p}</b>', noResults: 'कोई नतीजा नहीं',
    sortLabel: 'Sort', sortPriceAsc: 'कीमत: कम → ज़्यादा', sortPriceDesc: 'कीमत: ज़्यादा → कम',
    sortMatch: 'सबसे अच्छा match', sortRating: 'Rating', sortDiscount: 'सबसे ज़्यादा छूट',
    onlyMatch: 'सिर्फ़ specs से मेल खाने वाले', hideAcc: 'Covers/accessories छुपाएं', hideAds: 'Sponsored छुपाएं',
    bestDeal: 'Best deal ✓', bestDealTitle: 'सारी ज़रूरी specs वाले फ़ोनों में सबसे कम कीमत',
    ad: 'Ad', off: '{n}% छूट', ratings: '{n} ratings',
    specOk: 'मिला', specUnknown: 'title में नहीं लिखा', specNo: 'नहीं मिला',
    emptyFiltered: 'फ़िल्टर के हिसाब से कुछ नहीं बचा — बजट बढ़ाएँ या "सिर्फ़ specs से मेल खाने वाले" हटाएँ।',
    emptyNone: 'किसी साइट से नतीजे नहीं आए। ऊपर दिए "साइट पर देखें" links आज़माएँ।',
    footer: 'कीमतें साइट से उसी वक़्त पढ़ी गई हैं — ख़रीदने से पहले साइट पर ज़रूर देखें।',
    errPickSite: 'कम से कम एक साइट चुनें', errWriteSomething: 'पहले लिखें कि क्या चाहिए 🙂',
    errMoreDetail: 'कुछ और detail लिखें — जैसे ब्रांड या model',
    errCancelled: 'रोका गया', errNewSearch: 'नई खोज शुरू हुई', errWindowClosed: 'खोज वाली window बंद हो गई', errGeneric: 'गड़बड़ी'
  },
  mr: {
    appName: 'खोज', tagline: 'एकदा लिहा, सगळ्या साइट्सवर शोधा',
    openTab: '⤢ पूर्ण टॅबमध्ये', openTabTitle: 'मोठ्या स्क्रीनवर उघडा', language: 'भाषा',
    descLabel: 'काय हवं आहे?', descHint: '(जसं मनात आहे तसं लिहा)',
    descPlaceholder: 'उदा.: Samsung 5G फोन, 8GB RAM, 128GB, 50MP कॅमेरा, 20000 पर्यंत',
    filters: 'फिल्टर', filtersHint: '(रिकामे ठेवा — वर लिहिलेल्यावरून आपोआप समजेल)',
    category: 'श्रेणी', catMobile: 'मोबाईल फोन', catAny: 'काहीही',
    brand: 'ब्रँड', any: 'कोणताही', ram: 'RAM (किमान)', storage: 'Storage (किमान)',
    budgetFrom: 'बजेट पासून (₹)', budgetTo: 'बजेट पर्यंत (₹)', noLimit: 'मर्यादा नाही',
    only5g: 'फक्त 5G', sitesAria: 'कोणत्या साइट्सवर शोधायचे',
    search: '🔍 शोधा', searching: 'शोधत आहे…', stop: 'थांबवा',
    understood: 'समजले:', noFilter: 'कोणताही फिल्टर नाही', searchedAs: '· साइट्सवर शोधले:',
    priceUpTo: '{p} पर्यंत', priceAbove: '{p} पेक्षा जास्त',
    stLoading: 'शोधत आहे…', stOk: '✓ {n} निकाल', stEmpty: 'काहीही सापडले नाही', stBlocked: 'साइटने अडवले (captcha)',
    viewOnSite: 'साइटवर पहा ↗', verifyOnSite: 'उघडून verify करा ↗',
    summary: '<b>{n}</b> निकाल · सर्वात स्वस्त <b>{p}</b>', noResults: 'कोणताही निकाल नाही',
    sortLabel: 'क्रम', sortPriceAsc: 'किंमत: कमी → जास्त', sortPriceDesc: 'किंमत: जास्त → कमी',
    sortMatch: 'सर्वोत्तम जुळणारे', sortRating: 'रेटिंग', sortDiscount: 'सर्वाधिक सूट',
    onlyMatch: 'फक्त specs जुळणारे', hideAcc: 'कव्हर/ॲक्सेसरीज लपवा', hideAds: 'Sponsored लपवा',
    bestDealTitle: 'तुमच्या सर्व specs असलेल्या फोनमध्ये सर्वात कमी किंमत',
    ad: 'जाहिरात', off: '{n}% सूट', ratings: '{n} रेटिंग्स',
    specOk: 'सापडले', specUnknown: 'शीर्षकात नमूद नाही', specNo: 'सापडले नाही',
    emptyFiltered: 'फिल्टरनंतर काहीच उरले नाही — बजेट वाढवा किंवा "फक्त specs जुळणारे" काढा.',
    emptyNone: 'कोणत्याही साइटवरून निकाल आले नाहीत. वरील "साइटवर पहा" लिंक वापरून पहा.',
    footer: 'किमती त्याच क्षणी साइटवरून वाचल्या आहेत — खरेदीपूर्वी साइटवर नक्की तपासा.',
    errPickSite: 'किमान एक साइट निवडा', errWriteSomething: 'आधी काय हवं ते लिहा 🙂',
    errMoreDetail: 'थोडी अधिक माहिती लिहा — जसे ब्रँड किंवा मॉडेल',
    errCancelled: 'थांबवले', errNewSearch: 'नवीन शोध सुरू झाला', errWindowClosed: 'शोधाची विंडो बंद झाली', errGeneric: 'त्रुटी'
  },
  gu: {
    appName: 'ખોજ', tagline: 'એક વાર લખો, દરેક સાઇટ પર શોધો',
    openTab: '⤢ પૂરા ટૅબમાં', openTabTitle: 'મોટી સ્ક્રીન પર ખોલો', language: 'ભાષા',
    descLabel: 'શું જોઈએ છે?', descHint: '(જેમ મનમાં હોય તેમ લખો)',
    descPlaceholder: 'દા.ત.: Samsung 5G ફોન, 8GB RAM, 128GB, 50MP કૅમેરા, 20000 સુધી',
    filters: 'ફિલ્ટર', filtersHint: '(ખાલી છોડો — ઉપર લખેલામાંથી આપમેળે સમજી લેશે)',
    category: 'કેટેગરી', catMobile: 'મોબાઇલ ફોન', catAny: 'કંઈ પણ',
    brand: 'બ્રાન્ડ', any: 'કોઈ પણ', ram: 'RAM (ઓછામાં ઓછી)', storage: 'Storage (ઓછામાં ઓછું)',
    budgetFrom: 'બજેટ થી (₹)', budgetTo: 'બજેટ સુધી (₹)', noLimit: 'કોઈ મર્યાદા નહીં',
    only5g: 'ફક્ત 5G', sitesAria: 'કઈ સાઇટ્સ પર શોધવું',
    search: '🔍 શોધો', searching: 'શોધી રહ્યા છીએ…', stop: 'રોકો',
    understood: 'સમજાયું:', noFilter: 'કોઈ ફિલ્ટર નથી', searchedAs: '· સાઇટ્સ પર શોધ્યું:',
    priceUpTo: '{p} સુધી', priceAbove: '{p} થી વધુ',
    stLoading: 'શોધી રહ્યા છીએ…', stOk: '✓ {n} પરિણામો', stEmpty: 'કંઈ મળ્યું નહીં', stBlocked: 'સાઇટે રોક્યું (captcha)',
    viewOnSite: 'સાઇટ પર જુઓ ↗', verifyOnSite: 'ખોલીને verify કરો ↗',
    summary: '<b>{n}</b> પરિણામો · સૌથી સસ્તું <b>{p}</b>', noResults: 'કોઈ પરિણામ નથી',
    sortLabel: 'ક્રમ', sortPriceAsc: 'કિંમત: ઓછી → વધુ', sortPriceDesc: 'કિંમત: વધુ → ઓછી',
    sortMatch: 'શ્રેષ્ઠ મેળ', sortRating: 'રેટિંગ', sortDiscount: 'સૌથી વધુ છૂટ',
    onlyMatch: 'ફક્ત specs મેળ ખાતા', hideAcc: 'કવર/એક્સેસરીઝ છુપાવો', hideAds: 'Sponsored છુપાવો',
    bestDealTitle: 'તમારી બધી specs વાળા ફોનમાં સૌથી ઓછી કિંમત',
    ad: 'જાહેરાત', off: '{n}% છૂટ', ratings: '{n} રેટિંગ્સ',
    specOk: 'મળ્યું', specUnknown: 'શીર્ષકમાં લખ્યું નથી', specNo: 'મળ્યું નહીં',
    emptyFiltered: 'ફિલ્ટર પછી કંઈ બાકી નથી — બજેટ વધારો અથવા "ફક્ત specs મેળ ખાતા" હટાવો.',
    emptyNone: 'કોઈ સાઇટ પરથી પરિણામો આવ્યા નહીં. ઉપરની "સાઇટ પર જુઓ" લિંક અજમાવો.',
    footer: 'કિંમતો તે જ સમયે સાઇટ પરથી વાંચવામાં આવી છે — ખરીદતા પહેલાં સાઇટ પર જરૂર તપાસો.',
    errPickSite: 'ઓછામાં ઓછી એક સાઇટ પસંદ કરો', errWriteSomething: 'પહેલાં લખો કે શું જોઈએ છે 🙂',
    errMoreDetail: 'થોડી વધુ વિગત લખો — જેમ કે બ્રાન્ડ કે મોડેલ',
    errCancelled: 'રોક્યું', errNewSearch: 'નવી શોધ શરૂ થઈ', errWindowClosed: 'શોધની વિન્ડો બંધ થઈ ગઈ', errGeneric: 'ભૂલ'
  },
  bn: {
    appName: 'খোঁজ', tagline: 'একবার লিখুন, সব সাইটে খুঁজুন',
    openTab: '⤢ পুরো ট্যাবে', openTabTitle: 'বড় স্ক্রিনে খুলুন', language: 'ভাষা',
    descLabel: 'কী চাই?', descHint: '(মনে যেমন আছে তেমনই লিখুন)',
    descPlaceholder: 'যেমন: Samsung 5G ফোন, 8GB RAM, 128GB, 50MP ক্যামেরা, 20000 পর্যন্ত',
    filters: 'ফিল্টার', filtersHint: '(ফাঁকা রাখুন — উপরের লেখা থেকে নিজেই বুঝে নেবে)',
    category: 'ক্যাটাগরি', catMobile: 'মোবাইল ফোন', catAny: 'যেকোনো কিছু',
    brand: 'ব্র্যান্ড', any: 'যেকোনো', ram: 'RAM (কমপক্ষে)', storage: 'Storage (কমপক্ষে)',
    budgetFrom: 'বাজেট থেকে (₹)', budgetTo: 'বাজেট পর্যন্ত (₹)', noLimit: 'কোনো সীমা নেই',
    only5g: 'শুধু 5G', sitesAria: 'কোন সাইটে খুঁজবেন',
    search: '🔍 খুঁজুন', searching: 'খোঁজা হচ্ছে…', stop: 'থামান',
    understood: 'বোঝা গেছে:', noFilter: 'কোনো ফিল্টার নেই', searchedAs: '· সাইটে খোঁজা হয়েছে:',
    priceUpTo: '{p} পর্যন্ত', priceAbove: '{p}-এর বেশি',
    stLoading: 'খোঁজা হচ্ছে…', stOk: '✓ {n}টি ফলাফল', stEmpty: 'কিছু পাওয়া যায়নি', stBlocked: 'সাইট আটকে দিয়েছে (captcha)',
    viewOnSite: 'সাইটে দেখুন ↗', verifyOnSite: 'খুলে verify করুন ↗',
    summary: '<b>{n}</b>টি ফলাফল · সবচেয়ে সস্তা <b>{p}</b>', noResults: 'কোনো ফলাফল নেই',
    sortLabel: 'সাজান', sortPriceAsc: 'দাম: কম → বেশি', sortPriceDesc: 'দাম: বেশি → কম',
    sortMatch: 'সেরা মিল', sortRating: 'রেটিং', sortDiscount: 'সবচেয়ে বেশি ছাড়',
    onlyMatch: 'শুধু specs মিলছে এমন', hideAcc: 'কভার/অ্যাক্সেসরিজ লুকান', hideAds: 'Sponsored লুকান',
    bestDealTitle: 'আপনার সব specs আছে এমন ফোনের মধ্যে সবচেয়ে কম দাম',
    ad: 'বিজ্ঞাপন', off: '{n}% ছাড়', ratings: '{n}টি রেটিং',
    specOk: 'পাওয়া গেছে', specUnknown: 'শিরোনামে উল্লেখ নেই', specNo: 'পাওয়া যায়নি',
    emptyFiltered: 'ফিল্টারের পর কিছুই বাকি নেই — বাজেট বাড়ান বা "শুধু specs মিলছে এমন" সরান।',
    emptyNone: 'কোনো সাইট থেকে ফলাফল আসেনি। উপরের "সাইটে দেখুন" লিঙ্কগুলো চেষ্টা করুন।',
    footer: 'দাম সেই মুহূর্তে সাইট থেকে পড়া হয়েছে — কেনার আগে সাইটে অবশ্যই দেখে নিন।',
    errPickSite: 'অন্তত একটি সাইট বেছে নিন', errWriteSomething: 'আগে লিখুন কী চাই 🙂',
    errMoreDetail: 'আরেকটু বিস্তারিত লিখুন — যেমন ব্র্যান্ড বা মডেল',
    errCancelled: 'থামানো হয়েছে', errNewSearch: 'নতুন খোঁজ শুরু হয়েছে', errWindowClosed: 'খোঁজার উইন্ডো বন্ধ হয়ে গেছে', errGeneric: 'ত্রুটি'
  },
  ta: {
    tagline: 'ஒருமுறை எழுதுங்கள், எல்லா தளங்களிலும் தேடுங்கள்',
    openTab: '⤢ முழு டேபில்', openTabTitle: 'பெரிய திரையில் திறக்க', language: 'மொழி',
    descLabel: 'என்ன வேண்டும்?', descHint: '(மனதில் உள்ளபடியே எழுதுங்கள்)',
    descPlaceholder: 'எ.கா: Samsung 5G போன், 8GB RAM, 128GB, 50MP கேமரா, 20000 வரை',
    filters: 'வடிகட்டிகள்', filtersHint: '(காலியாக விடலாம் — மேலே எழுதியதிலிருந்து தானாகப் புரிந்துகொள்ளும்)',
    category: 'வகை', catMobile: 'மொபைல் போன்', catAny: 'எதுவும்',
    brand: 'பிராண்ட்', any: 'ஏதேனும்', ram: 'RAM (குறைந்தது)', storage: 'Storage (குறைந்தது)',
    budgetFrom: 'பட்ஜெட் முதல் (₹)', budgetTo: 'பட்ஜெட் வரை (₹)', noLimit: 'வரம்பு இல்லை',
    only5g: '5G மட்டும்', sitesAria: 'எந்த தளங்களில் தேட வேண்டும்',
    search: '🔍 தேடு', searching: 'தேடுகிறது…', stop: 'நிறுத்து',
    understood: 'புரிந்தது:', noFilter: 'வடிகட்டி இல்லை', searchedAs: '· தளங்களில் தேடியது:',
    priceUpTo: '{p} வரை', priceAbove: '{p}க்கு மேல்',
    stLoading: 'தேடுகிறது…', stOk: '✓ {n} முடிவுகள்', stEmpty: 'எதுவும் கிடைக்கவில்லை', stBlocked: 'தளம் தடுத்தது (captcha)',
    viewOnSite: 'தளத்தில் பார்க்க ↗', verifyOnSite: 'திறந்து verify செய்யவும் ↗',
    summary: '<b>{n}</b> முடிவுகள் · மலிவானது <b>{p}</b>', noResults: 'முடிவுகள் இல்லை',
    sortLabel: 'வரிசை', sortPriceAsc: 'விலை: குறைவு → அதிகம்', sortPriceDesc: 'விலை: அதிகம் → குறைவு',
    sortMatch: 'சிறந்த பொருத்தம்', sortRating: 'மதிப்பீடு', sortDiscount: 'அதிக தள்ளுபடி',
    onlyMatch: 'specs பொருந்துபவை மட்டும்', hideAcc: 'கவர்/துணைப்பொருட்களை மறை', hideAds: 'Sponsored மறை',
    bestDealTitle: 'உங்கள் எல்லா specs உள்ள போன்களில் குறைந்த விலை',
    ad: 'விளம்பரம்', off: '{n}% தள்ளுபடி', ratings: '{n} மதிப்பீடுகள்',
    specOk: 'உள்ளது', specUnknown: 'தலைப்பில் குறிப்பிடப்படவில்லை', specNo: 'இல்லை',
    emptyFiltered: 'வடிகட்டிய பின் எதுவும் இல்லை — பட்ஜெட்டை உயர்த்துங்கள் அல்லது "specs பொருந்துபவை மட்டும்" நீக்குங்கள்.',
    emptyNone: 'எந்த தளத்திலிருந்தும் முடிவுகள் வரவில்லை. மேலே உள்ள "தளத்தில் பார்க்க" இணைப்புகளை முயற்சிக்கவும்.',
    footer: 'விலைகள் அதே நேரத்தில் தளங்களிலிருந்து படிக்கப்பட்டவை — வாங்கும் முன் தளத்தில் சரிபார்க்கவும்.',
    errPickSite: 'குறைந்தது ஒரு தளத்தைத் தேர்ந்தெடுக்கவும்', errWriteSomething: 'முதலில் என்ன வேண்டும் என்று எழுதுங்கள் 🙂',
    errMoreDetail: 'இன்னும் கொஞ்சம் விவரம் எழுதுங்கள் — பிராண்ட் அல்லது மாடல் போல',
    errCancelled: 'நிறுத்தப்பட்டது', errNewSearch: 'புதிய தேடல் தொடங்கியது', errWindowClosed: 'தேடல் சாளரம் மூடப்பட்டது', errGeneric: 'பிழை'
  },
  te: {
    tagline: 'ఒక్కసారి రాయండి, అన్ని సైట్లలో వెతకండి',
    openTab: '⤢ పూర్తి ట్యాబ్‌లో', openTabTitle: 'పెద్ద స్క్రీన్‌లో తెరవండి', language: 'భాష',
    descLabel: 'మీకు ఏం కావాలి?', descHint: '(మనసులో ఉన్నట్లే రాయండి)',
    descPlaceholder: 'ఉదా: Samsung 5G ఫోన్, 8GB RAM, 128GB, 50MP కెమెరా, 20000 వరకు',
    filters: 'ఫిల్టర్లు', filtersHint: '(ఖాళీగా వదిలేయండి — పైన రాసిన దాని నుంచి తానే అర్థం చేసుకుంటుంది)',
    category: 'వర్గం', catMobile: 'మొబైల్ ఫోన్లు', catAny: 'ఏదైనా',
    brand: 'బ్రాండ్', any: 'ఏదైనా', ram: 'RAM (కనీసం)', storage: 'Storage (కనీసం)',
    budgetFrom: 'బడ్జెట్ నుండి (₹)', budgetTo: 'బడ్జెట్ వరకు (₹)', noLimit: 'పరిమితి లేదు',
    only5g: '5G మాత్రమే', sitesAria: 'ఏ సైట్లలో వెతకాలి',
    search: '🔍 వెతకండి', searching: 'వెతుకుతోంది…', stop: 'ఆపండి',
    understood: 'అర్థమైంది:', noFilter: 'ఫిల్టర్ లేదు', searchedAs: '· సైట్లలో వెతికింది:',
    priceUpTo: '{p} వరకు', priceAbove: '{p} పైన',
    stLoading: 'వెతుకుతోంది…', stOk: '✓ {n} ఫలితాలు', stEmpty: 'ఏమీ దొరకలేదు', stBlocked: 'సైట్ అడ్డుకుంది (captcha)',
    viewOnSite: 'సైట్‌లో చూడండి ↗', verifyOnSite: 'తెరిచి verify చేయండి ↗',
    summary: '<b>{n}</b> ఫలితాలు · అత్యంత చౌక <b>{p}</b>', noResults: 'ఫలితాలు లేవు',
    sortLabel: 'క్రమం', sortPriceAsc: 'ధర: తక్కువ → ఎక్కువ', sortPriceDesc: 'ధర: ఎక్కువ → తక్కువ',
    sortMatch: 'ఉత్తమ సరిపోలిక', sortRating: 'రేటింగ్', sortDiscount: 'అత్యధిక తగ్గింపు',
    onlyMatch: 'specs సరిపోయేవి మాత్రమే', hideAcc: 'కవర్లు/యాక్సెసరీలు దాచండి', hideAds: 'Sponsored దాచండి',
    bestDealTitle: 'మీ అన్ని specs ఉన్న ఫోన్లలో అతి తక్కువ ధర',
    ad: 'ప్రకటన', off: '{n}% తగ్గింపు', ratings: '{n} రేటింగ్‌లు',
    specOk: 'ఉంది', specUnknown: 'టైటిల్‌లో పేర్కొనలేదు', specNo: 'లేదు',
    emptyFiltered: 'ఫిల్టర్ల తర్వాత ఏమీ మిగల్లేదు — బడ్జెట్ పెంచండి లేదా "specs సరిపోయేవి మాత్రమే" తీసేయండి.',
    emptyNone: 'ఏ సైట్ నుంచీ ఫలితాలు రాలేదు. పైన ఉన్న "సైట్‌లో చూడండి" లింకులు ప్రయత్నించండి.',
    footer: 'ధరలు అదే సమయంలో సైట్ల నుంచి చదవబడ్డాయి — కొనే ముందు సైట్‌లో తప్పక చూడండి.',
    errPickSite: 'కనీసం ఒక సైట్ ఎంచుకోండి', errWriteSomething: 'ముందు మీకు ఏం కావాలో రాయండి 🙂',
    errMoreDetail: 'ఇంకొంచెం వివరం రాయండి — బ్రాండ్ లేదా మోడల్ లాంటివి',
    errCancelled: 'ఆపబడింది', errNewSearch: 'కొత్త శోధన ప్రారంభమైంది', errWindowClosed: 'శోధన విండో మూసివేయబడింది', errGeneric: 'లోపం'
  },
  kn: {
    tagline: 'ಒಮ್ಮೆ ಬರೆಯಿರಿ, ಎಲ್ಲಾ ಸೈಟ್‌ಗಳಲ್ಲಿ ಹುಡುಕಿ',
    openTab: '⤢ ಪೂರ್ಣ ಟ್ಯಾಬ್‌ನಲ್ಲಿ', openTabTitle: 'ದೊಡ್ಡ ಪರದೆಯಲ್ಲಿ ತೆರೆಯಿರಿ', language: 'ಭಾಷೆ',
    descLabel: 'ನಿಮಗೆ ಏನು ಬೇಕು?', descHint: '(ಮನಸ್ಸಿನಲ್ಲಿ ಇದ್ದಂತೆಯೇ ಬರೆಯಿರಿ)',
    descPlaceholder: 'ಉದಾ: Samsung 5G ಫೋನ್, 8GB RAM, 128GB, 50MP ಕ್ಯಾಮೆರಾ, 20000 ವರೆಗೆ',
    filters: 'ಫಿಲ್ಟರ್‌ಗಳು', filtersHint: '(ಖಾಲಿ ಬಿಡಿ — ಮೇಲೆ ಬರೆದದ್ದರಿಂದ ತಾನೇ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತದೆ)',
    category: 'ವರ್ಗ', catMobile: 'ಮೊಬೈಲ್ ಫೋನ್', catAny: 'ಏನಾದರೂ',
    brand: 'ಬ್ರ್ಯಾಂಡ್', any: 'ಯಾವುದಾದರೂ', ram: 'RAM (ಕನಿಷ್ಠ)', storage: 'Storage (ಕನಿಷ್ಠ)',
    budgetFrom: 'ಬಜೆಟ್ ಇಂದ (₹)', budgetTo: 'ಬಜೆಟ್ ವರೆಗೆ (₹)', noLimit: 'ಮಿತಿ ಇಲ್ಲ',
    only5g: '5G ಮಾತ್ರ', sitesAria: 'ಯಾವ ಸೈಟ್‌ಗಳಲ್ಲಿ ಹುಡುಕಬೇಕು',
    search: '🔍 ಹುಡುಕಿ', searching: 'ಹುಡುಕುತ್ತಿದೆ…', stop: 'ನಿಲ್ಲಿಸಿ',
    understood: 'ಅರ್ಥವಾಯಿತು:', noFilter: 'ಯಾವುದೇ ಫಿಲ್ಟರ್ ಇಲ್ಲ', searchedAs: '· ಸೈಟ್‌ಗಳಲ್ಲಿ ಹುಡುಕಿದ್ದು:',
    priceUpTo: '{p} ವರೆಗೆ', priceAbove: '{p} ಕ್ಕಿಂತ ಹೆಚ್ಚು',
    stLoading: 'ಹುಡುಕುತ್ತಿದೆ…', stOk: '✓ {n} ಫಲಿತಾಂಶಗಳು', stEmpty: 'ಏನೂ ಸಿಗಲಿಲ್ಲ', stBlocked: 'ಸೈಟ್ ತಡೆಯಿತು (captcha)',
    viewOnSite: 'ಸೈಟ್‌ನಲ್ಲಿ ನೋಡಿ ↗', verifyOnSite: 'ತೆರೆದು verify ಮಾಡಿ ↗',
    summary: '<b>{n}</b> ಫಲಿತಾಂಶಗಳು · ಅತ್ಯಂತ ಅಗ್ಗ <b>{p}</b>', noResults: 'ಫಲಿತಾಂಶಗಳಿಲ್ಲ',
    sortLabel: 'ಕ್ರಮ', sortPriceAsc: 'ಬೆಲೆ: ಕಡಿಮೆ → ಹೆಚ್ಚು', sortPriceDesc: 'ಬೆಲೆ: ಹೆಚ್ಚು → ಕಡಿಮೆ',
    sortMatch: 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ', sortRating: 'ರೇಟಿಂಗ್', sortDiscount: 'ಅತಿ ಹೆಚ್ಚು ರಿಯಾಯಿತಿ',
    onlyMatch: 'specs ಹೊಂದುವವು ಮಾತ್ರ', hideAcc: 'ಕವರ್/ಪರಿಕರಗಳನ್ನು ಮರೆಮಾಡಿ', hideAds: 'Sponsored ಮರೆಮಾಡಿ',
    bestDealTitle: 'ನಿಮ್ಮ ಎಲ್ಲಾ specs ಇರುವ ಫೋನ್‌ಗಳಲ್ಲಿ ಕಡಿಮೆ ಬೆಲೆ',
    ad: 'ಜಾಹೀರಾತು', off: '{n}% ರಿಯಾಯಿತಿ', ratings: '{n} ರೇಟಿಂಗ್‌ಗಳು',
    specOk: 'ಇದೆ', specUnknown: 'ಶೀರ್ಷಿಕೆಯಲ್ಲಿ ಉಲ್ಲೇಖವಿಲ್ಲ', specNo: 'ಇಲ್ಲ',
    emptyFiltered: 'ಫಿಲ್ಟರ್ ನಂತರ ಏನೂ ಉಳಿದಿಲ್ಲ — ಬಜೆಟ್ ಹೆಚ್ಚಿಸಿ ಅಥವಾ "specs ಹೊಂದುವವು ಮಾತ್ರ" ತೆಗೆಯಿರಿ.',
    emptyNone: 'ಯಾವ ಸೈಟ್‌ನಿಂದಲೂ ಫಲಿತಾಂಶ ಬರಲಿಲ್ಲ. ಮೇಲಿನ "ಸೈಟ್‌ನಲ್ಲಿ ನೋಡಿ" ಲಿಂಕ್‌ಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ.',
    footer: 'ಬೆಲೆಗಳನ್ನು ಅದೇ ಸಮಯದಲ್ಲಿ ಸೈಟ್‌ಗಳಿಂದ ಓದಲಾಗಿದೆ — ಖರೀದಿಸುವ ಮೊದಲು ಸೈಟ್‌ನಲ್ಲಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
    errPickSite: 'ಕನಿಷ್ಠ ಒಂದು ಸೈಟ್ ಆಯ್ಕೆಮಾಡಿ', errWriteSomething: 'ಮೊದಲು ನಿಮಗೆ ಏನು ಬೇಕು ಎಂದು ಬರೆಯಿರಿ 🙂',
    errMoreDetail: 'ಇನ್ನಷ್ಟು ವಿವರ ಬರೆಯಿರಿ — ಬ್ರ್ಯಾಂಡ್ ಅಥವಾ ಮಾಡೆಲ್‌ನಂತೆ',
    errCancelled: 'ನಿಲ್ಲಿಸಲಾಗಿದೆ', errNewSearch: 'ಹೊಸ ಹುಡುಕಾಟ ಆರಂಭವಾಯಿತು', errWindowClosed: 'ಹುಡುಕಾಟದ ವಿಂಡೋ ಮುಚ್ಚಲಾಯಿತು', errGeneric: 'ದೋಷ'
  },
  pa: {
    appName: 'ਖੋਜ', tagline: 'ਇੱਕ ਵਾਰ ਲਿਖੋ, ਹਰ ਸਾਈਟ ਤੇ ਲੱਭੋ',
    openTab: '⤢ ਪੂਰੇ ਟੈਬ ਵਿੱਚ', openTabTitle: 'ਵੱਡੀ ਸਕ੍ਰੀਨ ਤੇ ਖੋਲ੍ਹੋ', language: 'ਭਾਸ਼ਾ',
    descLabel: 'ਕੀ ਚਾਹੀਦਾ ਹੈ?', descHint: '(ਜਿਵੇਂ ਮਨ ਵਿੱਚ ਹੈ, ਉਵੇਂ ਹੀ ਲਿਖੋ)',
    descPlaceholder: 'ਜਿਵੇਂ: Samsung 5G ਫ਼ੋਨ, 8GB RAM, 128GB, 50MP ਕੈਮਰਾ, 20000 ਤੱਕ',
    filters: 'ਫ਼ਿਲਟਰ', filtersHint: '(ਖ਼ਾਲੀ ਛੱਡੋ — ਉੱਪਰ ਲਿਖੇ ਤੋਂ ਆਪਣੇ ਆਪ ਸਮਝ ਲਵੇਗਾ)',
    category: 'ਸ਼੍ਰੇਣੀ', catMobile: 'ਮੋਬਾਈਲ ਫ਼ੋਨ', catAny: 'ਕੁਝ ਵੀ',
    brand: 'ਬ੍ਰਾਂਡ', any: 'ਕੋਈ ਵੀ', ram: 'RAM (ਘੱਟੋ-ਘੱਟ)', storage: 'Storage (ਘੱਟੋ-ਘੱਟ)',
    budgetFrom: 'ਬਜਟ ਤੋਂ (₹)', budgetTo: 'ਬਜਟ ਤੱਕ (₹)', noLimit: 'ਕੋਈ ਸੀਮਾ ਨਹੀਂ',
    only5g: 'ਸਿਰਫ਼ 5G', sitesAria: 'ਕਿਹੜੀਆਂ ਸਾਈਟਾਂ ਤੇ ਲੱਭਣਾ ਹੈ',
    search: '🔍 ਲੱਭੋ', searching: 'ਲੱਭ ਰਹੇ ਹਾਂ…', stop: 'ਰੋਕੋ',
    understood: 'ਸਮਝਿਆ:', noFilter: 'ਕੋਈ ਫ਼ਿਲਟਰ ਨਹੀਂ', searchedAs: '· ਸਾਈਟਾਂ ਤੇ ਲੱਭਿਆ:',
    priceUpTo: '{p} ਤੱਕ', priceAbove: '{p} ਤੋਂ ਵੱਧ',
    stLoading: 'ਲੱਭ ਰਹੇ ਹਾਂ…', stOk: '✓ {n} ਨਤੀਜੇ', stEmpty: 'ਕੁਝ ਨਹੀਂ ਮਿਲਿਆ', stBlocked: 'ਸਾਈਟ ਨੇ ਰੋਕਿਆ (captcha)',
    viewOnSite: 'ਸਾਈਟ ਤੇ ਵੇਖੋ ↗', verifyOnSite: 'ਖੋਲ੍ਹ ਕੇ verify ਕਰੋ ↗',
    summary: '<b>{n}</b> ਨਤੀਜੇ · ਸਭ ਤੋਂ ਸਸਤਾ <b>{p}</b>', noResults: 'ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ',
    sortLabel: 'ਕ੍ਰਮ', sortPriceAsc: 'ਕੀਮਤ: ਘੱਟ → ਵੱਧ', sortPriceDesc: 'ਕੀਮਤ: ਵੱਧ → ਘੱਟ',
    sortMatch: 'ਸਭ ਤੋਂ ਵਧੀਆ ਮੇਲ', sortRating: 'ਰੇਟਿੰਗ', sortDiscount: 'ਸਭ ਤੋਂ ਵੱਧ ਛੋਟ',
    onlyMatch: 'ਸਿਰਫ਼ specs ਨਾਲ ਮੇਲ ਖਾਂਦੇ', hideAcc: 'ਕਵਰ/ਐਕਸੈਸਰੀਜ਼ ਲੁਕਾਓ', hideAds: 'Sponsored ਲੁਕਾਓ',
    bestDealTitle: 'ਤੁਹਾਡੀਆਂ ਸਾਰੀਆਂ specs ਵਾਲੇ ਫ਼ੋਨਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਕੀਮਤ',
    ad: 'ਇਸ਼ਤਿਹਾਰ', off: '{n}% ਛੋਟ', ratings: '{n} ਰੇਟਿੰਗਾਂ',
    specOk: 'ਮਿਲਿਆ', specUnknown: 'ਸਿਰਲੇਖ ਵਿੱਚ ਨਹੀਂ ਲਿਖਿਆ', specNo: 'ਨਹੀਂ ਮਿਲਿਆ',
    emptyFiltered: 'ਫ਼ਿਲਟਰਾਂ ਤੋਂ ਬਾਅਦ ਕੁਝ ਨਹੀਂ ਬਚਿਆ — ਬਜਟ ਵਧਾਓ ਜਾਂ "ਸਿਰਫ਼ specs ਨਾਲ ਮੇਲ ਖਾਂਦੇ" ਹਟਾਓ।',
    emptyNone: 'ਕਿਸੇ ਵੀ ਸਾਈਟ ਤੋਂ ਨਤੀਜੇ ਨਹੀਂ ਆਏ। ਉੱਪਰ ਦਿੱਤੇ "ਸਾਈਟ ਤੇ ਵੇਖੋ" ਲਿੰਕ ਅਜ਼ਮਾਓ।',
    footer: 'ਕੀਮਤਾਂ ਉਸੇ ਵੇਲੇ ਸਾਈਟਾਂ ਤੋਂ ਪੜ੍ਹੀਆਂ ਗਈਆਂ ਹਨ — ਖ਼ਰੀਦਣ ਤੋਂ ਪਹਿਲਾਂ ਸਾਈਟ ਤੇ ਜ਼ਰੂਰ ਵੇਖੋ।',
    errPickSite: 'ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਾਈਟ ਚੁਣੋ', errWriteSomething: 'ਪਹਿਲਾਂ ਲਿਖੋ ਕਿ ਕੀ ਚਾਹੀਦਾ ਹੈ 🙂',
    errMoreDetail: 'ਥੋੜ੍ਹਾ ਹੋਰ ਵੇਰਵਾ ਲਿਖੋ — ਜਿਵੇਂ ਬ੍ਰਾਂਡ ਜਾਂ ਮਾਡਲ',
    errCancelled: 'ਰੋਕਿਆ ਗਿਆ', errNewSearch: 'ਨਵੀਂ ਖੋਜ ਸ਼ੁਰੂ ਹੋਈ', errWindowClosed: 'ਖੋਜ ਵਾਲੀ ਵਿੰਡੋ ਬੰਦ ਹੋ ਗਈ', errGeneric: 'ਗਲਤੀ'
  }
};

let current = DEFAULT_LANG;
export const getLang = () => current;
export const setLang = (id) => { current = STRINGS[id] ? id : DEFAULT_LANG; };

/** t('stOk', { n: 5 }) → "✓ 5 results" */
export function t(key, vars = {}) {
  const s = STRINGS[current]?.[key] ?? STRINGS.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

/** data-i18n / data-i18n-placeholder / data-i18n-title / data-i18n-aria वाले सारे elements भरें */
export function applyStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  root.querySelectorAll('[data-i18n-title]').forEach((el) => (el.title = t(el.dataset.i18nTitle)));
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.documentElement.lang = current;
}

/** किसी ख़ास भाषा में (search में English नाम से भी match करने के लिए) */
export const tIn = (lang, key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;

/** register('key', [en, hi, mr, gu, bn, ta, te, kn, pa]) — दूसरी files (जैसे categories.js) अपने texts यहीं जोड़ती हैं */
export function register(key, arr) {
  LANGS.forEach((l, i) => {
    if (arr[i] != null) (STRINGS[l.id] ||= {})[key] = arr[i];
  });
}

export const allKeys = () => Object.keys(STRINGS.en);
export const langKeys = (id) => Object.keys(STRINGS[id] || {});

// ---------- v1.2: categories, out-of-stock ----------
//                     en | hi | mr | gu | bn | ta | te | kn | pa
const R = register;
R('catPlaceholder', ['Type to search — e.g. mob, fridge, diaper', 'टाइप करें — जैसे mob, fridge, diaper', 'टाइप करा — उदा. mob, fridge, diaper', 'ટાઇપ કરો — દા.ત. mob, fridge, diaper', 'টাইপ করুন — যেমন mob, fridge, diaper', 'தட்டச்சு செய்யுங்கள் — எ.கா. mob, fridge, diaper', 'టైప్ చేయండి — ఉదా. mob, fridge, diaper', 'ಟೈಪ್ ಮಾಡಿ — ಉದಾ. mob, fridge, diaper', 'ਟਾਈਪ ਕਰੋ — ਜਿਵੇਂ mob, fridge, diaper']);
R('catNoMatch', ['No matching category', 'कोई कैटेगरी नहीं मिली', 'जुळणारी श्रेणी नाही', 'કોઈ કેટેગરી મળી નહીં', 'মিলে যাওয়া ক্যাটাগরি নেই', 'பொருந்தும் வகை இல்லை', 'సరిపోలే వర్గం లేదు', 'ಹೊಂದುವ ವರ್ಗ ಇಲ್ಲ', 'ਕੋਈ ਮਿਲਦੀ ਸ਼੍ਰੇਣੀ ਨਹੀਂ']);
R('catAuto', ['auto-detected from your text', 'आपके लिखे से अपने-आप पहचानी गई', 'तुमच्या मजकुरावरून आपोआप ओळखली', 'તમારા લખાણ પરથી આપમેળે ઓળખાઈ', 'আপনার লেখা থেকে স্বয়ংক্রিয়ভাবে চেনা', 'உங்கள் உரையிலிருந்து தானாகக் கண்டறியப்பட்டது', 'మీ రాతను బట్టి ఆటోమేటిక్‌గా గుర్తించబడింది', 'ನಿಮ್ಮ ಬರಹದಿಂದ ಸ್ವಯಂ ಪತ್ತೆಯಾಗಿದೆ', 'ਤੁਹਾਡੇ ਲਿਖੇ ਤੋਂ ਆਪਣੇ ਆਪ ਪਛਾਣੀ']);
R('showOOS', ['Show out-of-stock items', 'आउट ऑफ़ स्टॉक भी दिखाएँ', 'स्टॉक संपलेलेही दाखवा', 'આઉટ ઓફ સ્ટોક પણ બતાવો', 'স্টক শেষ হওয়া পণ্যও দেখান', 'இருப்பு இல்லாதவற்றையும் காட்டு', 'స్టాక్ లేనివి కూడా చూపించు', 'ಸ್ಟಾಕ್ ಇಲ್ಲದವನ್ನೂ ತೋರಿಸಿ', 'ਆਊਟ ਆਫ਼ ਸਟਾਕ ਵੀ ਵਿਖਾਓ']);
R('outOfStock', ['Out of stock', 'आउट ऑफ़ स्टॉक', 'स्टॉक संपला', 'આઉટ ઓફ સ્ટોક', 'স্টক নেই', 'இருப்பு இல்லை', 'స్టాక్ లేదు', 'ಸ್ಟಾಕ್ ಇಲ್ಲ', 'ਸਟਾਕ ਖ਼ਤਮ']);
R('oosCount', ['{n} out of stock hidden', '{n} आउट ऑफ़ स्टॉक छुपे हैं', '{n} स्टॉक संपलेले लपवले', '{n} આઉટ ઓફ સ્ટોક છુપાવ્યા', '{n}টি স্টক-শেষ লুকানো', '{n} இருப்பு இல்லாதவை மறைக்கப்பட்டன', '{n} స్టాక్ లేనివి దాచబడ్డాయి', '{n} ಸ್ಟಾಕ್ ಇಲ್ಲದವು ಮರೆಮಾಡಲಾಗಿದೆ', '{n} ਸਟਾਕ ਖ਼ਤਮ ਲੁਕਾਏ']);
R('priceNA', ['Price not shown', 'कीमत नहीं दिखाई', 'किंमत दाखवलेली नाही', 'કિંમત દર્શાવી નથી', 'দাম দেখানো নেই', 'விலை காட்டப்படவில்லை', 'ధర చూపలేదు', 'ಬೆಲೆ ತೋರಿಸಿಲ್ಲ', 'ਕੀਮਤ ਨਹੀਂ ਦਿਖਾਈ']);
R('siteIrrelevant', ["This store doesn't usually sell this category", 'यह साइट आमतौर पर यह कैटेगरी नहीं बेचती', 'ही साइट सहसा ही श्रेणी विकत नाही', 'આ સાઇટ સામાન્ય રીતે આ કેટેગરી વેચતી નથી', 'এই সাইট সাধারণত এই ক্যাটাগরি বিক্রি করে না', 'இந்த தளம் பொதுவாக இந்த வகையை விற்பதில்லை', 'ఈ సైట్ సాధారణంగా ఈ వర్గాన్ని అమ్మదు', 'ಈ ಸೈಟ್ ಸಾಮಾನ್ಯವಾಗಿ ಈ ವರ್ಗವನ್ನು ಮಾರುವುದಿಲ್ಲ', 'ਇਹ ਸਾਈਟ ਆਮ ਤੌਰ ਤੇ ਇਹ ਸ਼੍ਰੇਣੀ ਨਹੀਂ ਵੇਚਦੀ']);
R('brandAnyText', ['Any brand', 'कोई भी ब्रांड', 'कोणताही ब्रँड', 'કોઈ પણ બ્રાન્ડ', 'যেকোনো ব্র্যান্ড', 'எந்த பிராண்டும்', 'ఏ బ్రాండ్ అయినా', 'ಯಾವುದೇ ಬ್ರ್ಯಾಂಡ್', 'ਕੋਈ ਵੀ ਬ੍ਰਾਂਡ']);
R('bestDealTitle', ['Lowest price among items with all your specs', 'सारी ज़रूरी specs वाले products में सबसे कम कीमत', 'तुमच्या सर्व specs असलेल्या वस्तूंमध्ये सर्वात कमी किंमत', 'તમારી બધી specs વાળી વસ્તુઓમાં સૌથી ઓછી કિંમત', 'আপনার সব specs আছে এমন পণ্যের মধ্যে সবচেয়ে কম দাম', 'உங்கள் எல்லா specs உள்ள பொருட்களில் குறைந்த விலை', 'మీ అన్ని specs ఉన్న వస్తువుల్లో అతి తక్కువ ధర', 'ನಿಮ್ಮ ಎಲ್ಲಾ specs ಇರುವ ವಸ್ತುಗಳಲ್ಲಿ ಕಡಿಮೆ ಬೆಲೆ', 'ਤੁਹਾਡੀਆਂ ਸਾਰੀਆਂ specs ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਕੀਮਤ']);
// ---------- ग्राहक रेटिंग filter ----------
R('minRating', ['Customer rating', 'ग्राहक रेटिंग', 'ग्राहक रेटिंग', 'ગ્રાહક રેટિંગ', 'গ্রাহক রেটিং', 'வாடிக்கையாளர் மதிப்பீடு', 'కస్టమర్ రేటింగ్', 'ಗ್ರಾಹಕರ ರೇಟಿಂಗ್', 'ਗਾਹਕ ਰੇਟਿੰਗ']);
R('ratingUp', ['{r}★ & up', '{r}★ और ऊपर', '{r}★ आणि अधिक', '{r}★ અને વધુ', '{r}★ ও তার বেশি', '{r}★ மற்றும் அதற்கு மேல்', '{r}★ మరియు పైన', '{r}★ ಮತ್ತು ಮೇಲ್ಪಟ್ಟು', '{r}★ ਅਤੇ ਵੱਧ']);
R('ratingHidden', ['{n} hidden: rated below {r}★ or not rated', '{n} छुपे: {r}★ से कम या बिना रेटिंग', '{n} लपवले: {r}★ पेक्षा कमी किंवा रेटिंग नसलेले', '{n} છુપાવ્યા: {r}★ થી ઓછું અથવા રેટિંગ વગરના', '{n}টি লুকানো: {r}★-এর কম বা রেটিং নেই', '{n} மறைக்கப்பட்டன: {r}★-க்குக் குறைவு அல்லது மதிப்பீடு இல்லை', '{n} దాచబడ్డాయి: {r}★ కంటే తక్కువ లేదా రేటింగ్ లేనివి', '{n} ಮರೆಮಾಡಲಾಗಿದೆ: {r}★ ಗಿಂತ ಕಡಿಮೆ ಅಥವಾ ರೇಟಿಂಗ್ ಇಲ್ಲದವು', '{n} ਲੁਕਾਏ: {r}★ ਤੋਂ ਘੱਟ ਜਾਂ ਬਿਨਾਂ ਰੇਟਿੰਗ']);
R('descPlaceholder', ['e.g. Samsung 5G phone, 8GB RAM, under 20000 — or: double door fridge 300L, 4 star', 'जैसे: Samsung 5G phone, 8GB RAM, 20000 तक — या: double door fridge 300L, 4 star', 'उदा.: Samsung 5G फोन, 8GB RAM, 20000 पर्यंत — किंवा: double door fridge 300L', 'દા.ત.: Samsung 5G ફોન, 8GB RAM, 20000 સુધી — અથવા: double door fridge 300L', 'যেমন: Samsung 5G ফোন, 8GB RAM, 20000 পর্যন্ত — বা: double door fridge 300L', 'எ.கா: Samsung 5G போன், 8GB RAM, 20000 வரை — அல்லது: double door fridge 300L', 'ఉదా: Samsung 5G ఫోన్, 8GB RAM, 20000 వరకు — లేదా: double door fridge 300L', 'ಉದಾ: Samsung 5G ಫೋನ್, 8GB RAM, 20000 ವರೆಗೆ — ಅಥವಾ: double door fridge 300L', 'ਜਿਵੇਂ: Samsung 5G ਫ਼ੋਨ, 8GB RAM, 20000 ਤੱਕ — ਜਾਂ: double door fridge 300L']);
