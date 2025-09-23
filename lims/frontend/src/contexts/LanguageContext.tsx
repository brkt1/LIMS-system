import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "en" | "om" | "am";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation keys
const translations = {
  en: {
    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.clear": "Clear",
    "common.all": "All",
    "common.none": "None",
    "common.select": "Select",
    "common.required": "Required",
    "common.optional": "Optional",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.notifications": "Notifications",
    "nav.help": "Help & Support",

    // Profile
    "profile.title": "Profile Settings",
    "profile.subtitle": "Manage your account information and preferences",
    "profile.personalInfo": "Personal Information",
    "profile.preferences": "Preferences",
    "profile.notifications": "Notification Preferences",
    "profile.firstName": "First Name",
    "profile.lastName": "Last Name",
    "profile.email": "Email Address",
    "profile.username": "Username",
    "profile.phone": "Phone Number",
    "profile.address": "Address",
    "profile.bio": "Bio",
    "profile.timezone": "Timezone",
    "profile.language": "Language",
    "profile.emailNotifications": "Email Notifications",
    "profile.smsNotifications": "SMS Notifications",
    "profile.pushNotifications": "Push Notifications",
    "profile.editProfile": "Edit Profile",
    "profile.saveChanges": "Save Changes",
    "profile.saving": "Saving...",

    // Notifications
    "notifications.title": "Notifications",
    "notifications.markAllRead": "Mark all as read",
    "notifications.noNotifications": "No notifications yet",
    "notifications.viewAll": "View all notifications",
    "notifications.justNow": "Just now",
    "notifications.minutesAgo": "{count}m ago",
    "notifications.hoursAgo": "{count}h ago",
    "notifications.daysAgo": "{count}d ago",

    // Languages
    "language.english": "English",
    "language.oromo": "Oromo",
    "language.amharic": "Amharic",
  },
  om: {
    // Common
    "common.loading": "Hojjechaa jira...",
    "common.save": "Hifadhu",
    "common.cancel": "Dhaabuu",
    "common.edit": "Fooyyessuu",
    "common.delete": "Haquu",
    "common.confirm": "Mirkaneessuu",
    "common.yes": "Eeyyee",
    "common.no": "Lakki",
    "common.close": "Cufuu",
    "common.back": "Duubatti deebi'uu",
    "common.next": "Ita aanu",
    "common.previous": "Duraan",
    "common.search": "Barbaachuu",
    "common.filter": "Seenuu",
    "common.clear": "Qulqulleessuu",
    "common.all": "Hunda",
    "common.none": "Hin jiru",
    "common.select": "Filachuu",
    "common.required": "Barbaachisa",
    "common.optional": "Filachuu danda'a",

    // Navigation
    "nav.dashboard": "Daashiboorduu",
    "nav.profile": "Profaayilii",
    "nav.settings": "Seenuu",
    "nav.logout": "Ba'uu",
    "nav.notifications": "Beeksisa",
    "nav.help": "Gargaarsa & Deeggarsa",

    // Profile
    "profile.title": "Seenuu Profaayilii",
    "profile.subtitle": "Odeeffannoo akkaawuntii kee fi fedhii kee bulchi",
    "profile.personalInfo": "Odeeffannoo Dhuunfaa",
    "profile.preferences": "Fedhiiwwan",
    "profile.notifications": "Fedhii Beeksisa",
    "profile.firstName": "Maqaa Dhuunfaa",
    "profile.lastName": "Maqaa Abbaa",
    "profile.email": "Imeelii",
    "profile.username": "Maqaa Fayyadamaa",
    "profile.phone": "Lakkoofsi Bilbilaa",
    "profile.address": "Teessoo",
    "profile.bio": "Seenaa Dhuunfaa",
    "profile.timezone": "Yeroo Teessoo",
    "profile.language": "Afaan",
    "profile.emailNotifications": "Beeksisa Imeelii",
    "profile.smsNotifications": "Beeksisa SMS",
    "profile.pushNotifications": "Beeksisa Push",
    "profile.editProfile": "Profaayilii Fooyyessuu",
    "profile.saveChanges": "Jijjiiramaa Hifadhu",
    "profile.saving": "Hifachaa jira...",

    // Notifications
    "notifications.title": "Beeksisa",
    "notifications.markAllRead": "Hunda dubbisaa ta'e jechuu",
    "notifications.noNotifications": "Beeksisa hin jiru",
    "notifications.viewAll": "Beeksisa hunda ilaaluu",
    "notifications.justNow": "Amma",
    "notifications.minutesAgo": "{count} daqiiqaa dura",
    "notifications.hoursAgo": "{count} sa'aa dura",
    "notifications.daysAgo": "{count} guyyaa dura",

    // Languages
    "language.english": "Ingiliizii",
    "language.oromo": "Oromoo",
    "language.amharic": "Amaaraa",
  },
  am: {
    // Common
    "common.loading": "በመጫን ላይ...",
    "common.save": "አስቀምጥ",
    "common.cancel": "ሰርዝ",
    "common.edit": "አርትዖት",
    "common.delete": "ሰርዝ",
    "common.confirm": "አረጋግጥ",
    "common.yes": "አዎ",
    "common.no": "አይ",
    "common.close": "ዝጋ",
    "common.back": "ተመለስ",
    "common.next": "ቀጣይ",
    "common.previous": "ቀዳሚ",
    "common.search": "ፍለጋ",
    "common.filter": "አጣራ",
    "common.clear": "አጽዳ",
    "common.all": "ሁሉም",
    "common.none": "ምንም",
    "common.select": "ምረጥ",
    "common.required": "የሚያስፈልግ",
    "common.optional": "አማራጭ",

    // Navigation
    "nav.dashboard": "ዳሽቦርድ",
    "nav.profile": "መገለጫ",
    "nav.settings": "ቅንብሮች",
    "nav.logout": "ውጣ",
    "nav.notifications": "ማሳወቂያዎች",
    "nav.help": "እርዳታ እና ድጋፍ",

    // Profile
    "profile.title": "የመገለጫ ቅንብሮች",
    "profile.subtitle": "የመለያ መረጃዎን እና ምርጫዎችዎን ያቀናብሩ",
    "profile.personalInfo": "የግል መረጃ",
    "profile.preferences": "ምርጫዎች",
    "profile.notifications": "የማሳወቂያ ምርጫዎች",
    "profile.firstName": "የመጀመሪያ ስም",
    "profile.lastName": "የአባት ስም",
    "profile.email": "ኢሜይል",
    "profile.username": "የተጠቃሚ ስም",
    "profile.phone": "የስልክ ቁጥር",
    "profile.address": "አድራሻ",
    "profile.bio": "መግለጫ",
    "profile.timezone": "የጊዜ ቦታ",
    "profile.language": "ቋንቋ",
    "profile.emailNotifications": "ኢሜይል ማሳወቂያዎች",
    "profile.smsNotifications": "SMS ማሳወቂያዎች",
    "profile.pushNotifications": "Push ማሳወቂያዎች",
    "profile.editProfile": "መገለጫ አርትዖት",
    "profile.saveChanges": "ለውጦችን አስቀምጥ",
    "profile.saving": "በመቀመጥ ላይ...",

    // Notifications
    "notifications.title": "ማሳወቂያዎች",
    "notifications.markAllRead": "ሁሉንም እንደተነበበ ምልክት አድርግ",
    "notifications.noNotifications": "እስካሁን ማሳወቂያ የለም",
    "notifications.viewAll": "ሁሉንም ማሳወቂያዎች ይመልከቱ",
    "notifications.justNow": "አሁን",
    "notifications.minutesAgo": "{count} ደቂቃ በፊት",
    "notifications.hoursAgo": "{count} ሰዓት በፊት",
    "notifications.daysAgo": "{count} ቀን በፊት",

    // Languages
    "language.english": "እንግሊዝኛ",
    "language.oromo": "ኦሮሞኛ",
    "language.amharic": "አማርኛ",
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "om", "am"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    const translation =
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ];
    return translation || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
