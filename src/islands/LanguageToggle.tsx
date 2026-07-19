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
    'home.hero.name': 'Pranjal Prakash',
    'home.hero.subtitle': 'Vedic sciences, symbolic systems, projects, and field notes from a curious life.',
    'home.panel.location': 'Location',
    'home.panel.locationValue': 'Bengaluru, India',
    'home.panel.focus': 'Focus',
    'home.panel.focusValue': 'Vedic sciences + symbolic systems',
    'home.panel.archive': 'Archive',
    'home.panel.archiveValue': 'Kosh: notes, references, and fragments',
    'home.realms.eyebrow': 'Realms',
    'home.realms.title': 'A map of the site',
    'home.realms.subtitle': 'The homepage is a gateway into Kosh, technical work on ancient sciences, speculative notes, and projects that will grow over time.',
    'realm.technical.label': 'Technical Work',
    'realm.technical.title': 'Vedic Sciences',
    'realm.technical.desc': 'Structured notes and research experiments around Vedic sciences, symbolic systems, and computation.',
    'realm.kosh.label': 'Kosh',
    'realm.kosh.title': 'कोश',
    'realm.kosh.desc': 'Kosh means a treasury or library — a living archive of notes, references, essays, and fragments.',
    'realm.mist.label': 'Mist',
    'realm.mist.title': 'Ananta Nīhāra',
    'realm.mist.desc': 'A speculative inner-world room for perception, mythic language, intelligence, and visual essays.',
    'realm.projects.label': 'Projects',
    'realm.projects.title': 'Ancient Sciences Builds',
    'realm.projects.desc': 'Projects and prototypes inspired by ancient sciences, knowledge systems, and practical tools.',
    'contact.eyebrow': 'Contact',
    'contact.title': 'Get in touch',
    'contact.subtitle': 'For conversations, collaborations, suggestions, or shared curiosities.',
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
    'home.hero.name': 'प्रांजल प्रकाश',
    'home.hero.subtitle': 'वैदिक विज्ञान, प्रतीकात्मक प्रणालियाँ, प्रोजेक्ट्स और एक जिज्ञासु जीवन के फील्ड नोट्स।',
    'home.panel.location': 'स्थान',
    'home.panel.locationValue': 'बेंगलुरु, भारत',
    'home.panel.focus': 'केंद्र',
    'home.panel.focusValue': 'वैदिक विज्ञान + प्रतीकात्मक प्रणालियाँ',
    'home.panel.archive': 'संग्रह',
    'home.panel.archiveValue': 'कोश: नोट्स, संदर्भ और अंश',
    'home.realms.eyebrow': 'रियलम्स',
    'home.realms.title': 'साइट का मानचित्र',
    'home.realms.subtitle': 'यह मुखपृष्ठ कोश, प्राचीन विज्ञानों पर तकनीकी कार्य, कल्पनाशील नोट्स और समय के साथ बढ़ते प्रोजेक्ट्स का प्रवेश-द्वार है।',
    'realm.technical.label': 'तकनीकी कार्य',
    'realm.technical.title': 'वैदिक विज्ञान',
    'realm.technical.desc': 'वैदिक विज्ञान, प्रतीकात्मक प्रणालियों और कम्प्यूटेशन पर संरचित नोट्स तथा शोध-प्रयोग।',
    'realm.kosh.label': 'कोश',
    'realm.kosh.title': 'कोश',
    'realm.kosh.desc': 'कोश का अर्थ है खज़ाना या पुस्तकालय — नोट्स, संदर्भों, निबंधों और अंशों का एक जीवंत संग्रह।',
    'realm.mist.label': 'नीहार',
    'realm.mist.title': 'अनंत नीहार',
    'realm.mist.desc': 'अनुभूति, मिथकीय भाषा, बुद्धिमत्ता और दृश्य निबंधों के लिए एक कल्पनाशील आंतरिक कक्ष।',
    'realm.projects.label': 'प्रोजेक्ट्स',
    'realm.projects.title': 'प्राचीन विज्ञानों से प्रेरित निर्माण',
    'realm.projects.desc': 'प्राचीन विज्ञानों, ज्ञान-प्रणालियों और उपयोगी उपकरणों से प्रेरित प्रोजेक्ट्स और प्रोटोटाइप।',
    'contact.eyebrow': 'संपर्क',
    'contact.title': 'संपर्क करें',
    'contact.subtitle': 'संवाद, सहयोग, सुझाव या साझा जिज्ञासाओं के लिए।',
    'contact.availability': 'उपलब्धता',
    'contact.availabilityText': 'विचारशील संवादों, सहयोगों और नए विचारों के लिए खुला हूँ।',
    'contact.location': 'बेंगलुरु में स्थित',
    'contact.email': 'आपका ईमेल',
    'contact.idea': 'प्रोजेक्ट का विचार',
    'contact.send': 'संदेश भेजें →',
  },
} as const;

type Lang = keyof typeof translations;

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
        EN
      </button>
      <span className="text-mist/35">/</span>
      <button type="button" onClick={() => setLanguage('hi')} className={`px-1.5 py-1 transition hover:text-white ${lang === 'hi' ? 'text-white' : 'text-mist/60'}`} aria-pressed={lang === 'hi'}>
        हिंदी
      </button>
    </div>
  );
}
