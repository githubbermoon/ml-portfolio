import React, { useEffect, useState } from 'react';

export const translations = {
  en: {
    'nav.home': 'Home',
    'nav.realms': 'Realms',
    'nav.projects': 'Projects',
    'nav.kosh': 'Kosh',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.navigation': 'Navigation',
    'home.hero.eyebrow': 'A living treasury',
    'home.hero.folio': 'Folio 01',
    'home.hero.title': 'Kosh',
    'home.hero.name': 'Pranjal Prakash Pandey',
    'home.hero.subtitle': 'A living treasury of empirical sciences, symbolic systems, material experiments, and field notes.',
    'home.hero.curated': 'Curated by',
    'home.hero.place': 'Bengaluru · India',
    'home.hero.enter': 'Enter the Kosh',
    'home.hero.explore': 'Explore the realms',
    'home.hero.treasure': 'Treasure',
    'home.hero.archive': 'Archive',
    'home.hero.inquiry': 'Inquiry',
    'home.hero.scroll': 'Scroll to unfold',
    'home.panel.location': 'Location',
    'home.panel.locationValue': 'Bengaluru, India',
    'home.panel.focus': 'Focus',
    'home.panel.focusValue': 'Vedic sciences + symbolic systems',
    'home.panel.archive': 'Archive',
    'home.panel.archiveValue': 'Kosh: notes, references, and fragments',
    'home.realms.eyebrow': 'The realms',
    'home.realms.title': 'Four fields of inquiry',
    'home.realms.subtitle': 'Enter through any field. Each is a different way of observing, preserving, and making sense of the world.',
    'home.realms.open': 'Open realm ↗',
    'realm.technical.label': 'Technical Work',
    'realm.technical.title': 'Texts & Systems',
    'realm.technical.desc': 'Structured notes and research experiments around Vedic sciences, symbolic systems, and computation.',
    'realm.kosh.label': 'Kosh',
    'realm.kosh.title': 'कोश',
    'realm.kosh.desc': 'A living archive of notes, references, essays, and fragments gathered over time.',
    'realm.mist.label': 'Mist',
    'realm.mist.title': 'Ananta N',
    'realm.mist.desc': 'An inner-world room for perception, mythic language, intelligence, and visual essays.',
    'realm.projects.label': 'Projects',
    'realm.projects.title': 'Ancient Sciences Builds',
    'realm.projects.desc': 'Prototypes inspired by ancient sciences, knowledge systems, and practical tools.',
    'home.recent.eyebrow': 'New leaves',
    'home.recent.title': 'Recently entered',
    'home.recent.subtitle': 'The newest notes, references, and visual fragments added to the treasury.',
    'home.recent.ishputraType': 'Linked archive',
    'home.recent.ishputraTitle': 'Ishputra',
    'home.recent.ishputraSummary': 'Four moving-image fragments preserved as reference links.',
    'home.recent.fearType': 'Reading notes',
    'home.recent.fearTitle': 'Fear',
    'home.recent.fearSummary': 'Verses and reflections on duality, restraint, and fearlessness.',
    'home.recent.dharmaType': 'Visual essay',
    'home.recent.dharmaTitle': 'Dharma Kshetra',
    'home.recent.dharmaSummary': 'A field of duty, doubt, action, and release.',
    'home.statement.eyebrow': 'A guiding thought',
    'home.statement.text': 'This is a place for slow attention: to study inherited systems, test them against lived experience, and build new tools without stripping away their context.',
    'contact.eyebrow': 'Correspondence',
    'contact.title': 'Begin a conversation',
    'contact.subtitle': 'For thoughtful conversations, collaborations, suggestions, or shared curiosities.',
    'contact.write': 'Write to me',
    'home.footer.copyright': '© 2026 Himavat — Pranjal Prakash Pandey. All rights reserved.',
    'home.footer.place': 'Kosh · Bengaluru',
    'contact.availability': 'Availability',
    'contact.availabilityText': 'Open to thoughtful conversations, collaborations, and new ideas.',
    'contact.location': 'Based in Bengaluru',
    'contact.email': 'Your email',
    'contact.idea': 'Project idea',
    'contact.send': 'Send Message →',
  },
  hi: {
    'nav.home': 'होम',
    'nav.realms': 'रियलम्स',
    'nav.projects': 'प्रोजेक्ट्स',
    'nav.kosh': 'कोश',
    'nav.blog': 'ब्लॉग',
    'nav.contact': 'संपर्क',
    'nav.menu': 'मेनू',
    'nav.close': 'बंद करें',
    'nav.navigation': 'नेविगेशन',
    'home.hero.eyebrow': 'एक जीवंत ज्ञान-भंडार',
    'home.hero.folio': 'पृष्ठ ०१',
    'home.hero.title': 'कोश',
    'home.hero.name': 'प्रांजल प्रकाश पांडेय',
    'home.hero.subtitle': 'प्राचीन विज्ञानों, प्रतीकात्मक प्रणालियों, प्रयोगों और फील्ड नोट्स का एक जीवंत ज्ञान-भंडार।',
    'home.hero.curated': 'संकलन',
    'home.hero.place': 'बेंगलुरु · भारत',
    'home.hero.enter': 'कोश में प्रवेश करें',
    'home.hero.explore': 'क्षेत्रों को देखें',
    'home.hero.treasure': 'निधि',
    'home.hero.archive': 'संग्रह',
    'home.hero.inquiry': 'जिज्ञासा',
    'home.hero.scroll': 'खोलने के लिए स्क्रॉल करें',
    'home.panel.location': 'स्थान',
    'home.panel.locationValue': 'बेंगलुरु, भारत',
    'home.panel.focus': 'केंद्र',
    'home.panel.focusValue': 'वैदिक विज्ञान + प्रतीकात्मक प्रणालियाँ',
    'home.panel.archive': 'संग्रह',
    'home.panel.archiveValue': 'कोश: नोट्स, संदर्भ और अंश',
    'home.realms.eyebrow': 'ज्ञान-क्षेत्र',
    'home.realms.title': 'जिज्ञासा के चार क्षेत्र',
    'home.realms.subtitle': 'किसी भी क्षेत्र से प्रवेश करें। प्रत्येक संसार को देखने, सहेजने और समझने का एक अलग मार्ग है।',
    'home.realms.open': 'क्षेत्र खोलें ↗',
    'realm.technical.label': 'तकनीकी कार्य',
    'realm.technical.title': 'ग्रंथ और प्रणालियाँ',
    'realm.technical.desc': 'वैदिक विज्ञान, प्रतीकात्मक प्रणालियों और कम्प्यूटेशन पर संरचित नोट्स तथा शोध-प्रयोग।',
    'realm.kosh.label': 'कोश',
    'realm.kosh.title': 'कोश',
    'realm.kosh.desc': 'समय के साथ संकलित नोट्स, संदर्भों, निबंधों और अंशों का एक जीवंत संग्रह।',
    'realm.mist.label': 'नीहार',
    'realm.mist.title': 'अनंत न',
    'realm.mist.desc': 'अनुभूति, मिथकीय भाषा, बुद्धिमत्ता और दृश्य निबंधों के लिए एक आंतरिक कक्ष।',
    'realm.projects.label': 'प्रोजेक्ट्स',
    'realm.projects.title': 'प्राचीन विज्ञानों से प्रेरित निर्माण',
    'realm.projects.desc': 'प्राचीन विज्ञानों, ज्ञान-प्रणालियों और उपयोगी उपकरणों से प्रेरित प्रोटोटाइप।',
    'home.recent.eyebrow': 'नए पृष्ठ',
    'home.recent.title': 'हाल में संकलित',
    'home.recent.subtitle': 'कोश में जोड़े गए नवीनतम नोट्स, संदर्भ और दृश्य अंश।',
    'home.recent.ishputraType': 'लिंक्ड संग्रह',
    'home.recent.ishputraTitle': 'ईशपुत्र',
    'home.recent.ishputraSummary': 'संदर्भ लिंक के रूप में संरक्षित चार चल-चित्र अंश।',
    'home.recent.fearType': 'पठन-नोट्स',
    'home.recent.fearTitle': 'भय',
    'home.recent.fearSummary': 'द्वैत, संयम और निर्भयता पर श्लोक और चिंतन।',
    'home.recent.dharmaType': 'दृश्य निबंध',
    'home.recent.dharmaTitle': 'धर्म-क्षेत्र',
    'home.recent.dharmaSummary': 'कर्तव्य, संशय, कर्म और मुक्ति का क्षेत्र।',
    'home.statement.eyebrow': 'एक मार्गदर्शक विचार',
    'home.statement.text': 'यह धीमे और सजग अवलोकन का स्थान है—विरासत में मिली प्रणालियों का अध्ययन करने, उन्हें जीवन-अनुभव पर कसने और उनके संदर्भ को मिटाए बिना नए उपकरण बनाने के लिए।',
    'contact.eyebrow': 'पत्राचार',
    'contact.title': 'संवाद आरंभ करें',
    'contact.subtitle': 'विचारशील संवाद, सहयोग, सुझाव या साझा जिज्ञासाओं के लिए।',
    'contact.write': 'मुझे लिखें',
    'home.footer.copyright': '© २०२६ हिमवत — प्रांजल प्रकाश पांडेय। सर्वाधिकार सुरक्षित।',
    'home.footer.place': 'कोश · बेंगलुरु',
    'contact.availability': 'उपलब्धता',
    'contact.availabilityText': 'विचारशील संवादों, सहयोगों और नए विचारों के लिए खुला हूँ।',
    'contact.location': 'बेंगलुरु में स्थित',
    'contact.email': 'आपका ईमेल',
    'contact.idea': 'प्रोजेक्ट का विचार',
    'contact.send': 'संदेश भेजें →',
  },
} as const;

const exactTextTranslations: Record<string, string> = {
  'Kosh (कोश)': 'कोश',
  'A treasury of notes, references, essays, fragments, and field notes.': 'नोट्स, संदर्भों, निबंधों, अंशों और फील्ड नोट्स का एक संग्रह।',
  'Context': 'संदर्भ',
  'Living Archive': 'जीवंत संग्रह',
  'Texts & Systems': 'ग्रंथ और प्रणालियाँ',
  'Technical Work': 'तकनीकी कार्य',
  'Structured notes and experiments around ancient sciences, symbolic systems, and computation.': 'प्राचीन विज्ञानों, प्रतीकात्मक प्रणालियों और कम्प्यूटेशन पर संरचित नोट्स और प्रयोग।',
  'Spiritual / speculative': 'आध्यात्मिक / कल्पनाशील',
  'Perception, intelligence, inner experience, mythic language, and visual essays.': 'अनुभूति, बुद्धिमत्ता, आंतरिक अनुभव, मिथकीय भाषा और दृश्य निबंध।',
  'Calendrics & Celestial Symbolism': 'कालगणना और खगोलीय प्रतीकवाद',
  'Ananta N': 'अनंत न',
  'Astrology': 'ज्योतिष',
  'Planetary notes, symbolic systems, timing, archetypes, and chart reflections.': 'ग्रहों पर नोट्स, प्रतीकात्मक प्रणालियाँ, समय-विवेक, आदिरूप और कुंडली-चिंतन।',
  'Palate': 'रसबोध',
  'Cooking': 'पाक-कला',
  'Recipes, kitchen systems, taste experiments, food memory, and process notes.': 'व्यंजन-विधियाँ, रसोई प्रणालियाँ, स्वाद-प्रयोग, भोजन-स्मृति और प्रक्रिया-नोट्स।',
  'Field Notes': 'फील्ड नोट्स',
  'Essays': 'निबंध',
  'Personal essays, observations, reading notes, and unfinished thoughts worth preserving.': 'व्यक्तिगत निबंध, अवलोकन, पठन-नोट्स और संजोने योग्य अधूरे विचार।',
  'Index': 'अनुक्रमणिका',
  'Reference': 'संदर्भ',
  'Short notes, glossary entries, links, fragments, and reusable knowledge blocks.': 'छोटे नोट्स, शब्दावली, लिंक, अंश और पुन: प्रयोज्य ज्ञान-खंड।',
  'Ancient Sciences Projects': 'प्राचीन विज्ञानों के प्रोजेक्ट्स',
  'This page will hold projects and prototypes built around Vedic sciences, symbolic systems, traditional knowledge, and practical tools.': 'यह पृष्ठ वैदिक विज्ञान, प्रतीकात्मक प्रणालियों, पारंपरिक ज्ञान और उपयोगी उपकरणों पर बने प्रोजेक्ट्स व प्रोटोटाइप्स को सँजोएगा।',
  'Coming soon': 'शीघ्र आने वाला',
  'Vedic sciences tools': 'वैदिक विज्ञान उपकरण',
  'Future calculators, visualizations, diagrams, and research interfaces will live here.': 'भविष्य के कैलकुलेटर, दृश्यांकन, आरेख और शोध-इंटरफेस यहाँ रखे जाएँगे।',
  'Direction': 'दिशा',
  'Ancient knowledge × software': 'प्राचीन ज्ञान × सॉफ्टवेयर',
  'A separate project surface for Realms, not the professional GitHub Pages portfolio.': 'रियलम्स के लिए एक अलग प्रोजेक्ट-सतह, पेशेवर GitHub Pages पोर्टफोलियो से अलग।',
  'Vedic sciences, systems, and experiments': 'वैदिक विज्ञान, प्रणालियाँ और प्रयोग',
  'This space will hold structured notes and technical explorations around ancient sciences, symbolic systems, computation, and research artifacts.': 'यह स्थान प्राचीन विज्ञानों, प्रतीकात्मक प्रणालियों, कम्प्यूटेशन और शोध-कलाकृतियों पर संरचित नोट्स व तकनीकी खोजों को सँजोएगा।',
  'Coming next': 'आगे आने वाला',
  'Vedic sciences notebook': 'वैदिक विज्ञान नोटबुक',
  'A clean index for future essays, diagrams, experiments, references, and implementation notes.': 'भविष्य के निबंधों, आरेखों, प्रयोगों, संदर्भों और कार्यान्वयन-नोट्स के लिए एक साफ़ अनुक्रमणिका।',
  'Ancient knowledge × modern systems': 'प्राचीन ज्ञान × आधुनिक प्रणालियाँ',
  'The goal is to build readable bridges between Sanskritic frameworks, reasoning systems, visual models, and practical software artifacts.': 'लक्ष्य है संस्कृत-आधारित ढाँचों, तर्क-प्रणालियों, दृश्य मॉडलों और उपयोगी सॉफ्टवेयर कलाकृतियों के बीच पठनीय सेतु बनाना।',
  'Realms / Linked Archive': 'रियलम्स / लिंक्ड संग्रह',
  'Ishputra': 'ईशपुत्र',
  'Collected Instagram reels preserved here as reference links.': 'संदर्भ लिंक के रूप में संरक्षित Instagram रीलों का संग्रह।',
  'Reel 1': 'रील 1',
  'Reel 2': 'रील 2',
  'Reel 3': 'रील 3',
  'Reel 4': 'रील 4',
  'Back to library': 'संग्रह पर लौटें',
  'Back to Blog': 'ब्लॉग पर लौटें',
  'Back to Field Notes': 'फील्ड नोट्स पर लौटें',
  'Themes': 'विषय',
  'Embodied intelligence': 'देहधारी बुद्धिमत्ता',
  'Machine narratives': 'मशीन कथाएँ',
  'Speculative futures': 'कल्पनाशील भविष्य',
  'Interaction': 'अंतःक्रिया',
  'Scroll to dissolve the veil. Watch the mist fade as you scroll.': 'आवरण को विलीन करने के लिए स्क्रॉल करें। स्क्रॉल करते हुए नीहार को मिटते देखें।',
  'The Endless Mist': 'अनंत नीहार',
  'The Infinite': 'अनंत',
  'Planetary notes, symbolic timing, archetypal study, and chart reflections. This realm is prepared for essays that treat astrology as a language of pattern, not a replacement for judgment.': 'ग्रह-नोट्स, प्रतीकात्मक समय-विवेक, आदिरूपों का अध्ययन और कुंडली-चिंतन। यह खंड ज्योतिष को निर्णय का विकल्प नहीं, पैटर्न की भाषा मानने वाले निबंधों के लिए तैयार है।',
  'Seed': 'बीज',
  'Transits journal': 'गोचर-जर्नल',
  'Short notes tied to dates, observations, and recurring symbols.': 'तिथियों, अवलोकनों और बार-बार उभरते प्रतीकों से जुड़े छोटे नोट्स।',
  'Chart studies': 'कुंडली अध्ययन',
  'Structured readings with sources, caveats, and repeatable method.': 'स्रोतों, सावधानियों और दोहराई जा सकने वाली विधि के साथ संरचित पाठन।',
  'Glossary': 'शब्दावली',
  'Reusable definitions for signs, houses, aspects, and yogas.': 'राशियों, भावों, दृष्टियों और योगों के लिए पुन: प्रयोज्य परिभाषाएँ।',
  'Recipes, process notes, taste experiments, food memory, and kitchen systems. This section can become both a practical cookbook and a sensory notebook.': 'व्यंजन-विधियाँ, प्रक्रिया-नोट्स, स्वाद-प्रयोग, भोजन-स्मृति और रसोई प्रणालियाँ। यह खंड उपयोगी कुकबुक और इंद्रिय-अनुभव नोटबुक दोनों बन सकता है।',
  'Template': 'टेम्पलेट',
  'Recipe cards': 'रेसिपी कार्ड',
  'Pizza': 'पिज़्ज़ा',
  'A homemade pizza study — dough, heat, sauce, and the pleasure of making it by hand.': 'घर पर बने पिज़्ज़ा का अध्ययन — आटा, ताप, सॉस और अपने हाथों से बनाने का आनंद।',
  'Ingredients, timing, method, variations, and failure notes.': 'सामग्री, समय, विधि, विविधताएँ और असफलता-नोट्स।',
  'Technique notes': 'तकनीक नोट्स',
  'Grinding, tempering, fermentation, heat control, and texture.': 'पीसना, तड़का, किण्वन, ताप-नियंत्रण और बनावट।',
  'Taste logs': 'स्वाद लॉग',
  'Small experiments with spice balance, acidity, fat, and aroma.': 'मसालों के संतुलन, अम्लता, वसा और सुगंध पर छोटे प्रयोग।',
  'Personal essays, reading notes, observations, and unfinished thoughts. This realm is for slower writing that does not need to fit into a technical or ritual category.': 'व्यक्तिगत निबंध, पठन-नोट्स, अवलोकन और अधूरे विचार। यह खंड ऐसे धीमे लेखन के लिए है जिसे तकनीकी या अनुष्ठानिक श्रेणी में फिट होने की आवश्यकता नहीं।',
  'Format': 'रूप',
  'Long essays': 'लंबे निबंध',
  'Polished arguments with references and durable URLs.': 'संदर्भों और टिकाऊ URLs के साथ परिष्कृत तर्क।',
  'Reading notes': 'पठन-नोट्स',
  'Short summaries, quotes, links, and personal annotations.': 'छोटे सारांश, उद्धरण, लिंक और निजी टिप्पणियाँ।',
  'Open note: Fear': 'खुला नोट: भय',
  'Fragments': 'अंश',
  'Half-formed ideas worth keeping visible for later synthesis.': 'बाद के संश्लेषण के लिए दिखाई देते रहने योग्य अधबने विचार।',
  'A place for short notes, glossary entries, useful links, and reusable knowledge blocks. This can become the connective tissue between technical, spiritual, astrological, and cooking posts.': 'छोटे नोट्स, शब्दावली प्रविष्टियों, उपयोगी लिंक और पुन: प्रयोज्य ज्ञान-खंडों का स्थान। यह तकनीकी, आध्यात्मिक, ज्योतिषीय और पाक-कला पोस्टों के बीच जोड़ने वाला तंतु बन सकता है।',
  'Definitions that can be linked from future essays.': 'भविष्य के निबंधों से जोड़ी जा सकने वाली परिभाषाएँ।',
  'Links': 'लिंक',
  'Tools, papers, recipes, ephemeris resources, and readings.': 'उपकरण, शोध-पत्र, रेसिपी, पंचांग/एपhemeris संसाधन और पठन।',
  'Patterns': 'पैटर्न',
  'Cross-domain motifs that show up repeatedly in your writing.': 'वे रूपक/मोटिफ़ जो आपके लेखन में विभिन्न क्षेत्रों में बार-बार उभरते हैं।',
  'Reading Notes': 'पठन-नोट्स',
  'Fear': 'भय',
  '1. Fear arises from duality / separation': '1. भय द्वैत / अलगाव से उत्पन्न होता है',
  'Transliteration': 'लिप्यंतरण',
  'Meaning': 'अर्थ',
  'He was afraid; therefore one who is alone is afraid. Then he reflected: ‘Since there is nothing other than me, what should I fear?’ Then his fear vanished. For what was there to fear? Fear indeed arises from a second.': 'वह भयभीत हुआ; इसलिए अकेला व्यक्ति भयभीत होता है। फिर उसने विचार किया: “जब मेरे अतिरिक्त कुछ भी नहीं है, तो मुझे किससे भय हो?” तब उसका भय दूर हो गया। भय किससे होता? भय सचमुच दूसरे से उत्पन्न होता है।',
  '2. Fearlessness through self-restraint': '2. आत्मसंयम से निर्भयता',
  'Śukla Yajurveda tradition': 'शुक्ल यजुर्वेद परंपरा',
  'Śānti Parva, Mokṣadharma Parva': 'शान्ति पर्व, मोक्षधर्म पर्व',
  'Verse 4': 'श्लोक 4',
  'Self-restraint increases one’s energy; self-restraint is said to be purifying. The self-restrained person, free from sin and fearless, attains greatness.': 'आत्मसंयम तेज को बढ़ाता है; आत्मसंयम को पवित्र करने वाला कहा गया है। संयमी पुरुष पाप से मुक्त और निर्भय होकर महानता प्राप्त करता है।',
  'DHARMA KSHETRA': 'धर्म-क्षेत्र',
  'The Field of Duty': 'कर्तव्य का क्षेत्र',
  'Scroll to Witness': 'साक्षी बनने के लिए स्क्रॉल करें',
  'I. The Despair': 'I. विषाद',
  'My bow Gandiva slips from my hand, and my skin burns. I cannot fight my own blood.': 'मेरा गांडीव हाथ से फिसल रहा है, त्वचा जल रही है। मैं अपने ही रक्त से युद्ध नहीं कर सकता।',
  'II. The Truth': 'II. सत्य',
  'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.': 'तुम्हारा अधिकार केवल निर्धारित कर्म करने में है; उसके फलों पर नहीं।',
  'III. The Release': 'III. मुक्ति',
  'Stand up and fight. Conquer your enemies and enjoy a prosperous kingdom.': 'उठो और युद्ध करो। शत्रुओं को जीतकर समृद्ध राज्य का आनंद लो।',
  'Selected Work 2024': 'चयनित कार्य 2024',
  'Living': 'जीवंत',
  'Identities': 'पहचानें',
  'Proof of Concept': 'संकल्पना-प्रमाण',
  'REPLICATING "PLENTY" MANIFESTO': '“PLENTY” मैनिफेस्टो की पुनर्रचना',
  'THREE.JS • REACT THREE FIBER • GLSL NOISE': 'THREE.JS • REACT THREE FIBER • GLSL NOISE',
};

type Lang = keyof typeof translations;

const normalized = (value: string) => value.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
const exactHiByNormalized = Object.fromEntries(Object.entries(exactTextTranslations).map(([en, hi]) => [normalized(en), hi]));
const reverseExactTextTranslations = Object.fromEntries(Object.entries(exactTextTranslations).map(([en, hi]) => [normalized(hi), en]));

function translateExactText(lang: Lang) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    const parent = node.parentElement;
    if (
      parent &&
      !parent.closest('[data-no-translate]') &&
      !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(parent.tagName)
    ) textNodes.push(node as Text);
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const raw = textNode.textContent ?? '';
    const key = normalized(raw);
    if (!key) continue;
    if (lang === 'hi') {
      const translated = exactHiByNormalized[key];
      if (translated) textNode.textContent = translated;
    } else {
      const restored = reverseExactTextTranslations[key];
      if (restored) textNode.textContent = restored;
    }
  }

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[placeholder]').forEach((el) => {
    const key = normalized(el.placeholder);
    if (lang === 'hi' && exactHiByNormalized[key]) el.placeholder = exactHiByNormalized[key];
    if (lang === 'en' && reverseExactTextTranslations[key]) el.placeholder = reverseExactTextTranslations[key];
  });
}

export function applyLanguage(lang: Lang) {
  const dict = translations[lang];
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  document.documentElement.dataset.lang = lang;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n as keyof typeof dict | undefined;
    if (key && dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder as keyof typeof dict | undefined;
    if (key && dict[key]) el.placeholder = dict[key];
  });

  translateExactText(lang);
  window.dispatchEvent(new CustomEvent('realms-language-change', { detail: { lang, dict } }));
}

export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('realms-lang') as Lang | null) || 'en';
    const initial = saved === 'hi' ? 'hi' : 'en';
    setLang(initial);
    applyLanguage(initial);
  }, []);

  const setLanguage = (next: Lang) => {
    setLang(next);
    localStorage.setItem('realms-lang', next);
    applyLanguage(next);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-mist/35 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-mist backdrop-blur-md" aria-label="Language selector">
      <button type="button" onClick={() => setLanguage('en')} className={`px-1.5 py-1 transition hover:text-white ${lang === 'en' ? 'text-white' : 'text-mist/60'}`} aria-pressed={lang === 'en'}>
        A
      </button>
      <span className="text-mist/35">/</span>
      <button type="button" onClick={() => setLanguage('hi')} className={`px-1.5 py-1 transition hover:text-white ${lang === 'hi' ? 'text-white' : 'text-mist/60'}`} aria-pressed={lang === 'hi'}>
        अ
      </button>
    </div>
  );
}
