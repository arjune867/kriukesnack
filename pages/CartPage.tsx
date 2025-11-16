import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Page } from '../types';
import { Icon } from '../components/Icon';

interface CartPageProps {
    navigate: (page: Page) => void;
}

const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
    const { cartItems, updateQuantity, removeFromCart, itemCount, clearCart, subtotal, discountAmount, totalPrice, appliedDiscount, applyDiscount, removeDiscount } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        notes: '',
    });
    const [discountCode, setDiscountCode] = useState('');
    const [discountMessage, setDiscountMessage] = useState({ type: '', text: '' });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyDiscount = () => {
        if (!discountCode.trim()) return;
        const result = applyDiscount(discountCode);
        setDiscountMessage({ type: result.success ? 'success' : 'error', text: result.message });
        if (result.success) {
            setDiscountCode('');
        }
        setTimeout(() => setDiscountMessage({ type: '', text: '' }), 3000);
    };

    const handleRemoveDiscount = () => {
        removeDiscount();
        setDiscountMessage({ type: 'success', text: 'Diskon dihapus.' });
        setTimeout(() => setDiscountMessage({ type: '', text: '' }), 3000);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const WHATSAPP_NUMBER = '6282349786916';
        let message = 'Halo Kriuké Snack, saya mau pesan:\n\n';
        
        cartItems.forEach(item => {
            message += `*${item.name}*\n`;
            message += `Jumlah: ${item.quantity}\n`;
            message += `Harga: ${formatCurrency(item.price * item.quantity)}\n\n`;
        });

        message += '-----------------------------------\n';
        message += `Subtotal: ${formatCurrency(subtotal)}\n`;
        if (appliedDiscount) {
            message += `Diskon (${appliedDiscount.code}): -${formatCurrency(discountAmount)}\n`;
        }
        message += `*Total Pesanan: ${formatCurrency(totalPrice)}*\n`;
        message += '-----------------------------------\n';
        message += '*Data Pengiriman*:\n';
        message += `Nama: ${formData.name}\n`;
        message += `No. WhatsApp: ${formData.phone}\n`;
        message += `Alamat Lengkap: ${formData.address}\n`;
        if(formData.notes) {
            message += `Catatan: ${formData.notes}\n`;
        }
        
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        
        clearCart();
        navigate('home');
    };

    if (itemCount === 0) {
        return (
            <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Keranjang Kosong</h1>
                <p className="text-gray-600 mb-6">Yuk, isi keranjangmu dengan snack favorit!</p>
                <button 
                    onClick={() => navigate('home')}
                    className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-orange-600 transition-colors"
                >
                    Mulai Belanja
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 pb-48">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Detail Pesanan</h2>
            <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800 leading-tight">{item.name}</p>
                            <p className="text-orange-500 font-bold text-sm mt-1">{formatCurrency(item.price)}</p>
                            <div className="flex items-center mt-2">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-gray-200 rounded-md font-bold text-lg flex items-center justify-center">-</button>
                                <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-gray-200 rounded-md font-bold text-lg flex items-center justify-center">+</button>
                            </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500" aria-label={`Remove ${item.name} from cart`}>
                            <Icon name="trash" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                 <h2 className="text-lg font-bold text-gray-800 mb-4">Kode Diskon</h2>
                 {appliedDiscount ? (
                     <div className="flex justify-between items-center">
                         <p className="text-green-600 font-semibold">Kode "{appliedDiscount.code}" diterapkan!</p>
                         <button onClick={handleRemoveDiscount} className="text-sm text-red-500 hover:underline">Hapus</button>
                     </div>
                 ) : (
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                            placeholder="Masukkan kode diskon"
                            className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                        <button onClick={handleApplyDiscount} className="bg-amber-500 text-white font-semibold px-4 rounded-lg shadow hover:bg-amber-600 transition-colors">
                            Terapkan
                        </button>
                    </div>
                 )}
                 {discountMessage.text && (
                    <p className={`text-sm mt-2 ${discountMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{discountMessage.text}</p>
                 )}
            </div>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Data Pengiriman</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" required />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" required placeholder="Contoh: 08123456789" />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                        <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" required placeholder="Sertakan nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kab, dan kode pos."></textarea>
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Catatan (opsional)</label>
                        <textarea name="notes" id="notes" rows={2} value={formData.notes} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" placeholder="Contoh: Pagar warna hijau"></textarea>
                    </div>
                </div>
            </form>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-4 border-t border-gray-200 shadow-t-md">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-700">{formatCurrency(subtotal)}</span>
                    </div>
                     {appliedDiscount && (
                        <div className="flex justify-between items-center text-green-600">
                            <span>Diskon ({appliedDiscount.code})</span>
                            <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span className="text-gray-800">Total</span>
                        <span className="text-orange-500">{formatCurrency(totalPrice)}</span>
                    </div>
                </div>
                 <button 
                    type="submit"
                    form="checkout-form"
                    className="w-full flex justify-center items-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-200"
                >
                    <Icon name="whatsapp" /> Kirim Pesanan via WhatsApp
                </button>
            </div>
        </div>
    );
};

export default CartPage;