import PolicyPage from '../../components/PolicyPage';

export const metadata = { title: 'Privacy Policy — Hub Cart' };

const bn = {
  title: 'Privacy Policy',
  subtitle: 'আপনার তথ্য আমরা কীভাবে ব্যবহার করি',
  updated: 'November 2026',
  sections: [
    {
      h: 'আমরা কোন তথ্য সংগ্রহ করি',
      body: [
        'অর্ডার করার সময় আমরা আপনার নাম, WhatsApp নম্বর, এবং (যদি দেন) Telegram ইউজারনেম সংগ্রহ করি। অ্যাকাউন্ট তৈরি করলে আপনার ইমেইল ঠিকানাও সংরক্ষিত হয়।',
        'এই তথ্য শুধুমাত্র আপনার অর্ডার সম্পন্ন করা, ডেলিভারি দেওয়া এবং সাপোর্ট দেওয়ার কাজে ব্যবহার হয়।',
      ],
    },
    {
      h: 'তথ্য কারো সাথে শেয়ার করা হয় না',
      body: [
        'আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা ভাড়া দিই না। অর্ডার প্রসেসিংয়ের জন্য প্রয়োজনীয় সার্ভিস (যেমন পেমেন্ট ও ডাটাবেস প্রোভাইডার) ছাড়া কেউ আপনার তথ্যে অ্যাক্সেস পায় না।',
      ],
    },
    {
      h: 'তথ্য সুরক্ষা',
      body: [
        'আপনার পাসওয়ার্ড এনক্রিপ্টেড (হ্যাশ) আকারে সংরক্ষিত হয় — আমরা আপনার আসল পাসওয়ার্ড দেখতে পাই না। তবুও অনলাইনে কোনো সিস্টেমই ১০০% ঝুঁকিমুক্ত নয়, তাই শক্তিশালী পাসওয়ার্ড ব্যবহারের পরামর্শ দিই।',
      ],
    },
    {
      h: 'আপনার অধিকার',
      body: [
        'আপনি যেকোনো সময় WhatsApp Support-এ মেসেজ করে আপনার তথ্য সংশোধন বা মুছে ফেলার অনুরোধ করতে পারেন। আমরা যুক্তিসংগত সময়ের মধ্যে ব্যবস্থা নেব।',
      ],
    },
  ],
};

const en = {
  title: 'Privacy Policy',
  subtitle: 'How we use your information',
  updated: 'November 2026',
  sections: [
    {
      h: 'What information we collect',
      body: [
        'When you order, we collect your name, WhatsApp number, and (if you provide it) your Telegram username. If you create an account, your email address is also stored.',
        'This information is used only to complete your order, deliver your service, and provide support.',
      ],
    },
    {
      h: 'We do not share your information',
      body: [
        'We never sell or rent your personal information to third parties. No one outside the services required to process your order (such as payment and database providers) can access your information.',
      ],
    },
    {
      h: 'Data security',
      body: [
        'Your password is stored in encrypted (hashed) form — we cannot see your actual password. Still, no online system is 100% risk-free, so we recommend using a strong password.',
      ],
    },
    {
      h: 'Your rights',
      body: [
        'You can message WhatsApp Support at any time to request a correction or deletion of your information. We will act within a reasonable time.',
      ],
    },
  ],
};

export default function PrivacyPage() {
  return <PolicyPage bn={bn} en={en} />;
}
