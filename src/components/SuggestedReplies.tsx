import { memo } from 'react';

interface SuggestedRepliesProps {
  mood: string;
  onSelect: (text: string) => void;
}

const MOOD_SUGGESTIONS: Record<string, string[]> = {
  'bhai-radar': ['কেমন আছিস ভাই?', 'আজকে কী করলি?', 'একটা মজার কিছু বল'],
  'gen-z': ['Bro what\'s the tea? ☕', 'Vibe check দে তো', 'Lowkey bored, কিছু বল'],
  'mon-halka': ['মন খারাপ ভাই 😢', 'একটু হাসাও না', 'Life niye confused'],
  'poramorsho': ['ক্যারিয়ার নিয়ে confused', 'কী করা উচিত?', 'একটু গাইড করো'],
  'thatta': ['আমাকে রোস্ট করো 😂', 'একটা জোক শোনাও', 'মজা করো কিছু নিয়ে'],
  'roast': ['আমাকে রোস্ট করো!', 'সবচেয়ে মারাত্মক রোস্ট দাও', 'ফ্রেন্ডলি রোস্ট দাও'],
  'motivation': ['মোটিভেট করো ভাই 💪', 'Life tough লাগছে', 'Success tips দাও'],
  'romantic': ['একটা প্রেমের কবিতা লেখো', 'রোমান্টিক মেসেজ লেখো', 'Love advice দাও'],
  'sad-mode': ['কষ্ট পাচ্ছি ভাই 😢', 'একটু কথা বলবে?', 'মন ভালো করতে হেল্প করো'],
  'angry-mode': ['অনেক রাগ হচ্ছে! 😤', 'কীভাবে calm down করবো?', 'রাগ কমানোর tips দাও'],
  'happy-mode': ['আজকে অনেক খুশি! 🎉', 'খুশির খবর শেয়ার করি!', 'Fun কিছু করি আয়!'],
  'lonely': ['একা লাগছে ভাই 🌙', 'কথা বলো আমার সাথে', 'কিছু মজার করো'],
  'confused': ['Confused আছি ভাই 🤔', 'Decision নিতে হেল্প করো', 'Options analyze করো'],
  'anxiety': ['উদ্বিগ্ন লাগছে 😰', 'Calm down করতে সাহায্য করো', 'Breathing exercise করাও'],
  'nostalgia': ['ছোটবেলার কথা মনে পড়ে 🕰️', '90s এর কথা বলো', 'পুরনো দিনের গল্প করো'],
  'gratitude': ['কৃতজ্ঞ আছি জীবনের জন্য 🙏', 'Gratitude practice শেখাও', 'আজকের ৩টা ভালো জিনিস বলি'],
  'study': ['পড়াশোনার tips দাও', 'Exam preparation হেল্প করো', 'Study plan বানাও'],
  'science': ['মজার science fact বলো 🔬', 'Space নিয়ে কিছু বলো', 'Physics explain করো'],
  'history': ['মুক্তিযুদ্ধের গল্প বলো', 'ইতিহাসের মজার fact দাও', 'বাংলার ইতিহাস শেখাও'],
  'math': ['Math problem solve করো 🔢', 'Algebra শেখাও', 'Math কে easy করো'],
  'english': ['English grammar শেখাও', 'Vocabulary বাড়াতে হেল্প করো', 'Conversation practice করি'],
  'geography': ['বাংলাদেশের নদী বলো 🌍', 'দেশ সম্পর্কে fun facts দাও', 'Climate change বোঝাও'],
  'philosophy': ['জীবনের মানে কী? 🤯', 'Existence নিয়ে ভাবো', 'Famous philosophers বলো'],
  'quiz': ['একটা quiz দাও! ❓', 'GK test নাও', 'Brain teaser দাও'],
  'golpo': ['একটা ভৌতিক গল্প বলো', 'রোমান্টিক গল্প শোনাও', 'সায়েন্স ফিকশন বলো'],
  'horror': ['ভয়ের গল্প শোনাও 👻', 'পেত্নীর গল্প বলো', 'রাত ৩টার গল্প দাও'],
  'movie': ['আজকে কোন মুভি দেখবো? 🎬', 'Best Bangla movie বলো', 'Series recommend করো'],
  'music': ['মন খারাপের গান বলো 🎵', 'Party playlist দাও', 'বাংলা band নিয়ে কথা বলো'],
  'gaming': ['PUBG tips দাও 🎮', 'Best mobile game বলো', 'Gaming setup recommend করো'],
  'cricket': ['বাংলাদেশ ক্রিকেট নিয়ে বলো 🏏', 'Best XI বানাও', 'Match prediction দাও'],
  'memes': ['Meme বানাও 🤣', 'Trending meme বলো', 'Dank meme দাও'],
  'anime': ['Best anime recommend করো 🎌', 'Naruto vs Goku debate!', 'নতুন anime কী দেখবো?'],
  'sports': ['Football নিয়ে কথা বলো ⚽', 'Workout routine দাও', 'Sports news দাও'],
  'drama': ['Best নাটক recommend করো 🎭', 'Mosharraf Karim-এর নাটক বলো', 'K-drama suggest করো'],
  'health': ['Health tips দাও 🏥', 'কী খাবো কী খাবো না?', 'ঘরোয়া চিকিৎসা বলো'],
  'cooking': ['Easy recipe দাও 🍳', 'বিরিয়ানি বানাতে শেখাও', 'Bachelor cooking tips'],
  'travel': ['বাংলাদেশে কোথায় ঘুরতে যাবো? ✈️', 'Budget travel tips দাও', 'Hidden gems বলো'],
  'fitness': ['Home workout দাও 🏋️', 'Diet plan বানাও', 'Weight loss tips দাও'],
  'fashion': ['Styling tips দাও 👗', 'Budget shopping কোথায়?', 'Grooming tips দাও'],
  'gardening': ['ব্যালকনিতে কী লাগাবো? 🌱', 'Indoor plants recommend করো', 'Gardening basics শেখাও'],
  'parenting': ['বাচ্চাকে কী শেখাবো? 👶', 'Positive parenting tips দাও', 'Screen time manage করো'],
  'relationship': ['সম্পর্কে সমস্যা 💑', 'Communication improve করি', 'Trust issues solve করো'],
  'self-care': ['Self care routine দাও 🧘', 'Burnout হচ্ছে, কী করবো?', 'Mental health tips দাও'],
  'career': ['কোন career ভালো? 🎯', 'Job interview tips দাও', 'Skill development করি'],
  'business': ['Business idea দাও 💰', 'Marketing strategy বানাও', 'E-commerce শুরু করবো'],
  'freelancing': ['Freelancing শুরু করবো 💼', 'Upwork profile optimize করো', 'Client পাওয়ার tips দাও'],
  'finance': ['Budget plan বানাও 🏦', 'Investment কোথায় করবো?', 'Savings tips দাও'],
  'interview': ['Common questions বলো 🤝', 'STAR method শেখাও', 'Mock interview করো'],
  'resume': ['CV review করো 📄', 'Cover letter লিখতে হেল্প', 'LinkedIn optimize করো'],
  'startup': ['Startup idea validate করো 🚀', 'Business plan বানাও', 'Funding কীভাবে পাবো?'],
  'marketing': ['Social media strategy দাও 📢', 'Content ideas দাও', 'SEO basics শেখাও'],
  'shayari': ['একটা শায়েরি বলো 🌹', 'প্রেমের শায়েরি লেখো', 'বিরহের শায়েরি শোনাও'],
  'deep-thinking': ['জীবন কী? 🧠', 'Consciousness নিয়ে ভাবো', 'Universe কত বড়?'],
  'poetry': ['একটা কবিতা লেখো ✒️', 'রবীন্দ্রনাথের মতো লেখো', 'Free verse কবিতা দাও'],
  'writing': ['Blog post লিখতে হেল্প 📝', 'Writing tips দাও', 'Writer\'s block ভাঙাও'],
  'art': ['Drawing tips দাও 🎨', 'Color theory শেখাও', 'Digital art শুরু করবো'],
  'photography': ['Mobile photography tips 📸', 'Composition rules শেখাও', 'Photo editing শেখাও'],
  'storytelling': ['গল্প লিখতে হেল্প 📖', 'Plot idea দাও', 'Character create করি'],
  'coding-help': ['React শেখাও', 'Python দিয়ে কী করা যায়?', 'Bug fix করতে হেল্প করো'],
  'web-dev': ['HTML/CSS শেখাও 🌐', 'React project idea দাও', 'Full-stack হতে চাই'],
  'mobile-dev': ['Flutter শেখাও 📱', 'App idea validate করো', 'React Native vs Flutter?'],
  'ai-ml': ['ML কী? বোঝাও 🤖', 'Python দিয়ে AI শুরু করি', 'ChatGPT কীভাবে কাজ করে?'],
  'cybersecurity': ['Online safe থাকার tips 🔒', 'Password security শেখাও', 'Phishing চিনবো কীভাবে?'],
  'gadgets': ['কোন ফোন কিনবো? 📟', 'Best laptop suggest করো', 'Budget earbuds বলো'],
  'linux': ['Linux শুরু করবো 🐧', 'Ubuntu vs Fedora?', 'Terminal commands শেখাও'],
  'news': ['আজকের খবর কী? 📰', 'Tech news দাও', 'বাংলাদেশের update দাও'],
  'religion': ['আজকের দোয়া বলো 🕌', 'ইসলামের ইতিহাস শেখাও', 'ধর্মীয় জ্ঞান দাও'],
  'debate': ['একটা topic দাও debate করি ⚔️', 'আমার argument-এ weakness বলো', 'Logical fallacy শেখাও'],
  'politics': ['বাংলাদেশের রাজনীতি 🏛️', 'বিশ্ব রাজনীতি নিয়ে বলো', 'Policy analysis করো'],
  'social-media': ['Follower বাড়ানোর tips 📲', 'Content calendar বানাও', 'Viral হতে কী করবো?'],
  'environment': ['পরিবেশ রক্ষার tips 🌿', 'Climate change বোঝাও', 'Eco-friendly জীবন যাপন'],
  'deshi-adda': ['চা খেতে খেতে আড্ডা দিই ☕', 'রাজনীতি-ক্রিকেট আড্ডা করি', 'দেশি গসিপ দাও'],
  'time-travel': ['১৯৭১ এ নিয়ে যাও ⏳', 'ভবিষ্যতের পৃথিবী দেখাও', 'মুঘল আমলে যেতে চাই'],
  'detective': ['Mystery solve করতে চাই 🔍', 'একটা case দাও', 'Sherlock-এর মত deduce করো'],
  'astrology': ['আমার রাশিফল বলো ⭐', 'Zodiac compatibility চেক করো', 'আজকের ভাগ্য কেমন?'],
  'dream': ['গতরাতের স্বপ্নের মানে বলো 💭', 'Lucid dreaming কীভাবে করবো?', 'স্বপ্নে সাপ দেখলে কী হয়?'],
  'survival': ['বন্যায় কী করবো? 🏕️', 'First aid শেখাও', 'Emergency kit কী কী রাখবো?'],
  'dua-prayer': ['ঘুমানোর আগের দোয়া বলো 🤲', 'পরীক্ষার আগে কোন দোয়া পড়বো?', 'সুরা ইয়াসিন-এর ফজিলত'],
  'riddle': ['একটা ধাঁধা দাও! 🧩', 'Brain teaser চাই', 'Logic puzzle দাও'],
  'bangla-culture': ['পহেলা বৈশাখ নিয়ে বলো 🇧🇩', 'বাউল সংগীত কী?', 'মসলিন কাপড়ের ইতিহাস বলো'],

  // ===== NEW MOODS SUGGESTIONS =====
  'arabic-learn': ['আরবি বর্ণমালা শেখাও 🕋', 'সালাম কীভাবে বলবো?', 'কোরআনের আরবি বুঝতে চাই'],
  'hindi-learn': ['হিন্দি বর্ণমালা শেখাও 🇮🇳', 'Bollywood dialogue বাংলায় বলো', 'হিন্দি conversation practice'],
  'japanese-learn': ['Konnichiwa! জাপানি শেখাও 🇯🇵', 'Anime থেকে জাপানি শিখি', 'Hiragana chart দাও'],
  'korean-learn': ['Annyeong! কোরিয়ান শেখাও 🇰🇷', 'K-drama থেকে কোরিয়ান শিখি', 'Hangul কীভাবে পড়বো?'],
  'chinese-learn': ['Ni hao! চাইনিজ শেখাও 🇨🇳', 'Basic Mandarin phrases দাও', 'Pinyin system বোঝাও'],
  'spanish-learn': ['Hola! স্প্যানিশ শেখাও 🇪🇸', 'Spanish greetings শেখাও', 'Basic conversation practice'],
  'french-learn': ['Bonjour! ফ্রেঞ্চ শেখাও 🇫🇷', 'French pronunciation tips দাও', 'Basic phrases শেখাও'],
  'bangla-grammar': ['সন্ধি বিচ্ছেদ শেখাও 📗', 'বাগধারা ও প্রবাদ বলো', 'শুদ্ধ বাংলা লেখা শেখাও'],

  'quran-tafsir': ['সুরা ফাতিহার তাফসির বলো 📖', 'আয়াতুল কুরসির মানে বোঝাও', 'সুরা মুলক-এর ফজিলত'],
  'hadith': ['আজকের একটা হাদিস শোনাও 📜', 'সহীহ বুখারি থেকে হাদিস দাও', 'হাদিসের শিক্ষা বলো'],
  'islamic-history': ['খলিফাদের গল্প বলো 🕌', 'বদর যুদ্ধের ইতিহাস বলো', 'সাহাবীদের জীবনী শোনাও'],
  'meditation': ['Guided meditation করাও 🧘‍♂️', 'Mindfulness কী শেখাও', 'Stress relief exercise দাও'],
  'sufi': ['রুমির একটা কবিতা বলো 🌀', 'লালন শাহের দর্শন বলো', 'সুফিবাদ কী বোঝাও'],
  'ramadan': ['ইফতারে কী খাবো? 🌙', 'তারাবীহ নামাজের নিয়ম বলো', 'রমজানের রুটিন বানাও'],
  'spiritual-healing': ['মনের শান্তির দোয়া বলো ✨', 'Ruqyah কী? বোঝাও', 'Inner peace পেতে কী করবো?'],
  'life-after-death': ['কবরের জীবন নিয়ে বলো 🌌', 'জান্নাতের বর্ণনা দাও', 'হাশরের দিন কেমন হবে?'],

  'space': ['ব্ল্যাক হোল কী? 🚀', 'মঙ্গল গ্রহে মানুষ যাবে কবে?', 'মহাবিশ্ব কত বড়?'],
  'psychology': ['মনোবিজ্ঞানের fun facts বলো 🧠', 'Cognitive bias কী?', 'Body language পড়তে শেখাও'],
  'biology': ['DNA কীভাবে কাজ করে? 🧬', 'Evolution theory বোঝাও', 'Human body-র amazing facts'],
  'chemistry': ['মজার chemical reaction বলো ⚗️', 'Periodic table মনে রাখার tricks', 'দৈনন্দিন জীবনে chemistry'],
  'physics-adv': ['Quantum mechanics কী? ⚛️', 'Relativity সহজে বোঝাও', 'Light-এর speed কত?'],
  'medical': ['মাথা ব্যথার কারণ কী? 🩺', 'প্রাথমিক চিকিৎসা শেখাও', 'Vitamin deficiency বোঝাও'],
  'economics': ['Inflation কী? 📊', 'বাংলাদেশের GDP নিয়ে বলো', 'Stock market বোঝাও'],
  'research': ['Research paper কীভাবে লিখবো? 🔎', 'Literature review করতে হেল্প', 'Citation format শেখাও'],
  'invention': ['Edison কীভাবে বাল্ব আবিষ্কার করলো? 💡', 'বাংলাদেশি আবিষ্কারক বলো', 'Future inventions কী হতে পারে?'],
  'dinosaur': ['T-Rex সম্পর্কে বলো 🦕', 'ডাইনোসর কেন বিলুপ্ত হলো?', 'সবচেয়ে বড় ডাইনোসর কোনটা?'],

  'chess': ['Chess opening শেখাও ♟️', 'Best chess strategy কী?', 'Magnus Carlsen নিয়ে বলো'],
  'carrom': ['ক্যারম board shot শেখাও 🎯', 'Cover shot কীভাবে মারবো?', 'ক্যারম tournament rules বলো'],
  'fishing': ['কোন মাছ কোন সিজনে ধরা যায়? 🎣', 'মাছ ধরার সরঞ্জাম বলো', 'মাছ ধরার গল্প শোনাও'],
  'cycling': ['ঢাকায় cycling route বলো 🚴', 'Bike maintenance tips দাও', 'সাইক্লিং-এর health benefits'],
  'swimming': ['সাঁতার শেখার সহজ উপায় 🏊', 'Freestyle technique বোঝাও', 'Water safety tips দাও'],
  'painting': ['Pencil sketch কীভাবে করবো? 🖼️', 'Watercolor basics শেখাও', 'বাংলার চিত্রশিল্পী বলো'],
  'origami': ['কাগজের পাখি বানাতে শেখাও 🦢', 'Easy origami ideas দাও', 'Paper craft project বলো'],
  'bird-watching': ['বাংলাদেশের পাখি চেনাও 🐦', 'দোয়েল পাখি নিয়ে বলো', 'পাখি দেখার best spots'],
  'collecting': ['Stamp collecting শুরু করবো 🪙', 'Old coin collection tips', 'কী কী collect করা যায়?'],
  'pet-care': ['বিড়াল পালতে কী করবো? 🐱', 'কুকুরের training tips', 'মাছের aquarium setup'],

  'pirate': ['জলদস্যু adventure শোনাও 🏴‍☠️', 'Treasure map বানাও', 'Famous pirates-দের কথা বলো'],
  'wizard': ['একটা spell শেখাও! 🧙', 'Hogwarts-এ ভর্তি হতে চাই', 'জাদুর দুনিয়ায় নিয়ে যাও'],
  'scientist-rp': ['একটা experiment করি! 🥼', 'মজার আবিষ্কার করো', 'Lab-এ কী হচ্ছে?'],
  'king': ['আদেশ করুন মহারাজ! 👑', 'রাজ্য পরিচালনা করি', 'রাজসভায় কী হচ্ছে?'],
  'robot': ['তোমার processor কত fast? 🦾', 'Human emotions বোঝাও', 'Robot হিসেবে পৃথিবী কেমন?'],
  'alien': ['পৃথিবী কেমন লাগছে? 👽', 'তোমার গ্রহের কথা বলো', 'মানুষ কেন এরকম?'],
  'superhero': ['তোমার superpower কী? 🦸', 'ভিলেনকে থামাও!', 'বাংলাদেশি superhero হিসেবে কাজ করো'],
  'villain': ['তোমার evil plan কী? 🦹', 'World domination plan বলো', 'Hero-কে হারানোর plan করো'],
  'teacher-rp': ['আজকের পড়া ধরো! 👨‍🏫', 'পরীক্ষা নাও', 'Homework দাও'],
  'doctor-rp': ['ডাক্তার সাহেব, সমস্যা আছে 👨‍⚕️', 'Check-up করো', 'Medicine suggest করো'],

  'exam-stress': ['পরীক্ষার ভয়ে মরে যাচ্ছি! 📝', 'Last minute tips দাও', 'Anxiety কমানোর উপায়?'],
  'scholarship': ['কোন scholarship-এ apply করবো? 🎓', 'SOP লিখতে হেল্প করো', 'Scholarship essay tips দাও'],
  'abroad-study': ['কোন দেশে পড়তে যাবো? 🌏', 'IELTS preparation tips দাও', 'Visa process বোঝাও'],

  'podcast': ['Best Bengali podcast বলো 🎙️', 'Podcast শুরু করতে কী লাগে?', 'Interesting topic suggest করো'],
  'standup': ['একটা comedy bit লেখো 🎤', 'ঢাকার traffic নিয়ে joke বলো', 'Stand-up tips দাও'],
  'web-series': ['Binge-worthy web series বলো 📺', 'বাংলা web series recommend করো', 'Top 5 list দাও'],
  'book-review': ['একটা বই recommend করো 📕', 'হুমায়ূন আহমেদ-এর best book?', 'Self-help book বলো'],
  'comic': ['Best comic recommend করো 💥', 'বাংলা comic বলো', 'Marvel vs DC debate করো'],

  'diy': ['সহজ DIY project দাও 🔧', 'পুরনো জিনিস দিয়ে নতুন কিছু বানাও', 'Home improvement ideas'],
  'minimalism': ['Decluttering tips দাও 🪴', 'কম দিয়ে বেশি পাওয়া কীভাবে?', 'Digital minimalism শেখাও'],
  'sleep-tips': ['ঘুম আসছে না 😴', 'Better sleep routine দাও', 'Insomnia থেকে মুক্তির উপায়?'],
  'skincare': ['Skincare routine দাও 🧴', 'ব্রণের solution কী?', 'Budget skincare products বলো'],
  'home-decor': ['ঘর সাজানোর ideas দাও 🏡', 'Budget-এ room makeover', 'Color combination suggest করো'],

  'presentation': ['Presentation tips দাও 📊', 'Public speaking ভয় কমাও', 'Slide design শেখাও'],
  'leadership': ['Leader হতে কী করবো? 🏆', 'Team management tips দাও', 'Decision making শেখাও'],
  'networking': ['Professional networking tips 🤝', 'LinkedIn-এ connect কীভাবে?', 'Elevator pitch লেখো'],
  'email-writing': ['Professional email লিখতে হেল্প 📧', 'Email template দাও', 'Follow-up email কীভাবে লিখবো?'],

  'calligraphy': ['বাংলা ক্যালিগ্রাফি শেখাও ✍️', 'আরবি ক্যালিগ্রাফি শুরু করবো', 'কী tool লাগবে?'],
  'song-writing': ['একটা গান লিখতে হেল্প করো 🎶', 'Rhyme scheme শেখাও', 'বাংলা গানের structure বোঝাও'],
  'script-writing': ['Short film script লিখবো 🎬', 'Screenplay format শেখাও', 'Dialogue writing tips দাও'],

  'data-science': ['Data Science শুরু করবো 📈', 'Python দিয়ে data analysis', 'SQL শেখাও'],
  'blockchain': ['Blockchain কী? ⛓️', 'Cryptocurrency বোঝাও', 'Smart contract কী?'],
  'cloud-computing': ['AWS শুরু করবো ☁️', 'Cloud কী? সহজে বোঝাও', 'Free tier দিয়ে কী করা যায়?'],
  'database': ['SQL শেখাও 🗄️', 'Database design বোঝাও', 'PostgreSQL vs MongoDB?'],
  'game-dev': ['Game কীভাবে বানাবো? 🕹️', 'Unity শেখাও', 'Game design principles বলো'],

  'volunteer': ['Volunteer করতে চাই 🤝', 'বাংলাদেশে NGO বলো', 'Community service ideas দাও'],
  'human-rights': ['মানবাধিকার কী? ✊', 'UN Human Rights বোঝাও', 'Activism কীভাবে করবো?'],
  'women-empowerment': ['নারী ক্ষমতায়ন নিয়ে বলো 👩‍💼', 'বাংলাদেশি successful নারী বলো', 'Gender equality কীভাবে আনবো?'],

  'magic-tricks': ['একটা magic trick শেখাও 🎩', 'Card trick দাও', 'Easy illusion বোঝাও'],
  'conspiracy': ['Moon landing কি fake? 🔺', 'Bermuda Triangle নিয়ে বলো', 'Area 51 কী?'],
  'mythology': ['Greek mythology বলো ⚡', 'রামায়ণের গল্প শোনাও', 'Norse gods নিয়ে বলো'],
  'trivia': ['একটা amazing fact বলো 🎲', 'জানো কি? type fact দাও', 'Mind-blowing trivia চাই'],
  'life-hack': ['কাজের life hack দাও 💡', 'Kitchen hack বলো', 'Productivity tips দাও'],
};

const DEFAULT_SUGGESTIONS = ['কিছু মজার বলো!', 'আজকের টিপস দাও', 'হেল্প দরকার'];

function SuggestedRepliesInner({ mood, onSelect }: SuggestedRepliesProps) {
  const suggestions = MOOD_SUGGESTIONS[mood] || DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="px-3 py-1.5 rounded-full text-xs bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-200 hover:scale-105 border border-border/30"
        >
          {text}
        </button>
      ))}
    </div>
  );
}

const SuggestedReplies = memo(SuggestedRepliesInner);
export default SuggestedReplies;
