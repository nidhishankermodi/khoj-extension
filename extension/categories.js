// Category catalog: नाम (9 भाषाओं में), search synonyms, कौन-सी साइट्स बेचती हैं,
// ब्रांड, और हर category के अपने filters (fields)।
//
// Field types:
//   min    — "कम से कम" वाला नंबर (RAM 8GB+, 300L+, 4 star+). `extract` = parser.js का extractor नाम
//   range  — नंबर की range (screen 13–14", TV 43")
//   select — options में से एक; हर option का regex title में ढूँढा जाता है
//   bool   — checkbox (5G, Inverter, ANC…)
// नई category जोड़ने के लिए नीचे CATEGORIES में एक entry डालें।

import { register, t, tIn, LANGS } from './i18n.js';

const L = (key, arr) => { register(key, arr); return key; };

// ---------- साइट्स ----------
const ALL = ['amazon', 'flipkart', 'jiomart', 'croma', 'reliance'];
const GEN = ['amazon', 'flipkart', 'jiomart'];
const BOOKS = ['amazon', 'flipkart'];

// ---------- builders ----------
// option: [label, regex, searchTerm, labelKey?]
const o = (label, re, q, labelKey) => ({ v: label, label, re: re ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '[\\s-]*'), q: q ?? label.toLowerCase(), labelKey });
const sel = (id, label, options, extra = {}) => ({ id, type: 'select', label, options: options.map((x) => (Array.isArray(x) ? o(...x) : x)), ...extra });
const min = (id, label, extract, values, fmt, extra = {}) => ({ id, type: 'min', label, extract, values, fmt, chip: fmt, inQuery: false, ...extra });
const range = (id, label, extract, opts, extra = {}) => ({ id, type: 'range', label, extract, options: opts.map(([lbl, lo, hi, q]) => ({ v: lbl, label: lbl, lo, hi, q })), inQuery: true, ...extra });
const bool = (id, label, re, q, chip, extra = {}) => ({ id, type: 'bool', label, re, q, chip, ...extra });

const gb = (v) => (v >= 1024 ? `${v / 1024} TB` : `${v} GB`);
const TYPE = 'fType';

// ---------- field labels ----------
L('fCamera', ['Camera (at least)', 'कैमरा (कम से कम)', 'कॅमेरा (किमान)', 'કેમેરા (ઓછામાં ઓછો)', 'ক্যামেরা (কমপক্ষে)', 'கேமரா (குறைந்தது)', 'కెమెరా (కనీసం)', 'ಕ್ಯಾಮೆರಾ (ಕನಿಷ್ಠ)', 'ਕੈਮਰਾ (ਘੱਟੋ-ਘੱਟ)']);
L('fBattery', ['Battery (at least)', 'बैटरी (कम से कम)', 'बॅटरी (किमान)', 'બેટરી (ઓછામાં ઓછી)', 'ব্যাটারি (কমপক্ষে)', 'பேட்டரி (குறைந்தது)', 'బ్యాటరీ (కనీసం)', 'ಬ್ಯಾಟರಿ (ಕನಿಷ್ಠ)', 'ਬੈਟਰੀ (ਘੱਟੋ-ਘੱਟ)']);
L('fDisplay', ['Display', 'डिस्प्ले', 'डिस्प्ले', 'ડિસ્પ્લે', 'ডিসপ্লে', 'டிஸ்ப்ளே', 'డిస్‌ప్లే', 'ಡಿಸ್‌ಪ್ಲೇ', 'ਡਿਸਪਲੇ']);
L('fRefresh', ['Refresh rate (at least)', 'रिफ्रेश रेट (कम से कम)', 'रिफ्रेश रेट (किमान)', 'રિફ્રેશ રેટ (ઓછામાં ઓછો)', 'রিফ্রেশ রেট (কমপক্ষে)', 'ரிஃப்ரெஷ் ரேட் (குறைந்தது)', 'రిఫ్రెష్ రేట్ (కనీసం)', 'ರಿಫ್ರೆಶ್ ರೇಟ್ (ಕನಿಷ್ಠ)', 'ਰਿਫ੍ਰੈਸ਼ ਰੇਟ (ਘੱਟੋ-ਘੱਟ)']);
L('fScreen', ['Screen size', 'स्क्रीन साइज़', 'स्क्रीन आकार', 'સ્ક્રીન સાઇઝ', 'স্ক্রিন সাইজ', 'திரை அளவு', 'స్క్రీన్ పరిమాణం', 'ಪರದೆ ಗಾತ್ರ', 'ਸਕ੍ਰੀਨ ਸਾਈਜ਼']);
L('fConnectivity', ['Connectivity', 'कनेक्टिविटी', 'कनेक्टिव्हिटी', 'કનેક્ટિવિટી', 'কানেক্টিভিটি', 'இணைப்பு', 'కనెక్టివిటీ', 'ಸಂಪರ್ಕ', 'ਕਨੈਕਟੀਵਿਟੀ']);
L('fProcessor', ['Processor', 'प्रोसेसर', 'प्रोसेसर', 'પ્રોસેસર', 'প্রসেসর', 'பிராசசர்', 'ప్రాసెసర్', 'ಪ್ರೊಸೆಸರ್', 'ਪ੍ਰੋਸੈਸਰ']);
L('fSsd', ['SSD (at least)', 'SSD (कम से कम)', 'SSD (किमान)', 'SSD (ઓછામાં ઓછું)', 'SSD (কমপক্ষে)', 'SSD (குறைந்தது)', 'SSD (కనీసం)', 'SSD (ಕನಿಷ್ಠ)', 'SSD (ਘੱਟੋ-ਘੱਟ)']);
L('fUse', ['Made for', 'किसके लिए', 'कशासाठी', 'શેના માટે', 'কীসের জন্য', 'எதற்காக', 'దేని కోసం', 'ಯಾವುದಕ್ಕಾಗಿ', 'ਕਿਸ ਲਈ']);
L('fOs', ['Operating system', 'ऑपरेटिंग सिस्टम', 'ऑपरेटिंग सिस्टम', 'ઓપરેટિંગ સિસ્ટમ', 'অপারেটিং সিস্টেম', 'இயக்க முறைமை', 'ఆపరేటింగ్ సిస్టమ్', 'ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್', 'ਆਪਰੇਟਿੰਗ ਸਿਸਟਮ']);
L('fGpu', ['Dedicated graphics', 'डेडिकेटेड ग्राफ़िक्स', 'डेडिकेटेड ग्राफिक्स', 'ડેડિકેટેડ ગ્રાફિક્સ', 'ডেডিকেটেড গ্রাফিক্স', 'தனி கிராஃபிக்ஸ்', 'డెడికేటెడ్ గ్రాఫిక్స్', 'ಡೆಡಿಕೇಟೆಡ್ ಗ್ರಾಫಿಕ್ಸ್', 'ਡੈਡੀਕੇਟਿਡ ਗ੍ਰਾਫ਼ਿਕਸ']);
L('fResolution', ['Resolution', 'रेज़ोल्यूशन', 'रिझोल्यूशन', 'રિઝોલ્યુશન', 'রেজোলিউশন', 'ரெசல்யூஷன்', 'రిజల్యూషన్', 'ರೆಸಲ್ಯೂಶನ್', 'ਰੈਜ਼ੋਲਿਊਸ਼ਨ']);
L('fPanel', ['Panel type', 'पैनल टाइप', 'पॅनल प्रकार', 'પેનલ પ્રકાર', 'প্যানেলের ধরন', 'பேனல் வகை', 'ప్యానెల్ రకం', 'ಪ್ಯಾನೆಲ್ ಪ್ರಕಾರ', 'ਪੈਨਲ ਕਿਸਮ']);
L(TYPE, ['Type', 'प्रकार', 'प्रकार', 'પ્રકાર', 'ধরন', 'வகை', 'రకం', 'ಪ್ರಕಾರ', 'ਕਿਸਮ']);
L('fWireless', ['Wireless', 'वायरलेस', 'वायरलेस', 'વાયરલેસ', 'ওয়্যারলেস', 'வயர்லெஸ்', 'వైర్‌లెస్', 'ವೈರ್‌ಲೆಸ್', 'ਵਾਇਰਲੈੱਸ']);
L('fWifi', ['Wi-Fi', 'Wi-Fi', 'Wi-Fi', 'Wi-Fi', 'Wi-Fi', 'Wi-Fi', 'Wi-Fi', 'Wi-Fi', 'Wi-Fi']);
L('fCapacity', ['Capacity (at least)', 'क्षमता (कम से कम)', 'क्षमता (किमान)', 'ક્ષમતા (ઓછામાં ઓછી)', 'ক্ষমতা (কমপক্ষে)', 'கொள்ளளவு (குறைந்தது)', 'సామర్థ్యం (కనీసం)', 'ಸಾಮರ್ಥ್ಯ (ಕನಿಷ್ಠ)', 'ਸਮਰੱਥਾ (ਘੱਟੋ-ਘੱਟ)']);
L('fAnc', ['Noise cancellation (ANC)', 'नॉइज़ कैंसलेशन (ANC)', 'नॉईज कॅन्सलेशन (ANC)', 'નોઇઝ કેન્સલેશન (ANC)', 'নয়েজ ক্যান্সেলেশন (ANC)', 'நாய்ஸ் கேன்சலேஷன் (ANC)', 'నాయిస్ క్యాన్సలేషన్ (ANC)', 'ನಾಯ್ಸ್ ಕ್ಯಾನ್ಸಲೇಶನ್ (ANC)', 'ਨੌਇਜ਼ ਕੈਂਸਲੇਸ਼ਨ (ANC)']);
L('fPower', ['Power (at least)', 'पावर (कम से कम)', 'पॉवर (किमान)', 'પાવર (ઓછામાં ઓછો)', 'পাওয়ার (কমপক্ষে)', 'திறன் (குறைந்தது)', 'పవర్ (కనీసం)', 'ಪವರ್ (ಕನಿಷ್ಠ)', 'ਪਾਵਰ (ਘੱਟੋ-ਘੱਟ)']);
L('fCalling', ['Bluetooth calling', 'ब्लूटूथ कॉलिंग', 'ब्लूटूथ कॉलिंग', 'બ્લૂટૂથ કૉલિંગ', 'ব্লুটুথ কলিং', 'ப்ளூடூத் அழைப்பு', 'బ్లూటూత్ కాలింగ్', 'ಬ್ಲೂಟೂತ್ ಕರೆ', 'ਬਲੂਟੁੱਥ ਕਾਲਿੰਗ']);
L('fGps', ['Built-in GPS', 'बिल्ट-इन GPS', 'बिल्ट-इन GPS', 'બિલ્ટ-ઇન GPS', 'বিল্ট-ইন GPS', 'உள்ளமைந்த GPS', 'బిల్ట్-ఇన్ GPS', 'ಅಂತರ್ನಿರ್ಮಿತ GPS', 'ਬਿਲਟ-ਇਨ GPS']);
L('fDoor', ['Door type', 'दरवाज़े', 'दरवाजे', 'દરવાજા', 'দরজা', 'கதவு வகை', 'డోర్ రకం', 'ಬಾಗಿಲು ಪ್ರಕಾರ', 'ਦਰਵਾਜ਼ੇ']);
L('fStars', ['Energy rating (at least)', 'एनर्जी रेटिंग (कम से कम)', 'ऊर्जा रेटिंग (किमान)', 'એનર્જી રેટિંગ (ઓછામાં ઓછું)', 'এনার্জি রেটিং (কমপক্ষে)', 'ஆற்றல் மதிப்பீடு (குறைந்தது)', 'ఎనర్జీ రేటింగ్ (కనీసం)', 'ಇಂಧನ ರೇಟಿಂಗ್ (ಕನಿಷ್ಠ)', 'ਊਰਜਾ ਰੇਟਿੰਗ (ਘੱਟੋ-ਘੱਟ)']);
L('fInverter', ['Inverter technology', 'इन्वर्टर टेक्नोलॉजी', 'इन्व्हर्टर तंत्रज्ञान', 'ઇન્વર્ટર ટેક્નોલોજી', 'ইনভার্টার প্রযুক্তি', 'இன்வெர்ட்டர் தொழில்நுட்பம்', 'ఇన్వర్టర్ టెక్నాలజీ', 'ಇನ್ವರ್ಟರ್ ತಂತ್ರಜ್ಞಾನ', 'ਇਨਵਰਟਰ ਤਕਨੀਕ']);
L('fTonnage', ['Tonnage', 'टन', 'टन', 'ટન', 'টন', 'டன்', 'టన్నులు', 'ಟನ್', 'ਟਨ']);
L('fTech', ['Purification', 'शुद्धिकरण तकनीक', 'शुद्धीकरण तंत्र', 'શુદ્ધિકરણ ટેક્નોલોજી', 'পরিশোধন প্রযুক্তি', 'சுத்திகரிப்பு முறை', 'శుద్ధి సాంకేతికత', 'ಶುದ್ಧೀಕರಣ ತಂತ್ರಜ್ಞಾನ', 'ਸ਼ੁੱਧੀਕਰਨ ਤਕਨੀਕ']);
L('fBldc', ['BLDC (power saving)', 'BLDC (बिजली बचत)', 'BLDC (वीज बचत)', 'BLDC (વીજળી બચત)', 'BLDC (বিদ্যুৎ সাশ্রয়ী)', 'BLDC (மின் சேமிப்பு)', 'BLDC (విద్యుత్ ఆదా)', 'BLDC (ವಿದ್ಯುತ್ ಉಳಿತಾಯ)', 'BLDC (ਬਿਜਲੀ ਬੱਚਤ)']);
L('fMaterial', ['Material', 'मटीरियल', 'साहित्य', 'મટીરિયલ', 'উপাদান', 'பொருள்', 'మెటీరియల్', 'ವಸ್ತು', 'ਮਟੀਰੀਅਲ']);
L('fInduction', ['Induction compatible', 'इंडक्शन पर चलने वाला', 'इंडक्शन सुसंगत', 'ઇન્ડક્શન પર ચાલે', 'ইন্ডাকশনে চলে', 'இண்டக்ஷனுக்கு ஏற்றது', 'ఇండక్షన్‌కు అనుకూలం', 'ಇಂಡಕ್ಷನ್‌ಗೆ ಹೊಂದುತ್ತದೆ', 'ਇੰਡਕਸ਼ਨ ਤੇ ਚੱਲਣ ਵਾਲਾ']);
L('fSize', ['Size', 'साइज़', 'आकार', 'સાઇઝ', 'সাইজ', 'அளவு', 'సైజు', 'ಗಾತ್ರ', 'ਸਾਈਜ਼']);
L('fColour', ['Colour', 'रंग', 'रंग', 'રંગ', 'রং', 'நிறம்', 'రంగు', 'ಬಣ್ಣ', 'ਰੰਗ']);
L('fGender', ['For', 'किसके लिए', 'कोणासाठी', 'કોના માટે', 'কার জন্য', 'யாருக்கு', 'ఎవరి కోసం', 'ಯಾರಿಗೆ', 'ਕਿਸ ਲਈ']);
L('fSkin', ['Skin type', 'त्वचा का प्रकार', 'त्वचेचा प्रकार', 'ત્વચાનો પ્રકાર', 'ত্বকের ধরন', 'சரும வகை', 'చర్మ రకం', 'ಚರ್ಮದ ಪ್ರಕಾರ', 'ਚਮੜੀ ਦੀ ਕਿਸਮ']);
L('fCordless', ['Cordless', 'कॉर्डलेस', 'कॉर्डलेस', 'કોર્ડલેસ', 'কর্ডলেস', 'கம்பியில்லா', 'కార్డ్‌లెస్', 'ಕಾರ್ಡ್‌ಲೆಸ್', 'ਕੋਰਡਲੈੱਸ']);
L('fCount', ['Pack count (at least)', 'पैक में संख्या (कम से कम)', 'पॅकमधील संख्या (किमान)', 'પેકમાં સંખ્યા (ઓછામાં ઓછી)', 'প্যাকে সংখ্যা (কমপক্ষে)', 'பேக்கில் எண்ணிக்கை (குறைந்தது)', 'ప్యాక్‌లో సంఖ్య (కనీసం)', 'ಪ್ಯಾಕ್‌ನಲ್ಲಿ ಸಂಖ್ಯೆ (ಕನಿಷ್ಠ)', 'ਪੈਕ ਵਿੱਚ ਗਿਣਤੀ (ਘੱਟੋ-ਘੱਟ)']);
L('fAge', ['Age', 'उम्र', 'वय', 'ઉંમર', 'বয়স', 'வயது', 'వయస్సు', 'ವಯಸ್ಸು', 'ਉਮਰ']);
L('fQuantity', ['Quantity (at least)', 'मात्रा (कम से कम)', 'प्रमाण (किमान)', 'જથ્થો (ઓછામાં ઓછો)', 'পরিমাণ (কমপক্ষে)', 'அளவு (குறைந்தது)', 'పరిమాణం (కనీసం)', 'ಪ್ರಮಾಣ (ಕನಿಷ್ಠ)', 'ਮਾਤਰਾ (ਘੱਟੋ-ਘੱਟ)']);
L('fVeg', ['Vegetarian', 'शाकाहारी', 'शाकाहारी', 'શાકાહારી', 'নিরামিষ', 'சைவம்', 'శాకాహారం', 'ಸಸ್ಯಾಹಾರಿ', 'ਸ਼ਾਕਾਹਾਰੀ']);
L('fPowerSource', ['Power source', 'पावर सोर्स', 'पॉवर स्रोत', 'પાવર સોર્સ', 'পাওয়ার সোর্স', 'மின் ஆதாரம்', 'పవర్ సోర్స్', 'ವಿದ್ಯುತ್ ಮೂಲ', 'ਪਾਵਰ ਸਰੋਤ']);
L('fVoltage', ['Battery voltage', 'बैटरी वोल्टेज', 'बॅटरी व्होल्टेज', 'બેટરી વોલ્ટેજ', 'ব্যাটারি ভোল্টেজ', 'பேட்டரி வோல்டேஜ்', 'బ్యాటరీ వోల్టేజ్', 'ಬ್ಯಾಟರಿ ವೋಲ್ಟೇಜ್', 'ਬੈਟਰੀ ਵੋਲਟੇਜ']);
L('fWeight', ['Weight (at least)', 'वज़न (कम से कम)', 'वजन (किमान)', 'વજન (ઓછામાં ઓછું)', 'ওজন (কমপক্ষে)', 'எடை (குறைந்தது)', 'బరువు (కనీసం)', 'ತೂಕ (ಕನಿಷ್ಠ)', 'ਭਾਰ (ਘੱਟੋ-ਘੱਟ)']);
L('fGears', ['With gears', 'गियर वाली', 'गिअर असलेली', 'ગિયરવાળી', 'গিয়ারযুক্ত', 'கியர் உடன்', 'గేర్లతో', 'ಗೇರ್ ಸಹಿತ', 'ਗੇਅਰ ਵਾਲੀ']);
L('fWheel', ['Wheel size', 'पहिये का साइज़', 'चाकाचा आकार', 'વ્હીલ સાઇઝ', 'চাকার সাইজ', 'சக்கர அளவு', 'చక్రం సైజు', 'ಚಕ್ರದ ಗಾತ್ರ', 'ਪਹੀਏ ਦਾ ਸਾਈਜ਼']);
L('fFormat', ['Format', 'फ़ॉर्मेट', 'स्वरूप', 'ફોર્મેટ', 'ফরম্যাট', 'வடிவம்', 'ఫార్మాట్', 'ಸ್ವರೂಪ', 'ਫ਼ਾਰਮੈਟ']);
L('fPet', ['Pet', 'पालतू जानवर', 'पाळीव प्राणी', 'પાળતુ પ્રાણી', 'পোষ্য', 'செல்லப்பிராணி', 'పెంపుడు జంతువు', 'ಸಾಕುಪ್ರಾಣಿ', 'ਪਾਲਤੂ ਜਾਨਵਰ']);
L('fFunction', ['Functions', 'फ़ंक्शन', 'कार्ये', 'ફંક્શન', 'ফাংশন', 'செயல்பாடுகள்', 'ఫంక్షన్లు', 'ಕಾರ್ಯಗಳು', 'ਫ਼ੰਕਸ਼ਨ']);

// option labels जिनका अनुवाद ज़रूरी है
L('oMen', ['Men', 'पुरुष', 'पुरुष', 'પુરુષ', 'পুরুষ', 'ஆண்கள்', 'పురుషులు', 'ಪುರುಷರು', 'ਮਰਦ']);
L('oWomen', ['Women', 'महिलाएँ', 'महिला', 'મહિલાઓ', 'মহিলা', 'பெண்கள்', 'మహిళలు', 'ಮಹಿಳೆಯರು', 'ਔਰਤਾਂ']);
L('oKids', ['Kids', 'बच्चे', 'मुले', 'બાળકો', 'বাচ্চা', 'குழந்தைகள்', 'పిల్లలు', 'ಮಕ್ಕಳು', 'ਬੱਚੇ']);
L('oBoys', ['Boys', 'लड़के', 'मुलगे', 'છોકરા', 'ছেলে', 'சிறுவர்கள்', 'అబ్బాయిలు', 'ಹುಡುಗರು', 'ਮੁੰਡੇ']);
L('oGirls', ['Girls', 'लड़कियाँ', 'मुली', 'છોકરીઓ', 'মেয়ে', 'சிறுமிகள்', 'అమ్మాయిలు', 'ಹುಡುಗಿಯರು', 'ਕੁੜੀਆਂ']);
L('oBaby', ['Baby / infant', 'शिशु', 'बाळ', 'શિશુ', 'শিশু', 'கைக்குழந்தை', 'శిశువు', 'ಶಿಶು', 'ਨਵਜੰਮਿਆ ਬੱਚਾ']);
L('oUnisex', ['Unisex', 'यूनिसेक्स', 'युनिसेक्स', 'યુનિસેક્સ', 'ইউনিসেক্স', 'இருபாலருக்கும்', 'యూనిసెక్స్', 'ಯುನಿಸೆಕ್ಸ್', 'ਯੂਨੀਸੈਕਸ']);
L('oDog', ['Dog', 'कुत्ता', 'कुत्रा', 'કૂતરો', 'কুকুর', 'நாய்', 'కుక్క', 'ನಾಯಿ', 'ਕੁੱਤਾ']);
L('oCat', ['Cat', 'बिल्ली', 'मांजर', 'બિલાડી', 'বিড়াল', 'பூனை', 'పిల్లి', 'ಬೆಕ್ಕು', 'ਬਿੱਲੀ']);

// ---------- reusable fields ----------
const RAM = (vals = [4, 6, 8, 12, 16]) => min('ram', 'ram', 'ram', vals, (v) => `${v} GB+`, { inQuery: true, q: (v) => `${v}gb ram`, chip: (v) => `${v}GB+ RAM` });
const STORAGE = (vals, label = 'storage', id = 'storage') => min(id, label, 'storage', vals, (v) => `${gb(v)}+`, { inQuery: true, q: (v) => gb(v).replace(' ', '').toLowerCase() });
const STARS = (vals = [3, 4, 5]) => min('stars', 'fStars', 'stars', vals, (v) => `${v}★+`);
const LITRES = (vals) => min('capacity', 'fCapacity', 'litre', vals, (v) => `${v} L+`);
const INVERTER = bool('inverter', 'fInverter', 'inverter|bldc|direct\\s*drive', 'inverter', 'Inverter');
const GENDER = (opts = ['men', 'women']) => sel('gender', 'fGender', opts.map((g) => ({
  men: ['Men', "\\bmen\\b|\\bmens\\b|men's|\\bmale\\b|\\bgents\\b", 'men', 'oMen'],
  women: ['Women', "women|ladies|\\bfemale\\b|girls?\\b", 'women', 'oWomen'],
  kids: ['Kids', 'kids|boys?\\b|girls?\\b|junior|child', 'kids', 'oKids'],
  unisex: ['Unisex', 'unisex|couple', 'unisex', 'oUnisex']
}[g])), { inQuery: true });
const COLOUR = sel('colour', 'fColour', ['Black', 'White', 'Blue', 'Navy', 'Grey', 'Green', 'Red', 'Pink', 'Yellow', 'Beige', 'Brown', 'Maroon']
  .map((c) => [c, `\\b${c.toLowerCase()}\\b${c === 'Grey' ? '|\\bgray\\b' : ''}`, c.toLowerCase()]));
const BED_SIZE = sel('size', 'fSize', [['Single', '\\bsingle\\b'], ['Double', '\\bdouble\\b'], ['Queen', '\\bqueen\\b'], ['King', '\\bking\\b']]);

// ---------- brands ----------
const BR = {
  phones: [['Samsung', 'samsung', 'galaxy', 'सैमसंग'], ['Apple (iPhone)', 'apple', 'iphone', 'आईफोन', 'एप्पल'], ['OnePlus', 'oneplus', 'one plus', 'वनप्लस'], ['Xiaomi / Redmi', 'xiaomi', 'redmi', 'mi', 'रेडमी'], ['POCO', 'poco'], ['realme', 'realme', 'narzo', 'रियलमी'], ['vivo', 'vivo', 'वीवो'], ['iQOO', 'iqoo'], ['OPPO', 'oppo', 'ओप्पो'], ['Motorola', 'motorola', 'moto', 'मोटोरोला'], ['Google Pixel', 'google pixel', 'pixel'], ['Nothing / CMF', 'nothing phone', 'cmf phone', 'cmf'], 'Infinix', 'Tecno', 'Lava', 'Honor', 'Nokia', 'itel'],
  tablets: [['Apple (iPad)', 'apple', 'ipad'], 'Samsung', 'Lenovo', ['Xiaomi / Redmi', 'xiaomi', 'redmi', 'mi'], 'OnePlus', 'realme', 'Honor', 'POCO'],
  laptops: [['HP', 'hp'], 'Dell', 'Lenovo', ['ASUS', 'asus'], 'Acer', ['Apple (MacBook)', 'apple', 'macbook'], 'MSI', 'Samsung', 'Infinix', ['Microsoft Surface', 'surface']],
  monitors: ['Samsung', 'LG', 'Dell', 'Acer', 'BenQ', ['ASUS', 'asus'], 'MSI', 'Lenovo', 'Zebronics', ['HP', 'hp']],
  printers: [['HP', 'hp'], 'Canon', 'Epson', 'Brother'],
  pcacc: ['Logitech', ['HP', 'hp'], 'Dell', 'Zebronics', 'Lenovo', 'Portronics', 'boAt'],
  storage: ['SanDisk', 'Samsung', 'Seagate', ['WD (Western Digital)', 'western digital', 'wd'], 'Kingston', ['HP', 'hp'], 'Crucial', 'Lexar'],
  tvs: ['Samsung', 'LG', 'Sony', 'TCL', ['Xiaomi / Redmi', 'xiaomi', 'redmi', 'mi'], 'OnePlus', 'Acer', 'Hisense', 'Vu', 'Panasonic', 'Thomson', 'Toshiba', 'Haier'],
  audio: ['boAt', 'JBL', 'Sony', 'OnePlus', 'Noise', 'realme', 'Boult', 'Bose', 'Samsung', ['Apple', 'apple', 'airpods'], 'Sennheiser', 'Marshall', 'Zebronics', 'Philips'],
  wear: ['Noise', 'boAt', ['Fire-Boltt', 'fire-boltt', 'fire boltt'], 'Amazfit', 'Samsung', 'Apple', 'Titan', 'Fastrack', 'Garmin', 'OnePlus'],
  cameras: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'GoPro', 'Panasonic', 'DJI', 'Insta360'],
  fridges: ['LG', 'Samsung', 'Whirlpool', 'Godrej', 'Haier', 'Bosch', 'Panasonic', 'Voltas Beko'],
  washers: ['LG', 'Samsung', 'Whirlpool', 'IFB', 'Bosch', 'Godrej', 'Haier', 'Panasonic'],
  acs: ['Voltas', 'Daikin', 'LG', 'Samsung', ['Blue Star', 'blue star', 'bluestar'], 'Lloyd', 'Carrier', 'Hitachi', 'Panasonic', 'Godrej'],
  micro: ['LG', 'Samsung', 'IFB', 'Panasonic', 'Morphy Richards', 'Bajaj', 'Agaro'],
  purifier: ['Kent', ['Aquaguard', 'aquaguard', 'eureka forbes'], 'Livpure', 'Pureit', ['A. O. Smith', 'ao smith', 'a. o. smith', 'a.o. smith'], 'Havells', 'Blue Star'],
  fans: ['Havells', 'Crompton', 'Usha', 'Orient', 'Bajaj', 'Atomberg', 'Polycab'],
  coolers: ['Symphony', 'Bajaj', 'Crompton', 'Havells', 'Kenstar', 'Orient', 'Voltas'],
  geysers: ['Racold', ['A. O. Smith', 'ao smith', 'a. o. smith'], 'Havells', 'Bajaj', 'Crompton', ['V-Guard', 'v-guard', 'vguard']],
  mixers: ['Prestige', 'Philips', 'Bajaj', 'Preethi', 'Butterfly', 'Sujata', 'Usha', 'Wonderchef'],
  cookware: ['Prestige', 'Hawkins', 'Pigeon', 'Milton', 'Vinod', 'Wonderchef', 'Butterfly'],
  footwear: ['Nike', 'Adidas', 'Puma', 'Bata', 'Campus', 'Sparx', 'Red Tape', 'Skechers', 'Crocs', 'Woodland', 'Asian'],
  watches: ['Titan', 'Fastrack', 'Casio', 'Timex', 'Fossil', 'Sonata'],
  bags: ['American Tourister', 'Skybags', 'Safari', 'VIP', 'Wildcraft', 'Samsonite', 'Aristocrat'],
  grooming: ['Philips', 'Braun', ['Xiaomi', 'xiaomi', 'mi'], 'Havells', 'Gillette', 'Nova', 'Bombay Shaving Company'],
  diapers: ['Pampers', 'Huggies', 'MamyPoko', 'Himalaya', ["Little's", "little's", 'littles'], 'Supples', 'Bella Baby'],
  wipes: ['Himalaya', 'Pampers', 'Huggies', 'Mother Sparsh', "Johnson's", 'Mamaearth'],
  babyfood: [['Nestlé Cerelac', 'cerelac', 'nestle', 'nestlé'], ['Nestlé Lactogen / NAN', 'lactogen', 'nan pro'], 'Similac', 'Enfamil', 'Timios', 'Slurrp Farm'],
  babygear: ['LuvLap', 'R for Rabbit', 'Mee Mee', 'Chicco', 'StarAndDaisy'],
  supplements: [['Optimum Nutrition', 'optimum nutrition'], 'MuscleBlaze', 'MyProtein', ['Fast&Up', 'fast&up', 'fast & up'], 'HealthKart', 'Himalaya', 'Avvatar'],
  healthdev: ['Omron', ['Dr Trust', 'dr trust', 'dr. trust'], ['Accu-Chek', 'accu-chek', 'accuchek'], 'BPL', 'HealthSense', 'Beurer'],
  powertools: ['Bosch', ['Black+Decker', 'black+decker', 'black & decker', 'black and decker', 'black decker'], 'Makita', 'DeWalt', 'Stanley', 'Ibell', 'AGARO', 'Hitachi'],
  handtools: ['Stanley', 'Taparia', 'Bosch', 'Inditrust', 'Jakemy'],
  electrical: ['Philips', 'Havells', 'Syska', 'Wipro', 'Polycab', 'Anchor', 'Crompton', 'Bajaj', 'Halonix'],
  fitness: ['Kore', 'Cockatoo', 'Boldfit', 'PowerMax', 'Lifelong', 'Strauss'],
  cycles: ['Hero', 'Hercules', 'Firefox', 'Leader', 'Montra', 'Btwin'],
  helmets: ['Steelbird', 'Vega', 'Studds', ['Royal Enfield', 'royal enfield'], 'Axor'],
  pets: ['Pedigree', 'Whiskas', 'Drools', 'Royal Canin', 'Purepet', 'Me-O']
};

// ---------- groups ----------
export const GROUPS = [
  { id: 'all', name: L('g_all', ['All', 'सभी', 'सर्व', 'બધું', 'সব', 'அனைத்தும்', 'అన్నీ', 'ಎಲ್ಲಾ', 'ਸਾਰੇ']) },
  { id: 'mobiles', name: L('g_mobiles', ['Mobiles & Tablets', 'मोबाइल और टैबलेट', 'मोबाईल आणि टॅबलेट', 'મોબાઇલ અને ટેબ્લેટ', 'মোবাইল ও ট্যাবলেট', 'மொபைல் & டேப்லெட்', 'మొబైల్స్ & టాబ్లెట్లు', 'ಮೊಬೈಲ್ ಮತ್ತು ಟ್ಯಾಬ್ಲೆಟ್', 'ਮੋਬਾਈਲ ਅਤੇ ਟੈਬਲੈੱਟ']) },
  { id: 'computers', name: L('g_computers', ['Computers', 'कंप्यूटर', 'संगणक', 'કમ્પ્યુટર', 'কম্পিউটার', 'கணினிகள்', 'కంప్యూటర్లు', 'ಕಂಪ್ಯೂಟರ್‌ಗಳು', 'ਕੰਪਿਊਟਰ']) },
  { id: 'tvaudio', name: L('g_tvaudio', ['TV, Audio & Wearables', 'टीवी, ऑडियो और वियरेबल्स', 'टीव्ही, ऑडिओ आणि वेअरेबल्स', 'ટીવી, ઑડિયો અને વેરેબલ્સ', 'টিভি, অডিও ও ওয়্যারেবল', 'டிவி, ஆடியோ & வியரபிள்ஸ்', 'టీవీ, ఆడియో & వేరబుల్స్', 'ಟಿವಿ, ಆಡಿಯೋ ಮತ್ತು ವೇರಬಲ್ಸ್', 'ਟੀਵੀ, ਆਡੀਓ ਅਤੇ ਵੀਅਰੇਬਲ']) },
  { id: 'appliances', name: L('g_appliances', ['Home Appliances', 'घरेलू उपकरण', 'घरगुती उपकरणे', 'ઘરેલું ઉપકરણો', 'গৃহস্থালি যন্ত্রপাতি', 'வீட்டு உபகரணங்கள்', 'గృహోపకరణాలు', 'ಗೃಹೋಪಯೋಗಿ ಉಪಕರಣಗಳು', 'ਘਰੇਲੂ ਉਪਕਰਣ']) },
  { id: 'home', name: L('g_home', ['Home & Kitchen', 'घर और रसोई', 'घर आणि स्वयंपाकघर', 'ઘર અને રસોડું', 'ঘর ও রান্নাঘর', 'வீடு & சமையலறை', 'ఇల్లు & వంటగది', 'ಮನೆ ಮತ್ತು ಅಡುಗೆಮನೆ', 'ਘਰ ਅਤੇ ਰਸੋਈ']) },
  { id: 'fashion', name: L('g_fashion', ['Fashion', 'फ़ैशन', 'फॅशन', 'ફેશન', 'ফ্যাশন', 'ஃபேஷன்', 'ఫ్యాషన్', 'ಫ್ಯಾಷನ್', 'ਫ਼ੈਸ਼ਨ']) },
  { id: 'beauty', name: L('g_beauty', ['Beauty & Personal Care', 'सौंदर्य और पर्सनल केयर', 'सौंदर्य आणि वैयक्तिक काळजी', 'સૌંદર્ય અને પર્સનલ કેર', 'সৌন্দর্য ও ব্যক্তিগত যত্ন', 'அழகு & தனிப்பட்ட பராமரிப்பு', 'అందం & వ్యక్తిగత సంరక్షణ', 'ಸೌಂದರ್ಯ ಮತ್ತು ವೈಯಕ್ತಿಕ ಆರೈಕೆ', 'ਸੁੰਦਰਤਾ ਅਤੇ ਨਿੱਜੀ ਦੇਖਭਾਲ']) },
  { id: 'baby', name: L('g_baby', ['Baby Care', 'बेबी केयर', 'बाळाची काळजी', 'બેબી કેર', 'শিশুর যত্ন', 'குழந்தை பராமரிப்பு', 'శిశు సంరక్షణ', 'ಮಗುವಿನ ಆರೈಕೆ', 'ਬੱਚਿਆਂ ਦੀ ਦੇਖਭਾਲ']) },
  { id: 'grocery', name: L('g_grocery', ['Grocery', 'किराना', 'किराणा', 'કરિયાણું', 'মুদিখানা', 'மளிகை', 'కిరాణా', 'ದಿನಸಿ', 'ਕਰਿਆਨਾ']) },
  { id: 'health', name: L('g_health', ['Health', 'स्वास्थ्य', 'आरोग्य', 'આરોગ્ય', 'স্বাস্থ্য', 'ஆரோக்கியம்', 'ఆరోగ్యం', 'ಆರೋಗ್ಯ', 'ਸਿਹਤ']) },
  { id: 'hardware', name: L('g_hardware', ['Hardware & Tools', 'हार्डवेयर और टूल्स', 'हार्डवेअर आणि साधने', 'હાર્ડવેર અને ટૂલ્સ', 'হার্ডওয়্যার ও যন্ত্রপাতি', 'ஹார்டுவேர் & கருவிகள்', 'హార్డ్‌వేర్ & టూల్స్', 'ಹಾರ್ಡ್‌ವೇರ್ ಮತ್ತು ಉಪಕರಣಗಳು', 'ਹਾਰਡਵੇਅਰ ਅਤੇ ਟੂਲ']) },
  { id: 'sports', name: L('g_sports', ['Sports & Fitness', 'खेल और फ़िटनेस', 'खेळ आणि फिटनेस', 'રમતગમત અને ફિટનેસ', 'খেলাধুলা ও ফিটনেস', 'விளையாட்டு & உடற்பயிற்சி', 'క్రీడలు & ఫిట్‌నెస్', 'ಕ್ರೀಡೆ ಮತ್ತು ಫಿಟ್ನೆಸ್', 'ਖੇਡਾਂ ਅਤੇ ਫ਼ਿਟਨੈੱਸ']) },
  { id: 'toys', name: L('g_toys', ['Toys, Books & Stationery', 'खिलौने, किताबें और स्टेशनरी', 'खेळणी, पुस्तके आणि स्टेशनरी', 'રમકડાં, પુસ્તકો અને સ્ટેશનરી', 'খেলনা, বই ও স্টেশনারি', 'பொம்மைகள், புத்தகங்கள் & எழுதுபொருள்', 'బొమ్మలు, పుస్తకాలు & స్టేషనరీ', 'ಆಟಿಕೆಗಳು, ಪುಸ್ತಕಗಳು ಮತ್ತು ಲೇಖನ ಸಾಮಗ್ರಿ', 'ਖਿਡੌਣੇ, ਕਿਤਾਬਾਂ ਅਤੇ ਸਟੇਸ਼ਨਰੀ']) },
  { id: 'auto', name: L('g_auto', ['Automotive & Pets', 'ऑटोमोटिव और पालतू', 'वाहन आणि पाळीव प्राणी', 'ઓટોમોટિવ અને પાળતુ પ્રાણી', 'গাড়ি ও পোষ্য', 'வாகனம் & செல்லப்பிராணிகள்', 'వాహనాలు & పెంపుడు జంతువులు', 'ವಾಹನ ಮತ್ತು ಸಾಕುಪ್ರಾಣಿ', 'ਆਟੋਮੋਟਿਵ ਅਤੇ ਪਾਲਤੂ ਜਾਨਵਰ']) }
];

const C = (id, group, names, def) => ({ id, group, name: L(`c_${id}`, names), sites: ALL, brands: [], fields: [], syn: [], ...def });

// ---------- categories ----------
const RAW = [
  C('all', 'all', ['Everything', 'सब कुछ', 'सर्व काही', 'બધું જ', 'সবকিছু', 'அனைத்தும்', 'అన్నీ', 'ಎಲ್ಲವೂ', 'ਸਭ ਕੁਝ'], { syn: ['all', 'everything', 'any'] }),

  // ---- Mobiles & tablets
  C('mobiles', 'mobiles', ['Mobile phones', 'मोबाइल फ़ोन', 'मोबाईल फोन', 'મોબાઇલ ફોન', 'মোবাইল ফোন', 'மொபைல் போன்கள்', 'మొబైల్ ఫోన్లు', 'ಮೊಬೈಲ್ ಫೋನ್‌ಗಳು', 'ਮੋਬਾਈਲ ਫ਼ੋਨ'], {
    q: 'mobile', syn: ['mobile', 'mobiles', 'phone', 'phones', 'smartphone', 'smart phone', 'iphone', 'cellphone', 'फोन', 'फ़ोन', 'मोबाइल', 'मोबाईल'],
    brands: BR.phones,
    fields: [
      RAM(), STORAGE([64, 128, 256, 512, 1024]),
      min('camera', 'fCamera', 'mp', [12, 48, 50, 64, 108, 200], (v) => `${v} MP+`),
      min('battery', 'fBattery', 'mah', [4000, 5000, 6000, 7000], (v) => `${v} mAh+`),
      sel('display', 'fDisplay', [['AMOLED / OLED', '(?:super\\s*)?amoled|\\boled\\b|\\bpoled\\b', 'amoled'], ['LCD', '\\blcd\\b|\\bips\\b', 'lcd']], { inQuery: false }),
      min('refresh', 'fRefresh', 'hz', [90, 120, 144], (v) => `${v} Hz+`),
      bool('g5', 'only5g', '\\b5g\\b', '5g', '5G', { absentNo: true })
    ],
    featureWords: ['snapdragon', 'dimensity', 'nfc', 'ois', 'esim', 'wireless charging', 'ip68', 'ip67', 'stereo'],
    exclude: 'cover|case|tempered|screen guard|screen protector|protector|charger|cable|adapter|back cover|skin|holder|pouch|earphones?|earbuds|headphones?|neckband|power bank|lens guard|stand|strap|smartwatch|watch|refurbished',
    keep: '\\d+\\s*gb\\s*ram', minPrice: 1500
  }),
  C('tablets', 'mobiles', ['Tablets', 'टैबलेट', 'टॅबलेट', 'ટેબ્લેટ', 'ট্যাবলেট', 'டேப்லெட்டுகள்', 'టాబ్లెట్లు', 'ಟ್ಯಾಬ್ಲೆಟ್‌ಗಳು', 'ਟੈਬਲੈੱਟ'], {
    q: 'tablet', syn: ['tablet', 'tablets', 'tab', 'ipad', 'टैबलेट'], brands: BR.tablets,
    fields: [
      RAM([4, 6, 8, 12]), STORAGE([64, 128, 256, 512]),
      range('screen', 'fScreen', 'inch', [['8"–9"', 7.5, 9.9, '8 inch'], ['10"–11"', 10, 11.4, '11 inch'], ['12"+', 11.5, 20, '12 inch']]),
      sel('conn', 'fConnectivity', [['Wi-Fi + Cellular', 'cellular|\\blte\\b|\\b5g\\b|\\b4g\\b|\\bsim\\b|calling', 'lte'], ['Wi-Fi only', 'wi-?fi\\s*only|wifi\\s*only|\\(\\s*wi-?fi\\s*\\)', 'wifi']])
    ],
    exclude: 'cover|case|tempered|screen protector|stylus|pencil|keyboard case|stand|charger', minPrice: 3000
  }),

  // ---- Computers
  C('laptops', 'computers', ['Laptops', 'लैपटॉप', 'लॅपटॉप', 'લેપટોપ', 'ল্যাপটপ', 'லேப்டாப்கள்', 'ల్యాప్‌టాప్‌లు', 'ಲ್ಯಾಪ್‌ಟಾಪ್‌ಗಳು', 'ਲੈਪਟਾਪ'], {
    q: 'laptop', syn: ['laptop', 'laptops', 'macbook', 'chromebook', 'लैपटॉप'], brands: BR.laptops,
    fields: [
      sel('cpu', 'fProcessor', [
        ['Intel Core i3', '\\bi3\\b|core\\s*3\\b', 'i3'], ['Intel Core i5', '\\bi5\\b|core\\s*(?:ultra\\s*)?5\\b', 'i5'],
        ['Intel Core i7', '\\bi7\\b|core\\s*(?:ultra\\s*)?7\\b', 'i7'], ['Intel Core i9', '\\bi9\\b|core\\s*(?:ultra\\s*)?9\\b', 'i9'],
        ['AMD Ryzen 3', 'ryzen\\s*3\\b', 'ryzen 3'], ['AMD Ryzen 5', 'ryzen\\s*5\\b', 'ryzen 5'], ['AMD Ryzen 7', 'ryzen\\s*7\\b', 'ryzen 7'], ['AMD Ryzen 9', 'ryzen\\s*9\\b', 'ryzen 9'],
        ['Apple M-series', 'apple\\s*m[1-5]\\b|\\bm[1-5]\\s*(?:pro|max|chip)?\\b.*macbook|macbook.*\\bm[1-5]\\b', 'macbook'],
        ['Snapdragon X', 'snapdragon\\s*x', 'snapdragon x'], ['Celeron / Pentium / Athlon', 'celeron|pentium|athlon', 'celeron']
      ]),
      RAM([8, 16, 32]), STORAGE([256, 512, 1024], 'fSsd', 'ssd'),
      range('screen', 'fScreen', 'inch', [['13"–14"', 12.5, 14.9, '14 inch'], ['15"–16"', 15, 16.9, '15.6 inch'], ['17"+', 17, 30, '17 inch']], { inQuery: false }),
      sel('use', 'fUse', [['Gaming', 'gaming', 'gaming'], ['Thin & light', 'thin\\s*(?:and|&)\\s*light|ultra\\s*slim|ultrabook', 'thin and light'], ['2-in-1 / touch', '2\\s*in\\s*1|x360|\\bflip\\b|touch', '2 in 1'], ['Business', 'business|thinkpad|latitude|probook|elitebook|expertbook', 'business']]),
      sel('os', 'fOs', [['Windows', 'windows|win\\s*1[01]', 'windows'], ['macOS', 'macos|macbook', 'macbook'], ['ChromeOS', 'chrome\\s*os|chromebook', 'chromebook'], ['DOS / Linux', '\\bdos\\b|linux|ubuntu', 'dos']], { inQuery: false }),
      bool('gpu', 'fGpu', '\\brtx\\b|\\bgtx\\b|radeon\\s*rx|\\brx\\s*\\d{4}', 'rtx', 'GPU')
    ],
    featureWords: ['backlit', 'fingerprint', 'thunderbolt', 'oled'],
    exclude: 'bag|sleeve|skin|stand|cooling pad|keyboard protector|keyboard cover|adapter|charger|battery for|screen guard|mouse|docking', minPrice: 8000
  }),
  C('monitors', 'computers', ['Monitors', 'मॉनिटर', 'मॉनिटर', 'મોનિટર', 'মনিটর', 'மானிட்டர்கள்', 'మానిటర్లు', 'ಮಾನಿಟರ್‌ಗಳು', 'ਮਾਨੀਟਰ'], {
    q: 'monitor', syn: ['monitor', 'monitors', 'मॉनिटर'], brands: BR.monitors,
    fields: [
      range('screen', 'fScreen', 'inch', [['21"–22"', 20.5, 22.9, '22 inch'], ['24"', 23, 25.4, '24 inch'], ['27"', 26.5, 28.4, '27 inch'], ['32"+', 30, 60, '32 inch']]),
      sel('res', 'fResolution', [['Full HD', 'full\\s*hd|\\bfhd\\b|1080p|1920\\s*x\\s*1080', 'full hd'], ['QHD / 2K', '\\bqhd\\b|\\b2k\\b|1440p|2560\\s*x\\s*1440', 'qhd'], ['4K', '\\b4k\\b|\\buhd\\b|2160p|3840\\s*x\\s*2160', '4k']]),
      min('refresh', 'fRefresh', 'hz', [75, 100, 144, 165, 240], (v) => `${v} Hz+`, { inQuery: true, q: (v) => `${v}hz` }),
      sel('panel', 'fPanel', [['IPS', '\\bips\\b'], ['VA', '\\bva\\b'], ['OLED', 'oled']], { inQuery: false })
    ],
    exclude: 'arm|mount|stand|cable|cleaner', minPrice: 3000
  }),
  C('printers', 'computers', ['Printers', 'प्रिंटर', 'प्रिंटर', 'પ્રિન્ટર', 'প্রিন্টার', 'பிரிண்டர்கள்', 'ప్రింటర్లు', 'ಪ್ರಿಂಟರ್‌ಗಳು', 'ਪ੍ਰਿੰਟਰ'], {
    q: 'printer', syn: ['printer', 'printers', 'scanner', 'प्रिंटर'], brands: BR.printers,
    fields: [
      sel('ptype', TYPE, [['Ink tank', 'ink\\s*tank|ecotank|smart\\s*tank|\\bgt\\d', 'ink tank'], ['Inkjet', 'inkjet|deskjet|pixma', 'inkjet'], ['Laser', 'laser', 'laser']]),
      sel('colour', 'fColour', [['Colour', 'colou?r', 'color'], ['Mono (B/W)', 'mono|black\\s*(?:and|&)\\s*white|\\bb\\s*/\\s*w\\b', 'monochrome']]),
      sel('func', 'fFunction', [['All-in-one (print, scan, copy)', 'all[\\s-]*in[\\s-]*one|multi[\\s-]*function|\\bmfp?\\b|print.{0,15}scan', 'all in one'], ['Print only', 'single\\s*function|print\\s*only', 'single function']]),
      bool('wifi', 'fWifi', 'wi-?fi|wireless', 'wifi', 'Wi-Fi')
    ],
    exclude: 'cartridge|toner|\\bink\\b(?!\\s*tank)|ink bottle|paper|cable|cover', minPrice: 2500
  }),
  C('pc_acc', 'computers', ['Keyboards, mice & webcams', 'कीबोर्ड, माउस और वेबकैम', 'कीबोर्ड, माऊस आणि वेबकॅम', 'કીબોર્ડ, માઉસ અને વેબકેમ', 'কিবোর্ড, মাউস ও ওয়েবক্যাম', 'கீபோர்டு, மவுஸ் & வெப்கேம்', 'కీబోర్డులు, మౌస్ & వెబ్‌క్యామ్‌లు', 'ಕೀಬೋರ್ಡ್, ಮೌಸ್ ಮತ್ತು ವೆಬ್‌ಕ್ಯಾಮ್', 'ਕੀਬੋਰਡ, ਮਾਊਸ ਅਤੇ ਵੈੱਬਕੈਮ'], {
    q: 'keyboard mouse', syn: ['keyboard', 'mouse', 'webcam', 'keyboard mouse', 'कीबोर्ड', 'माउस'], brands: BR.pcacc,
    fields: [
      sel('type', TYPE, [['Keyboard', 'keyboard', 'keyboard'], ['Mouse', 'mouse|mice', 'mouse'], ['Keyboard + mouse combo', 'combo|keyboard\\s*(?:and|&|\\+)\\s*mouse', 'keyboard mouse combo'], ['Webcam', 'webcam|web\\s*camera', 'webcam']]),
      bool('wireless', 'fWireless', 'wireless|bluetooth|2\\.4\\s*ghz', 'wireless', 'Wireless')
    ]
  }),
  C('storage_dev', 'computers', ['Pen drives & hard disks', 'पेन ड्राइव और हार्ड डिस्क', 'पेन ड्राइव्ह आणि हार्ड डिस्क', 'પેન ડ્રાઇવ અને હાર્ડ ડિસ્ક', 'পেন ড্রাইভ ও হার্ড ডিস্ক', 'பென் டிரைவ் & ஹார்டு டிஸ்க்', 'పెన్ డ్రైవ్‌లు & హార్డ్ డిస్క్‌లు', 'ಪೆನ್ ಡ್ರೈವ್ ಮತ್ತು ಹಾರ್ಡ್ ಡಿಸ್ಕ್', 'ਪੈੱਨ ਡਰਾਈਵ ਅਤੇ ਹਾਰਡ ਡਿਸਕ'], {
    q: 'pen drive', syn: ['pen drive', 'pendrive', 'hard disk', 'hard drive', 'hdd', 'ssd', 'memory card', 'sd card', 'micro sd', 'पेन ड्राइव'], brands: BR.storage,
    fields: [
      sel('type', TYPE, [['Pen drive', 'pen\\s*drive|flash\\s*drive|usb\\s*(?:flash\\s*)?drive', 'pen drive'], ['Portable SSD', 'portable\\s*ssd|external\\s*ssd', 'portable ssd'], ['External hard disk', 'external\\s*hard|portable\\s*hard|\\bhdd\\b', 'external hard disk'], ['Memory card', 'memory\\s*card|micro\\s*sd|\\bsdxc\\b|\\bsdhc\\b', 'memory card'], ['Internal SSD', 'nvme|m\\.2|internal\\s*ssd|sata\\s*(?:iii\\s*)?ssd', 'internal ssd']]),
      min('cap', 'fCapacity', 'gbtb', [32, 64, 128, 256, 512, 1024, 2048], (v) => `${gb(v)}+`, { inQuery: true, q: (v) => gb(v).replace(' ', '').toLowerCase() })
    ]
  }),

  // ---- TV, audio, wearables
  C('tvs', 'tvaudio', ['Televisions', 'टीवी', 'टीव्ही', 'ટીવી', 'টেলিভিশন', 'தொலைக்காட்சிகள்', 'టీవీలు', 'ಟಿವಿಗಳು', 'ਟੀਵੀ'], {
    q: 'tv', syn: ['tv', 'tvs', 'television', 'smart tv', 'led tv', 'टीवी', 'टीव्ही'], brands: BR.tvs,
    fields: [
      range('screen', 'fScreen', 'inch', [32, 40, 43, 50, 55, 65, 75, 85].map((v) => [`${v}"`, v - 1, v + 0.9, `${v} inch`])),
      sel('res', 'fResolution', [['HD Ready', 'hd\\s*ready|\\b720p|1366', 'hd ready'], ['Full HD', 'full\\s*hd|\\bfhd\\b|1080p', 'full hd'], ['4K Ultra HD', 'ultra\\s*hd|\\buhd\\b|\\b4k\\b|2160p', '4k'], ['8K', '\\b8k\\b', '8k']]),
      sel('panel', 'fPanel', [['LED', '\\bled\\b', 'led'], ['QLED', '\\bqled\\b|neo\\s*qled', 'qled'], ['OLED', '\\boled\\b', 'oled'], ['Mini LED', 'mini\\s*led', 'mini led']]),
      sel('os', 'fOs', [['Google TV / Android', 'google\\s*tv|android', 'google tv'], ['webOS', 'webos', 'webos'], ['Tizen', 'tizen', 'tizen'], ['Fire TV', 'fire\\s*tv', 'fire tv']], { inQuery: false })
    ],
    exclude: 'wall mount|remote|stand|cover|stabili[sz]er|cable|bracket|fire tv stick|streaming device', minPrice: 5000
  }),
  C('headphones', 'tvaudio', ['Headphones & earbuds', 'हेडफ़ोन और ईयरबड्स', 'हेडफोन आणि इअरबड्स', 'હેડફોન અને ઇયરબડ્સ', 'হেডফোন ও ইয়ারবাড', 'ஹெட்ஃபோன் & இயர்பட்ஸ்', 'హెడ్‌ఫోన్లు & ఇయర్‌బడ్స్', 'ಹೆಡ್‌ಫೋನ್ ಮತ್ತು ಇಯರ್‌ಬಡ್ಸ್', 'ਹੈੱਡਫ਼ੋਨ ਅਤੇ ਈਅਰਬਡਸ'], {
    q: 'headphones', syn: ['headphone', 'headphones', 'earphone', 'earphones', 'earbuds', 'airpods', 'tws', 'neckband', 'हेडफोन', 'ईयरफोन'], brands: BR.audio,
    fields: [
      sel('type', TYPE, [['True wireless earbuds', '\\btws\\b|true\\s*wireless|earbuds|airpods|\\bbuds\\b', 'earbuds'], ['Over-ear', 'over[\\s-]*(?:the[\\s-]*)?ear', 'over ear headphones'], ['On-ear', 'on[\\s-]*ear', 'on ear headphones'], ['Neckband', 'neck\\s*band', 'neckband'], ['Wired earphones', '\\bwired\\b|3\\.5\\s*mm', 'wired earphones']]),
      bool('anc', 'fAnc', '\\banc\\b|active\\s*noise|noise\\s*cancell?(?:ation|ing)', 'anc', 'ANC')
    ],
    exclude: 'case cover|ear tips|cushion|replacement', minPrice: 300
  }),
  C('speakers', 'tvaudio', ['Speakers & soundbars', 'स्पीकर और साउंडबार', 'स्पीकर आणि साउंडबार', 'સ્પીકર અને સાઉન્ડબાર', 'স্পিকার ও সাউন্ডবার', 'ஸ்பீக்கர் & சவுண்ட்பார்', 'స్పీకర్లు & సౌండ్‌బార్లు', 'ಸ್ಪೀಕರ್ ಮತ್ತು ಸೌಂಡ್‌ಬಾರ್', 'ਸਪੀਕਰ ਅਤੇ ਸਾਊਂਡਬਾਰ'], {
    q: 'speaker', syn: ['speaker', 'speakers', 'soundbar', 'sound bar', 'home theatre', 'home theater', 'स्पीकर'], brands: BR.audio,
    fields: [
      sel('type', TYPE, [['Bluetooth speaker', 'bluetooth\\s*speaker|portable\\s*speaker|wireless\\s*speaker', 'bluetooth speaker'], ['Soundbar', 'sound\\s*bar', 'soundbar'], ['Party speaker', 'party|trolley\\s*speaker|tower\\s*speaker', 'party speaker'], ['Smart speaker', 'alexa|\\becho\\b|smart\\s*speaker|google\\s*(?:home|nest)', 'smart speaker'], ['Home theatre', 'home\\s*theat(?:re|er)|5\\.1|7\\.1', 'home theatre']]),
      min('power', 'fPower', 'watt', [10, 20, 40, 100, 200, 500], (v) => `${v} W+`)
    ]
  }),
  C('smartwatches', 'tvaudio', ['Smartwatches', 'स्मार्टवॉच', 'स्मार्टवॉच', 'સ્માર્ટવોચ', 'স্মার্টওয়াচ', 'ஸ்மார்ட்வாட்ச்', 'స్మార్ట్‌వాచ్‌లు', 'ಸ್ಮಾರ್ಟ್‌ವಾಚ್‌ಗಳು', 'ਸਮਾਰਟਵਾਚ'], {
    q: 'smartwatch', syn: ['smartwatch', 'smart watch', 'smartwatches', 'fitness band', 'स्मार्टवॉच'], brands: BR.wear,
    fields: [
      sel('display', 'fDisplay', [['AMOLED', 'amoled|\\boled\\b', 'amoled'], ['LCD / TFT', '\\blcd\\b|\\btft\\b|\\bips\\b', 'lcd']]),
      bool('calling', 'fCalling', 'calling|bt\\s*call|bluetooth\\s*call', 'calling', 'Calling'),
      bool('gps', 'fGps', '\\bgps\\b', 'gps', 'GPS')
    ],
    exclude: 'strap|screen guard|protector|charger|case|cover|band for', minPrice: 800
  }),
  C('cameras', 'tvaudio', ['Cameras', 'कैमरा', 'कॅमेरा', 'કેમેરા', 'ক্যামেরা', 'கேமராக்கள்', 'కెమెరాలు', 'ಕ್ಯಾಮೆರಾಗಳು', 'ਕੈਮਰੇ'], {
    q: 'camera', syn: ['camera', 'cameras', 'dslr', 'mirrorless', 'gopro', 'action camera', 'कैमरा'], brands: BR.cameras,
    fields: [
      sel('type', TYPE, [['DSLR', '\\bdslr\\b', 'dslr'], ['Mirrorless', 'mirrorless', 'mirrorless camera'], ['Action camera', 'action\\s*cam|gopro|insta360', 'action camera'], ['Instant camera', 'instax|instant', 'instant camera'], ['Point & shoot', 'point\\s*(?:and|&)\\s*shoot|compact', 'compact camera']]),
      min('mp', 'fCamera', 'mp', [16, 24, 32, 45], (v) => `${v} MP+`)
    ],
    exclude: '\\bbag\\b|tripod|lens cap|battery|charger|strap|memory card|screen guard|lens hood|filter', minPrice: 2000
  }),

  // ---- Appliances
  C('fridges', 'appliances', ['Refrigerators', 'फ्रिज', 'फ्रिज', 'ફ્રિજ', 'ফ্রিজ', 'குளிர்சாதன பெட்டிகள்', 'ఫ్రిజ్‌లు', 'ಫ್ರಿಜ್‌ಗಳು', 'ਫ਼ਰਿੱਜ'], {
    q: 'refrigerator', syn: ['fridge', 'fridges', 'refrigerator', 'refrigerators', 'फ्रिज', 'फ्रीज'], brands: BR.fridges,
    fields: [
      LITRES([180, 240, 300, 400, 500, 600]),
      sel('door', 'fDoor', [['Single door', 'single\\s*door|\\b1\\s*door', 'single door'], ['Double door', 'double\\s*door|\\b2\\s*door', 'double door'], ['Triple door', 'triple\\s*door|\\b3\\s*door', 'triple door'], ['Side-by-side', 'side[\\s-]*by[\\s-]*side', 'side by side'], ['French / multi-door', 'french\\s*door|multi[\\s-]*door|\\b4\\s*door', 'french door']]),
      STARS([2, 3, 4, 5]), INVERTER
    ],
    exclude: 'cover|stand|stabili[sz]er|trolley|\\bmat\\b|organi[sz]er|gasket|handle', minPrice: 6000
  }),
  C('washers', 'appliances', ['Washing machines', 'वॉशिंग मशीन', 'वॉशिंग मशीन', 'વોશિંગ મશીન', 'ওয়াশিং মেশিন', 'சலவை இயந்திரங்கள்', 'వాషింగ్ మెషీన్లు', 'ವಾಷಿಂಗ್ ಮೆಷಿನ್‌ಗಳು', 'ਵਾਸ਼ਿੰਗ ਮਸ਼ੀਨ'], {
    q: 'washing machine', syn: ['washing machine', 'washing machines', 'washer', 'वॉशिंग मशीन'], brands: BR.washers,
    fields: [
      min('capacity', 'fCapacity', 'kg', [6, 7, 8, 9, 10, 12], (v) => `${v} kg+`),
      sel('type', TYPE, [['Front load', 'front[\\s-]*load(?:ing)?', 'front load'], ['Top load (fully automatic)', '^(?!.*semi[\\s-]*auto).*top[\\s-]*load', 'top load'], ['Semi-automatic', 'semi[\\s-]*auto(?:matic)?', 'semi automatic']]),
      STARS([3, 4, 5]), INVERTER
    ],
    exclude: 'cover|stand|trolley|inlet|outlet|pipe|descaler|cleaner', minPrice: 5000
  }),
  C('acs', 'appliances', ['Air conditioners', 'एसी', 'एसी', 'એસી', 'এসি', 'ஏசி', 'ఏసీలు', 'ಎಸಿಗಳು', 'ਏਸੀ'], {
    q: 'ac', syn: ['ac', 'acs', 'air conditioner', 'air conditioners', 'split ac', 'window ac', 'एसी'], brands: BR.acs,
    fields: [
      sel('ton', 'fTonnage', [['1 Ton', '\\b1(?:\\.0)?\\s*tons?\\b', '1 ton'], ['1.5 Ton', '\\b1\\.5\\s*tons?\\b', '1.5 ton'], ['2 Ton', '\\b2(?:\\.0)?\\s*tons?\\b', '2 ton']]),
      sel('type', TYPE, [['Split', '\\bsplit\\b', 'split ac'], ['Window', '\\bwindow\\b', 'window ac'], ['Portable', 'portable', 'portable ac']]),
      STARS([3, 4, 5]), INVERTER
    ],
    exclude: 'stabili[sz]er|cover|stand|remote|bracket|copper pipe|cleaner', minPrice: 15000
  }),
  C('microwaves', 'appliances', ['Microwave ovens', 'माइक्रोवेव ओवन', 'मायक्रोवेव्ह ओव्हन', 'માઇક્રોવેવ ઓવન', 'মাইক্রোওয়েভ ওভেন', 'மைக்ரோவேவ் ஓவன்', 'మైక్రోవేవ్ ఓవెన్లు', 'ಮೈಕ್ರೋವೇವ್ ಓವನ್', 'ਮਾਈਕ੍ਰੋਵੇਵ ਓਵਨ'], {
    q: 'microwave oven', syn: ['microwave', 'microwave oven', 'oven', 'otg', 'माइक्रोवेव'], brands: BR.micro,
    fields: [
      sel('type', TYPE, [['Solo', '\\bsolo\\b', 'solo microwave'], ['Grill', '\\bgrill\\b', 'grill microwave'], ['Convection', 'convection', 'convection microwave'], ['OTG', '\\botg\\b|oven\\s*toaster', 'otg']]),
      LITRES([17, 20, 25, 28, 32])
    ],
    exclude: 'cover|stand|bowl|container|glove', minPrice: 3000
  }),
  C('purifiers', 'appliances', ['Water purifiers', 'वाटर प्यूरीफायर', 'वॉटर प्युरिफायर', 'વોટર પ્યુરિફાયર', 'ওয়াটার পিউরিফায়ার', 'நீர் சுத்திகரிப்பான்', 'వాటర్ ప్యూరిఫైయర్లు', 'ನೀರು ಶುದ್ಧೀಕರಣ ಯಂತ್ರ', 'ਵਾਟਰ ਪਿਊਰੀਫਾਇਰ'], {
    q: 'water purifier', syn: ['water purifier', 'purifier', 'ro purifier', 'वाटर प्यूरीफायर'], brands: BR.purifier,
    fields: [
      sel('tech', 'fTech', [['RO + UV', '\\bro\\b.{0,15}\\buv\\b', 'ro uv'], ['RO', '\\bro\\b', 'ro'], ['UV', '\\buv\\b', 'uv'], ['Gravity / non-electric', 'gravity|non[\\s-]*electric', 'gravity']]),
      LITRES([5, 7, 8, 10])
    ],
    exclude: 'filter|candle|membrane|cartridge|service kit|spare', minPrice: 2500
  }),
  C('fans', 'appliances', ['Fans', 'पंखे', 'पंखे', 'પંખા', 'পাখা', 'மின்விசிறிகள்', 'ఫ్యాన్లు', 'ಫ್ಯಾನ್‌ಗಳು', 'ਪੱਖੇ'], {
    q: 'fan', syn: ['fan', 'fans', 'ceiling fan', 'table fan', 'pedestal fan', 'exhaust fan', 'पंखा', 'पंखे'], brands: BR.fans,
    fields: [
      sel('type', TYPE, [['Ceiling', 'ceiling', 'ceiling fan'], ['Table', 'table\\s*fan', 'table fan'], ['Pedestal', 'pedestal', 'pedestal fan'], ['Wall', 'wall\\s*(?:mount(?:ed)?\\s*)?fan', 'wall fan'], ['Exhaust', 'exhaust|ventilation', 'exhaust fan'], ['Tower', 'tower\\s*fan', 'tower fan']]),
      bool('bldc', 'fBldc', 'bldc|energy\\s*sav', 'bldc', 'BLDC')
    ],
    exclude: 'regulator|capacitor|blade|cover|rod|canopy', minPrice: 700
  }),
  C('coolers', 'appliances', ['Air coolers', 'कूलर', 'कूलर', 'કૂલર', 'এয়ার কুলার', 'ஏர் கூலர்', 'ఎయిర్ కూలర్లు', 'ಏರ್ ಕೂಲರ್', 'ਕੂਲਰ'], {
    q: 'air cooler', syn: ['cooler', 'coolers', 'air cooler', 'कूलर'], brands: BR.coolers,
    fields: [
      sel('type', TYPE, [['Desert', 'desert', 'desert cooler'], ['Personal', 'personal', 'personal cooler'], ['Tower', 'tower', 'tower cooler'], ['Window', 'window', 'window cooler']]),
      LITRES([20, 35, 50, 70, 90])
    ],
    exclude: 'pad|pump|cover|stand|trolley', minPrice: 2500
  }),
  C('geysers', 'appliances', ['Water heaters (geysers)', 'गीज़र', 'गिझर', 'ગીઝર', 'গিজার', 'வாட்டர் ஹீட்டர் (கீசர்)', 'గీజర్లు', 'ಗೀಸರ್‌ಗಳು', 'ਗੀਜ਼ਰ'], {
    q: 'geyser', syn: ['geyser', 'geysers', 'water heater', 'गीजर', 'गीज़र'], brands: BR.geysers,
    fields: [
      sel('type', TYPE, [['Storage', 'storage', 'storage geyser'], ['Instant', 'instant', 'instant geyser'], ['Gas', '\\bgas\\b', 'gas geyser']]),
      LITRES([3, 6, 10, 15, 25])
    ],
    exclude: 'element|thermostat|stand|pipe|valve', minPrice: 2000
  }),
  C('mixers', 'appliances', ['Mixer grinders', 'मिक्सर ग्राइंडर', 'मिक्सर ग्राइंडर', 'મિક્સર ગ્રાઇન્ડર', 'মিক্সার গ্রাইন্ডার', 'மிக்ஸி', 'మిక్సర్ గ్రైండర్లు', 'ಮಿಕ್ಸರ್ ಗ್ರೈಂಡರ್', 'ਮਿਕਸਰ ਗ੍ਰਾਈਂਡਰ'], {
    q: 'mixer grinder', syn: ['mixer', 'mixer grinder', 'grinder', 'juicer', 'blender', 'mixie', 'मिक्सर'], brands: BR.mixers,
    fields: [
      sel('type', TYPE, [['Mixer grinder', 'mixer|grinder', 'mixer grinder'], ['Juicer / juicer mixer', 'juicer', 'juicer mixer grinder'], ['Hand blender', 'hand\\s*blender', 'hand blender']]),
      min('power', 'fPower', 'watt', [500, 750, 1000], (v) => `${v} W+`, { inQuery: true, q: (v) => `${v}w` })
    ],
    exclude: '\\bjar\\b(?!s)|blade|coupler|gasket|spare', minPrice: 1200
  }),

  // ---- Home & kitchen
  C('cookware', 'home', ['Cookware', 'बर्तन (कुकवेयर)', 'भांडी (कुकवेअर)', 'વાસણો (કુકવેર)', 'রান্নার বাসন', 'சமையல் பாத்திரங்கள்', 'వంట పాత్రలు', 'ಅಡುಗೆ ಪಾತ್ರೆಗಳು', 'ਰਸੋਈ ਦੇ ਭਾਂਡੇ'], {
    q: 'cookware', syn: ['cookware', 'pressure cooker', 'cooker', 'kadai', 'kadhai', 'tawa', 'frying pan', 'pan', 'कुकर', 'कढ़ाई', 'तवा', 'बर्तन'], brands: BR.cookware, sites: GEN,
    fields: [
      sel('type', TYPE, [['Pressure cooker', 'pressure\\s*cooker', 'pressure cooker'], ['Kadai / wok', 'kadai|kadhai|\\bwok\\b', 'kadai'], ['Tawa', 'tawa|dosa|griddle', 'tawa'], ['Frying pan', 'fry(?:ing)?\\s*pan', 'frying pan'], ['Cookware set', '\\bset\\b|combo', 'cookware set']]),
      sel('material', 'fMaterial', [['Stainless steel', 'stainless|steel|tri[\\s-]*ply', 'stainless steel'], ['Aluminium', 'alumin', 'aluminium'], ['Cast iron', 'cast\\s*iron|\\biron\\b', 'cast iron'], ['Non-stick', 'non[\\s-]*stick|granite|ceramic', 'non stick']]),
      LITRES([2, 3, 5]),
      bool('induction', 'fInduction', 'induction', 'induction', 'Induction')
    ],
    exclude: 'gasket|whistle|safety valve|handle|lid only'
  }),
  C('furniture', 'home', ['Furniture & mattresses', 'फ़र्नीचर और गद्दे', 'फर्निचर आणि गाद्या', 'ફર્નિચર અને ગાદલા', 'আসবাব ও ম্যাট্রেস', 'மரச்சாமான்கள் & மெத்தைகள்', 'ఫర్నిచర్ & పరుపులు', 'ಪೀಠೋಪಕರಣ ಮತ್ತು ಹಾಸಿಗೆ', 'ਫ਼ਰਨੀਚਰ ਅਤੇ ਗੱਦੇ'], {
    q: 'furniture', syn: ['furniture', 'sofa', 'bed', 'mattress', 'wardrobe', 'almirah', 'chair', 'study table', 'office chair', 'shoe rack', 'गद्दा', 'सोफा', 'पलंग'], sites: GEN,
    fields: [
      sel('type', TYPE, [['Mattress', 'mattress', 'mattress'], ['Bed', '\\bbed\\b(?!\\s*sheet)', 'bed'], ['Sofa', 'sofa', 'sofa'], ['Wardrobe', 'wardrobe|almirah', 'wardrobe'], ['Study / office table', 'study\\s*table|\\bdesk\\b|computer\\s*table|office\\s*table', 'study table'], ['Chair', 'chair', 'chair'], ['Shoe rack / storage', 'rack|cabinet|shel(?:f|ves)', 'storage rack']]),
      BED_SIZE,
      sel('material', 'fMaterial', [['Solid wood', 'solid\\s*wood|sheesham|teak|mango\\s*wood', 'solid wood'], ['Engineered wood', 'engineered\\s*wood|particle\\s*board|\\bmdf\\b', 'engineered wood'], ['Metal', 'metal|steel|iron', 'metal'], ['Foam', 'foam', 'foam']])
    ]
  }),
  C('furnishing', 'home', ['Bedsheets, curtains & towels', 'चादर, पर्दे और तौलिये', 'चादरी, पडदे आणि टॉवेल', 'ચાદર, પડદા અને ટુવાલ', 'চাদর, পর্দা ও তোয়ালে', 'போர்வை, திரைச்சீலை & துண்டு', 'బెడ్‌షీట్లు, కర్టెన్లు & టవల్స్', 'ಬೆಡ್‌ಶೀಟ್, ಕರ್ಟನ್ ಮತ್ತು ಟವೆಲ್', 'ਚਾਦਰਾਂ, ਪਰਦੇ ਅਤੇ ਤੌਲੀਏ'], {
    q: 'bedsheet', syn: ['bedsheet', 'bed sheet', 'curtain', 'curtains', 'towel', 'towels', 'blanket', 'comforter', 'pillow', 'चादर', 'पर्दा', 'तौलिया', 'कंबल'], sites: GEN,
    fields: [
      sel('type', TYPE, [['Bedsheet', 'bed\\s*sheet', 'bedsheet'], ['Curtain', 'curtain', 'curtains'], ['Blanket / comforter', 'blanket|comforter|dohar|quilt|razai', 'blanket'], ['Pillow', 'pillow', 'pillow'], ['Towel', 'towel', 'towel']]),
      BED_SIZE, COLOUR
    ]
  }),

  // ---- Fashion
  C('men_wear', 'fashion', ["Men's clothing", 'पुरुषों के कपड़े', 'पुरुषांचे कपडे', 'પુરુષોના કપડાં', 'পুরুষদের পোশাক', 'ஆண்கள் ஆடைகள்', 'పురుషుల దుస్తులు', 'ಪುರುಷರ ಉಡುಪು', 'ਮਰਦਾਂ ਦੇ ਕੱਪੜੇ'], {
    q: 'men', syn: ['shirt', 't-shirt', 'tshirt', 'jeans', 'trouser', 'trousers', 'men clothing', 'mens wear', 'शर्ट', 'जींस'], sites: GEN,
    fields: [
      sel('type', TYPE, [['T-shirt', 't[\\s-]*shirt|\\btee\\b', 't-shirt'], ['Shirt', '(?<!t[\\s-]?)shirt', 'shirt'], ['Jeans', 'jeans', 'jeans'], ['Trousers / chinos', 'trouser|chinos|\\bpants\\b', 'trousers'], ['Kurta', 'kurta', 'kurta'], ['Shorts', 'shorts', 'shorts'], ['Jacket / hoodie', 'jacket|hoodie|sweatshirt', 'jacket']]),
      COLOUR
    ]
  }),
  C('women_wear', 'fashion', ["Women's clothing", 'महिलाओं के कपड़े', 'महिलांचे कपडे', 'મહિલાઓના કપડાં', 'মহিলাদের পোশাক', 'பெண்கள் ஆடைகள்', 'మహిళల దుస్తులు', 'ಮಹಿಳೆಯರ ಉಡುಪು', 'ਔਰਤਾਂ ਦੇ ਕੱਪੜੇ'], {
    q: 'women', syn: ['saree', 'sari', 'kurti', 'kurta set', 'dress', 'women clothing', 'lehenga', 'leggings', 'साड़ी', 'कुर्ती'], sites: GEN,
    fields: [
      sel('type', TYPE, [['Kurta / kurti', 'kurt[ai]', 'kurti'], ['Saree', 'saree|\\bsari\\b', 'saree'], ['Dress', 'dress|gown', 'dress'], ['Top / T-shirt', '\\btop\\b|t[\\s-]*shirt|\\btee\\b', 'top'], ['Jeans', 'jeans', 'jeans'], ['Leggings', 'legging', 'leggings'], ['Lehenga', 'lehenga', 'lehenga'], ['Salwar suit', 'salwar|suit\\s*set|kurta\\s*set', 'salwar suit']]),
      COLOUR
    ]
  }),
  C('kids_wear', 'fashion', ["Kids' clothing", 'बच्चों के कपड़े', 'मुलांचे कपडे', 'બાળકોના કપડાં', 'বাচ্চাদের পোশাক', 'குழந்தைகள் ஆடைகள்', 'పిల్లల దుస్తులు', 'ಮಕ್ಕಳ ಉಡುಪು', 'ਬੱਚਿਆਂ ਦੇ ਕੱਪੜੇ'], {
    q: 'kids clothing', syn: ['kids clothing', 'kids wear', 'baby clothes', 'frock', 'बच्चों के कपड़े'], sites: GEN,
    fields: [
      sel('gender', 'fGender', [['Boys', '\\bboys?\\b', 'boys', 'oBoys'], ['Girls', '\\bgirls?\\b', 'girls', 'oGirls'], ['Baby / infant', 'baby|infant|new\\s*born', 'baby', 'oBaby']]),
      sel('type', TYPE, [['T-shirt', 't[\\s-]*shirt|\\btee\\b', 't-shirt'], ['Dress / frock', 'dress|frock', 'frock'], ['Shorts', 'shorts', 'shorts'], ['Jeans', 'jeans', 'jeans'], ['Ethnic wear', 'ethnic|kurta|lehenga|dhoti', 'ethnic wear'], ['Nightwear', 'night\\s*suit|pyjama|nightwear', 'night suit']]),
      COLOUR
    ]
  }),
  C('footwear', 'fashion', ['Footwear', 'जूते-चप्पल', 'पादत्राणे', 'ફૂટવેર', 'জুতো', 'காலணிகள்', 'పాదరక్షలు', 'ಪಾದರಕ್ಷೆ', 'ਜੁੱਤੀਆਂ'], {
    q: 'shoes', syn: ['shoes', 'shoe', 'sneakers', 'sandals', 'slippers', 'chappal', 'footwear', 'जूते', 'चप्पल'], brands: BR.footwear, sites: GEN,
    fields: [
      GENDER(['men', 'women', 'kids']),
      sel('type', TYPE, [['Running / sports', 'running|sports|training|walking', 'sports shoes'], ['Sneakers / casual', 'sneaker|casual', 'sneakers'], ['Formal', 'formal|oxford|derby|loafer', 'formal shoes'], ['Sandals', 'sandal|floater', 'sandals'], ['Slippers / flip-flops', 'slipper|flip[\\s-]*flop|slides|chappal', 'slippers'], ['Boots', '\\bboots?\\b', 'boots']]),
      COLOUR
    ]
  }),
  C('watches', 'fashion', ['Watches', 'घड़ियाँ', 'घड्याळे', 'ઘડિયાળો', 'ঘড়ি', 'கைக்கடிகாரங்கள்', 'గడియారాలు', 'ಕೈಗಡಿಯಾರಗಳು', 'ਘੜੀਆਂ'], {
    q: 'watch', syn: ['watch', 'watches', 'wrist watch', 'analog watch', 'घड़ी'], brands: BR.watches, sites: GEN,
    fields: [
      GENDER(['men', 'women', 'unisex']),
      sel('type', TYPE, [['Analog', 'analog(?:ue)?', 'analog watch'], ['Digital', 'digital', 'digital watch'], ['Chronograph', 'chronograph', 'chronograph watch']])
    ],
    exclude: 'smart\\s*watch|smartwatch|strap only'
  }),
  C('bags', 'fashion', ['Bags, luggage & wallets', 'बैग, सामान और पर्स', 'बॅग, सामान आणि पाकीट', 'બેગ, સામાન અને વોલેટ', 'ব্যাগ, লাগেজ ও ওয়ালেট', 'பைகள், லக்கேஜ் & பர்ஸ்', 'బ్యాగులు, లగేజీ & వాలెట్లు', 'ಬ್ಯಾಗ್, ಲಗೇಜ್ ಮತ್ತು ವಾಲೆಟ್', 'ਬੈਗ, ਸਮਾਨ ਅਤੇ ਬਟੂਏ'], {
    q: 'bag', syn: ['bag', 'bags', 'backpack', 'trolley bag', 'luggage', 'suitcase', 'wallet', 'handbag', 'बैग', 'पर्स'], brands: BR.bags, sites: GEN,
    fields: [
      sel('type', TYPE, [['Backpack', 'backpack|rucksack', 'backpack'], ['Laptop bag', 'laptop', 'laptop bag'], ['Trolley / suitcase', 'trolley|suitcase|luggage|cabin', 'trolley bag'], ['Handbag / sling', 'handbag|tote|sling', 'handbag'], ['Wallet', 'wallet|purse', 'wallet'], ['Duffle / gym bag', 'duffle|duffel|gym\\s*bag', 'duffle bag']]),
      LITRES([20, 30, 40, 60])
    ]
  }),

  // ---- Beauty
  C('skincare', 'beauty', ['Skincare', 'स्किनकेयर', 'त्वचेची काळजी', 'સ્કિનકેર', 'ত্বকের যত্ন', 'சருமப் பராமரிப்பு', 'చర్మ సంరక్షణ', 'ಚರ್ಮದ ಆರೈಕೆ', 'ਚਮੜੀ ਦੀ ਦੇਖਭਾਲ'], {
    q: 'skincare', syn: ['face wash', 'facewash', 'moisturizer', 'moisturiser', 'sunscreen', 'serum', 'face cream', 'skincare', 'skin care'], sites: GEN,
    fields: [
      sel('type', TYPE, [['Face wash', 'face\\s*wash|cleanser', 'face wash'], ['Moisturizer / cream', 'moisturi[sz]er|cream|lotion', 'moisturizer'], ['Sunscreen', 'sun\\s*screen|\\bspf\\b', 'sunscreen'], ['Serum', 'serum', 'face serum'], ['Face mask', 'mask|face\\s*pack', 'face mask'], ['Lip care', '\\blip\\b', 'lip balm']]),
      sel('skin', 'fSkin', [['Oily', 'oily', 'oily skin'], ['Dry', '\\bdry\\b', 'dry skin'], ['Sensitive', 'sensitive', 'sensitive skin'], ['All skin types', 'all\\s*skin', 'all skin types']])
    ]
  }),
  C('haircare', 'beauty', ['Haircare', 'बालों की देखभाल', 'केसांची काळजी', 'વાળની સંભાળ', 'চুলের যত্ন', 'கூந்தல் பராமரிப்பு', 'జుట్టు సంరక్షణ', 'ಕೂದಲ ಆರೈಕೆ', 'ਵਾਲਾਂ ਦੀ ਦੇਖਭਾਲ'], {
    q: 'hair', syn: ['shampoo', 'conditioner', 'hair oil', 'hair dryer', 'hair straightener', 'hair serum', 'hair colour', 'शैम्पू'], sites: GEN,
    fields: [
      sel('type', TYPE, [['Shampoo', 'shampoo', 'shampoo'], ['Conditioner', 'conditioner', 'conditioner'], ['Hair oil', 'hair\\s*oil|\\boil\\b', 'hair oil'], ['Hair serum', 'serum', 'hair serum'], ['Hair dryer', 'dryer', 'hair dryer'], ['Straightener', 'straighten', 'hair straightener'], ['Hair colour', 'hair\\s*colou?r|\\bdye\\b', 'hair colour']])
    ]
  }),
  C('grooming', 'beauty', ['Trimmers & shavers', 'ट्रिमर और शेवर', 'ट्रिमर आणि शेव्हर', 'ટ્રિમર અને શેવર', 'ট্রিমার ও শেভার', 'ட்ரிம்மர் & ஷேவர்', 'ట్రిమ్మర్లు & షేవర్లు', 'ಟ್ರಿಮ್ಮರ್ ಮತ್ತು ಶೇವರ್', 'ਟ੍ਰਿਮਰ ਅਤੇ ਸ਼ੇਵਰ'], {
    q: 'trimmer', syn: ['trimmer', 'beard trimmer', 'shaver', 'razor', 'epilator', 'grooming kit', 'ट्रिमर'], brands: BR.grooming,
    fields: [
      sel('type', TYPE, [['Beard trimmer', 'trimmer', 'trimmer'], ['Electric shaver', 'shaver', 'electric shaver'], ['Razor', 'razor', 'razor'], ['Epilator', 'epilator', 'epilator'], ['Grooming kit', 'grooming\\s*kit|multi[\\s-]*grooming', 'grooming kit']]),
      GENDER(['men', 'women']),
      bool('cordless', 'fCordless', 'cordless|rechargeable|battery', 'cordless', 'Cordless')
    ],
    exclude: 'blade only|replacement blade|cartridge|oil only|comb only'
  }),
  C('fragrance', 'beauty', ['Perfumes & deodorants', 'परफ़्यूम और डियो', 'परफ्यूम आणि डिओडोरंट', 'પરફ્યુમ અને ડિઓડરન્ટ', 'পারফিউম ও ডিওডোরেন্ট', 'வாசனை திரவியங்கள்', 'పెర్ఫ్యూమ్‌లు & డియోడరెంట్లు', 'ಸುಗಂಧ ದ್ರವ್ಯ ಮತ್ತು ಡಿಯೋಡರೆಂಟ್', 'ਪਰਫ਼ਿਊਮ ਅਤੇ ਡੀਓ'], {
    q: 'perfume', syn: ['perfume', 'perfumes', 'deo', 'deodorant', 'body spray', 'body mist', 'attar', 'परफ्यूम', 'इत्र'], sites: GEN,
    fields: [
      sel('type', TYPE, [['Perfume (EDP / EDT)', 'perfume|eau\\s*de|\\bedp\\b|\\bedt\\b', 'perfume'], ['Deodorant', 'deodorant|\\bdeo\\b', 'deodorant'], ['Body mist / spray', 'body\\s*(?:mist|spray)', 'body mist'], ['Attar', 'attar|ittar', 'attar']]),
      GENDER(['men', 'women', 'unisex'])
    ]
  }),

  // ---- Baby care
  C('diapers', 'baby', ['Diapers', 'डायपर', 'डायपर', 'ડાયપર', 'ডায়াপার', 'டயப்பர்கள்', 'డైపర్లు', 'ಡೈಪರ್‌ಗಳು', 'ਡਾਇਪਰ'], {
    q: 'diapers', syn: ['diaper', 'diapers', 'diaper pants', 'nappy', 'nappies', 'डायपर'], brands: BR.diapers, sites: GEN,
    fields: [
      sel('type', TYPE, [['Pants', '\\bpants?\\b', 'diaper pants'], ['Taped', '\\btaped?\\b', 'taped diapers']]),
      sel('size', 'fSize', [['Newborn (NB)', '\\bnb\\b|new\\s*born', 'newborn'], ['Small (S)', '\\bsmall\\b|\\(s\\)|size\\s*s\\b|\\bs\\s*\\d{2,3}\\b', 'small'], ['Medium (M)', '\\bmedium\\b|\\(m\\)|size\\s*m\\b|\\bm\\s*\\d{2,3}\\b', 'medium'], ['Large (L)', '(?<!extra\\s)\\blarge\\b|\\(l\\)|size\\s*l\\b|\\bl\\s*\\d{2,3}\\b', 'large'], ['XL', '\\bxl\\b|extra\\s*large', 'xl'], ['XXL', '\\bxxl\\b|\\b2xl\\b', 'xxl']]),
      min('count', 'fCount', 'count', [20, 40, 60, 80, 100], (v) => `${v}+ pcs`)
    ]
  }),
  C('wipes', 'baby', ['Baby wipes', 'बेबी वाइप्स', 'बेबी वाइप्स', 'બેબી વાઇપ્સ', 'বেবি ওয়াইপস', 'குழந்தை துடைப்பான்கள்', 'బేబీ వైప్స్', 'ಬೇಬಿ ವೈಪ್ಸ್', 'ਬੇਬੀ ਵਾਈਪਸ'], {
    q: 'baby wipes', syn: ['wipes', 'baby wipes', 'wet wipes', 'वाइप्स'], brands: BR.wipes, sites: GEN,
    fields: [min('count', 'fCount', 'count', [72, 144, 216, 288], (v) => `${v}+ pcs`)]
  }),
  C('baby_food', 'baby', ['Baby food & formula', 'बेबी फ़ूड और फ़ॉर्मूला', 'बाळाचे अन्न आणि फॉर्म्युला', 'બેબી ફૂડ અને ફોર્મ્યુલા', 'শিশুখাদ্য ও ফর্মুলা', 'குழந்தை உணவு & ஃபார்முலா', 'బేబీ ఫుడ్ & ఫార్ములా', 'ಮಗುವಿನ ಆಹಾರ ಮತ್ತು ಫಾರ್ಮುಲಾ', 'ਬੱਚਿਆਂ ਦਾ ਭੋਜਨ ਅਤੇ ਫ਼ਾਰਮੂਲਾ'], {
    q: 'baby food', syn: ['baby food', 'cerelac', 'infant formula', 'formula milk', 'बेबी फूड'], brands: BR.babyfood, sites: GEN,
    fields: [
      sel('type', TYPE, [['Cereal', 'cereal|cerelac', 'baby cereal'], ['Infant formula', 'formula|lactogen|nan\\s*pro|similac|enfamil', 'infant formula'], ['Puree / snacks', 'puree|puffs|snack', 'baby snacks']]),
      sel('age', 'fAge', [['0–6 months', '\\b0\\s*(?:-|to)\\s*6\\s*m|stage\\s*1\\b|up\\s*to\\s*6\\s*months', 'stage 1'], ['6+ months', '\\b6\\s*(?:\\+|-|to)\\s*(?:\\d+\\s*)?m|stage\\s*2\\b|from\\s*6\\s*months', 'stage 2'], ['8+ months', '\\b8\\s*(?:\\+|-|to)|stage\\s*3\\b', 'stage 3'], ['12+ months', '\\b(?:12|1\\s*year)\\s*(?:\\+|-|to)|stage\\s*[45]\\b', 'stage 4']], { inQuery: false })
    ]
  }),
  C('baby_gear', 'baby', ['Strollers, car seats & carriers', 'स्ट्रॉलर, कार सीट और कैरियर', 'स्ट्रॉलर, कार सीट आणि कॅरियर', 'સ્ટ્રોલર, કાર સીટ અને કેરિયર', 'স্ট্রলার, কার সিট ও ক্যারিয়ার', 'ஸ்ட்ரோலர், கார் சீட் & கேரியர்', 'స్ట్రోలర్లు, కార్ సీట్లు & క్యారియర్లు', 'ಸ್ಟ್ರೋಲರ್, ಕಾರ್ ಸೀಟ್ ಮತ್ತು ಕ್ಯಾರಿಯರ್', 'ਸਟ੍ਰੋਲਰ, ਕਾਰ ਸੀਟ ਅਤੇ ਕੈਰੀਅਰ'], {
    q: 'baby stroller', syn: ['stroller', 'pram', 'baby car seat', 'baby carrier', 'high chair', 'baby walker'], brands: BR.babygear, sites: GEN,
    fields: [sel('type', TYPE, [['Stroller / pram', 'stroller|pram|buggy', 'baby stroller'], ['Car seat', 'car\\s*seat', 'baby car seat'], ['Baby carrier', 'carrier', 'baby carrier'], ['High chair / booster', 'high\\s*chair|booster', 'high chair'], ['Walker', 'walker', 'baby walker']])]
  }),

  // ---- Grocery
  C('staples', 'grocery', ['Atta, rice, dal & oil', 'आटा, चावल, दाल और तेल', 'पीठ, तांदूळ, डाळ आणि तेल', 'લોટ, ચોખા, દાળ અને તેલ', 'আটা, চাল, ডাল ও তেল', 'மாவு, அரிசி, பருப்பு & எண்ணெய்', 'పిండి, బియ్యం, పప్పు & నూనె', 'ಹಿಟ್ಟು, ಅಕ್ಕಿ, ಬೇಳೆ ಮತ್ತು ಎಣ್ಣೆ', 'ਆਟਾ, ਚੌਲ, ਦਾਲ ਅਤੇ ਤੇਲ'], {
    q: '', syn: ['atta', 'rice', 'basmati', 'dal', 'cooking oil', 'mustard oil', 'sugar', 'ghee', 'masala', 'आटा', 'चावल', 'दाल', 'तेल', 'घी'], sites: GEN,
    fields: [
      sel('type', TYPE, [['Atta / flour', 'atta|flour|maida|besan', 'atta'], ['Rice', 'rice|basmati', 'rice'], ['Dal / pulses', '\\bdal\\b|pulses|moong|toor|arhar|chana|masoor|urad|rajma', 'dal'], ['Cooking oil / ghee', '\\boil\\b|ghee', 'cooking oil'], ['Sugar / salt / jaggery', 'sugar|\\bsalt\\b|jaggery|gud', 'sugar'], ['Spices / masala', 'masala|spice|turmeric|chilli|haldi|jeera|cumin', 'masala']]),
      min('qty', 'fQuantity', 'qty', [1, 2, 5, 10], (v) => `${v} kg/L+`, { inQuery: true, q: (v) => `${v} kg` })
    ]
  }),
  C('snacks', 'grocery', ['Snacks & beverages', 'स्नैक्स और पेय', 'स्नॅक्स आणि पेये', 'નાસ્તો અને પીણાં', 'স্ন্যাকস ও পানীয়', 'தின்பண்டங்கள் & பானங்கள்', 'స్నాక్స్ & పానీయాలు', 'ತಿಂಡಿ ಮತ್ತು ಪಾನೀಯಗಳು', 'ਸਨੈਕਸ ਅਤੇ ਪੀਣ ਵਾਲੇ ਪਦਾਰਥ'], {
    q: '', syn: ['tea', 'coffee', 'biscuit', 'biscuits', 'chips', 'namkeen', 'juice', 'chocolate', 'chocolates', 'चाय', 'कॉफी', 'बिस्कुट'], sites: GEN,
    fields: [sel('type', TYPE, [['Tea', '\\btea\\b|\\bchai\\b', 'tea'], ['Coffee', 'coffee', 'coffee'], ['Biscuits / cookies', 'biscuit|cookie', 'biscuits'], ['Chips / namkeen', 'chips|namkeen|bhujia', 'namkeen'], ['Chocolates', 'chocolate', 'chocolate'], ['Juice / drinks', 'juice|drink|cola|soda', 'juice']])]
  }),
  C('household', 'grocery', ['Cleaning & household', 'सफ़ाई और घरेलू सामान', 'स्वच्छता आणि घरगुती वस्तू', 'સફાઈ અને ઘરવપરાશ', 'পরিষ্কার ও গৃহস্থালি', 'சுத்தம் & வீட்டுப் பொருட்கள்', 'శుభ్రత & గృహోపకరణ సామాగ్రి', 'ಸ್ವಚ್ಛತೆ ಮತ್ತು ಮನೆಬಳಕೆ', 'ਸਫ਼ਾਈ ਅਤੇ ਘਰੇਲੂ ਸਮਾਨ'], {
    q: '', syn: ['detergent', 'washing powder', 'dishwash', 'floor cleaner', 'toilet cleaner', 'garbage bags', 'डिटर्जेंट'], sites: GEN,
    fields: [
      sel('type', TYPE, [['Detergent', 'detergent|washing\\s*powder', 'detergent'], ['Dishwash', 'dish', 'dishwash'], ['Floor cleaner', 'floor', 'floor cleaner'], ['Toilet cleaner', 'toilet', 'toilet cleaner'], ['Garbage bags', 'garbage|trash|dustbin\\s*bag', 'garbage bags']]),
      min('qty', 'fQuantity', 'qty', [1, 2, 5], (v) => `${v} kg/L+`)
    ]
  }),

  // ---- Health
  C('supplements', 'health', ['Protein & supplements', 'प्रोटीन और सप्लीमेंट', 'प्रोटीन आणि सप्लिमेंट्स', 'પ્રોટીન અને સપ્લિમેન્ટ્સ', 'প্রোটিন ও সাপ্লিমেন্ট', 'புரதம் & சப்ளிமெண்ட்ஸ்', 'ప్రోటీన్ & సప్లిమెంట్లు', 'ಪ್ರೋಟೀನ್ ಮತ್ತು ಸಪ್ಲಿಮೆಂಟ್', 'ਪ੍ਰੋਟੀਨ ਅਤੇ ਸਪਲੀਮੈਂਟ'], {
    q: '', syn: ['protein', 'whey', 'whey protein', 'multivitamin', 'mass gainer', 'creatine', 'omega 3', 'fish oil', 'प्रोटीन'], brands: BR.supplements, sites: GEN,
    fields: [
      sel('type', TYPE, [['Whey protein', 'whey', 'whey protein'], ['Plant protein', 'plant\\s*protein|pea\\s*protein|vegan\\s*protein', 'plant protein'], ['Mass gainer', 'gainer', 'mass gainer'], ['Multivitamin', 'multi[\\s-]*vitamin', 'multivitamin'], ['Omega-3 / fish oil', 'omega|fish\\s*oil', 'omega 3'], ['Creatine', 'creatine', 'creatine']]),
      min('weight', 'fWeight', 'kg', [1, 2, 4], (v) => `${v} kg+`, { inQuery: true, q: (v) => `${v}kg` }),
      bool('veg', 'fVeg', '\\bveg\\b|vegetarian|vegan|plant', 'veg', 'Veg')
    ]
  }),
  C('health_dev', 'health', ['Health devices', 'स्वास्थ्य उपकरण', 'आरोग्य उपकरणे', 'આરોગ્ય ઉપકરણો', 'স্বাস্থ্য যন্ত্র', 'சுகாதார சாதனங்கள்', 'ఆరోగ్య పరికరాలు', 'ಆರೋಗ್ಯ ಸಾಧನಗಳು', 'ਸਿਹਤ ਉਪਕਰਣ'], {
    q: '', syn: ['bp monitor', 'blood pressure', 'oximeter', 'thermometer', 'glucometer', 'weighing scale', 'weighing machine', 'nebulizer'], brands: BR.healthdev, sites: GEN,
    fields: [sel('type', TYPE, [['BP monitor', '\\bbp\\b|blood\\s*pressure', 'bp monitor'], ['Pulse oximeter', 'oximeter', 'pulse oximeter'], ['Thermometer', 'thermometer', 'thermometer'], ['Glucometer', 'gluco', 'glucometer'], ['Weighing scale', 'weighing|weight\\s*(?:machine|scale)|body\\s*fat', 'weighing scale'], ['Nebulizer', 'nebuli[sz]er', 'nebulizer']])],
    exclude: 'strips only|test strips|lancets|batteries'
  }),

  // ---- Hardware & tools
  C('power_tools', 'hardware', ['Power tools', 'पावर टूल्स', 'पॉवर टूल्स', 'પાવર ટૂલ્સ', 'পাওয়ার টুলস', 'மின் கருவிகள்', 'పవర్ టూల్స్', 'ಪವರ್ ಟೂಲ್ಸ್', 'ਪਾਵਰ ਟੂਲ'], {
    q: '', syn: ['drill', 'drill machine', 'angle grinder', 'impact driver', 'jigsaw', 'circular saw', 'heat gun', 'power tool', 'power tools', 'ड्रिल'], brands: BR.powertools,
    fields: [
      sel('type', TYPE, [['Drill / driver', 'drill|driver', 'drill machine'], ['Impact driver / wrench', 'impact', 'impact driver'], ['Angle grinder', 'angle\\s*grinder|\\bgrinder\\b', 'angle grinder'], ['Jigsaw', 'jig\\s*saw', 'jigsaw'], ['Circular saw', 'circular\\s*saw', 'circular saw'], ['Heat gun', 'heat\\s*gun', 'heat gun'], ['Blower', 'blower', 'blower'], ['Tool kit / combo', '\\bkit\\b|combo', 'power tool kit']]),
      sel('source', 'fPowerSource', [['Corded', '\\bcorded\\b|\\d{3,4}\\s*w\\b', 'corded'], ['Cordless (battery)', 'cordless|battery|li[\\s-]*ion', 'cordless']]),
      sel('volt', 'fVoltage', [['12V', '\\b1[02](?:\\.8)?\\s*v\\b', '12v'], ['18V / 20V', '\\b(?:18|20|21)\\s*v\\b', '18v'], ['36V+', '\\b(?:36|40|54)\\s*v\\b', '36v']]),
      min('power', 'fPower', 'watt', [500, 650, 800, 1000, 1500], (v) => `${v} W+`)
    ],
    exclude: '\\bbits?\\b only|bit set|drill bits|blade only|carbon brush|chuck key|battery only|charger only'
  }),
  C('hand_tools', 'hardware', ['Hand tools', 'हैंड टूल्स', 'हाताची साधने', 'હેન્ડ ટૂલ્સ', 'হাতের যন্ত্রপাতি', 'கைக் கருவிகள்', 'చేతి పనిముట్లు', 'ಕೈ ಉಪಕರಣಗಳು', 'ਹੱਥ ਦੇ ਸੰਦ'], {
    q: '', syn: ['screwdriver', 'screwdriver set', 'spanner', 'wrench', 'hammer', 'plier', 'pliers', 'tool kit', 'toolkit', 'tool box', 'measuring tape', 'पेचकस', 'पाना'], brands: BR.handtools,
    fields: [sel('type', TYPE, [['Screwdriver set', 'screw\\s*driver', 'screwdriver set'], ['Spanner / wrench set', 'spanner|wrench', 'spanner set'], ['Hammer', 'hammer', 'hammer'], ['Pliers', 'plier', 'pliers'], ['Tool kit', 'tool\\s*(?:kit|box|set)', 'tool kit'], ['Measuring tape', 'measuring\\s*tape|tape\\s*measure', 'measuring tape'], ['Allen / hex keys', 'allen|hex\\s*key', 'allen key set']])]
  }),
  C('electrical', 'hardware', ['Bulbs, switches & wiring', 'बल्ब, स्विच और वायरिंग', 'बल्ब, स्विच आणि वायरिंग', 'બલ્બ, સ્વિચ અને વાયરિંગ', 'বাল্ব, সুইচ ও ওয়্যারিং', 'பல்புகள், சுவிட்சுகள் & வயரிங்', 'బల్బులు, స్విచ్‌లు & వైరింగ్', 'ಬಲ್ಬ್, ಸ್ವಿಚ್ ಮತ್ತು ವೈರಿಂಗ್', 'ਬੱਲਬ, ਸਵਿੱਚ ਅਤੇ ਵਾਇਰਿੰਗ'], {
    q: '', syn: ['bulb', 'led bulb', 'tube light', 'batten', 'extension board', 'extension cord', 'spike guard', 'switch', 'wire', 'smart plug', 'बल्ब'], brands: BR.electrical,
    fields: [
      sel('type', TYPE, [['LED bulb', 'bulb', 'led bulb'], ['Tube light / batten', 'batten|tube\\s*light', 'led batten'], ['Extension board', 'extension|spike\\s*guard|surge', 'extension board'], ['Switches & sockets', 'switch|socket', 'modular switch'], ['Wire / cable', '\\bwire\\b|\\bcable\\b', 'electrical wire'], ['Smart plug', 'smart\\s*plug', 'smart plug'], ['Emergency light', 'emergency|rechargeable\\s*(?:led\\s*)?light', 'emergency light']]),
      min('power', 'fPower', 'watt', [5, 9, 12, 20, 40], (v) => `${v} W+`)
    ]
  }),

  // ---- Sports
  C('fitness', 'sports', ['Fitness equipment', 'फ़िटनेस उपकरण', 'फिटनेस उपकरणे', 'ફિટનેસ સાધનો', 'ফিটনেস সরঞ্জাম', 'உடற்பயிற்சி உபகரணங்கள்', 'ఫిట్‌నెస్ పరికరాలు', 'ಫಿಟ್ನೆಸ್ ಉಪಕರಣಗಳು', 'ਫ਼ਿਟਨੈੱਸ ਉਪਕਰਣ'], {
    q: '', syn: ['dumbbell', 'dumbbells', 'kettlebell', 'treadmill', 'yoga mat', 'exercise cycle', 'resistance band', 'home gym', 'gym equipment'], brands: BR.fitness, sites: GEN,
    fields: [
      sel('type', TYPE, [['Dumbbells', 'dumbbell', 'dumbbells'], ['Kettlebell', 'kettlebell', 'kettlebell'], ['Treadmill', 'treadmill', 'treadmill'], ['Exercise cycle', 'exercise\\s*(?:cycle|bike)|spin\\s*bike', 'exercise cycle'], ['Yoga mat', 'yoga\\s*mat|exercise\\s*mat', 'yoga mat'], ['Resistance band', 'resistance|\\bbands?\\b', 'resistance band'], ['Home gym / bench', 'home\\s*gym|bench', 'home gym']]),
      min('weight', 'fWeight', 'kg', [2, 5, 10, 20], (v) => `${v} kg+`)
    ]
  }),
  C('cycles', 'sports', ['Bicycles', 'साइकिल', 'सायकल', 'સાયકલ', 'সাইকেল', 'மிதிவண்டிகள்', 'సైకిళ్లు', 'ಸೈಕಲ್‌ಗಳು', 'ਸਾਈਕਲ'], {
    q: 'cycle', syn: ['cycle', 'cycles', 'bicycle', 'bicycles', 'mtb', 'साइकिल'], brands: BR.cycles, sites: GEN,
    fields: [
      sel('type', TYPE, [['Mountain (MTB)', '\\bmtb\\b|mountain', 'mtb cycle'], ['Road / racing', '\\broad\\b|racing', 'road bike'], ['Hybrid / city', 'hybrid|\\bcity\\b', 'hybrid cycle'], ['Kids', 'kids|junior|\\b(?:12|14|16)\\s*(?:t\\b|inch)', 'kids cycle'], ['Electric', 'electric|e[\\s-]*bike|e[\\s-]*cycle', 'electric cycle']]),
      sel('wheel', 'fWheel', [['20"', '\\b20\\s*(?:t\\b|"|inch)', '20t'], ['24"', '\\b24\\s*(?:t\\b|"|inch)', '24t'], ['26"', '\\b26\\s*(?:t\\b|"|inch)', '26t'], ['27.5"', '27\\.5', '27.5'], ['29"', '\\b29\\s*(?:t\\b|er\\b|"|inch)', '29er']]),
      bool('gears', 'fGears', 'gears?\\b|\\d+\\s*speed|shimano', 'gear', 'Gears')
    ],
    exclude: 'lock only|bell|light only|pump only|cover only|stand only|tube only'
  }),

  // ---- Toys, books & stationery
  C('toys', 'toys', ['Toys & games', 'खिलौने और गेम्स', 'खेळणी आणि खेळ', 'રમકડાં અને રમતો', 'খেলনা ও গেম', 'பொம்மைகள் & விளையாட்டுகள்', 'బొమ్మలు & ఆటలు', 'ಆಟಿಕೆಗಳು ಮತ್ತು ಆಟಗಳು', 'ਖਿਡੌਣੇ ਅਤੇ ਖੇਡਾਂ'], {
    q: 'toys', syn: ['toy', 'toys', 'board game', 'lego', 'puzzle', 'rc car', 'soft toy', 'teddy', 'खिलौना', 'खिलौने'], sites: GEN,
    fields: [
      sel('age', 'fAge', [['0–2 years', '\\b0\\s*(?:\\+|-|to)|\\b(?:6|12|18)\\s*months?\\s*\\+|infant|toddler', 'toddler'], ['3–5 years', '\\b[345]\\s*(?:\\+|-|to)|\\b[345]\\s*(?:years?|yrs?)\\s*(?:\\+|and\\s*up)', '3 years'], ['6–8 years', '\\b[678]\\s*(?:\\+|-|to)|\\b[678]\\s*(?:years?|yrs?)\\s*(?:\\+|and\\s*up)', '6 years'], ['9+ years', '\\b(?:9|1[0-4])\\s*(?:\\+|-|to)|\\b(?:9|1[0-4])\\s*(?:years?|yrs?)\\s*(?:\\+|and\\s*up)', '9 years']], { inQuery: false }),
      sel('type', TYPE, [['Educational / STEM', 'educational|learning|\\bstem\\b', 'educational toys'], ['Remote control', 'remote\\s*control|\\brc\\b', 'remote control toy'], ['Building blocks', 'blocks|lego|building', 'building blocks'], ['Board game / puzzle', 'board\\s*game|ludo|chess|monopoly|puzzle', 'board game'], ['Soft toy', 'soft\\s*toy|teddy|plush', 'soft toy'], ['Ride-on', 'ride[\\s-]*on|tricycle|scooter', 'ride on toy']])
    ]
  }),
  C('books', 'toys', ['Books', 'किताबें', 'पुस्तके', 'પુસ્તકો', 'বই', 'புத்தகங்கள்', 'పుస్తకాలు', 'ಪುಸ್ತಕಗಳು', 'ਕਿਤਾਬਾਂ'], {
    q: 'book', syn: ['book', 'books', 'novel', 'किताब', 'पुस्तक'], sites: BOOKS,
    fields: [
      sel('lang', 'language', [['English', 'english', 'english'], ['Hindi', 'hindi', 'hindi']]),
      sel('format', 'fFormat', [['Paperback', 'paperback', 'paperback'], ['Hardcover', 'hard\\s*(?:cover|bound)', 'hardcover']], { inQuery: false })
    ]
  }),
  C('stationery', 'toys', ['Stationery', 'स्टेशनरी', 'स्टेशनरी', 'સ્ટેશનરી', 'স্টেশনারি', 'எழுதுபொருட்கள்', 'స్టేషనరీ', 'ಲೇಖನ ಸಾಮಗ್ರಿ', 'ਸਟੇਸ਼ਨਰੀ'], {
    q: '', syn: ['pen', 'pens', 'notebook', 'notebooks', 'diary', 'calculator', 'crayons', 'geometry box', 'register', 'stationery'], sites: GEN,
    fields: [sel('type', TYPE, [['Notebook / diary', 'note\\s*book|register|diary', 'notebook'], ['Pens', '\\bpens?\\b|ball\\s*pen|\\bgel\\b', 'pen'], ['Art supplies', 'colou?r|crayon|paint|sketch', 'art supplies'], ['Calculator', 'calculator', 'calculator'], ['Geometry box', 'geometry', 'geometry box']])]
  }),

  // ---- Automotive & pets
  C('car_acc', 'auto', ['Car accessories', 'कार एक्सेसरीज़', 'कार ॲक्सेसरीज', 'કાર એક્સેસરીઝ', 'গাড়ির অ্যাক্সেসরিজ', 'கார் உபகரணங்கள்', 'కార్ యాక్సెసరీలు', 'ಕಾರ್ ಪರಿಕರಗಳು', 'ਕਾਰ ਐਕਸੈਸਰੀਜ਼'], {
    q: 'car', syn: ['car accessories', 'dash cam', 'dashcam', 'tyre inflator', 'car charger', 'seat cover', 'car vacuum', 'car perfume', 'car phone holder'], sites: GEN,
    fields: [sel('type', TYPE, [['Dash cam', 'dash\\s*cam', 'dash cam'], ['Tyre inflator', 'inflator|air\\s*compressor', 'tyre inflator'], ['Car charger', 'car\\s*charger', 'car charger'], ['Phone holder', 'holder|mount', 'car mobile holder'], ['Seat cover', 'seat\\s*cover', 'car seat cover'], ['Car vacuum', 'vacuum', 'car vacuum cleaner'], ['Air freshener', 'perfume|freshener', 'car perfume']])]
  }),
  C('bike_acc', 'auto', ['Bike accessories & helmets', 'बाइक एक्सेसरीज़ और हेलमेट', 'बाईक ॲक्सेसरीज आणि हेल्मेट', 'બાઇક એક્સેસરીઝ અને હેલ્મેટ', 'বাইকের অ্যাক্সেসরিজ ও হেলমেট', 'பைக் உபகரணங்கள் & ஹெல்மெட்', 'బైక్ యాక్సెసరీలు & హెల్మెట్లు', 'ಬೈಕ್ ಪರಿಕರಗಳು ಮತ್ತು ಹೆಲ್ಮೆಟ್', 'ਬਾਈਕ ਐਕਸੈਸਰੀਜ਼ ਅਤੇ ਹੈਲਮੇਟ'], {
    q: '', syn: ['helmet', 'helmets', 'riding gloves', 'bike cover', 'bike accessories', 'हेलमेट'], brands: BR.helmets, sites: GEN,
    fields: [sel('type', TYPE, [['Helmet', 'helmet', 'helmet'], ['Riding gloves', 'gloves', 'riding gloves'], ['Bike cover', 'cover', 'bike cover'], ['Phone mount', 'mount|holder', 'bike mobile holder'], ['Riding jacket', 'jacket', 'riding jacket']])]
  }),
  C('pet', 'auto', ['Pet food & supplies', 'पालतू जानवरों का खाना और सामान', 'पाळीव प्राण्यांचे अन्न आणि साहित्य', 'પાળતુ પ્રાણીનો ખોરાક અને સામાન', 'পোষ্যের খাবার ও সামগ্রী', 'செல்லப்பிராணி உணவு & பொருட்கள்', 'పెంపుడు జంతువుల ఆహారం & సామాగ్రి', 'ಸಾಕುಪ್ರಾಣಿ ಆಹಾರ ಮತ್ತು ಸಾಮಗ್ರಿ', 'ਪਾਲਤੂ ਜਾਨਵਰਾਂ ਦਾ ਖਾਣਾ ਅਤੇ ਸਮਾਨ'], {
    q: 'pet food', syn: ['dog food', 'cat food', 'pet food', 'puppy food', 'cat litter', 'dog', 'cat'], brands: BR.pets, sites: GEN,
    fields: [
      sel('pet', 'fPet', [['Dog', '\\bdogs?\\b|puppy', 'dog', 'oDog'], ['Cat', '\\bcats?\\b|kitten', 'cat', 'oCat']]),
      sel('type', TYPE, [['Dry food', '\\bdry\\b', 'dry food'], ['Wet food', '\\bwet\\b|gravy|pouch', 'wet food'], ['Treats', 'treat|biscuit|chew', 'treats'], ['Litter', 'litter', 'litter'], ['Toys / accessories', '\\btoy|collar|leash|\\bbed\\b|bowl', 'pet accessories']]),
      sel('age', 'fAge', [['Puppy / kitten', 'puppy|kitten|starter|junior', 'puppy'], ['Adult', 'adult', 'adult'], ['Senior', 'senior', 'senior']], { inQuery: false }),
      min('qty', 'fQuantity', 'qty', [1, 3, 10], (v) => `${v} kg+`)
    ]
  })
];

// ---------- compile ----------
const toBrand = (b) => (Array.isArray(b) ? { name: b[0], alias: b.slice(1) } : { name: b, alias: [b.toLowerCase()] });
for (const c of RAW) {
  c.brands = c.brands.map(toBrand).map((b) => ({ ...b, id: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));
  for (const f of c.fields) {
    if (f.type === 'select') f.options.forEach((op) => (op.rx = new RegExp(op.re, 'i')));
    if (f.type === 'bool') f.rx = new RegExp(f.re, 'i');
  }
  c.excludeRx = c.exclude ? new RegExp(`\\b(?:${c.exclude})`, 'i') : null;
  c.keepRx = c.keep ? new RegExp(c.keep, 'i') : null;
  c.synWords = new Set(c.syn.flatMap((s) => s.toLowerCase().split(/\s+/)));
}

export const CATEGORIES = RAW;
const BY_ID = new Map(RAW.map((c) => [c.id, c]));
export const catById = (id) => BY_ID.get(id) || BY_ID.get('all');
export const groupById = (id) => GROUPS.find((g) => g.id === id);

const IND = '\\u0900-\\u0DFF';
const synRe = (s) => new RegExp(`(^|[^a-z0-9${IND}])${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^a-z0-9${IND}])`, 'i');
const SYN_RX = RAW.flatMap((c) => c.syn.filter(() => c.id !== 'all').map((s) => ({ id: c.id, len: s.length, rx: synRe(s) })));

/** description में से category पहचानें — सबसे लंबा मिला synonym जीतता है ("angle grinder" > "grinder") */
export function detectCategory(text) {
  // जो product पहले लिखा है वो जीतता है ("phone ... 50MP camera" = phone);
  // एक ही जगह पर लंबा synonym जीतता है ("angle grinder" > "grinder", "car phone holder" > "phone")
  const s = ` ${(text || '').toLowerCase()} `;
  let best = null;
  for (const x of SYN_RX) {
    const m = x.rx.exec(s);
    if (!m) continue;
    const pos = m.index + m[1].length;
    const end = pos + x.len;
    if (!best || pos < best.pos && end <= best.pos || (pos <= best.pos && end >= best.end) || (pos < best.pos && x.len >= best.len)) best = { ...x, pos, end };
  }
  return best?.id || null;
}

/** type-ahead: नाम (मौजूदा भाषा + English), group और synonyms में खोजें */
export function searchCategories(query, lang) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return RAW;
  const scored = [];
  RAW.forEach((c, i) => {
    const names = [t(c.name), ...LANGS.map((l) => tIn(l.id, c.name))].map((n) => n.toLowerCase());
    const grp = [t(groupById(c.group).name), tIn('en', groupById(c.group).name)].map((n) => n.toLowerCase());
    const words = (arr) => arr.flatMap((n) => n.split(/[\s,&/()-]+/)).filter(Boolean);
    let score = 0;
    if (names.some((n) => n.startsWith(q))) score = 100;
    else if (words(names).some((w) => w.startsWith(q))) score = 80;
    else if (c.syn.some((s) => s.startsWith(q))) score = 60;
    else if (names.some((n) => n.includes(q)) || c.syn.some((s) => s.includes(q))) score = 40;
    else if (grp.some((n) => n.startsWith(q)) || words(grp).some((w) => w.startsWith(q))) score = 30;
    if (score) scored.push({ c, score, i });
  });
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).map((x) => x.c);
}

/** option का दिखने वाला नाम (अनुवाद हो तो) */
export const optLabel = (op) => (op.labelKey ? t(op.labelKey) : op.label);
