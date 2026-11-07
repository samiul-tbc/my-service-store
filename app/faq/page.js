import PolicyPage from '../../components/PolicyPage';

export const metadata = { title: 'FAQ — Hub Cart' };

const bn = {
  title: 'FAQ',
  subtitle: 'সাধারণ প্রশ্নের উত্তর',
  updated: '',
  sections: [
    {
      h: 'কীভাবে অর্ডার করব?',
      body: [
        'পছন্দের সার্ভিসের পেজে গিয়ে Buy Now চাপুন, আপনার নাম ও WhatsApp নম্বর দিন, তারপর অর্ডার কনফার্ম করুন। পরবর্তী ধাপের নির্দেশনা WhatsApp-এ জানিয়ে দেওয়া হবে।',
      ],
    },
    {
      h: 'ডেলিভারি পেতে কতক্ষণ লাগবে?',
      body: [
        'প্রতিটি পণ্যের পেজে আনুমানিক ডেলিভারি সময় লেখা থাকে। বেশিরভাগ ডিজিটাল সার্ভিস পেমেন্ট নিশ্চিত হওয়ার পর দ্রুতই ডেলিভারি দেওয়া হয়; কোনো সার্ভিসে বেশি সময় লাগলে তা পণ্যের বিবরণেই উল্লেখ থাকে।',
      ],
    },
    {
      h: 'অর্ডার ট্র্যাক করব কীভাবে?',
      body: [
        'নিচের নেভিগেশনের Orders অংশে অথবা Track Order পেজে আপনার ফোন নম্বর বা Order ID (যেমন HC-XXXX) দিলেই অর্ডারের বর্তমান অবস্থা দেখতে পাবেন — অ্যাকাউন্ট খোলার দরকার নেই।',
      ],
    },
    {
      h: 'পেমেন্ট কীভাবে করব?',
      body: [
        'অর্ডারের সময় উপলব্ধ পেমেন্ট অপশনগুলো (bKash, Nagad, Rocket, Upay, Crypto ইত্যাদি — যেগুলো চালু আছে) দেখানো ও বেছে নেওয়া যাবে। কোনো অপশন নিয়ে সন্দেহ থাকলে পেমেন্টের আগে WhatsApp Support-এ জিজ্ঞেস করুন।',
      ],
    },
    {
      h: 'সমস্যা হলে কোথায় যোগাযোগ করব?',
      body: [
        'ফুটারের WhatsApp Support লিংক থেকে মেসেজ করুন। দ্রুত সমাধানের জন্য আপনার Order ID-টা প্রথম মেসেজেই লিখে দিন। রিফান্ড সংক্রান্ত বিষয়ে Refund Policy পেজটি দেখুন।',
      ],
    },
  ],
};

const en = {
  title: 'FAQ',
  subtitle: 'Answers to common questions',
  updated: '',
  sections: [
    {
      h: 'How do I order?',
      body: [
        'Go to your chosen service\u2019s page, tap Buy Now, enter your name and WhatsApp number, then confirm the order. Next-step instructions will be sent on WhatsApp.',
      ],
    },
    {
      h: 'How long does delivery take?',
      body: [
        'Each product page states an estimated delivery time. Most digital services are delivered quickly after payment is confirmed; if a service takes longer, it is mentioned in the product description.',
      ],
    },
    {
      h: 'How do I track my order?',
      body: [
        'In the Orders section of the bottom navigation, or on the Track Order page, enter your phone number or Order ID (e.g. HC-XXXX) to see your order\u2019s current status — no account needed.',
      ],
    },
    {
      h: 'How do I pay?',
      body: [
        'During ordering you can see and choose from the available payment options (bKash, Nagad, Rocket, Upay, Crypto, etc. — whichever are enabled). If you are unsure about an option, ask WhatsApp Support before paying.',
      ],
    },
    {
      h: 'Where do I contact you if there is a problem?',
      body: [
        'Message us from the WhatsApp Support link in the footer. For a faster solution, include your Order ID in your first message. For refunds, see the Refund Policy page.',
      ],
    },
  ],
};

export default function FaqPage() {
  return <PolicyPage bn={bn} en={en} />;
}
