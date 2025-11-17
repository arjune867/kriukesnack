
import React, { useState, useEffect } from 'react';
import { Promotion } from '../types';
import { usePromotions } from '../hooks/usePromotions';
import { useProducts } from '../hooks/useProducts';

interface PromotionFormProps {
    promotion: Promotion | null;
    onDone: () => void;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ promotion, onDone }) => {
    const { addPromotion, updatePromotion } = usePromotions();
    const { products } = useProducts();
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        productId: '',
    });

    useEffect(() => {
        if (promotion) {
            setFormData({
                title: promotion.title,
                imageUrl: promotion.imageUrl,
                productId: promotion.productId,
            });
        } else if (products.length > 0) {
            // Default to the first product if creating a new promotion
            setFormData(prev => ({ ...prev, productId: products[0].id }));
        }
    }, [promotion, products]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productId) {
            alert('Please select a product to link to.');
            return;
        }

        const promotionData = {
            title: formData.title,
            imageUrl: formData.imageUrl || `https://picsum.photos/seed/${new Date().getTime()}/400/400`,
            productId: formData.productId,
        };

        if (promotion) {
            updatePromotion({ ...promotion, ...promotionData });
        } else {
            addPromotion(promotionData);
        }
        onDone();
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">{promotion ? 'Edit Promosi' : 'Tambah Promosi Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Promosi</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL Gambar (1x1)</label>
                    <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" placeholder="Kosongkan untuk gambar acak" />
                </div>
                <div>
                    <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Link ke Produk</label>
                    <select name="productId" id="productId" value={formData.productId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" required>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button type="button" onClick={onDone} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                        Batal
                    </button>
                    <button type="submit" className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600">
                        {promotion ? 'Simpan Perubahan' : 'Tambah Promosi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PromotionForm;