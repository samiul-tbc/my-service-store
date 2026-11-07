import PolicyPage from '../../components/PolicyPage';

export const metadata = { title: 'Terms of Service — Hub Cart' };

const bn = {
  title: 'Terms of Service',
  subtitle: 'Hub Cart ব্যবহারের শর্তাবলি',
  updated: 'November 2026',
  sections: [
    {
      h: 'সার্ভিস সম্পর্কে',
      body: [
        'Hub Cart একটি ডিজিটাল সার্ভিস স্টোর। এখানে বিক্রিত সব পণ্যই ডিজিটাল — কোনো ফিজিক্যাল পণ্য ডেলিভারি করা হয় না। প্রতিটি পণ্যের পেজে ডেলিভারি সময় ও বিবরণ দেওয়া থাকে।',
      ],
    },
    {
      h: 'অর্ডার ও পেমেন্ট',
      body: [
        'অর্ডার কনফার্ম করার আগে পণ্যের নাম, প্যাকেজ ও দাম যাচাই করে নিন। ভুল তথ্য (বিশেষ করে WhatsApp নম্বর) দিলে ডেলিভারি বিলম্ব বা ব্যর্থ হতে পারে, যার দায়িত্ব ক্রেতার।',
        'অর্ডার সম্পন্ন বলে গণ্য হবে যখন পেমেন্ট নিশ্চিত হয়ে সার্ভিসটি আপনার দেওয়া নম্বর/অ্যাকাউন্টে ডেলিভারি দেওয়া হবে।',
      ],
    },
    {
      h: 'ব্যবহারের নিয়ম',
      body: [
        'কেনা সার্ভিস অন্যের সাথে শেয়ার, পুনঃবিক্রি বা অপব্যবহার করা যাবে না, যদি না পণ্যের বিবরণে অন্যভাবে বলা থাকে। নিয়ম ভঙ্গ হলে ওয়ারেন্টি/সাপোর্ট বাতিল হতে পারে।',
      ],
    },
    {
      h: 'শর্ত পরিবর্তন',
      body: [
        'আমরা প্রয়োজনে এই শর্তাবলি হালনাগাদ করতে পারি। পরিবর্তন এই পেজেই প্রকাশ করা হবে এবং প্রকাশের পর থেকে কার্যকর হবে।',
      ],
    },
  ],
};

const en = {
  title: 'Terms of Service',
  subtitle: 'Conditions for using Hub Cart',
  updated: 'November 2026',
  sections: [
    {
      h: 'About the service',
      body: [
        'Hub Cart is a digital services store. Everything sold here is digital — no physical products are delivered. Each product page states its delivery time and details.',
      ],
    },
    {
      h: 'Orders & payment',
      body: [
        'Please verify the product name, package, and price before confirming your order. If you provide incorrect information (especially your WhatsApp number), delivery may be delayed or fail, which is the buyer\u2019s responsibility.',
        'An order is considered complete when payment is confirmed and the service has been delivered to the number/account you provided.',
      ],
    },
    {
      h: 'Usage rules',
      body: [
        'A purchased service may not be shared with others, resold, or misused, unless the product description states otherwise. Violating the rules may void your warranty/support.',
      ],
    },
    {
      h: 'Changes to these terms',
      body: [
        'We may update these terms when needed. Changes will be published on this page and take effect from the time of publication.',
      ],
    },
  ],
};

export default function TermsPage() {
  return <PolicyPage bn={bn} en={en} />;
}
