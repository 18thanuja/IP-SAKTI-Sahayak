import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./index.css";
import "./app.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

// ============================================================
// Languages
// ============================================================

const languages = {
  English: { voice: "en-IN", label: "English" },
  Telugu: { voice: "te-IN", label: "తెలుగు" },
  Hindi: { voice: "hi-IN", label: "हिन्दी" },
  Tamil: { voice: "ta-IN", label: "தமிழ்" },
  Kannada: { voice: "kn-IN", label: "ಕನ್ನಡ" },
  Malayalam: { voice: "ml-IN", label: "മലയാളം" },
  Bengali: { voice: "bn-IN", label: "বাংলা" },
  Marathi: { voice: "mr-IN", label: "मराठी" },
  Gujarati: { voice: "gu-IN", label: "ગુજરાતી" },
  Punjabi: { voice: "pa-IN", label: "ਪੰਜਾਬੀ" },
  Urdu: { voice: "ur-IN", label: "اردو" },
  Odia: { voice: "or-IN", label: "ଓଡ଼ିଆ" },
  Assamese: { voice: "as-IN", label: "অসমীয়া" },
  French: { voice: "fr-FR", label: "Français" },
  Spanish: { voice: "es-ES", label: "Español" },
  German: { voice: "de-DE", label: "Deutsch" },
  Arabic: { voice: "ar-SA", label: "العربية" },
  Chinese: { voice: "zh-CN", label: "中文" },
  Japanese: { voice: "ja-JP", label: "日本語" },
};


// ============================================================
// English translations
// ============================================================

const english = {
  subtitle: "Intellectual Property & Ayurveda Guidance",

  language: "Language",

  newChat: "+ New Chat",

  heading: "Your IP Guidance Assistant",

  description:
    "Explore Ayurveda-related intellectual property, regulations, and national and international guidance.",

  welcome:
    "**Welcome to IP-SAKTI Sahayak!** 🌿\n\nAsk me about intellectual property, Ayurvedic products, traditional knowledge, patents, trademarks, and national or international regulations.",

  placeholder:
    "Ask your question about IP and Ayurveda...",

  send: "Send ↑",

  sending: "Sending...",

  preparing: "Preparing your answer...",

  listen: "🔊 Listen",

  stop: "⏹ Stop",

  footer:
    "AI-generated guidance should be verified against official laws, regulations, and cited sources.",

  connectionError:
    "Unable to complete your request.",

  emptyAnswer:
    "The API returned no answer. Please try again.",

  micError:
    "Voice input is not supported in this browser. Try Chrome or Edge.",

  micDenied:
    "Microphone access was denied. Allow it in your browser settings.",

  speechError:
    "Text-to-speech is not supported by this browser.",

  topics: "Explore topics",

  topic1: "🧪 Patents & formulations",

  topic2: "📚 Traditional knowledge",

  topic3: "🌍 International protection",

  suggestions: "Suggested questions",

  question1:
    "Can an Ayurvedic formulation be patented in India?",

  question2:
    "How is traditional Ayurvedic knowledge protected?",

  question3:
    "What IP rights apply to Ayurvedic products?",

  tagline:
    "Ask. Learn. Protect.",

  sidebarDescription:
    "Your guide to Ayurveda-related intellectual property.",

  voiceInput:
    "🎤 Speak",

  listening:
    "🎙️ Listening...",

  conversation:
    "Conversation",

  dismissError:
    "Dismiss error",

  user:
    "You",

  sources:
    "Sources",

  source:
    "Source",

  page:
    "Page",

  openSource:
    "Open PDF",

  noSource:
    "Source document is unavailable.",

  retrieved:
    "Retrieved evidence",

  online:
    "Online",

  delete:
    "Delete",

  emptyHistory:
    "Your previous conversations will appear here.",
};


// ============================================================
// Additional translations
// ============================================================

const additionalTranslations = {
  Bengali: {
    subtitle: "মেধাস্বত্ব ও আয়ুর্বেদ নির্দেশিকা",
    language: "ভাষা",
    newChat: "+ নতুন চ্যাট",
    heading: "আপনার IP নির্দেশিকা সহায়ক",
    description:
      "আয়ুর্বেদ-সম্পর্কিত মেধাস্বত্ব ও জাতীয় এবং আন্তর্জাতিক নিয়ম জানুন।",
    placeholder:
      "IP ও আয়ুর্বেদ সম্পর্কে প্রশ্ন লিখুন...",
    send: "পাঠান ↑",
    sending: "পাঠানো হচ্ছে...",
    preparing: "উত্তর তৈরি হচ্ছে...",
    listen: "🔊 শুনুন",
    stop: "⏹ থামান",
    suggestions: "প্রস্তাবিত প্রশ্ন",
    question1:
      "ভারতে কি আয়ুর্বেদিক ফর্মুলার পেটেন্ট করা যায়?",
    question2:
      "ঐতিহ্যবাহী আয়ুর্বেদিক জ্ঞান কীভাবে সুরক্ষিত হয়?",
    question3:
      "আয়ুর্বেদিক পণ্যে কোন IP অধিকার প্রযোজ্য?",
    tagline:
      "জিজ্ঞাসা করুন। শিখুন। সুরক্ষিত রাখুন।",
    voiceInput: "🎤 বলুন",
    listening: "🎙️ শুনছি...",
  },

  Marathi: {
    language: "भाषा",
    newChat: "+ नवीन चॅट",
    heading: "तुमचा IP मार्गदर्शक सहाय्यक",
    placeholder:
      "IP आणि आयुर्वेदाबद्दल प्रश्न विचारा...",
    send: "पाठवा ↑",
    sending: "पाठवत आहे...",
    preparing: "उत्तर तयार होत आहे...",
    listen: "🔊 ऐका",
    stop: "⏹ थांबवा",
    suggestions: "सुचवलेले प्रश्न",
    question1:
      "भारतात आयुर्वेदिक फॉर्म्युलाला पेटंट मिळू शकते का?",
    question2:
      "पारंपरिक आयुर्वेदिक ज्ञानाचे संरक्षण कसे केले जाते?",
    question3:
      "आयुर्वेदिक उत्पादनांना कोणते IP अधिकार लागू होतात?",
    tagline:
      "विचारा. शिका. संरक्षण करा.",
    voiceInput: "🎤 बोला",
    listening: "🎙️ ऐकत आहे...",
  },

  Gujarati: {
    language: "ભાષા",
    newChat: "+ નવી ચેટ",
    heading: "તમારો IP માર્ગદર્શક સહાયક",
    placeholder:
      "IP અને આયુર્વેદ વિશે પ્રશ્ન પૂછો...",
    send: "મોકલો ↑",
    sending: "મોકલાઈ રહ્યું છે...",
    preparing: "જવાબ તૈયાર થઈ રહ્યો છે...",
    listen: "🔊 સાંભળો",
    stop: "⏹ રોકો",
    suggestions: "સૂચિત પ્રશ્નો",
    question1:
      "શું ભારતમાં આયુર્વેદિક ફોર્મ્યુલાને પેટન્ટ મળી શકે?",
    question2:
      "પરંપરાગત આયુર્વેદિક જ્ઞાનનું રક્ષણ કેવી રીતે થાય છે?",
    question3:
      "આયુર્વેદિક ઉત્પાદનો પર કયા IP અધિકારો લાગુ પડે છે?",
    tagline:
      "પૂછો. શીખો. સુરક્ષિત રાખો.",
    voiceInput: "🎤 બોલો",
    listening: "🎙️ સાંભળી રહ્યું છે...",
  },

  Punjabi: {
    language: "ਭਾਸ਼ਾ",
    newChat: "+ ਨਵੀਂ ਚੈਟ",
    heading: "ਤੁਹਾਡਾ IP ਮਾਰਗਦਰਸ਼ਕ ਸਹਾਇਕ",
    placeholder:
      "IP ਅਤੇ ਆਯੁਰਵੇਦ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੋ...",
    send: "ਭੇਜੋ ↑",
    sending: "ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    preparing: "ਜਵਾਬ ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ...",
    listen: "🔊 ਸੁਣੋ",
    stop: "⏹ ਰੋਕੋ",
    suggestions: "ਸੁਝਾਏ ਗਏ ਸਵਾਲ",
    question1:
      "ਕੀ ਭਾਰਤ ਵਿੱਚ ਆਯੁਰਵੇਦਿਕ ਫਾਰਮੂਲੇ ਦਾ ਪੇਟੈਂਟ ਹੋ ਸਕਦਾ ਹੈ?",
    question2:
      "ਰਵਾਇਤੀ ਆਯੁਰਵੇਦਿਕ ਗਿਆਨ ਦੀ ਰੱਖਿਆ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ?",
    question3:
      "ਆਯੁਰਵੇਦਿਕ ਉਤਪਾਦਾਂ ਉੱਤੇ ਕਿਹੜੇ IP ਅਧਿਕਾਰ ਲਾਗੂ ਹੁੰਦੇ ਹਨ?",
    tagline:
      "ਪੁੱਛੋ। ਸਿੱਖੋ। ਸੁਰੱਖਿਅਤ ਰੱਖੋ।",
    voiceInput: "🎤 ਬੋਲੋ",
    listening: "🎙️ ਸੁਣ ਰਿਹਾ ਹੈ...",
  },

  Urdu: {
    language: "زبان",
    newChat: "+ نئی چیٹ",
    heading: "آپ کا IP رہنمائی معاون",
    placeholder:
      "IP اور آیوروید کے بارے میں سوال پوچھیں...",
    send: "بھیجیں ↑",
    sending: "بھیجا جا رہا ہے...",
    preparing: "جواب تیار ہو رہا ہے...",
    listen: "🔊 سنیں",
    stop: "⏹ روکیں",
    suggestions: "تجویز کردہ سوالات",
    question1:
      "کیا بھارت میں آیورویدک فارمولے کا پیٹنٹ ہو سکتا ہے؟",
    question2:
      "روایتی آیورویدک علم کا تحفظ کیسے ہوتا ہے؟",
    question3:
      "آیورویدک مصنوعات پر کون سے IP حقوق لاگو ہوتے ہیں؟",
    tagline:
      "پوچھیں۔ سیکھیں۔ محفوظ رکھیں۔",
    voiceInput: "🎤 بولیں",
    listening: "🎙️ سن رہا ہے...",
  },

  Odia: {
    language: "ଭାଷା",
    newChat: "+ ନୂଆ ଚାଟ୍",
    heading: "ଆପଣଙ୍କ IP ମାର୍ଗଦର୍ଶକ ସହାୟକ",
    placeholder:
      "IP ଏବଂ ଆୟୁର୍ବେଦ ବିଷୟରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...",
    send: "ପଠାନ୍ତୁ ↑",
    sending: "ପଠାଯାଉଛି...",
    preparing: "ଉତ୍ତର ପ୍ରସ୍ତୁତ ହେଉଛି...",
    listen: "🔊 ଶୁଣନ୍ତୁ",
    stop: "⏹ ବନ୍ଦ କରନ୍ତୁ",
    suggestions: "ପ୍ରସ୍ତାବିତ ପ୍ରଶ୍ନ",
    question1:
      "ଭାରତରେ ଆୟୁର୍ବେଦିକ ଫର୍ମୁଲାର ପେଟେଣ୍ଟ ହୋଇପାରିବ କି?",
    question2:
      "ପାରମ୍ପରିକ ଆୟୁର୍ବେଦିକ ଜ୍ଞାନ କିପରି ସୁରକ୍ଷିତ ହୁଏ?",
    question3:
      "ଆୟୁର୍ବେଦିକ ଉତ୍ପାଦ ପାଇଁ କେଉଁ IP ଅଧିକାର ଲାଗୁ ହୁଏ?",
    tagline:
      "ପଚାରନ୍ତୁ। ଶିଖନ୍ତୁ। ସୁରକ୍ଷା କରନ୍ତୁ।",
    voiceInput: "🎤 କୁହନ୍ତୁ",
    listening: "🎙️ ଶୁଣୁଛି...",
  },

  Assamese: {
    language: "ভাষা",
    newChat: "+ নতুন চেট",
    heading: "আপোনাৰ IP নিৰ্দেশনা সহায়ক",
    placeholder:
      "IP আৰু আয়ুৰ্বেদৰ বিষয়ে প্ৰশ্ন সোধক...",
    send: "পঠিয়াওক ↑",
    sending: "পঠিওৱা হৈছে...",
    preparing: "উত্তৰ প্ৰস্তুত হৈছে...",
    suggestions: "পৰামৰ্শ দিয়া প্ৰশ্ন",
    question1:
      "ভাৰতত আয়ুৰ্বেদিক ফৰ্মুলাৰ পেটেণ্ট হ’ব পাৰেনে?",
    question2:
      "পৰম্পৰাগত আয়ুৰ্বেদিক জ্ঞান কেনেকৈ সুৰক্ষিত কৰা হয়?",
    question3:
      "আয়ুৰ্বেদিক সামগ্ৰীৰ ক্ষেত্ৰত কোনবোৰ IP অধিকাৰ প্ৰযোজ্য?",
    tagline:
      "সোধক। শিকক। সুৰক্ষিত ৰাখক।",
    voiceInput: "🎤 কওক",
    listening: "🎙️ শুনি আছোঁ...",
  },

  French: {
    language: "Langue",
    newChat: "+ Nouvelle discussion",
    heading: "Votre assistant en propriété intellectuelle",
    placeholder:
      "Posez votre question sur la PI et l’Ayurveda...",
    send: "Envoyer ↑",
    sending: "Envoi...",
    preparing: "Préparation de la réponse...",
    listen: "🔊 Écouter",
    stop: "⏹ Arrêter",
    suggestions: "Questions suggérées",
    question1:
      "Une formule ayurvédique peut-elle être brevetée en Inde ?",
    question2:
      "Comment protéger les connaissances ayurvédiques traditionnelles ?",
    question3:
      "Quels droits de PI s’appliquent aux produits ayurvédiques ?",
    tagline:
      "Demandez. Apprenez. Protégez.",
    voiceInput: "🎤 Parler",
    listening: "🎙️ Écoute...",
  },

  Spanish: {
    language: "Idioma",
    newChat: "+ Nuevo chat",
    heading: "Tu asistente de propiedad intelectual",
    placeholder:
      "Pregunta sobre propiedad intelectual y Ayurveda...",
    send: "Enviar ↑",
    sending: "Enviando...",
    preparing: "Preparando la respuesta...",
    listen: "🔊 Escuchar",
    stop: "⏹ Detener",
    suggestions: "Preguntas sugeridas",
    question1:
      "¿Se puede patentar una fórmula ayurvédica en India?",
    question2:
      "¿Cómo se protege el conocimiento ayurvédico tradicional?",
    question3:
      "¿Qué derechos de PI se aplican a los productos ayurvédicos?",
    tagline:
      "Pregunta. Aprende. Protege.",
    voiceInput: "🎤 Hablar",
    listening: "🎙️ Escuchando...",
  },

  German: {
    language: "Sprache",
    newChat: "+ Neuer Chat",
    heading: "Ihr Assistent für geistiges Eigentum",
    placeholder:
      "Frage zu geistigem Eigentum und Ayurveda stellen...",
    send: "Senden ↑",
    sending: "Wird gesendet...",
    preparing: "Antwort wird vorbereitet...",
    listen: "🔊 Anhören",
    stop: "⏹ Stoppen",
    suggestions: "Vorgeschlagene Fragen",
    question1:
      "Kann eine ayurvedische Rezeptur in Indien patentiert werden?",
    question2:
      "Wie wird traditionelles ayurvedisches Wissen geschützt?",
    question3:
      "Welche IP-Rechte gelten für ayurvedische Produkte?",
    tagline:
      "Fragen. Lernen. Schützen.",
    voiceInput: "🎤 Sprechen",
    listening: "🎙️ Höre zu...",
  },

  Arabic: {
    language: "اللغة",
    newChat: "+ محادثة جديدة",
    heading: "مساعدك لإرشادات الملكية الفكرية",
    placeholder:
      "اسأل عن الملكية الفكرية والأيورفيدا...",
    send: "إرسال ↑",
    sending: "جارٍ الإرسال...",
    preparing: "جارٍ إعداد الإجابة...",
    listen: "🔊 استمع",
    stop: "⏹ إيقاف",
    suggestions: "أسئلة مقترحة",
    question1:
      "هل يمكن تسجيل براءة اختراع لتركيبة أيورفيدية في الهند؟",
    question2:
      "كيف تتم حماية المعرفة الأيورفيدية التقليدية؟",
    question3:
      "ما حقوق الملكية الفكرية المطبقة على منتجات الأيورفيدا؟",
    tagline:
      "اسأل. تعلّم. احمِ.",
    voiceInput: "🎤 تحدث",
    listening: "🎙️ أستمع...",
  },

  Chinese: {
    language: "语言",
    newChat: "+ 新对话",
    heading: "您的知识产权指导助手",
    placeholder:
      "请提出有关知识产权和阿育吠陀的问题...",
    send: "发送 ↑",
    sending: "正在发送...",
    preparing: "正在准备答案...",
    listen: "🔊 收听",
    stop: "⏹ 停止",
    suggestions: "推荐问题",
    question1:
      "阿育吠陀配方可以在印度申请专利吗？",
    question2:
      "传统阿育吠陀知识如何受到保护？",
    question3:
      "哪些知识产权适用于阿育吠陀产品？",
    tagline:
      "提问。学习。保护。",
    voiceInput: "🎤 说话",
    listening: "🎙️ 正在聆听...",
  },

  Japanese: {
    language: "言語",
    newChat: "+ 新しいチャット",
    heading: "知的財産ガイダンスアシスタント",
    placeholder:
      "知的財産とアーユルヴェーダについて質問してください...",
    send: "送信 ↑",
    sending: "送信中...",
    preparing: "回答を準備しています...",
    listen: "🔊 聞く",
    stop: "⏹ 停止",
    suggestions: "おすすめの質問",
    question1:
      "インドでアーユルヴェーダの処方に特許を取得できますか？",
    question2:
      "伝統的なアーユルヴェーダの知識はどのように保護されますか？",
    question3:
      "アーユルヴェーダ製品にはどの知的財産権が適用されますか？",
    tagline:
      "質問する。学ぶ。守る。",
    voiceInput: "🎤 話す",
    listening: "🎙️ 聞いています...",
  },
};


// ============================================================
// Hindi
// ============================================================

const hindi = {
  ...english,

  subtitle:
    "बौद्धिक संपदा और आयुर्वेद मार्गदर्शन",

  language:
    "भाषा",

  newChat:
    "+ नई चैट",

  heading:
    "आपका IP मार्गदर्शन सहायक",

  description:
    "आयुर्वेद से संबंधित बौद्धिक संपदा और राष्ट्रीय तथा अंतरराष्ट्रीय नियमों को समझें।",

  welcome:
    "**IP-SAKTI Sahayak में आपका स्वागत है!** 🌿\n\nबौद्धिक संपदा, आयुर्वेदिक उत्पादों, पारंपरिक ज्ञान, पेटेंट, ट्रेडमार्क और राष्ट्रीय तथा अंतरराष्ट्रीय नियमों के बारे में पूछें।",

  placeholder:
    "अपना प्रश्न यहाँ लिखें...",

  send:
    "भेजें ↑",

  sending:
    "भेजा जा रहा है...",

  preparing:
    "उत्तर तैयार हो रहा है...",

  listen:
    "🔊 सुनें",

  stop:
    "⏹ रोकें",

  footer:
    "AI मार्गदर्शन को आधिकारिक कानूनों और स्रोतों से सत्यापित करें।",

  connectionError:
    "आपका अनुरोध पूरा नहीं हो सका।",

  emptyAnswer:
    "कोई उत्तर नहीं मिला। फिर से प्रयास करें।",

  micError:
    "इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। Chrome या Edge आज़माएँ।",

  micDenied:
    "माइक्रोफ़ोन की अनुमति नहीं मिली।",

  speechError:
    "इस ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है।",

  topics:
    "विषय देखें",

  topic1:
    "🧪 पेटेंट और फ़ॉर्मूले",

  topic2:
    "📚 पारंपरिक ज्ञान",

  topic3:
    "🌍 अंतरराष्ट्रीय सुरक्षा",

  suggestions:
    "सुझाए गए प्रश्न",

  question1:
    "क्या भारत में आयुर्वेदिक फ़ॉर्मूले का पेटेंट हो सकता है?",

  question2:
    "पारंपरिक आयुर्वेदिक ज्ञान की सुरक्षा कैसे होती है?",

  question3:
    "आयुर्वेदिक उत्पादों पर कौन से IP अधिकार लागू होते हैं?",

  tagline:
    "पूछें। सीखें। सुरक्षित रखें।",

  sidebarDescription:
    "आयुर्वेद संबंधी बौद्धिक संपदा के लिए आपका मार्गदर्शक।",

  voiceInput:
    "🎤 बोलें",

  listening:
    "🎙️ सुन रहा है...",
};


// ============================================================
// Telugu, Tamil, Kannada, Malayalam
// ============================================================

const translations = {
  English: english,

  Hindi: hindi,

  ...Object.fromEntries(
    Object.entries(additionalTranslations).map(
      ([language, values]) => [
        language,
        {
          ...english,
          ...values,
        },
      ]
    )
  ),

  Telugu: {
    ...english,

    language: "భాష",

    newChat: "+ కొత్త చాట్",

    heading:
      "మీ IP మార్గదర్శక సహాయకుడు",

    description:
      "ఆయుర్వేద మేధో సంపత్తి, నిబంధనలు మరియు జాతీయ, అంతర్జాతీయ మార్గదర్శకాల గురించి తెలుసుకోండి.",

    welcome:
      "**IP-SAKTI Sahayak కు స్వాగతం!** 🌿\n\nమేధో సంపత్తి, ఆయుర్వేద ఉత్పత్తులు, సంప్రదాయ జ్ఞానం, పేటెంట్లు మరియు జాతీయ, అంతర్జాతీయ నిబంధనల గురించి అడగండి.",

    placeholder:
      "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...",

    hint:
      "పంపడానికి Enter · కొత్త లైన్ కోసం Shift + Enter",

    send:
      "పంపండి ↑",

    sending:
      "పంపుతోంది...",

    preparing:
      "సమాధానం సిద్ధమవుతోంది...",

    listen:
      "🔊 వినండి",

    stop:
      "⏹ ఆపండి",

    topics:
      "విషయాలను అన్వేషించండి",

    suggestions:
      "సూచించిన ప్రశ్నలు",

    question1:
      "భారతదేశంలో ఆయుర్వేద ఫార్ములాకు పేటెంట్ పొందవచ్చా?",

    question2:
      "సంప్రదాయ ఆయుర్వేద జ్ఞానాన్ని ఎలా రక్షిస్తారు?",

    question3:
      "ఆయుర్వేద ఉత్పత్తులకు ఏ IP హక్కులు వర్తిస్తాయి?",

    tagline:
      "అడగండి. నేర్చుకోండి. రక్షించుకోండి.",

    sidebarDescription:
      "ఆయుర్వేద మేధో సంపత్తికి మీ మార్గదర్శి.",

    voiceInput:
      "🎤 మాట్లాడండి",

    listening:
      "🎙️ వింటోంది...",
  },

  Tamil: {
    ...english,

    language:
      "மொழி",

    newChat:
      "+ புதிய உரையாடல்",

    heading:
      "உங்கள் IP வழிகாட்டி உதவியாளர்",

    placeholder:
      "உங்கள் கேள்வியை உள்ளிடுங்கள்...",

    send:
      "அனுப்பு ↑",

    sending:
      "அனுப்புகிறது...",

    preparing:
      "பதில் தயாராகிறது...",

    listen:
      "🔊 கேளுங்கள்",

    stop:
      "⏹ நிறுத்து",

    topics:
      "தலைப்புகளை ஆராயுங்கள்",

    suggestions:
      "பரிந்துரைக்கப்பட்ட கேள்விகள்",

    question1:
      "இந்தியாவில் ஆயுர்வேத கலவைக்கு காப்புரிமை பெற முடியுமா?",

    question2:
      "பாரம்பரிய ஆயுர்வேத அறிவு எவ்வாறு பாதுகாக்கப்படுகிறது?",

    question3:
      "ஆயுர்வேத தயாரிப்புகளுக்கு எந்த IP உரிமைகள் பொருந்தும்?",

    tagline:
      "கேளுங்கள். கற்றுக்கொள்ளுங்கள். பாதுகாக்குங்கள்.",

    voiceInput:
      "🎤 பேசுங்கள்",

    listening:
      "🎙️ கேட்கிறது...",
  },

  Kannada: {
    ...english,

    language:
      "ಭಾಷೆ",

    newChat:
      "+ ಹೊಸ ಚಾಟ್",

    heading:
      "ನಿಮ್ಮ IP ಮಾರ್ಗದರ್ಶನ ಸಹಾಯಕ",

    placeholder:
      "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ...",

    send:
      "ಕಳುಹಿಸಿ ↑",

    sending:
      "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",

    preparing:
      "ಉತ್ತರ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...",

    listen:
      "🔊 ಆಲಿಸಿ",

    stop:
      "⏹ ನಿಲ್ಲಿಸಿ",

    topics:
      "ವಿಷಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",

    suggestions:
      "ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು",

    question1:
      "ಭಾರತದಲ್ಲಿ ಆಯುರ್ವೇದ ಸೂತ್ರಕ್ಕೆ ಪೇಟೆಂಟ್ ಪಡೆಯಬಹುದೇ?",

    question2:
      "ಸಾಂಪ್ರದಾಯಿಕ ಆಯುರ್ವೇದ ಜ್ಞಾನವನ್ನು ಹೇಗೆ ರಕ್ಷಿಸಲಾಗುತ್ತದೆ?",

    question3:
      "ಆಯುರ್ವೇದ ಉತ್ಪನ್ನಗಳಿಗೆ ಯಾವ IP ಹಕ್ಕುಗಳು ಅನ್ವಯಿಸುತ್ತವೆ?",

    tagline:
      "ಕೇಳಿ. ಕಲಿಯಿರಿ. ರಕ್ಷಿಸಿ.",

    voiceInput:
      "🎤 ಮಾತನಾಡಿ",

    listening:
      "🎙️ ಕೇಳುತ್ತಿದೆ...",
  },

  Malayalam: {
    ...english,

    language:
      "ഭാഷ",

    newChat:
      "+ പുതിയ ചാറ്റ്",

    heading:
      "നിങ്ങളുടെ IP സഹായകൻ",

    placeholder:
      "നിങ്ങളുടെ ചോദ്യം ഇവിടെ നൽകുക...",

    send:
      "അയയ്ക്കുക ↑",

    sending:
      "അയയ്ക്കുന്നു...",

    preparing:
      "ഉത്തരം തയ്യാറാക്കുന്നു...",

    listen:
      "🔊 കേൾക്കുക",

    stop:
      "⏹ നിർത്തുക",

    topics:
      "വിഷയങ്ങൾ കണ്ടെത്തുക",

    suggestions:
      "നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ",

    question1:
      "ഇന്ത്യയിൽ ആയുർവേദ ഫോർമുലയ്ക്ക് പേറ്റന്റ് ലഭിക്കുമോ?",

    question2:
      "പരമ്പരാഗത ആയുർവേദ അറിവ് എങ്ങനെ സംരക്ഷിക്കുന്നു?",

    question3:
      "ആയുർവേദ ഉൽപ്പന്നങ്ങൾക്ക് ഏത് IP അവകാശങ്ങളാണ് ബാധകം?",

    tagline:
      "ചോദിക്കൂ. പഠിക്കൂ. സംരക്ഷിക്കൂ.",

    voiceInput:
      "🎤 സംസാരിക്കുക",

    listening:
      "🎙️ കേൾക്കുന്നു...",
  },
};


// ============================================================
// Utility functions
// ============================================================

function cleanTextForSpeech(text) {
  return String(text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[Source\s+\d+\]/gi, "")
    .replace(/[#*_>`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function makeId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}


// ============================================================
// Source card
// ============================================================

function SourceCard({ citation, index, t }) {
  const sourceName =
    citation?.source ||
    citation?.title ||
    "Unknown source";

  const page =
    citation?.page &&
    citation.page !== "Unknown"
      ? citation.page
      : null;

  const score =
    typeof citation?.score === "number"
      ? citation.score
      : null;

  const pdfUrl =
    citation?.pdf_url ||
    citation?.pdfUrl ||
    citation?.url ||
    null;

  return (
    <article className="source-card">
      <div className="source-card-top">

        <div className="source-number">
          {index + 1}
        </div>

        <div className="source-card-info">

          <div className="source-card-title">
            {sourceName}
          </div>

          <div className="source-card-meta">

            {page && (
              <span>
                {t.page} {page}
              </span>
            )}

            {score !== null && (
              <span>
                Relevance {Math.round(score * 100)}%
              </span>
            )}

          </div>

        </div>

      </div>

      {citation?.text && (
        <details className="source-evidence">
          <summary>
            {t.retrieved}
          </summary>

          <p>
            {citation.text}
          </p>
        </details>
      )}

      {pdfUrl ? (
        <a
          className="source-open-button"
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.openSource} ↗
        </a>
      ) : (
        <span className="source-unavailable">
          {t.noSource}
        </span>
      )}
    </article>
  );
}


// ============================================================
// Sources section
// ============================================================

function SourcesSection({ citations, t }) {
  if (!Array.isArray(citations) || citations.length === 0) {
    return null;
  }

  return (
    <section className="sources-section">

      <div className="sources-header">
        <div>
          <span className="sources-icon">📚</span>

          <span className="sources-title">
            {t.sources}
          </span>
        </div>

        <span className="sources-count">
          {citations.length}
        </span>
      </div>

      <div className="sources-list">
        {citations.map((citation, index) => (
          <SourceCard
            key={
              citation.chunk_id ||
              `${citation.source}-${citation.page}-${index}`
            }
            citation={citation}
            index={index}
            t={t}
          />
        ))}
      </div>

    </section>
  );
}


// ============================================================
// Message component
// ============================================================

function Message({
  message,
  onSpeak,
  speaking,
  onStopSpeaking,
  t,
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-row ${
        isUser
          ? "user-row"
          : "assistant-row"
      }`}
    >

      <div
        className={`message-avatar ${
          isUser
            ? "user-avatar"
            : "assistant-avatar"
        }`}
      >
        {isUser ? "U" : "🌿"}
      </div>

      <div
        className={`message-bubble ${
          isUser
            ? "user-message"
            : "assistant-message"
        }`}
      >

        <div className="message-content">

          {isUser ? (
            <div>
              {message.content}
            </div>
          ) : (
            <ReactMarkdown
              components={{
                a: ({
                  children,
                  ...props
                }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content || ""}
            </ReactMarkdown>
          )}

        </div>


        {!isUser && message.content && (
          <div className="message-actions">

            <button
              type="button"
              className="listen-button"
              onClick={() =>
                speaking
                  ? onStopSpeaking()
                  : onSpeak(
                      message.content,
                      message.id
                    )
              }
            >
              {speaking
                ? t.stop
                : t.listen}
            </button>

          </div>
        )}


        {!isUser &&
          Array.isArray(message.citations) &&
          message.citations.length > 0 && (

            <SourcesSection
              citations={message.citations}
              t={t}
            />

          )}

      </div>

    </div>
  );
}


// ============================================================
// Main application
// ============================================================

export default function App() {

  const [language, setLanguage] =
    useState("English");

  const [theme, setTheme] =
    useState("colorful");

  const [messages, setMessages] =
    useState([]);

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isListening, setIsListening] =
    useState(false);

  const [speakingMessageId, setSpeakingMessageId] =
    useState(null);

  const [chatHistory, setChatHistory] =
    useState([]);

  const [activeChatId, setActiveChatId] =
    useState(null);


  const recognitionRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const languageRef =
    useRef(language);

  const activeChatIdRef =
    useRef(null);


  const t =
    translations[language] ||
    english;


  // ==========================================================
  // Synchronize refs
  // ==========================================================

  useEffect(() => {
    languageRef.current =
      language;
  }, [language]);


  useEffect(() => {
    activeChatIdRef.current =
      activeChatId;
  }, [activeChatId]);


  // ==========================================================
  // Load chat history
  // ==========================================================

  useEffect(() => {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "ip-sakti-chat-history"
          ) || "[]"
        );

      if (Array.isArray(saved)) {
        setChatHistory(saved);
      }

    } catch {

      setChatHistory([]);

    }


    setMessages([
      {
        id: makeId(),
        role: "assistant",
        content:
          english.welcome,
        citations: [],
      },
    ]);

  }, []);


  // ==========================================================
  // Save chat history
  // ==========================================================

  useEffect(() => {

    try {

      localStorage.setItem(
        "ip-sakti-chat-history",
        JSON.stringify(chatHistory)
      );

    } catch {

      console.warn(
        "Could not save chat history."
      );

    }

  }, [chatHistory]);


  // ==========================================================
  // Scroll
  // ==========================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    messages,
    loading,
  ]);


  // ==========================================================
  // Cleanup
  // ==========================================================

  useEffect(() => {

    return () => {

      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      recognitionRef.current?.abort?.();

    };

  }, []);


  // ==========================================================
  // Speech
  // ==========================================================

  function stopSpeaking() {

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setSpeakingMessageId(null);
  }


  function speakAnswer(
    text,
    messageId,
    selectedLanguage =
      languageRef.current
  ) {

    if (
      !("speechSynthesis" in window)
    ) {

      setError(
        (
          translations[
            selectedLanguage
          ] || english
        ).speechError
      );

      return;
    }


    window.speechSynthesis.cancel();


    const readableText =
      cleanTextForSpeech(text);

    if (!readableText) {
      return;
    }


    const utterance =
      new SpeechSynthesisUtterance(
        readableText
      );

    utterance.lang =
      languages[
        selectedLanguage
      ]?.voice || "en-IN";

    utterance.rate = 0.9;
    utterance.pitch = 1;


    utterance.onstart = () =>
      setSpeakingMessageId(
        messageId
      );

    utterance.onend = () =>
      setSpeakingMessageId(null);

    utterance.onerror = () =>
      setSpeakingMessageId(null);


    window.speechSynthesis.speak(
      utterance
    );
  }


  // ==========================================================
  // Save conversation
  // ==========================================================

  function saveConversation(
    nextMessages,
    chatId =
      activeChatIdRef.current
  ) {

    if (!chatId) {
      return;
    }


    const firstQuestion =
      nextMessages.find(
        (message) =>
          message.role === "user"
      );


    const title =
      firstQuestion
        ? firstQuestion.content.slice(
            0,
            48
          ) +
          (
            firstQuestion.content.length >
            48
              ? "…"
              : ""
          )
        : "New conversation";


    const updatedChat = {
      id: chatId,

      title,

      messages:
        nextMessages,

      updatedAt:
        Date.now(),
    };


    setChatHistory(
      (previous) => {

        const exists =
          previous.some(
            (chat) =>
              chat.id === chatId
          );


        const updated =
          exists
            ? previous.map(
                (chat) =>
                  chat.id === chatId
                    ? updatedChat
                    : chat
              )
            : [
                updatedChat,
                ...previous,
              ];


        return updated.sort(
          (a, b) =>
            b.updatedAt -
            a.updatedAt
        );

      }
    );
  }


  // ==========================================================
  // Update messages
  // ==========================================================

  function updateMessages(
    updater
  ) {

    setMessages(
      (previous) => {

        const next =
          typeof updater === "function"
            ? updater(previous)
            : updater;

        saveConversation(next);

        return next;

      }
    );
  }


  // ==========================================================
  // New chat
  // ==========================================================

  function startNewChat() {

    if (loading) {
      return;
    }


    stopSpeaking();

    recognitionRef.current?.abort?.();

    setIsListening(false);

    setQuestion("");

    setError("");


    const id =
      makeId();


    setActiveChatId(id);

    activeChatIdRef.current =
      id;


    const welcomeMessages = [
      {
        id: makeId(),

        role: "assistant",

        content:
          (
            translations[
              languageRef.current
            ] || english
          ).welcome,

        citations: [],
      },
    ];


    setMessages(
      welcomeMessages
    );
  }


  // ==========================================================
  // Open previous chat
  // ==========================================================

  function openChat(chat) {

    if (loading) {
      return;
    }


    stopSpeaking();

    recognitionRef.current?.abort?.();

    setIsListening(false);

    setQuestion("");

    setError("");


    setActiveChatId(
      chat.id
    );

    activeChatIdRef.current =
      chat.id;


    setMessages(
      chat.messages || []
    );
  }


  // ==========================================================
  // Delete chat
  // ==========================================================

  function deleteChat(
    event,
    chatId
  ) {

    event.stopPropagation();


    setChatHistory(
      (previous) =>
        previous.filter(
          (chat) =>
            chat.id !== chatId
        )
    );


    if (
      activeChatIdRef.current ===
      chatId
    ) {

      startNewChat();

    }
  }


  // ==========================================================
  // Change language
  // ==========================================================

  function changeLanguage(
    nextLanguage
  ) {

    stopSpeaking();

    recognitionRef.current?.abort?.();

    setIsListening(false);

    setLanguage(
      nextLanguage
    );

    setError("");


    const previousWelcome =
      (
        translations[
          languageRef.current
        ] || english
      ).welcome;


    const nextWelcome =
      (
        translations[
          nextLanguage
        ] || english
      ).welcome;


    updateMessages(
      (previous) => {

        if (
          previous.length === 1 &&
          previous[0].role ===
            "assistant" &&
          previous[0].content ===
            previousWelcome
        ) {

          return [
            {
              ...previous[0],
              content:
                nextWelcome,
            },
          ];

        }

        return previous;

      }
    );
  }


  // ==========================================================
  // Voice input
  // ==========================================================

  function startVoiceInput() {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

      setError(
        t.micError
      );

      return;
    }


    setError("");


    try {

      recognitionRef.current?.abort?.();


      const recognition =
        new SpeechRecognition();


      recognitionRef.current =
        recognition;


      recognition.lang =
        languages[
          language
        ]?.voice || "en-IN";


      recognition.continuous =
        false;

      recognition.interimResults =
        false;

      recognition.maxAlternatives =
        1;


      recognition.onstart =
        () =>
          setIsListening(true);


      recognition.onresult =
        (event) => {

          const transcript =
            event.results?.[0]?.[0]
              ?.transcript || "";


          setQuestion(
            (previous) =>
              previous.trim()
                ? `${previous.trim()} ${transcript}`.trim()
                : transcript
          );

        };


      recognition.onerror =
        (event) => {

          if (
            event.error ===
            "not-allowed"
          ) {

            setError(
              t.micDenied
            );

          } else if (
            ![
              "no-speech",
              "aborted",
            ].includes(
              event.error
            )
          ) {

            setError(
              t.micError
            );

          }

        };


      recognition.onend =
        () =>
          setIsListening(false);


      recognition.start();

    } catch {

      setIsListening(false);

      setError(
        t.micError
      );

    }
  }


  // ==========================================================
  // Send message
  // ==========================================================

  async function sendMessage(
    event
  ) {

    event.preventDefault();


    const trimmedQuestion =
      question.trim();


    if (
      !trimmedQuestion ||
      loading
    ) {
      return;
    }


    stopSpeaking();

    setError("");


    const selectedLanguage =
      language;


    let chatId =
      activeChatIdRef.current;


    if (!chatId) {

      chatId = makeId();

      activeChatIdRef.current =
        chatId;

      setActiveChatId(
        chatId
      );
    }


    const userMessage = {
      id: makeId(),

      role: "user",

      content:
        trimmedQuestion,
    };


    const nextMessages =
      [
        ...messages,
        userMessage,
      ];


    setMessages(
      nextMessages
    );


    saveConversation(
      nextMessages,
      chatId
    );


    setQuestion("");

    setLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/ask`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              question:
                trimmedQuestion,

              language:
                selectedLanguage,
            }),
          }
        );


      const data =
        await response
          .json()
          .catch(
            () => ({})
          );


      if (!response.ok) {

        const detail =
          typeof data.detail ===
          "string"
            ? data.detail
            : JSON.stringify(
                data.detail ||
                  data
              );


        throw new Error(
          detail ||
            `Request failed (${response.status})`
        );
      }


      // ------------------------------------------------------
      // Extract answer
      // ------------------------------------------------------

      const answer =
        typeof data === "string"
          ? data
          : data.answer ??
            data.response ??
            data.message ??
            data.result;


      if (
        typeof answer !==
          "string" ||
        !answer.trim()
      ) {

        throw new Error(
          t.emptyAnswer
        );
      }


      // ------------------------------------------------------
      // Extract citations
      // ------------------------------------------------------

      const citations =
        Array.isArray(
          data.citations
        )
          ? data.citations
          : [];


      // ------------------------------------------------------
      // Create assistant message
      // ------------------------------------------------------

      const assistantMessage = {
        id: makeId(),

        role: "assistant",

        content:
          answer,

        citations:
          citations,

        model:
          data.model ||
          "openai/gpt-oss-20b",

        language:
          data.language ||
          selectedLanguage,
      };


      const completedMessages =
        [
          ...nextMessages,
          assistantMessage,
        ];


      setMessages(
        completedMessages
      );


      saveConversation(
        completedMessages,
        chatId
      );


      speakAnswer(
        answer,
        assistantMessage.id,
        selectedLanguage
      );

    } catch (err) {

      console.error(
        "IP-SAKTI request error:",
        err
      );


      setError(
        `${t.connectionError} ${
          err?.message || ""
        }`
      );

    } finally {

      setLoading(false);

    }
  }


  // ==========================================================
  // Suggested question
  // ==========================================================

  function chooseQuestion(
    text
  ) {

    setQuestion(text);

    document
      .querySelector(
        ".question-input"
      )
      ?.focus();
  }


  const suggestions = [
    t.question1,
    t.question2,
    t.question3,
  ];


  // ==========================================================
  // Render
  // ==========================================================

  return (

    <div
      className={`app-container theme-${theme}`}
    >

      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="app-header">

        <a
          className="brand"
          href="#"
          onClick={(event) =>
            event.preventDefault()
          }
        >

          <div className="brand-logo">
            <span className="brand-logo-text">
              IP
            </span>
          </div>


          <div className="brand-text">

            <h1>
              IP-SAKTI{" "}
              <span>Sahayak</span>
            </h1>

            <p>
              {t.subtitle}
            </p>

          </div>

        </a>


        <div className="header-actions">

          <span className="online-status">
            <span className="online-dot" />
            {t.online}
          </span>


          <label
            className="language-label"
            htmlFor="language-select"
          >
            {t.language}
          </label>


          <select
            id="language-select"
            value={language}
            onChange={(event) =>
              changeLanguage(
                event.target.value
              )
            }
            disabled={loading}
          >

            {Object.entries(
              languages
            ).map(
              ([
                key,
                item,
              ]) => (

                <option
                  key={key}
                  value={key}
                >
                  {item.label}
                </option>

              )
            )}

          </select>


          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setTheme(
                (current) =>
                  current ===
                  "colorful"
                    ? "dark"
                    : "colorful"
              )
            }
          >

            {theme ===
            "colorful"
              ? "🌙"
              : "☀️"}

          </button>

        </div>

      </header>


      {/* ====================================================
          MAIN LAYOUT
      ==================================================== */}

      <main className="app-layout">


        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="sidebar">

          <button
            type="button"
            className="new-chat-button sidebar-new-chat"
            onClick={
              startNewChat
            }
            disabled={loading}
          >
            {t.newChat}
          </button>


          <div className="history-heading">

            <span>
              CHAT HISTORY
            </span>

            <span className="history-count">
              {chatHistory.length}
            </span>

          </div>


          <div className="history-list">

            {chatHistory.length ===
            0 ? (

              <p className="empty-history">
                {t.emptyHistory}
              </p>

            ) : (

              chatHistory.map(
                (chat) => (

                  <div
                    key={chat.id}
                    className={`history-item ${
                      activeChatId ===
                      chat.id
                        ? "active"
                        : ""
                    }`}
                  >

                    <button
                      type="button"
                      className="history-open"
                      onClick={() =>
                        openChat(
                          chat
                        )
                      }
                      disabled={
                        loading
                      }
                      title={
                        chat.title
                      }
                    >

                      <span className="history-icon">
                        ◷
                      </span>

                      <span>
                        {chat.title}
                      </span>

                    </button>


                    <button
                      type="button"
                      className="history-delete"
                      onClick={(
                        event
                      ) =>
                        deleteChat(
                          event,
                          chat.id
                        )
                      }
                      aria-label={`${t.delete} ${chat.title}`}
                      title={
                        t.delete
                      }
                    >
                      ×
                    </button>

                  </div>

                )
              )

            )}

          </div>


          <div className="sidebar-bottom">

            <div className="sidebar-brand-mark">
              🌱
            </div>

            <strong>
              {t.tagline}
            </strong>

            <p>
              {t.sidebarDescription}
            </p>

            <span>
              National &amp;
              international scope
            </span>

          </div>

        </aside>


        {/* ==================================================
            CHAT
        ================================================== */}

        <section className="chat-section">


          {/* HERO */}

          <div className="hero-section">

            <div className="hero-logo">

              <span className="hero-orbit hero-orbit-one" />

              <span className="hero-orbit hero-orbit-two" />

              <span className="hero-sparkle hero-sparkle-top">
                ✦
              </span>

              <span className="hero-sparkle hero-sparkle-bottom">
                ✧
              </span>

              <span className="hero-logo-symbol">
                ✳
              </span>

            </div>


            <h1 className="hero-title">

              Protecting tradition.

              <br />

              <span>
                Empowering innovation.
              </span>

            </h1>


            <p className="hero-description">
              {t.description}
            </p>

          </div>


          {/* SUGGESTIONS */}

          {messages.length <=
            1 && (

            <div className="suggested-questions">

              <div className="section-label">
                ✧ {t.suggestions}
              </div>


              <div className="suggestion-grid">

                {suggestions.map(
                  (
                    suggestion,
                    index
                  ) => (

                    <button
                      type="button"
                      key={`${index}-${suggestion}`}
                      className={`suggestion-card suggestion-${
                        index + 1
                      }`}
                      onClick={() =>
                        chooseQuestion(
                          suggestion
                        )
                      }
                    >

                      <span className="suggestion-icon">
                        {
                          [
                            "🧬",
                            "📚",
                            "🌍",
                          ][index]
                        }
                      </span>

                      <span>
                        {suggestion}
                      </span>

                      <span className="suggestion-arrow">
                        ↗
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          )}


          {/* MESSAGES */}

          <section
            className="messages-container"
            aria-label={
              t.conversation
            }
            aria-live="polite"
          >

            {messages.map(
              (message) => (

                <Message
                  key={message.id}
                  message={message}
                  onSpeak={
                    speakAnswer
                  }
                  onStopSpeaking={
                    stopSpeaking
                  }
                  speaking={
                    speakingMessageId ===
                    message.id
                  }
                  t={t}
                />

              )
            )}


            <div
              ref={
                messagesEndRef
              }
            />


            {/* LOADING */}

            {loading && (

              <div className="loading-message">

                <span className="loading-dot" />

                <span className="loading-dot" />

                <span className="loading-dot" />

                <span>
                  {t.preparing}
                </span>

              </div>

            )}

          </section>


          {/* ERROR */}

          {error && (

            <div
              className="error-message"
              role="alert"
            >

              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                aria-label={
                  t.dismissError
                }
              >
                ×
              </button>

            </div>

          )}


          {/* COMPOSER */}

          <form
            className="composer"
            onSubmit={
              sendMessage
            }
          >

            <textarea
              className="question-input"
              value={question}
              onChange={(
                event
              ) =>
                setQuestion(
                  event.target
                    .value
                )
              }
              placeholder={
                t.placeholder
              }
              rows={2}
              disabled={loading}
              aria-label={
                t.placeholder
              }
              onKeyDown={(
                event
              ) => {

                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {

                  event.preventDefault();

                  event.currentTarget.form?.requestSubmit();

                }

              }}
            />


            <div className="composer-actions">

              <span className="composer-hint">
                {t.hint ||
                  "Enter to send · Shift + Enter for new line"}
              </span>


              <div className="composer-buttons">

                <button
                  type="button"
                  onClick={
                    startVoiceInput
                  }
                  disabled={
                    loading ||
                    isListening
                  }
                  className={`voice-button ${
                    isListening
                      ? "listening"
                      : ""
                  }`}
                  aria-label={
                    t.voiceInput
                  }
                >

                  {isListening
                    ? t.listening
                    : t.voiceInput}

                </button>


                <button
                  type="submit"
                  className="send-button"
                  disabled={
                    loading ||
                    !question.trim()
                  }
                >

                  {loading
                    ? t.sending
                    : t.send}

                </button>

              </div>

            </div>

          </form>


          {/* FOOTER */}

          <footer className="chat-footer">
            {t.footer}
          </footer>

        </section>

      </main>

    </div>
  );
}