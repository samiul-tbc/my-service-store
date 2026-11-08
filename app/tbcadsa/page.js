'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = '/logo-icon.png';

const CATEGORIES = [
 { id: 'android-root', name: 'Android Root' },
 { id: 'android-panel', name: 'Android Panel' },
 { id: 'social-package', name: 'Social Boost' },
 { id: 'subscriptions', name: 'VIP Subs' },
 { id: 'e-service', name: 'E-Service' },
 { id: 'birthday', name: 'Birthday Card' },
];

const QUICK_TEMPLATES = [
 {
 label: ' Login / Key Access',
 text: ' আপনার সার্ভিসের লগইন বিবরণ:\nইউজার/কী: \nপাসওয়ার্ড: \nডাউনলোড লিংক: ',
 },
 {
 label: ' Root সম্পন্ন',
 text: ' আপনার ডিভাইসের রুট সফলভাবে সম্পন্ন করা হয়েছে। রুট চেকার অ্যাপ দিয়ে স্ট্যাটাস নিশ্চিত করে নিন।',
 },
 {
 label: ' VIP Subscription',
 text: ' আপনার ভিআইপি সাবস্ক্রিপশন চালু হয়েছে। মেয়াদের শেষ তারিখ পর্যন্ত যেকোনো সাপোর্টে মেসেজ দিন।',
 },
 {
 label: ' অতিরিক্ত তথ্য প্রয়োজন',
 text: 'হ্যালো, আপনার অর্ডারটি প্রসেস করতে কিছু অতিরিক্ত তথ্য প্রয়োজন। দয়া করে এই মেসেজে রিপ্লাই দিন।',
 },
];

export default function SecretAdminPage() {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [pinInput, setPinInput] = useState('');
 const [pinError, setPinError] = useState(false);
 const [verifying, setVerifying] = useState(false);

 const [activeTab, setActiveTab] = useState('orders');

 // নোটিশ স্টেট
 const [noticeText, setNoticeText] = useState('');
 const [savingNotice, setSavingNotice] = useState(false);

 // প্রোডাক্ট স্টেট
 const [products, setProducts] = useState([]);
 const [loadingProducts, setLoadingProducts] = useState(false);
 const [editingProduct, setEditingProduct] = useState(null);

 // অর্ডার স্টেট
 const [orders, setOrders] = useState([]);
 const [reviewsByProduct, setReviewsByProduct] = useState([]);
 const [loadingReviews, setLoadingReviews] = useState(false);
 const [copiedTrxId, setCopiedTrxId] = useState(null);
 const [autodeliveryConfigs, setAutodeliveryConfigs] = useState({});
 const [adModalProduct, setAdModalProduct] = useState(null);
 const [adMode, setAdMode] = useState('off');
 const [adText, setAdText] = useState('');
 const [savingAd, setSavingAd] = useState(false);
 const [coupons, setCoupons] = useState([]);
 const [statusNotify, setStatusNotify] = useState(null);
 const [productFlags, setProductFlags] = useState({});
 const [searchLog, setSearchLog] = useState(null);
 const [tgTestState, setTgTestState] = useState('');
 const [custSearch, setCustSearch] = useState('');
 const [newCoupon, setNewCoupon] = useState({ code: '', type: 'pct', value: '', min: '' });
 const [savingOffers, setSavingOffers] = useState(false);

 const [adDeliveryHint, setAdDeliveryHint] = useState('');
 const [adStockLine, setAdStockLine] = useState(null);
 const [adProductId, setAdProductId] = useState(null);
 const [loadingOrders, setLoadingOrders] = useState(false);
 const previousOrderCount = useRef(0);

 // ফিল্টার ও সার্চ স্টেট
 const [searchQuery, setSearchQuery] = useState('');
 const [statusFilter, setStatusFilter] = useState('all');
 const [methodFilter, setMethodFilter] = useState('all');

 // WhatsApp ডেলিভারি মডাল
 const [deliveryModalOrder, setDeliveryModalOrder] = useState(null);
 const [deliveryExtraNote, setDeliveryExtraNote] = useState('');

 // নতুন প্রোডাক্ট ইনপুট স্টেট
 const [title, setTitle] = useState('');
 const [category, setCategory] = useState('android-root');
 const [uploadMode, setUploadMode] = useState('file');
 const [imageUrl, setImageUrl] = useState('');
 const [imageFile, setImageFile] = useState(null);
 const [imagePreview, setImagePreview] = useState('');
 const [description, setDescription] = useState('');
 const [price, setPrice] = useState('');
 const [originalPrice, setOriginalPrice] = useState('');
 const [submitting, setSubmitting] = useState(false);

 // ১. বিপ সাউন্ড
 const playAlertSound = () => {
 try {
 const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
 const osc = audioCtx.createOscillator();
 const gain = audioCtx.createGain();
 osc.connect(gain);
 gain.connect(audioCtx.destination);
 osc.type = 'sine';
 osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
 osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
 gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
 osc.start();
 osc.stop(audioCtx.currentTime + 0.35);
 } catch (e) {
 console.error('Audio error:', e);
 }
 };

 // ২. সেশন রিস্টোর
 useEffect(() => {
 const savedPin = sessionStorage.getItem('hubcart_admin_pin');
 if (savedPin) {
 setPinInput(savedPin);
 validatePin(savedPin, false);
 }
 }, []);

 // ৩. রিয়েল-টাইম অর্ডার অটো-পোলিং
 useEffect(() => {
 if (!isAuthenticated) return;
 const interval = setInterval(() => {
 fetchOrders(pinInput, true);
 }, 25000);
 return () => clearInterval(interval);
 }, [isAuthenticated, pinInput]);

 const validatePin = async (pinToTest, showAlert = true) => {
 setPinError(false);
 setVerifying(true);

 try {
 const res = await fetch('/api/verify-pin', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ pin: pinToTest }),
 });

 const data = await res.json();

 if (res.ok && data.success) {
 setIsAuthenticated(true);
 sessionStorage.setItem('hubcart_admin_pin', pinToTest);
 loadAllData(pinToTest);
 } else {
 setPinError(true);
 if (showAlert) alert('ভুল পিন কোড!');
 }
 } catch (err) {
 if (showAlert) alert('সার্ভার ভেরিফিকেশন এরর!');
 } finally {
 setVerifying(false);
 }
 };

 const handlePinSubmit = (e) => {
 e.preventDefault();
 validatePin(pinInput, true);
 };

 const handleLogout = () => {
 if (confirm('অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?')) {
 sessionStorage.removeItem('hubcart_admin_pin');
 setIsAuthenticated(false);
 setPinInput('');
 }
 };

 const loadAllData = (pin) => {
 fetchOrders(pin);
 fetchProducts(pin);
 fetchNotice(pin);
 fetchReviews(pin);
 fetchAutodelivery(pin);
 fetchOffers(pin);
 };

 const fetchOrders = async (pin = pinInput, isSilent = false) => {
 if (!isSilent) setLoadingOrders(true);
 try {
 const res = await fetch('/api/admin?type=orders', {
 headers: { 'x-admin-pin': pin },
 });
 const data = await res.json();
 if (Array.isArray(data)) {
 if (previousOrderCount.current > 0 && data.length > previousOrderCount.current) {
 playAlertSound();
 }
 previousOrderCount.current = data.length;
 setOrders(data);
 }
 } catch (err) {
 console.error(err);
 } finally {
 if (!isSilent) setLoadingOrders(false);
 }
 };

 const fetchProducts = async (pin = pinInput) => {
 setLoadingProducts(true);
 try {
 const res = await fetch('/api/admin?type=products', {
 headers: { 'x-admin-pin': pin },
 });
 const data = await res.json();
 if (Array.isArray(data)) setProducts(data);
 } catch (err) {
 console.error(err);
 } finally {
 setLoadingProducts(false);
 }
 };

 const fetchNotice = async (pin = pinInput) => {
 try {
 const res = await fetch('/api/admin?type=notice', {
 headers: { 'x-admin-pin': pin },
 });
 const data = await res.json();
 if (Array.isArray(data) && data.length > 0) setNoticeText(data[0].value);
 } catch (err) {
 console.error(err);
 }
 };

 const fetchReviews = async (pin = pinInput) => {
 setLoadingReviews(true);
 try {
 const res = await fetch('/api/admin?type=reviews', {
 headers: { 'x-admin-pin': pin },
 });
 const data = await res.json();
 if (data && Array.isArray(data.groups)) setReviewsByProduct(data.groups);
 } catch (err) {
 console.error(err);
 } finally {
 setLoadingReviews(false);
 }
 };

 const handleDeleteReview = async (productId, index, reviewerName) => {
 if (!confirm(`"${reviewerName}"-এর রিভিউটি ডিলিট করবেন?`)) return;
 try {
 const pin = sessionStorage.getItem('hubcart_admin_pin') || pinInput;
 const res = await fetch(`/api/admin?type=review&productId=${productId}&index=${index}`, {
 method: 'DELETE',
 headers: { 'x-admin-pin': pin },
 });
 const data = await res.json();
 if (data.success) {
 setReviewsByProduct((prev) =>
 prev.map((g) =>
 g.productId === productId
 ? { ...g, reviews: g.reviews.filter((_, i) => i !== index) }
 : g
 )
 );
 } else {
 alert('রিভিউ ডিলিট করা যায়নি!');
 }
 } catch (err) {
 alert('নেটওয়ার্ক সমস্যা!');
 }
 };

 const handleCopyTrx = async (trxId, orderDbId) => {
 try {
 await navigator.clipboard.writeText(String(trxId || ''));
 setCopiedTrxId(orderDbId);
 setTimeout(() => setCopiedTrxId(null), 1500);
 } catch (e) { console.error(e); }
 };

 const trxCount = (trx) => {
 const k = String(trx || '').trim().toUpperCase();
 if (!k || k === 'N/A') return 0;
 return orders.filter((o) => String(o.trx_id || '').trim().toUpperCase() === k).length;
 };

 const handleExportCSV = () => {
 const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
 const rows = [
 ['Order ID', 'Date', 'Service', 'Customer', 'WhatsApp', 'Payment Method', 'TrxID', 'Price (BDT)', 'Status'].join(','),
 ...filteredOrders.map((o) => [
 esc(o.order_id), esc(o.created_at ? new Date(o.created_at).toLocaleString('en-GB') : ''),
 esc(o.service_name), esc(o.customer_name), esc(o.whatsapp_number),
 esc(o.payment_method), esc(o.trx_id), esc(o.price), esc(o.status || 'pending'),
 ].join(',')),
 ];
 const blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = 'hubcart-orders.csv';
 a.click();
 URL.revokeObjectURL(url);
 };

 const fetchAutodelivery = async (pin = pinInput) => {
 try {
 const res = await fetch('/api/admin?type=autodelivery', {
 headers: { 'x-admin-pin': pin },
 });
 const data = await res.json();
 if (data && data.configs) setAutodeliveryConfigs(data.configs);
 } catch (err) { console.error(err); }
 };

 useEffect(() => {
 if (activeTab === 'products') {
 fetchProductFlags();
 (async () => {
 try {
 const res = await fetch('/api/admin?type=search-log', { headers: { 'x-admin-pin': pinInput } });
 const data = await res.json();
 if (data && Array.isArray(data.items)) setSearchLog(data);
 } catch {}
 })();
 }
 }, [activeTab]);

 const fetchOffers = async (pin = pinInput) => {
 try {
 const res = await fetch('/api/admin?type=offers', {
 headers: { 'x-admin-pin': pin },
 });
 const data = await res.json();
 if (data && Array.isArray(data.coupons)) setCoupons(data.coupons);
 } catch (err) { console.error(err); }
 };

 const fetchProductFlags = async (pin = pinInput) => {
 try {
 const res = await fetch('/api/admin?type=product-flags', { headers: { 'x-admin-pin': pin } });
 const data = await res.json();
 if (data && data.flags) setProductFlags(data.flags);
 } catch {}
 };

 const handleToggleFlag = async (prod, flag) => {
 const current = productFlags[prod.id] || {};
 const currentValue = flag === 'published' ? current.published !== false : !!current.featured;
 const next = { ...current, published: current.published !== false, featured: !!current.featured, [flag]: !currentValue };
 setProductFlags((prev) => ({ ...prev, [prod.id]: next }));
 try {
 const data = await postAdmin('set-product-flag', { productId: prod.id, flag, value: !currentValue });
 if (data && data.flags) setProductFlags(data.flags);
 else { alert('সেভ হয়নি! আবার চেষ্টা করুন।'); fetchProductFlags(); }
 } catch { alert('নেটওয়ার্ক সমস্যা!'); fetchProductFlags(); }
 };

 const handleSaveCoupons = async (list) => {
 setSavingOffers(true);
 try {
 const data = await postAdmin('save-coupons', list);
 if (data && data.success) { setCoupons(data.coupons); alert('কুপন সেভ হয়েছে!'); }
 else alert('কুপন সেভ হয়নি!');
 } catch (e) { alert('নেটওয়ার্ক সমস্যা!'); }
 finally { setSavingOffers(false); }
 };

 const handleTestTelegram = async () => {
 setTgTestState('loading');
 try {
 const data = await postAdmin('test-telegram', {});
 if (data && data.ok) setTgTestState('ok');
 else if (data && data.error === 'env_missing') setTgTestState('env');
 else setTgTestState('fail');
 } catch { setTgTestState('fail'); }
 };

 const handleAddCoupon = () => {
 const code = newCoupon.code.trim().toUpperCase();
 const value = Number(newCoupon.value);
 if (!code || !value || value <= 0) { alert('কোড ও সঠিক মান দিন'); return; }
 if (coupons.some((c) => c.code === code)) { alert('এই কোড আগেই আছে'); return; }
 const list = [...coupons, { code, type: newCoupon.type, value, min: Number(newCoupon.min) || 0, active: true }];
 setNewCoupon({ code: '', type: 'pct', value: '', min: '' });
 handleSaveCoupons(list);
 };


 const postAdmin = async (action, payload) => {
 const pin = sessionStorage.getItem('hubcart_admin_pin') || pinInput;
 const res = await fetch('/api/admin', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
 body: JSON.stringify({ action, payload }),
 });
 return res.json();
 };

 const openAdModal = (prod) => {
 const cfg = autodeliveryConfigs[prod.id] || {};
 setAdMode(cfg.mode || 'off');
 setAdText(cfg.mode === 'stock' ? (cfg.stock || []).join('\n') : (cfg.fixedText || ''));
 setAdModalProduct(prod);
 };

 const handleSaveAutodelivery = async () => {
 if (!adModalProduct) return;
 setSavingAd(true);
 try {
 const prev = autodeliveryConfigs[adModalProduct.id] || {};
 let config;
 if (adMode === 'fixed') config = { ...prev, mode: 'fixed', fixedText: adText };
 else if (adMode === 'stock') config = { ...prev, mode: 'stock', stock: adText.split('\n').map((x) => x.trim()).filter(Boolean) };
 else config = { ...prev, mode: 'off' };
 const data = await postAdmin('save-autodelivery', { productId: adModalProduct.id, config });
 if (data.success) {
 setAutodeliveryConfigs((p) => ({ ...p, [adModalProduct.id]: config }));
 setAdModalProduct(null);
 } else {
 alert('সেভ করা যায়নি!');
 }
 } catch (err) {
 alert('নেটওয়ার্ক সমস্যা!');
 } finally {
 setSavingAd(false);
 }
 };

 const openDeliveryModal = (ord) => {
 setDeliveryModalOrder(ord);
 setDeliveryExtraNote('');
 setAdStockLine(null);
 setAdProductId(null);
 setAdDeliveryHint('');
 const prod = products.find((p) => p.title === ord.service_name);
 if (!prod) return;
 const cfg = autodeliveryConfigs[prod.id];
 if (!cfg || !cfg.mode || cfg.mode === 'off') return;
 if (cfg.mode === 'fixed' && cfg.fixedText) {
 setDeliveryExtraNote(cfg.fixedText);
 setAdDeliveryHint(' Auto-Delivery (Fixed) থেকে তথ্য ভরা হয়েছে — চাইলে বদলে নিতে পারো।');
 } else if (cfg.mode === 'stock') {
 const used = cfg.used || [];
 const next = (cfg.stock || []).find((l) => !used.includes(l));
 if (next) {
 setDeliveryExtraNote(next);
 setAdStockLine(next);
 setAdProductId(prod.id);
 const remaining = (cfg.stock || []).length - used.length - 1;
 setAdDeliveryHint(` Auto-Delivery স্টক থেকে নেওয়া হয়েছে — পাঠানোর পর স্টকে বাকি থাকবে ${remaining}টি।`);
 } else {
 setAdDeliveryHint(' এই প্রোডাক্টের Auto-Delivery স্টক শেষ! Products ট্যাব থেকে নতুন স্টক যোগ করো।');
 }
 }
 };

 const handleSaveNotice = async (e) => {
 e.preventDefault();
 setSavingNotice(true);
 try {
 const res = await fetch('/api/admin', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'x-admin-pin': pinInput,
 },
 body: JSON.stringify({
 action: 'update-notice',
 payload: noticeText.trim(),
 }),
 });

 if (res.ok) alert(' নোটিশ সফলভাবে আপডেট হয়েছে!');
 else alert('নোটিশ আপডেট ব্যর্থ হয়েছে!');
 } catch (err) {
 alert('নেটওয়ার্ক এরর!');
 } finally {
 setSavingNotice(false);
 }
 };

 const handleUpdateOrderStatus = async (orderDbId, newStatus) => {
 try {
 const res = await fetch('/api/admin', {
 method: 'PATCH',
 headers: {
 'Content-Type': 'application/json',
 'x-admin-pin': pinInput,
 },
 body: JSON.stringify({ orderDbId, status: newStatus }),
 });

 if (res.ok) {
 setOrders((prev) =>
 prev.map((ord) => (ord.id === orderDbId ? { ...ord, status: newStatus } : ord))
 );
 const changed = orders.find((o) => o.id === orderDbId);
 if (changed) setStatusNotify({ ord: changed, status: newStatus });
 } else {
 alert('স্ট্যাটাস আপডেট করা যায়নি!');
 }
 } catch (err) {
 alert('সার্ভার এরর!');
 }
 };

 const handleDeleteOrder = async (orderDbId, orderIdText) => {
 if (!confirm(`আপনি কি নিশ্চিত অর্ডার "${orderIdText}" মুছে ফেলতে চান?`)) return;

 try {
 const res = await fetch(`/api/admin?type=order&id=${orderDbId}`, {
 method: 'DELETE',
 headers: { 'x-admin-pin': pinInput },
 });

 if (res.ok) {
 setOrders((prev) => prev.filter((ord) => ord.id !== orderDbId));
 alert(' অর্ডার ডিলিট সম্পন্ন!');
 } else {
 alert('ডিলিট করা যায়নি!');
 }
 } catch (err) {
 alert('নেটওয়ার্ক সমস্যা!');
 }
 };

 const handleSendWhatsAppDelivery = async () => {
 if (!deliveryModalOrder) return;

 const ord = deliveryModalOrder;
 let digits = String(ord.whatsapp_number || '').replace(/[^0-9]/g, '');
 if (digits.startsWith('0') && digits.length === 11) {
 digits = `88${digits}`;
 } else if (/^1[3-9]\d{8}$/.test(digits)) {
 digits = `880${digits}`;
 }

 const host = typeof window !== 'undefined' ? window.location.origin : 'https://hubcart.vercel.app';
 const invoiceUrl = `${host}/invoice/${ord.order_id}`;

 let message = `প্রিয় ${ord.customer_name || 'গ্রাহক'}! \n\n` +
 `Hub Cart থেকে আপনার অর্ডারটি সফলভাবে ডেলিভারি করা হয়েছে। \n\n` +
 ` সার্ভিস: ${ord.service_name}\n` +
 ` অর্ডার আইডি: ${ord.order_id}\n` +
 ` মূল্য: ৳${ord.price}\n\n` +
 ` ডিজিটাল ক্যাশ মেমো / ইনভয়েস:\n${invoiceUrl}\n\n`;

 if (deliveryExtraNote.trim()) {
 message += ` সার্ভিস বিস্তারিত / এক্সেস তথ্য:\n${deliveryExtraNote.trim()}\n\n`;
 }

 message += `যেকোনো সহায়তায় আমাদের জানান। Hub Cart-এর সাথে থাকার জন্য ধন্যবাদ! `;

 // অটো-ডেলিভারি হিসাব: ডেলিভার্ড কন্টেন্ট সেভ (কাস্টমার ট্র্যাক পেজে দেখতে পাবে) + স্টক ব্যবহৃত চিহ্নিত
 try {
 const note = deliveryExtraNote.trim();
 if (note) {
 await postAdmin('save-delivered', { orderId: ord.order_id, content: note });
 }
 if (adStockLine && adProductId) {
 const cfg = { ...(autodeliveryConfigs[adProductId] || {}) };
 cfg.used = [...(cfg.used || []), adStockLine];
 await postAdmin('save-autodelivery', { productId: adProductId, config: cfg });
 setAutodeliveryConfigs((p) => ({ ...p, [adProductId]: cfg }));
 setAdStockLine(null);
 setAdProductId(null);
 }
 } catch (e) { console.error(e); }

 window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, '_blank');
 handleUpdateOrderStatus(ord.id, 'completed');
 setDeliveryModalOrder(null);
 setDeliveryExtraNote('');
 };

 const compressImage = (file) => {
 return new Promise((resolve, reject) => {
 const blobUrl = URL.createObjectURL(file);
 const img = new Image();

 img.onload = () => {
 URL.revokeObjectURL(blobUrl);
 try {
 const canvas = document.createElement('canvas');
 const MAX_WIDTH = 900;
 let width = img.width;
 let height = img.height;

 if (width > MAX_WIDTH) {
 height = Math.round((height * MAX_WIDTH) / width);
 width = MAX_WIDTH;
 }

 canvas.width = width;
 canvas.height = height;
 const ctx = canvas.getContext('2d');
 ctx.drawImage(img, 0, 0, width, height);
 const webp = canvas.toDataURL('image/webp', 0.82);
 resolve(webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.78));
 } catch (e) {
 reject(new Error('ছবি প্রসেস করা যায়নি'));
 }
 };

 img.onerror = () => {
 URL.revokeObjectURL(blobUrl);
 reject(new Error('ছবি লোড করা যায়নি'));
 };

 img.src = blobUrl;
 });
 };

 const handleFileChange = (e) => {
 const file = e.target.files[0];
 if (file) {
 setImageFile(file);
 setImagePreview(URL.createObjectURL(file));
 }
 };

 const handleAddProduct = async (e) => {
 e.preventDefault();
 setSubmitting(true);

 try {
 let finalImage = '';

 if (uploadMode === 'file') {
 if (!imageFile) {
 alert('অনুগ্রহ করে ছবি নির্বাচন করুন!');
 setSubmitting(false);
 return;
 }
 finalImage = await compressImage(imageFile);
 } else {
 if (!imageUrl.trim()) {
 alert('অনুগ্রহ করে ছবির লিংক দিন!');
 setSubmitting(false);
 return;
 }
 finalImage = imageUrl.trim();
 }

 const res = await fetch('/api/admin', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'x-admin-pin': pinInput,
 },
 body: JSON.stringify({
 action: 'add-product',
 payload: {
 title: title.trim(),
 category,
 image: finalImage,
 description: description.trim() || '',
 price: Number(price),
 original_price: originalPrice ? Number(originalPrice) : null,
 },
 }),
 });

 if (res.ok) {
 alert(' প্রোডাক্ট সফলভাবে যোগ হয়েছে!');
 setTitle('');
 setImageFile(null);
 setImagePreview('');
 setImageUrl('');
 setDescription('');
 setPrice('');
 setOriginalPrice('');
 fetchProducts();
 } else {
 alert('প্রোডাক্ট যোগ করা যায়নি!');
 }
 } catch (err) {
 alert('এরর: ' + err.message);
 } finally {
 setSubmitting(false);
 }
 };

 // প্রোডাক্ট এডিট সেভ (আপডেটেড লজিক)
 const handleSaveProductEdit = async (e) => {
 e.preventDefault();
 if (!editingProduct) return;

 try {
 const res = await fetch('/api/admin', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'x-admin-pin': pinInput,
 },
 body: JSON.stringify({
 action: 'update-product',
 payload: {
 id: editingProduct.id,
 title: editingProduct.title,
 price: Number(editingProduct.price),
 original_price: editingProduct.original_price ? Number(editingProduct.original_price) : null,
 description: editingProduct.description,
 category: editingProduct.category,
 },
 }),
 });

 const data = await res.json();

 if (res.ok && data.success) {
 alert(' প্রোডাক্ট তথ্য আপডেট সম্পন্ন!');
 setProducts((prev) =>
 prev.map((p) => (p.id === editingProduct.id ? { ...p, ...editingProduct } : p))
 );
 setEditingProduct(null);
 fetchProducts(pinInput);
 } else {
 alert(data.error || 'আপডেট করা যায়নি!');
 }
 } catch (err) {
 alert('সার্ভার এরর: ' + err.message);
 }
 };

 const handleDeleteProduct = async (id, prodTitle) => {
 if (!confirm(`আপনি কি নিশ্চিত "${prodTitle}" ডিলিট করতে চান?`)) return;

 try {
 const res = await fetch(`/api/admin?type=product&id=${id}`, {
 method: 'DELETE',
 headers: { 'x-admin-pin': pinInput },
 });

 if (res.ok) {
 setProducts((prev) => prev.filter((p) => p.id !== id));
 } else {
 alert('ডিলিট করা যায়নি!');
 }
 } catch (err) {
 alert('নেটওয়ার্ক সমস্যা!');
 }
 };

 const totalRevenue = orders
 .filter((o) => o.status === 'completed')
 .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

 const todayDateStr = new Date().toDateString();
 const todayRevenue = orders
 .filter((o) => o.status === 'completed' && new Date(o.created_at).toDateString() === todayDateStr)
 .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

 const pendingCount = orders.filter(
 (o) => !o.status || o.status === 'pending' || o.status === 'verifying'
 ).length;

 const completedCount = orders.filter((o) => o.status === 'completed').length;

 const nowD = new Date();
 const monthRevenue = orders
 .filter((o) => o.status === 'completed' && (() => { const d = new Date(o.created_at); return d.getMonth() === nowD.getMonth() && d.getFullYear() === nowD.getFullYear(); })())
 .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

 const last7Days = Array.from({ length: 7 }, (_, i) => {
 const d = new Date();
 d.setDate(d.getDate() - (6 - i));
 const key = d.toDateString();
 const amount = orders
 .filter((o) => o.status === 'completed' && new Date(o.created_at).toDateString() === key)
 .reduce((sum, o) => sum + (Number(o.price) || 0), 0);
 return { label: d.toLocaleDateString('bn-BD', { weekday: 'short' }), amount };
 });
 const maxDayAmount = Math.max(...last7Days.map((d) => d.amount), 1);

 const topProducts = Object.values(
 orders
 .filter((o) => o.status === 'completed')
 .reduce((acc, o) => {
 const name = o.service_name || 'Unknown';
 if (!acc[name]) acc[name] = { name, count: 0, revenue: 0 };
 acc[name].count += 1;
 acc[name].revenue += Number(o.price) || 0;
 return acc;
 }, {})
 ).sort((a, b) => b.count - a.count).slice(0, 5);

 const totalReviewCount = reviewsByProduct.reduce((n, g) => n + g.reviews.length, 0);

 const filteredOrders = orders.filter((ord) => {
 const q = searchQuery.toLowerCase().trim();
 const matchQuery =
 !q ||
 ord.order_id?.toLowerCase().includes(q) ||
 ord.customer_name?.toLowerCase().includes(q) ||
 ord.whatsapp_number?.includes(q) ||
 ord.trx_id?.toLowerCase().includes(q) ||
 ord.service_name?.toLowerCase().includes(q);

 const matchStatus =
 statusFilter === 'all' ||
 (statusFilter === 'pending' && (!ord.status || ord.status === 'pending')) ||
 ord.status?.toLowerCase() === statusFilter;

 const matchMethod =
 methodFilter === 'all' ||
 ord.payment_method?.toLowerCase().includes(methodFilter);

 return matchQuery && matchStatus && matchMethod;
 });

 const inputStyle = {
 width: '100%',
 boxSizing: 'border-box',
 padding: '11px 14px',
 borderRadius: '12px',
 background: 'rgba(30, 41, 59, 0.7)',
 border: '1px solid rgba(255, 255, 255, 0.1)',
 color: '#ffffff',
 fontSize: '13px',
 outline: 'none',
 };

 if (!isAuthenticated) {
 return (
 <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'radial-gradient(ellipse at 50% 30%, rgba(166, 243, 106, 0.08), transparent 55%)' }}>
 <div style={{
 width: '100%',
 maxWidth: '380px',
 background: 'rgba(15, 23, 42, 0.85)',
 backdropFilter: 'blur(16px)',
 borderRadius: '24px',
 border: '1px solid rgba(166, 243, 106, 0.3)',
 padding: '30px 24px',
 textAlign: 'center',
 boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
 }}>
 <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 12px', filter: 'drop-shadow(0 2px 8px rgba(166, 243, 106, 0.4))' }} />
 <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 6px', color: '#f8fafc' }}>Hub Cart Manager</h2>
 <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px' }}>মাস্টার পিন কোড দিয়ে প্রবেশ করুন</p>

 <form onSubmit={handlePinSubmit}>
 <input
 type="password"
 maxLength={10}
 placeholder="••••"
 value={pinInput}
 onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
 style={{
 width: '100%',
 boxSizing: 'border-box',
 padding: '12px',
 textAlign: 'center',
 fontSize: '22px',
 letterSpacing: '8px',
 borderRadius: '12px',
 background: 'rgba(30, 41, 59, 0.8)',
 border: pinError ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
 color: '#ffffff',
 marginBottom: '14px',
 outline: 'none',
 }}
 />
 {pinError && <div style={{ color: '#f87171', fontSize: '12px', marginBottom: '14px' }}>ভুল পিন কোড! পুনরায় চেষ্টা করুন।</div>}
 
 <button
 type="submit"
 disabled={verifying}
 style={{
 width: '100%',
 padding: '12px',
 background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
 color: '#10170c',
 border: 'none',
 borderRadius: '12px',
 fontWeight: 'bold',
 fontSize: '14px',
 cursor: 'pointer',
 boxShadow: '0 4px 14px rgba(166, 243, 106, 0.4)',
 }}
 >
 {verifying ? 'যাচাই করা হচ্ছে...' : 'প্রবেশ করুন →'}
 </button>
 </form>
 <Link href="/" style={{ display: 'inline-block', marginTop: '16px', fontSize: '12px', color: '#94a3b8', textDecoration: 'none', fontWeight: 'bold' }}>← স্টোরে ফিরে যান</Link>
 </div>
 </div>
 );
 }

 return (
 <div style={{ maxWidth: '800px', margin: '14px auto', padding: '0 14px 100px' }}>
 
 {/* হেডার */}
 <div style={{
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 background: 'rgba(15, 23, 42, 0.8)',
 backdropFilter: 'blur(16px)',
 padding: '14px 18px',
 borderRadius: '20px',
 border: '1px solid rgba(255, 255, 255, 0.08)',
 marginBottom: '16px',
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
 <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
 <div>
 <h2 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: '#f8fafc' }}>Hub Cart Manager</h2>
 <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold' }}>● Auto Sync & Protected</span>
 </div>
 </div>

 <div style={{ display: 'flex', gap: '8px' }}>
 <Link
 href="/"
 style={{
 textDecoration: 'none',
 background: 'rgba(30, 41, 59, 0.8)',
 border: '1px solid rgba(255, 255, 255, 0.08)',
 color: '#a6f36a',
 padding: '6px 12px',
 borderRadius: '10px',
 fontSize: '11px',
 fontWeight: 'bold',
 }}
 >
 Live Store ↗
 </Link>
 <button
 onClick={handleLogout}
 style={{
 background: 'rgba(239, 68, 68, 0.15)',
 border: '1px solid rgba(239, 68, 68, 0.3)',
 color: '#f87171',
 padding: '6px 12px',
 borderRadius: '10px',
 fontSize: '11px',
 fontWeight: 'bold',
 cursor: 'pointer',
 }}
 >
 লগআউট
 </button>
 </div>
 </div>

 {/* মেট্রিক্স কার্ড */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '16px' }}>
 <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(166, 243, 106, 0.2)', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
 <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', fontWeight: 'bold' }}>মোট সেলস</span>
 <span style={{ fontSize: '16px', fontWeight: '900', color: '#a6f36a' }}>৳{totalRevenue}</span>
 </div>
 <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
 <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', fontWeight: 'bold' }}>আজকের সেল</span>
 <span style={{ fontSize: '16px', fontWeight: '900', color: '#4ade80' }}>৳{todayRevenue}</span>
 </div>
 <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
 <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', fontWeight: 'bold' }}>পেন্ডিং অর্ডার</span>
 <span style={{ fontSize: '16px', fontWeight: '900', color: '#fbbf24' }}>{pendingCount}</span>
 </div>
 <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
 <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', fontWeight: 'bold' }}>ডেলিভারি সম্পন্ন</span>
 <span style={{ fontSize: '16px', fontWeight: '900', color: '#c084fc' }}>{completedCount}</span>
 </div>
 </div>

 {/* ইনসাইটস: মাসের সেল, ৭ দিনের চার্ট, টপ প্রোডাক্ট */}
 <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '14px 16px', marginBottom: '16px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
 <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc' }}> সেলস ইনসাইটস</span>
 <span style={{ fontSize: '12px', color: '#94a3b8' }}>এই মাসের সেল: <strong style={{ color: '#a6f36a', fontSize: '14px' }}>৳{monthRevenue}</strong></span>
 </div>
 <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '72px', marginBottom: '4px' }}>
 {last7Days.map((d, i) => (
 <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
 <span style={{ fontSize: '9px', color: '#94a3b8' }}>{d.amount > 0 ? `৳${d.amount}` : ''}</span>
 <div style={{ width: '100%', maxWidth: '34px', height: `${Math.max(6, Math.round((d.amount / maxDayAmount) * 44))}px`, background: d.amount > 0 ? 'linear-gradient(180deg, #a6f36a, #4d7c0f)' : 'rgba(255,255,255,0.08)', borderRadius: '6px 6px 3px 3px' }}></div>
 <span style={{ fontSize: '9px', color: '#64748b' }}>{d.label}</span>
 </div>
 ))}
 </div>
 {topProducts.length > 0 && (
 <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '8px' }}>
 <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', display: 'block', marginBottom: '6px' }}> টপ সেলিং প্রোডাক্ট</span>
 {topProducts.map((p, i) => (
 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1', padding: '3px 0' }}>
 <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{i + 1}. {p.name}</span>
 <span>{p.count}টি • <strong style={{ color: '#a6f36a' }}>৳{p.revenue}</strong></span>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* নোটিশ */}
 <div style={{
 background: 'rgba(15, 23, 42, 0.8)',
 backdropFilter: 'blur(16px)',
 border: '1px solid rgba(166, 243, 106, 0.25)',
 borderRadius: '18px',
 padding: '14px 16px',
 marginBottom: '16px',
 }}>
 <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#a6f36a', display: 'block', marginBottom: '8px' }}>
 হোমপেজ নোটিশ ব্যানার
 </span>
 <form onSubmit={handleSaveNotice} style={{ display: 'flex', gap: '8px' }}>
 <input
 type="text"
 placeholder="হোমপেজে নোটিশ টেক্সট লিখুন..."
 value={noticeText}
 onChange={(e) => setNoticeText(e.target.value)}
 style={{ ...inputStyle, flex: 1 }}
 />
 <button
 type="submit"
 disabled={savingNotice}
 style={{
 padding: '10px 16px',
 borderRadius: '12px',
 background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
 color: '#10170c',
 border: 'none',
 fontWeight: 'bold',
 fontSize: '12px',
 cursor: 'pointer',
 whiteSpace: 'nowrap',
 }}
 >
 {savingNotice ? 'সেভ হচ্ছে...' : 'আপডেট'}
 </button>
 </form>
 </div>

 {/* ট্যাব বাটন্স */}
 <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.7)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '16px' }}>
 <button
 type="button"
 onClick={() => setActiveTab('orders')}
 style={{
 flex: 1,
 padding: '10px',
 borderRadius: '12px',
 border: 'none',
 background: activeTab === 'orders' ? 'linear-gradient(135deg, #a6f36a, #d2ffad)' : 'transparent',
 color: activeTab === 'orders' ? '#10170c' : '#94a3b8',
 fontWeight: 'bold',
 fontSize: '13px',
 cursor: 'pointer',
 }}
 >
 লাইভ অর্ডার ({orders.length}){pendingCount > 0 && (
 <span style={{ marginLeft: '6px', background: '#f59e0b', color: '#111', borderRadius: '999px', padding: '1px 7px', fontSize: '11px', fontWeight: '900' }}>{pendingCount} পেন্ডিং</span>
 )}
 </button>
 <button
 type="button"
 onClick={() => setActiveTab('products')}
 style={{
 flex: 1,
 padding: '10px',
 borderRadius: '12px',
 border: 'none',
 background: activeTab === 'products' ? 'linear-gradient(135deg, #a6f36a, #d2ffad)' : 'transparent',
 color: activeTab === 'products' ? '#10170c' : '#94a3b8',
 fontWeight: 'bold',
 fontSize: '13px',
 cursor: 'pointer',
 }}
 >
 প্রোডাক্ট লিস্ট ({products.length})
 </button>
 <button
 type="button"
 onClick={() => setActiveTab('reviews')}
 style={{
 flex: 1,
 padding: '10px',
 borderRadius: '12px',
 border: 'none',
 background: activeTab === 'reviews' ? 'linear-gradient(135deg, #a6f36a, #d2ffad)' : 'transparent',
 color: activeTab === 'reviews' ? '#10170c' : '#94a3b8',
 fontWeight: 'bold',
 fontSize: '13px',
 cursor: 'pointer',
 }}
 >
 রিভিউ ({totalReviewCount})
 </button>
 <button
 type="button"
 onClick={() => setActiveTab('offers')}
 style={{
 flex: 1,
 padding: '10px',
 borderRadius: '12px',
 border: 'none',
 background: activeTab === 'offers' ? 'linear-gradient(135deg, #a6f36a, #d2ffad)' : 'transparent',
 color: activeTab === 'offers' ? '#10170c' : '#94a3b8',
 fontWeight: 'bold',
 fontSize: '13px',
 cursor: 'pointer',
 }}
 >
 অফার / কুপন
 </button>
 <button
 onClick={() => setActiveTab('customers')}
 style={{
 padding: '10px',
 borderRadius: '12px',
 border: 'none',
 background: activeTab === 'customers' ? 'linear-gradient(135deg, #a6f36a, #d2ffad)' : 'transparent',
 color: activeTab === 'customers' ? '#10170c' : '#94a3b8',
 fontWeight: 'bold',
 fontSize: '13px',
 cursor: 'pointer',
 }}
 >
 কাস্টমার
 </button>
 </div>

 {/* অফার / কুপন ট্যাব */}
 {activeTab === 'offers' && (
 <div>
 <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '14px' }}>
 <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '900', color: '#f8fafc' }}>কুপন কোড</h3>
 <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#94a3b8' }}>কাস্টমার চেকআউটে কোড বসালে ছাড় পাবে। শতাংশ (%) বা সরাসরি টাকা — দুই ধরনেরই হয়।</p>
 {coupons.length === 0 ? (
 <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px' }}>এখনো কোনো কুপন নেই।</p>
 ) : coupons.map((c, i) => (
 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', marginBottom: '8px', background: 'rgba(30,41,59,0.5)', flexWrap: 'wrap' }}>
 <span style={{ fontWeight: '900', color: '#a6f36a', letterSpacing: '1px', fontSize: '13px' }}>{c.code}</span>
 <span style={{ fontSize: '12px', color: '#e2e8f0' }}>{c.type === 'pct' ? `${c.value}% ছাড়` : `৳${c.value} ছাড়`}</span>
 {c.min > 0 && <span style={{ fontSize: '11px', color: '#94a3b8' }}>কমপক্ষে ৳{c.min} অর্ডারে</span>}
 <button type="button" onClick={() => handleSaveCoupons(coupons.map((x, j) => j === i ? { ...x, active: !x.active } : x))} style={{ marginLeft: 'auto', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: c.active ? '#4ade80' : '#f87171', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>{c.active ? 'চালু' : 'বন্ধ'}</button>
 <button type="button" onClick={() => { if (confirm(`"${c.code}" কুপন ডিলিট করবেন?`)) handleSaveCoupons(coupons.filter((_, j) => j !== i)); }} style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>ডিলিট</button>
 </div>
 ))}
 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
 <input type="text" placeholder="কোড (যেমন: EID20)" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} style={{ flex: '1 1 130px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', fontSize: '13px', outline: 'none', textTransform: 'uppercase' }} />
 <select value={newCoupon.type} onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', fontSize: '13px', outline: 'none' }}>
 <option value="pct">% শতাংশ</option>
 <option value="flat">৳ টাকা</option>
 </select>
 <input type="number" placeholder="মান" value={newCoupon.value} onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })} style={{ width: '84px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', fontSize: '13px', outline: 'none' }} />
 <input type="number" placeholder="মিনিমাম ৳ (ঐচ্ছিক)" value={newCoupon.min} onChange={(e) => setNewCoupon({ ...newCoupon, min: e.target.value })} style={{ width: '130px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', fontSize: '13px', outline: 'none' }} />
 <button type="button" onClick={handleAddCoupon} disabled={savingOffers} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #a6f36a, #d2ffad)', color: '#10170c', fontSize: '13px', fontWeight: '900', cursor: 'pointer' }}>{savingOffers ? 'সেভ হচ্ছে...' : 'কুপন যোগ করুন'}</button>
 </div>
 </div>

 </div>
 )}

 {/* কাস্টমার ট্যাব */}
 {activeTab === 'customers' && (
 <div>
 <input type="text" placeholder="নাম বা নম্বর দিয়ে খুঁজুন..." value={custSearch} onChange={(e) => setCustSearch(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', fontSize: '13px', outline: 'none', marginBottom: '12px' }} />
 {(() => {
 const norm = (v) => String(v || '').replace(/\D/g, '').slice(-11);
 const map = new Map();
 for (const o of orders) {
 const key = norm(o.whatsapp_number);
 if (!key) continue;
 const cur = map.get(key) || { phone: key, name: o.customer_name || '', count: 0, spent: 0, last: '' };
 cur.count += 1;
 if (o.status === 'completed') cur.spent += Number(o.price) || 0;
 if (!cur.last || String(o.created_at || '') > cur.last) { cur.last = String(o.created_at || ''); cur.name = o.customer_name || cur.name; }
 map.set(key, cur);
 }
 const q = custSearch.trim().toLowerCase();
 const list = [...map.values()]
 .filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q))
 .sort((a, b) => b.spent - a.spent || b.count - a.count);
 if (list.length === 0) return <p style={{ fontSize: '13px', color: '#64748b' }}>কোনো কাস্টমার পাওয়া যায়নি।</p>;
 return list.map((c) => (
 <div key={c.phone} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 12px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', marginBottom: '8px', background: 'rgba(15, 23, 42, 0.7)', flexWrap: 'wrap' }}>
 <div style={{ flex: 1, minWidth: '170px' }}>
 <div style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc' }}>{c.name || 'নাম নেই'}</div>
 <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.phone} • শেষ অর্ডার: {c.last ? c.last.slice(0, 10) : '—'}</div>
 </div>
 <span style={{ fontSize: '12px', color: '#e2e8f0' }}>{c.count}টি অর্ডার</span>
 <span style={{ fontSize: '12px', fontWeight: '900', color: '#a6f36a' }}>৳{c.spent} খরচ (completed)</span>
 <a href={`https://wa.me/88${c.phone}`} target="_blank" rel="noreferrer" style={{ padding: '6px 12px', borderRadius: '9px', background: 'rgba(37, 211, 102, 0.15)', border: '1px solid rgba(37, 211, 102, 0.4)', color: '#4ade80', fontSize: '11px', fontWeight: '900', textDecoration: 'none' }}>WhatsApp</a>
 </div>
 ));
 })()}
 </div>
 )}

 {/* লাইভ অর্ডার ট্যাব */}
 {activeTab === 'orders' && (
 <div>
 {statusNotify && (() => {
 const o = statusNotify.ord;
 const digits = String(o.whatsapp_number || '').replace(/\D/g, '');
 const waNum = digits.startsWith('01') ? '88' + digits : digits.replace(/^\+/, '');
 const first = String(o.customer_name || '').split(' ')[0] || 'আপনি';
 const msgs = {
 confirmed: `আসসালামু আলাইকুম ${first}, আপনার Hub Cart অর্ডার (${o.service_name}, ৳${o.price}) কনফার্ম হয়েছে। শীঘ্রই ডেলিভারি পেয়ে যাবেন। ধন্যবাদ!`,
 completed: `আসসালামু আলাইকুম ${first}, আপনার Hub Cart অর্ডার (${o.service_name}) ডেলিভারি সম্পন্ন হয়েছে। কোনো সমস্যা হলে এখানেই জানাবেন। ধন্যবাদ!`,
 cancelled: `আসসালামু আলাইকুম ${first}, দুঃখিত — আপনার Hub Cart অর্ডার (${o.service_name}) বাতিল করা হয়েছে। বিস্তারিত জানতে রিপ্লাই করুন।`,
 };
 const msg = msgs[statusNotify.status] || `আসসালামু আলাইকুম ${first}, আপনার Hub Cart অর্ডারের (${o.service_name}) স্ট্যাটাস এখন: ${statusNotify.status}।`;
 return (
 <div style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.4)', borderRadius: '14px', padding: '12px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
 <span style={{ fontSize: '13px', color: '#e2e8f0', flex: 1, minWidth: '200px' }}>স্ট্যাটাস <strong style={{ color: '#4ade80' }}>{statusNotify.status}</strong> হয়েছে — কাস্টমারকে WhatsApp-এ জানাবেন?</span>
 <a href={`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer" style={{ padding: '8px 14px', borderRadius: '10px', background: '#25d366', color: '#06281a', fontSize: '12px', fontWeight: '900', textDecoration: 'none' }}>WhatsApp-এ পাঠান</a>
 <button type="button" onClick={() => setStatusNotify(null)} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>বাদ দিন</button>
 </div>
 );
 })()}
 <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '12px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
 <span style={{ fontSize: '13px', color: '#e2e8f0', flex: 1, minWidth: '210px' }}><strong style={{ color: '#f8fafc' }}>Telegram Order Alert</strong> — নতুন অর্ডার এলে Telegram-এ মেসেজ যায় (Vercel env দিয়ে সেট করা)।</span>
 <button type="button" onClick={handleTestTelegram} disabled={tgTestState === 'loading'} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#0b1220', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>{tgTestState === 'loading' ? 'পাঠানো হচ্ছে...' : 'Test Alert পাঠান'}</button>
 {tgTestState === 'ok' && <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold' }}>পৌঁছেছে! Telegram চেক করুন।</span>}
 {tgTestState === 'env' && <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 'bold' }}>Env সেট করা নেই — Vercel-এ TELEGRAM_BOT_TOKEN ও TELEGRAM_CHAT_ID যোগ করুন।</span>}
 {tgTestState === 'fail' && <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 'bold' }}>পাঠানো যায়নি — token/chat id যাচাই করুন।</span>}
 </div>
 <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '12px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <input
 type="text"
 placeholder=" অর্ডার আইডি, TrxID, ফোন নম্বর বা নাম দিয়ে খুঁজুন..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 style={inputStyle}
 />
 <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
 <button
 type="button"
 onClick={handleExportCSV}
 style={{ background: 'rgba(166, 243, 106, 0.12)', border: '1px solid rgba(166, 243, 106, 0.35)', color: '#a6f36a', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
 >
 CSV এক্সপোর্ট ({filteredOrders.length})
 </button>
 </div>

 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
 {['all', 'pending', 'verifying', 'processing', 'completed', 'cancelled'].map((st) => (
 <button
 key={st}
 onClick={() => setStatusFilter(st)}
 style={{
 background: statusFilter === st ? '#a6f36a' : 'rgba(30, 41, 59, 0.6)',
 border: 'none',
 color: statusFilter === st ? '#fff' : '#94a3b8',
 padding: '4px 10px',
 borderRadius: '8px',
 fontSize: '11px',
 fontWeight: 'bold',
 cursor: 'pointer',
 textTransform: 'capitalize',
 }}
 >
 {st}
 </button>
 ))}
 </div>

 <select
 value={methodFilter}
 onChange={(e) => setMethodFilter(e.target.value)}
 style={{
 background: '#0b0f19',
 color: '#cbd5e1',
 border: '1px solid rgba(255, 255, 255, 0.1)',
 borderRadius: '8px',
 padding: '5px 8px',
 fontSize: '11px',
 outline: 'none',
 cursor: 'pointer',
 }}
 >
 <option value="all">সকল মেথড</option>
 <option value="bkash">bKash</option>
 <option value="nagad">Nagad</option>
 <option value="crypto">Crypto</option>
 <option value="tbc">TBC Pay</option>
 </select>
 </div>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
 <span style={{ fontSize: '12px', color: '#94a3b8' }}>
 পাওয়া গেছে: <strong>{filteredOrders.length}</strong> টি অর্ডার
 </span>
 <button
 onClick={() => fetchOrders()}
 style={{ background: 'none', border: 'none', color: '#a6f36a', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
 >
 রিফ্রেশ অর্ডার
 </button>
 </div>

 {loadingOrders ? (
 <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '13px' }}>অর্ডার লোড হচ্ছে...</div>
 ) : filteredOrders.length === 0 ? (
 <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '18px', padding: '36px', textAlign: 'center', color: '#64748b' }}>
 কোনো অর্ডার পাওয়া যায়নি।
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
 {filteredOrders.map((ord) => (
 <div
 key={ord.id}
 style={{
 background: 'rgba(15, 23, 42, 0.8)',
 backdropFilter: 'blur(12px)',
 border: '1px solid rgba(255, 255, 255, 0.08)',
 borderRadius: '18px',
 padding: '16px',
 }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
 <div>
 <span style={{ fontSize: '11px', color: '#a6f36a', fontWeight: 'bold' }}>{ord.order_id}</span>
 <h4 style={{ margin: '2px 0 0', fontSize: '15px', color: '#f8fafc', fontWeight: 'bold' }}>{ord.service_name}</h4>
 </div>
 <span style={{ fontSize: '15px', fontWeight: '900', color: '#a6f36a' }}>৳{ord.price}</span>
 </div>

 <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px 12px', borderRadius: '12px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '12px' }}>
 <div> <strong>নাম:</strong> {ord.customer_name}</div>
 <div> <strong>WhatsApp:</strong> <span style={{ color: '#4ade80' }}>{ord.whatsapp_number}</span>{' '}
 <a href={`https://wa.me/${String(ord.whatsapp_number || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 'bold' }}> চ্যাট</a>
 </div>
 {ord.telegram_username && <div> <strong>Telegram:</strong> {ord.telegram_username}</div>}
 <div> <strong>পেমেন্ট:</strong> {ord.payment_method}</div>
 <div> <strong>TrxID:</strong> <code style={{ color: '#f8fafc', background: '#0b0f19', padding: '2px 6px', borderRadius: '4px' }}>{ord.trx_id}</code>{' '}
 <button type="button" onClick={() => handleCopyTrx(ord.trx_id, ord.id)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: copiedTrxId === ord.id ? '#4ade80' : '#cbd5e1', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>{copiedTrxId === ord.id ? ' কপি হয়েছে' : ' কপি'}</button>{' '}
 {trxCount(ord.trx_id) > 1 && (<span style={{ display: 'inline-block', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.55)', color: '#f87171', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: '900' }}>Duplicate TrxID!</span>)}</div>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
 <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>স্ট্যাটাস:</span>
 <select
 value={ord.status || 'pending'}
 onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
 style={{
 background: '#0b0f19',
 color: ord.status === 'completed' ? '#4ade80' : ord.status === 'processing' ? '#a6f36a' : ord.status === 'cancelled' ? '#f87171' : '#fbbf24',
 border: '1px solid rgba(255, 255, 255, 0.15)',
 padding: '6px 10px',
 borderRadius: '8px',
 fontSize: '12px',
 fontWeight: 'bold',
 outline: 'none',
 cursor: 'pointer',
 }}
 >
 <option value="pending">⏳ Pending (গৃহীত)</option>
 <option value="verifying"> Verifying (যাচাইকরণ)</option>
 <option value="processing"> Processing (প্রসেসিং)</option>
 <option value="completed"> Completed (সম্পন্ন)</option>
 <option value="cancelled"> Cancelled (বাতিল)</option>
 </select>
 </div>

 <button
 onClick={() => handleDeleteOrder(ord.id, ord.order_id)}
 style={{
 background: 'rgba(239, 68, 68, 0.12)',
 border: '1px solid rgba(239, 68, 68, 0.3)',
 color: '#f87171',
 padding: '6px 10px',
 borderRadius: '8px',
 fontSize: '11px',
 fontWeight: 'bold',
 cursor: 'pointer',
 }}
 >
 ডিলিট
 </button>
 </div>

 <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px', display: 'flex', gap: '8px' }}>
 <button
 onClick={() => openDeliveryModal(ord)}
 style={{
 flex: 1,
 background: 'rgba(34, 197, 94, 0.15)',
 border: '1px solid rgba(34, 197, 94, 0.4)',
 color: '#4ade80',
 padding: '8px 12px',
 borderRadius: '10px',
 fontSize: '12px',
 fontWeight: 'bold',
 cursor: 'pointer',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '6px',
 }}
 >
 <span></span> WhatsApp ডেলিভারি
 </button>

 <Link
 href={`/invoice/${ord.order_id}`}
 target="_blank"
 style={{
 background: 'rgba(166, 243, 106, 0.1)',
 border: '1px solid rgba(166, 243, 106, 0.25)',
 color: '#a6f36a',
 padding: '8px 12px',
 borderRadius: '10px',
 fontSize: '11px',
 fontWeight: 'bold',
 textDecoration: 'none',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 }}
 >
 মেমো ↗
 </Link>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* প্রোডাক্ট ট্যাব */}
 {activeTab === 'products' && (
 <div>
 <div style={{
 background: 'rgba(15, 23, 42, 0.8)',
 backdropFilter: 'blur(16px)',
 padding: '20px',
 borderRadius: '20px',
 border: '1px solid rgba(255, 255, 255, 0.08)',
 marginBottom: '24px',
 }}>
 <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px', color: '#f8fafc' }}>+ নতুন প্রোডাক্ট যোগ করুন</h3>

 <form onSubmit={handleAddProduct}>
 <div style={{ marginBottom: '12px' }}>
 <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>প্রোডাক্টের নাম *</label>
 <input required type="text" placeholder="যেমন: Android Mobile Root" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
 <div>
 <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>ক্যাটাগরি *</label>
 <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, background: '#1e293b' }}>
 {CATEGORIES.map((c) => (
 <option key={c.id} value={c.id}>{c.name}</option>
 ))}
 </select>
 </div>

 <div>
 <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>বিক্রয় মূল্য (টাকা) *</label>
 <input required type="number" placeholder="550" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
 </div>
 </div>

 <div style={{ marginBottom: '14px', background: 'rgba(30, 41, 59, 0.6)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
 <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
 <button
 type="button"
 onClick={() => setUploadMode('file')}
 style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: uploadMode === 'file' ? '#a6f36a' : 'rgba(15, 23, 42, 0.6)', color: '#fff', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
 >
 গ্যালারি থেকে আপলোড
 </button>
 <button
 type="button"
 onClick={() => setUploadMode('url')}
 style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: uploadMode === 'url' ? '#a6f36a' : 'rgba(15, 23, 42, 0.6)', color: '#fff', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
 >
 ছবির লিংক দিন
 </button>
 </div>

 {uploadMode === 'file' ? (
 <div>
 <input
 type="file"
 accept="image/jpeg,image/png,image/webp"
 onChange={handleFileChange}
 style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '12px', color: '#94a3b8', background: '#0b0f19' }}
 />
 {imagePreview && (
 <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
 <img src={imagePreview} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #a6f36a' }} />
 <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold' }}> ছবি নির্বাচিত হয়েছে</span>
 </div>
 )}
 </div>
 ) : (
 <input
 type="url"
 placeholder="https://... ছবির ডিরেক্ট লিংক"
 value={imageUrl}
 onChange={(e) => setImageUrl(e.target.value)}
 style={inputStyle}
 />
 )}
 </div>

 <div style={{ marginBottom: '12px' }}>
 <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>আগের মূল্য (ঐচ্ছিক / Discount)</label>
 <input type="number" placeholder="800" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} style={inputStyle} />
 </div>

 <div style={{ marginBottom: '16px' }}>
 <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>বিস্তারিত বিবরণ</label>
 <textarea rows={2} placeholder="সার্ভিস বা প্যাকেজ সম্পর্কে বিস্তারিত লিখুন..." value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
 </div>

 <button
 type="submit"
 disabled={submitting}
 style={{
 width: '100%',
 padding: '12px',
 background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
 color: '#10170c',
 border: 'none',
 borderRadius: '12px',
 fontWeight: 'bold',
 fontSize: '14px',
 cursor: 'pointer',
 boxShadow: '0 4px 14px rgba(166, 243, 106, 0.4)',
 }}
 >
 {submitting ? 'সংরক্ষণ হচ্ছে...' : 'Add Product'}
 </button>
 </form>
 </div>

 <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
 <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>বর্তমান প্রোডাক্ট তালিকা ({products.length})</h3>
 <button onClick={() => fetchProducts()} style={{ background: 'none', border: 'none', color: '#a6f36a', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}> রিফ্রেশ</button>
 </div>

 {loadingProducts ? (
 <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>লোড হচ্ছে...</div>
 ) : products.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>কোনো প্রোডাক্ট পাওয়া যায়নি।</div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 {products.map((prod) => (
 <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', background: 'rgba(30, 41, 59, 0.5)' }}>
 <img src={prod.image} alt={prod.title} style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '10px', background: '#0b0f19' }} />
 <div style={{ flex: 1, opacity: (productFlags[prod.id] && productFlags[prod.id].published === false) ? 0.45 : 1 }}>
 <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>{prod.title}{(productFlags[prod.id] && productFlags[prod.id].published === false) ? ' • HIDDEN' : ''}</div>
 <div style={{ fontSize: '11px', color: '#94a3b8' }}>৳{prod.price} • {prod.category}</div>
 {(() => { const cfg = autodeliveryConfigs[prod.id]; if (!cfg || !cfg.mode || cfg.mode === 'off') return null; return (
 <div style={{ fontSize: '10px', color: '#a6f36a', fontWeight: '700', marginTop: '2px' }}>
 {cfg.mode === 'stock' ? ` Auto-Delivery: স্টক বাকি ${(cfg.stock || []).length - (cfg.used || []).length}টি` : ' Auto-Delivery: Fixed'}
 </div> ); })()}
 </div>
 <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
 {(() => { const f = productFlags[prod.id] || {}; const pub = f.published !== false; const feat = !!f.featured; return (<>
 <button
 onClick={() => handleToggleFlag(prod, 'published')}
 title="সাইটে দেখাবে কিনা"
 style={{ background: pub ? 'rgba(74, 222, 128, 0.15)' : 'rgba(100, 116, 139, 0.2)', border: `1px solid ${pub ? 'rgba(74, 222, 128, 0.45)' : 'rgba(100, 116, 139, 0.5)'}`, color: pub ? '#4ade80' : '#94a3b8', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
 >
 {pub ? 'Published: ON' : 'Published: OFF'}
 </button>
 <button
 onClick={() => handleToggleFlag(prod, 'featured')}
 title="সবার আগে দেখাবে কিনা"
 style={{ background: feat ? 'rgba(250, 204, 21, 0.15)' : 'rgba(100, 116, 139, 0.15)', border: `1px solid ${feat ? 'rgba(250, 204, 21, 0.5)' : 'rgba(100, 116, 139, 0.4)'}`, color: feat ? '#facc15' : '#94a3b8', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
 >
 {feat ? 'Featured: ON' : 'Featured'}
 </button>
 </>); })()}
 <button
 onClick={() => setEditingProduct(prod)}
 style={{ background: 'rgba(166, 243, 106, 0.15)', border: '1px solid rgba(166, 243, 106, 0.3)', color: '#a6f36a', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
 >
 Edit
 </button>
 <button
 onClick={() => openAdModal(prod)}
 style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.35)', color: '#7dd3fc', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
 >
 Auto
 </button>
 <button
 onClick={() => handleDeleteProduct(prod.id, prod.title)}
 style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
 >
 Delete
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )}

 {searchLog && searchLog.items.length > 0 && (
 <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px', marginTop: '16px' }}>
 <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px', color: '#f8fafc' }}>কাস্টমার খুঁজে পায়নি ({searchLog.total})</h3>
 <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px' }}>সার্চ করে কোনো রেজাল্ট পায়নি — এই জিনিসগুলোর চাহিদা আছে কিন্তু ক্যাটালগে নেই।</p>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
 {searchLog.items.map((it, i) => (
 <span key={i} style={{ fontSize: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.35)', color: '#7dd3fc', padding: '5px 11px', borderRadius: '999px', fontWeight: '700' }}>{it.q} • {it.count}বার</span>
 ))}
 </div>
 </div>
 )}

 {/* প্রোডাক্ট এডিট মডাল */}
 {editingProduct && (
 <div style={{
 position: 'fixed',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'rgba(0, 0, 0, 0.8)',
 backdropFilter: 'blur(8px)',
 zIndex: 1000,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px',
 }}>
 <div style={{
 width: '100%',
 maxWidth: '440px',
 background: '#0f172a',
 border: '1px solid rgba(166, 243, 106, 0.3)',
 borderRadius: '24px',
 padding: '24px',
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
 <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', fontWeight: 'bold' }}>
 প্রোডাক্ট এডিট করুন
 </h3>
 <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}>✕</button>
 </div>

 <form onSubmit={handleSaveProductEdit}>
 <div style={{ marginBottom: '12px' }}>
 <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>প্রোডাক্ট নাম</label>
 <input
 type="text"
 value={editingProduct.title}
 onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
 style={inputStyle}
 required
 />
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
 <div>
 <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>বিক্রয় মূল্য (৳)</label>
 <input
 type="number"
 value={editingProduct.price}
 onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
 style={inputStyle}
 required
 />
 </div>
 <div>
 <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>আগের মূল্য (৳)</label>
 <input
 type="number"
 value={editingProduct.original_price || ''}
 onChange={(e) => setEditingProduct({ ...editingProduct, original_price: e.target.value })}
 style={inputStyle}
 />
 </div>
 </div>

 <div style={{ marginBottom: '12px' }}>
 <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>ক্যাটাগরি</label>
 <select
 value={editingProduct.category || 'android-root'}
 onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
 style={{ ...inputStyle, background: '#1e293b' }}
 >
 {CATEGORIES.map((c) => (
 <option key={c.id} value={c.id}>{c.name}</option>
 ))}
 </select>
 </div>

 <div style={{ marginBottom: '16px' }}>
 <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>বিবরণ</label>
 <textarea
 rows={3}
 value={editingProduct.description || ''}
 onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
 style={inputStyle}
 />
 </div>

 <div style={{ display: 'flex', gap: '10px' }}>
 <button
 type="button"
 onClick={() => setEditingProduct(null)}
 style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'transparent', color: '#94a3b8', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
 >
 বাতিল
 </button>
 <button
 type="submit"
 style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #a6f36a, #d2ffad)', color: '#10170c', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
 >
 আপডেট করুন
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* WhatsApp ডেলিভারি মডাল */}
 {/* রিভিউ ট্যাব */}
 {activeTab === 'reviews' && (
 <div>
 <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px' }}>
 কাস্টমারদের দেওয়া সব রিভিউ — স্প্যাম বা অনুপযুক্ত রিভিউ এখান থেকে ডিলিট করা যাবে। ডিলিট করলে সাইট থেকেও সাথে সাথে সরে যাবে।
 </p>
 {loadingReviews ? (
 <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>রিভিউ লোড হচ্ছে...</div>
 ) : totalReviewCount === 0 ? (
 <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: '16px' }}>
 এখনো কোনো রিভিউ জমা পড়েনি।
 </div>
 ) : (
 reviewsByProduct.filter((g) => g.reviews.length > 0).map((group) => {
 const prod = products.find((p) => p.id === group.productId);
 const avg = group.reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / group.reviews.length;
 return (
 <div key={group.productId} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '14px', marginBottom: '12px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
 <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{prod ? prod.title : `প্রোডাক্ট #${group.productId}`}</strong>
 <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>{''.repeat(Math.round(avg))} {avg.toFixed(1)} • {group.reviews.length}টি রিভিউ</span>
 </div>
 {group.reviews.map((r, idx) => (
 <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '9px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
 <div style={{ minWidth: 0 }}>
 <div style={{ fontSize: '12px', color: '#e2e8f0' }}>
 <strong>{r.name}</strong>{' '}
 <span style={{ color: '#fbbf24' }}>{''.repeat(Number(r.rating) || 0)}</span>{' '}
 <span style={{ color: '#64748b', fontSize: '10px' }}>{r.date ? new Date(r.date).toLocaleDateString('bn-BD') : ''}</span>
 </div>
 <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#94a3b8', lineHeight: 1.55 }}>{r.text}</p>
 </div>
 <button
 type="button"
 onClick={() => handleDeleteReview(group.productId, idx, r.name)}
 style={{ flex: 'none', alignSelf: 'flex-start', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '5px 9px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
 >
 
 </button>
 </div>
 ))}
 </div>
 );
 })
 )}
 </div>
 )}

 {/* অটো-ডেলিভারি সেটিংস মডাল */}
 {adModalProduct && (
 <div style={{
 position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
 background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000,
 display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
 }}>
 <div style={{
 width: '100%', maxWidth: '440px', background: '#0f172a',
 border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '24px', padding: '24px',
 boxShadow: '0 20px 40px rgba(0,0,0,0.6)', maxHeight: '88vh', overflowY: 'auto',
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
 <h3 style={{ margin: 0, fontSize: '15px', color: '#f8fafc', fontWeight: 'bold' }}> Auto-Delivery সেটিংস</h3>
 <button onClick={() => setAdModalProduct(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}>✕</button>
 </div>
 <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px' }}>{adModalProduct.title}</p>

 <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
 {[['off', ' বন্ধ'], ['fixed', ' Fixed তথ্য'], ['stock', ' স্টক লিস্ট']].map(([m, label]) => (
 <button key={m} type="button" onClick={() => { setAdMode(m); const cfg = autodeliveryConfigs[adModalProduct.id] || {}; setAdText(m === 'stock' ? (cfg.stock || []).join('\n') : (cfg.fixedText || '')); }}
 style={{ flex: 1, padding: '8px 4px', borderRadius: '10px', border: adMode === m ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)', background: adMode === m ? 'rgba(56,189,248,0.15)' : 'transparent', color: adMode === m ? '#7dd3fc' : '#94a3b8', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
 {label}
 </button>
 ))}
 </div>

 {adMode === 'fixed' && (
 <>
 <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.6 }}>প্রতিটি অর্ডারে একই তথ্য গেলে এখানে লিখে রাখো (যেমন: ডাউনলোড লিংক, নির্দেশনা)। ডেলিভারি দেওয়ার সময় নিজে নিজে বসে যাবে।</p>
 <textarea value={adText} onChange={(e) => setAdText(e.target.value)} rows={5} placeholder="ডেলিভারি তথ্য লিখুন..." style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '10px', color: '#f8fafc', fontSize: '12px', lineHeight: 1.6 }} />
 </>
 )}
 {adMode === 'stock' && (
 <>
 <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.6 }}>প্রতিটি লাইনে একটি করে ডেলিভারি আইটেম (অ্যাকাউন্ট/কোড/লিংক)। প্রতিবার উপরের থেকে একটা করে যাবে, ব্যবহৃত হলে চিহ্নিত থাকবে। ব্যবহৃত: {(autodeliveryConfigs[adModalProduct.id]?.used || []).length}টি</p>
 <textarea value={adText} onChange={(e) => setAdText(e.target.value)} rows={7} placeholder={'user1@example.com / pass123\nuser2@example.com / pass456'} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '10px', color: '#f8fafc', fontSize: '12px', lineHeight: 1.6 }} />
 </>
 )}
 {adMode === 'off' && (
 <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>এই প্রোডাক্টের জন্য অটো-ডেলিভারি বন্ধ আছে — ডেলিভারির সময় আগের মতো হাতে তথ্য লিখতে হবে।</p>
 )}

 <button onClick={handleSaveAutodelivery} disabled={savingAd}
 style={{ width: '100%', marginTop: '14px', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#0b1020', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>
 {savingAd ? 'সেভ হচ্ছে...' : ' সেভ করো'}
 </button>
 </div>
 </div>
 )}

 {deliveryModalOrder && (
 <div style={{
 position: 'fixed',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'rgba(0, 0, 0, 0.8)',
 backdropFilter: 'blur(8px)',
 zIndex: 1000,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px',
 }}>
 <div style={{
 width: '100%',
 maxWidth: '440px',
 background: '#0f172a',
 border: '1px solid rgba(34, 197, 94, 0.4)',
 borderRadius: '24px',
 padding: '24px',
 boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
 <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', fontWeight: 'bold' }}>
 WhatsApp ডেলিভারি নিশ্চিতকরণ
 </h3>
 <button onClick={() => setDeliveryModalOrder(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}>
 
 </button>
 </div>

 <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.5 }}>
 <div> <strong>গ্রাহক:</strong> {deliveryModalOrder.customer_name} ({deliveryModalOrder.whatsapp_number})</div>
 <div> <strong>সার্ভিস:</strong> {deliveryModalOrder.service_name}</div>
 <div> <strong>অর্ডার:</strong> {deliveryModalOrder.order_id}</div>
 </div>

 {adDeliveryHint && (
 <div style={{ background: 'rgba(166, 243, 106, 0.1)', border: '1px solid rgba(166, 243, 106, 0.3)', color: '#d9f99d', fontSize: '11px', fontWeight: 'bold', padding: '8px 10px', borderRadius: '10px', marginBottom: '10px' }}>
 {adDeliveryHint}
 </div>
 )}

 <div style={{ marginBottom: '10px' }}>
 <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>কুইক টেমপ্লেট নির্বাচন করুন:</span>
 <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
 {QUICK_TEMPLATES.map((tmpl, idx) => (
 <button
 key={idx}
 type="button"
 onClick={() => setDeliveryExtraNote(tmpl.text)}
 style={{
 background: 'rgba(166, 243, 106, 0.1)',
 border: '1px solid rgba(166, 243, 106, 0.3)',
 color: '#a6f36a',
 padding: '4px 8px',
 borderRadius: '6px',
 fontSize: '10px',
 fontWeight: 'bold',
 cursor: 'pointer',
 }}
 >
 {tmpl.label}
 </button>
 ))}
 </div>
 </div>

 <div style={{ marginBottom: '16px' }}>
 <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '6px' }}>
 সার্ভিস এক্সেস তথ্য / ডেলিভারি নোট:
 </label>
 <textarea
 rows={3}
 placeholder="যেমন: ইউজারনেম, পাসওয়ার্ড, ফাইল ডাউনলোড লিংক..."
 value={deliveryExtraNote}
 onChange={(e) => setDeliveryExtraNote(e.target.value)}
 style={{
 width: '100%',
 boxSizing: 'border-box',
 padding: '10px 12px',
 borderRadius: '12px',
 background: 'rgba(30, 41, 59, 0.8)',
 border: '1px solid rgba(255, 255, 255, 0.1)',
 color: '#ffffff',
 fontSize: '12px',
 outline: 'none',
 }}
 />
 </div>

 <div style={{ display: 'flex', gap: '10px' }}>
 <button
 onClick={() => setDeliveryModalOrder(null)}
 style={{
 flex: 1,
 padding: '11px',
 borderRadius: '12px',
 border: '1px solid rgba(255, 255, 255, 0.1)',
 background: 'transparent',
 color: '#94a3b8',
 fontWeight: 'bold',
 fontSize: '13px',
 cursor: 'pointer',
 }}
 >
 বাতিল
 </button>

 <button
 onClick={handleSendWhatsAppDelivery}
 style={{
 flex: 2,
 padding: '11px',
 borderRadius: '12px',
 border: 'none',
 background: 'linear-gradient(135deg, #16a34a, #15803d)',
 color: '#ffffff',
 fontWeight: 'bold',
 fontSize: '13px',
 cursor: 'pointer',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '6px',
 }}
 >
 <span></span> WhatsApp-এ পাঠান
 </button>
 </div>
 </div>
 </div>
 )}

 </div>
 );
}
