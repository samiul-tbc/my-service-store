// Hub Cart guides — bilingual long-form help content for /guide.
// Body blocks: { h: 'heading' } | { p: 'paragraph' } | { list: ['item', ...] }

export const GUIDES = [
  {
    slug: 'how-to-order',
    mins: 3,
    title: { bn: 'কীভাবে অর্ডার করবেন', en: 'How to Order' },
    excerpt: {
      bn: 'পছন্দের সার্ভিস বাছাই থেকে পেমেন্ট পর্যন্ত — ধাপে ধাপে পুরো প্রক্রিয়া।',
      en: 'From picking a service to payment — the whole process, step by step.',
    },
    body: {
      bn: [
        { p: 'Hub Cart থেকে যেকোনো ডিজিটাল সার্ভিস কেনা খুব সহজ। পুরো প্রক্রিয়াটা ২-৩ মিনিটের বেশি লাগে না।' },
        { h: 'ধাপ ১: সার্ভিস বাছাই করুন' },
        { p: 'হোমপেজ বা Categories পেজ থেকে পছন্দের সার্ভিসটা বেছে নিন। সার্ভিসের পেজে বিস্তারিত বিবরণ, মেয়াদ আর দাম দেখে নিন। চাইলে কার্টে একাধিক সার্ভিস একসাথে যোগ করতেও পারেন।' },
        { h: 'ধাপ ২: তথ্য দিন' },
        { p: 'অর্ডার ফর্মে আপনার নাম, সঠিক WhatsApp নম্বর আর (থাকলে) Telegram username দিন। WhatsApp নম্বরটা অবশ্যই সচল রাখুন — ডেলিভারি আর আপডেট এই নম্বরেই যাবে।' },
        { h: 'ধাপ ৩: পেমেন্ট করুন' },
        { p: 'bKash, Nagad, Rocket, Upay বা Crypto — যেকোনো মাধ্যমে পেমেন্ট পেজে দেওয়া নম্বর/অ্যাকাউন্টে টাকা পাঠান। পেমেন্টের পর TrxID (Transaction ID) টা অর্ডারে বসান — এটা ছাড়া অর্ডার যাচাই করা যায় না।' },
        { h: 'ধাপ ৪: ডেলিভারির অপেক্ষা' },
        { p: 'অর্ডার কনফার্ম হলে আমাদের টিম যাচাই করে ডেলিভারি সম্পন্ন করবে। সাধারণত কয়েক মিনিট থেকে কয়েক ঘণ্টার মধ্যে ডেলিভারি পেয়ে যাবেন।' },
        { list: ['WhatsApp নম্বর ভুল দিলে ডেলিভারি দেরি হতে পারে — দুইবার যাচাই করুন', 'কুপন কোড থাকলে চেকআউটে বসালেই ছাড় পেয়ে যাবেন', 'VIP সুবিধা: প্রতি ৩টি সম্পূর্ণ অর্ডারে পরের অর্ডারে ৫% ছাড় নিজে নিজে যোগ হয়'] },
      ],
      en: [
        { p: 'Buying any digital service from Hub Cart is simple — the whole process takes 2-3 minutes.' },
        { h: 'Step 1: Pick a service' },
        { p: 'Choose your service from the homepage or the Categories page. Check the details, duration and price on the product page. You can also add several services to the cart and buy them together.' },
        { h: 'Step 2: Fill in your details' },
        { p: 'Enter your name, an active WhatsApp number and your Telegram username (if any). Keep the WhatsApp number reachable — delivery and updates go to that number.' },
        { h: 'Step 3: Pay' },
        { p: 'Pay via bKash, Nagad, Rocket, Upay or Crypto to the number/account shown on the payment page. After paying, put the TrxID (Transaction ID) in your order — orders cannot be verified without it.' },
        { h: 'Step 4: Wait for delivery' },
        { p: 'Once confirmed, our team verifies the payment and completes delivery — usually within a few minutes to a few hours.' },
        { list: ['A wrong WhatsApp number delays delivery — double-check it', 'Have a coupon code? Apply it at checkout for an instant discount', 'VIP perk: every 3 completed orders automatically earn 5% off the next one'] },
      ],
    },
  },
  {
    slug: 'payment-guide',
    mins: 3,
    title: { bn: 'নিরাপদে পেমেন্ট করার গাইড', en: 'How to Pay Safely' },
    excerpt: {
      bn: 'bKash/Nagad পেমেন্ট, TrxID যাচাই আর প্রতারণা থেকে বাঁচার নিয়ম।',
      en: 'bKash/Nagad payments, TrxID checks, and how to stay safe from scams.',
    },
    body: {
      bn: [
        { p: 'অনলাইনে টাকা পাঠানোর সময় একটু সতর্কতা মানেই আপনার টাকা পুরোপুরি নিরাপদ। এই নিয়মগুলো মেনে চলুন।' },
        { h: 'শুধু অফিসিয়াল নম্বরেই পেমেন্ট করুন' },
        { p: 'পেমেন্ট সবসময় Hub Cart-এর পেমেন্ট পেজে দেখানো নম্বরেই করুন। অন্য কেউ ইনবক্সে নম্বর দিলে সেটায় টাকা পাঠাবেন না — আমাদের টিম কখনো আলাদা করে ব্যক্তিগত নম্বর দেয় না।' },
        { h: 'TrxID ঠিকভাবে রাখুন' },
        { p: 'পেমেন্ট শেষে আপনি একটা Transaction ID (TrxID) পাবেন। অর্ডারে হুবহু ওই ID-টাই বসান। একই TrxID দিয়ে দুইবার অর্ডার করা যায় না — আমাদের সিস্টেম নিজে থেকেই ডুপ্লিকেট TrxID ধরে ফেলে।' },
        { h: 'যাচাই ছাড়া কারো কথায় টাকা নয়' },
        { list: ['অর্ডারের আগে পুরো টাকা ছাড়া কাউকে অতিরিক্ত টাকা পাঠাবেন না', '"অফার শুধু আজকেই, এখনই টাকা পাঠান" — এমন চাপ দিলে থামুন, ওটা প্রতারণার লক্ষণ', 'সন্দেহ হলে অর্ডার না করে আগে আমাদের WhatsApp সাপোর্টে যাচাই করুন'] },
        { p: 'মনে রাখুন: Hub Cart-এর একমাত্র অফিসিয়াল WhatsApp নম্বর সাইটের পেজগুলোতেই দেওয়া আছে। এর বাইরে কোনো নম্বর থেকে Hub Cart-এর নামে যোগাযোগ এলে সতর্ক থাকুন।' },
      ],
      en: [
        { p: 'A little care while sending money online keeps it fully safe. Follow these rules.' },
        { h: 'Pay only to the official number' },
        { p: 'Always pay to the number shown on Hub Cart\'s payment page. If someone sends you a different number in a chat, do not pay there — our team never shares separate personal numbers.' },
        { h: 'Keep your TrxID exact' },
        { p: 'After paying you receive a Transaction ID (TrxID). Enter exactly that ID in your order. The same TrxID cannot be used for two orders — our system automatically flags duplicate TrxIDs.' },
        { h: 'Never pay on pressure' },
        { list: ['Do not send anyone extra money beyond your order total', '"Offer ends today, pay right now" — pressure like this is a scam sign; stop and verify', 'In doubt, skip the order and check with our WhatsApp support first'] },
        { p: 'Remember: Hub Cart\'s only official WhatsApp number is the one shown across this site. Treat any other number claiming to be Hub Cart with caution.' },
      ],
    },
  },
  {
    slug: 'after-order',
    mins: 3,
    title: { bn: 'অর্ডারের পর: ডেলিভারি ও ট্র্যাকিং', en: 'After You Order: Delivery & Tracking' },
    excerpt: {
      bn: 'অর্ডার ট্র্যাক করা, ডেলিভারি পাওয়া আর সমস্যা হলে কী করবেন।',
      en: 'Tracking your order, receiving delivery, and what to do if something goes wrong.',
    },
    body: {
      bn: [
        { p: 'অর্ডার করার পর প্রতিটা ধাপ আপনি নিজেই দেখতে পারবেন — কোথাও ফোন করার দরকার নেই।' },
        { h: 'অর্ডার ট্র্যাক করুন' },
        { p: 'সাইটের Orders (ট্র্যাক) পেজে আপনার WhatsApp নম্বর বা Order ID (যেমন HC-1234) লিখলেই অর্ডারের বর্তমান অবস্থা দেখতে পাবেন — Pending, Confirmed, Completed নাকি Cancelled।' },
        { h: 'ডেলিভারি কোথায় পাবেন' },
        { p: 'অর্ডার Completed হলে ডেলিভারির বিবরণ (অ্যাকাউন্ট/কোড/লিংক) দুইভাবে পাবেন: WhatsApp-এ মেসেজ আকারে, আর ট্র্যাক পেজে "Your Delivery" বাক্সে। তাই ট্র্যাক পেজটা বুকমার্ক করে রাখুন।' },
        { h: 'দেরি হলে বা সমস্যা হলে' },
        { list: ['প্রথমে ট্র্যাক পেজে স্ট্যাটাসটা দেখুন', 'তারপর আমাদের WhatsApp সাপোর্টে Order ID সহ মেসেজ করুন — উত্তর সবচেয়ে দ্রুত পাবেন', 'পেমেন্টের TrxID আর স্ক্রিনশট হাতের কাছে রাখুন'] },
        { h: 'মেয়াদ শেষ হলে রিনিউ' },
        { p: 'সাবস্ক্রিপশন সার্ভিসের মেয়াদ শেষের দিকে এলে একই প্রোডাক্ট আবার অর্ডার করলেই রিনিউ হয়ে যাবে। পুরনো কাস্টমারদের জন্য VIP ছাড়ের সুবিধাও আছে — প্রতি ৩টি সম্পূর্ণ অর্ডারে পরের অর্ডারে ৫% ছাড়।' },
      ],
      en: [
        { p: 'After ordering, you can follow every step yourself — no phone calls needed.' },
        { h: 'Track your order' },
        { p: 'On the Orders (Track) page, enter your WhatsApp number or Order ID (e.g. HC-1234) to see the current status — Pending, Confirmed, Completed or Cancelled.' },
        { h: 'Where delivery arrives' },
        { p: 'When an order is Completed, delivery details (account/code/link) reach you two ways: as a WhatsApp message, and in the "Your Delivery" box on the track page. Bookmark the track page for later.' },
        { h: 'If it is late or something is wrong' },
        { list: ['First check the status on the track page', 'Then message our WhatsApp support with your Order ID — that gets the fastest reply', 'Keep your payment TrxID and screenshot handy'] },
        { h: 'Renewing a subscription' },
        { p: 'When a subscription nears its end, simply order the same product again to renew. Loyal customers also get the VIP perk — every 3 completed orders earn 5% off the next one.' },
      ],
    },
  },
];
