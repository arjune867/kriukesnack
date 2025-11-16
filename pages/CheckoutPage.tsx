
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Page } from '../types';
import { Icon } from '../components/Icon';

interface CheckoutPageProps {
    navigate: (page: Page) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
    const { cartItems, clearCart } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        notes: '',
    });

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const WHATSAPP_NUMBER = '6282349786916';
        let message = 'Halo Kriuké Snack, saya mau pesan:\n\n';
        
        cartItems.forEach(item => {
            message += `*${item.name}*\n`;
            message += `Jumlah: ${item.quantity}\n`;
            message += `Harga: ${formatCurrency(item.price * item.quantity)}\n\n`;
        });

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
    
    if (cartItems.length === 0) {
        return (
             <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                <h1 className="text-xl font-bold mb-4 text-gray-700">Tidak ada item untuk di-checkout.</h1>
                <button 
                    onClick={() => navigate('home')}
                    className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-orange-600 transition-colors"
                >
                    Kembali ke Home
                </button>
            </div>
        )
    }

    return (
        <div className="p-4 pb-32">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                 <h2 className="text-lg font-bold text-gray-800 mb-3">Ringkasan Pesanan</h2>
                 <div className="space-y-2">
                     {cartItems.map(item => (
                         <div key={item.id} className="flex justify-between items-center text-sm">
                             <div className="text-gray-600">
                                 {item.name} <span className="text-gray-400">x{item.quantity}</span>
                            </div>
                             <div className="font-medium text-gray-700">{formatCurrency(item.price * item.quantity)}</div>
                         </div>
                     ))}
                 </div>
                 <div className="border-t my-3"></div>
                 <div className="flex justify-between items-center font-bold">
                     <span className="text-gray-800">Total</span>
                     <span className="text-orange-500 text-lg">{formatCurrency(totalPrice)}</span>
                 </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm">
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
                 <button 
                    type="submit"
                    form="whatsapp-form"
                    onClick={handleSubmit}
                    className="w-full flex justify-center items-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-200"
                >
                    <Icon name="whatsapp" /> Kirim Pesanan via WhatsApp
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;