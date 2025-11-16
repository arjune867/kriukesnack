
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { generateDescription } from '../services/geminiService';
import { Icon } from './Icon';

interface ProductFormProps {
    product: Product | null;
    onDone: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onDone }) => {
    const { addProduct, updateProduct } = useProducts();
    const { categories } = useCategories();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        category: '',
        tiktok: '#',
        tokopedia: '#',
        shopee: '#',
        lazada: '#',
    });
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price.toString(),
                description: product.description,
                imageUrl: product.imageUrl,
                category: product.category,
                tiktok: product.ecommerceLinks.tiktok,
                tokopedia: product.ecommerceLinks.tokopedia,
                shopee: product.ecommerceLinks.shopee,
                lazada: product.ecommerceLinks.lazada,
            });
        } else if (categories.length > 0) {
            setFormData(prev => ({ ...prev, category: categories[0].name }));
        }
    }, [product, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            alert("Harap isi nama produk terlebih dahulu.");
            return;
        }
        setIsGenerating(true);
        const description = await generateDescription(formData.name, "renyah, enak, bikin nagih");
        setFormData(prev => ({ ...prev, description }));
        setIsGenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            name: formData.name,
            price: parseInt(formData.price, 10),
            description: formData.description,
            imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.name}/400/400`,
            category: formData.category,
            ecommerceLinks: {
                tiktok: formData.tiktok,
                tokopedia: formData.tokopedia,
                shopee: formData.shopee,
                lazada: formData.lazada,
            }
        };

        if (product) {
            updateProduct({ ...product, ...productData });
        } else {
            addProduct(productData);
        }
        onDone();
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Produk</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Harga</label>
                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm">
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL Gambar</label>
                    <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" placeholder="Kosongkan untuk gambar acak" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" required></textarea>
                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400">
                        <Icon name="sparkles" className="w-4 h-4" />
                        {isGenerating ? 'Membuat...' : 'Buat dengan AI'}
                    </button>
                </div>
                 <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Link E-commerce</h3>
                    <div className="space-y-2">
                         <input type="text" name="tiktok" placeholder="Link TikTok Shop" value={formData.tiktok} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                         <input type="text" name="tokopedia" placeholder="Link Tokopedia" value={formData.tokopedia} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                         <input type="text" name="shopee" placeholder="Link Shopee" value={formData.shopee} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                         <input type="text" name="lazada" placeholder="Link Lazada" value={formData.lazada} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <button type="button" onClick={onDone} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                        Batal
                    </button>
                    <button type="submit" className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600">
                        {product ? 'Simpan Perubahan' : 'Tambah Produk'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
