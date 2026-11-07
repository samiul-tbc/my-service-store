import PolicyPage from '../../components/PolicyPage';

export const metadata = { title: 'Refund Policy — Hub Cart' };

const bn = {
  title: 'Refund Policy',
  subtitle: 'কখন রিফান্ড পাবেন, কখন নয়',
  updated: 'November 2026',
  sections: [
    {
      h: 'রিফান্ড পাবেন যেসব ক্ষেত্রে',
      body: [
        '১) পেমেন্ট নেওয়ার পরও নির্ধারিত সময়ে সার্ভিস ডেলিভারি দেওয়া সম্ভব না হলে।',
        '২) বিবরণে যা বলা হয়েছিল তার থেকে সম্পূর্ণ ভিন্ন সার্ভিস ডেলিভারি হলে এবং আমরা তা ঠিক করে দিতে না পারলে।',
        '৩) একই অর্ডারের জন্য ভুলবশত দ্বিগুণ পেমেন্ট কেটে গেলে (অতিরিক্ত অংশ)।',
      ],
    },
    {
      h: 'রিফান্ড পাবেন না যেসব ক্ষেত্রে',
      body: [
        '১) সার্ভিস সঠিকভাবে ডেলিভারি হয়ে যাওয়ার পর শুধু মত পরিবর্তনের কারণে।',
        '২) ক্রেতার দেওয়া ভুল নম্বর/তথ্যের কারণে ডেলিভারি ব্যর্থ হলে (তবে আমরা যুক্তিসংগতভাবে পুনরায় ডেলিভারির চেষ্টা করব)।',
        '৩) পণ্যের বিবরণে উল্লিখিত সতর্কতা (যেমন ডিভাইস কম্প্যাটিবিলিটি) অগ্রাহ্য করে কেনার পর সমস্যা হলে।',
      ],
    },
    {
      h: 'রিফান্ড চাইবেন যেভাবে',
      body: [
        'WhatsApp Support-এ আপনার Order ID দিয়ে মেসেজ করুন। যাচাই শেষে অনুমোদিত রিফান্ড একই পেমেন্ট মাধ্যমে ফেরত দেওয়া হবে — সাধারণত ৩–৭ কর্মদিবসের মধ্যে, পেমেন্ট প্রোভাইডারের প্রসেসিং সময় অনুযায়ী।',
      ],
    },
  ],
};

const en = {
  title: 'Refund Policy',
  subtitle: 'When you will — and will not — get a refund',
  updated: 'November 2026',
  sections: [
    {
      h: 'Cases where you WILL get a refund',
      body: [
        '1) We are unable to deliver the service within the stated time after taking payment.',
        '2) A completely different service from the description was delivered, and we cannot fix it.',
        '3) You were charged twice for the same order by mistake (the extra amount).',
      ],
    },
    {
      h: 'Cases where you will NOT get a refund',
      body: [
        '1) The service was delivered correctly and you simply changed your mind.',
        '2) Delivery failed because of a wrong number/information provided by the buyer (we will still reasonably try to re-deliver).',
        '3) Problems resulting from ignoring warnings stated in the product description (such as device compatibility).',
      ],
    },
    {
      h: 'How to request a refund',
      body: [
        'Message WhatsApp Support with your Order ID. After verification, approved refunds are returned through the same payment method — usually within 3–7 working days, depending on the payment provider\u2019s processing time.',
      ],
    },
  ],
};

export default function RefundPage() {
  return <PolicyPage bn={bn} en={en} />;
}
