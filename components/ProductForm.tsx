

import React, { useState, useEffect } from 'react';
import { Product, Variant } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useDiscounts } from '../hooks/useDiscounts';
import { generateDescription } from '../services/geminiService';
import { Icon } from './Icon';

interface ProductFormProps {
    product: Product | null;
    onDone: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onDone }) => {
    const { addProduct, updateProduct } = useProducts();
    const { categories } = useCategories();
    const { discounts } = useDiscounts();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        category: '',
        discountCodeId: '',
        tiktok: '#',
        tokopedia: '#',
        shopee: '#',
        lazada: '#',
    });
    const [variants, setVariants] = useState<Omit<Variant, 'id'>[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                imageUrl: product.imageUrl,
                category: product.category,
                discountCodeId: product.discountCodeId || '',
                tiktok: product.ecommerceLinks.tiktok,
                tokopedia: product.ecommerceLinks.tokopedia,
                shopee: product.ecommerceLinks.shopee,
                lazada: product.ecommerceLinks.lazada,
            });
            setVariants(product.variants);
        } else {
             if (categories.length > 0) {
                setFormData(prev => ({ ...prev, category: categories[0].name }));
            }
            // Start with one default variant for new products
            setVariants([{ name: '', price: 0, stock: 0 }]);
        }
    }, [product, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [name]: value };
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { name: '', price: 0, stock: 0 }]);
    };

    const removeVariant = (index: number) => {
        if (variants.length > 1) {
            const newVariants = variants.filter((_, i) => i !== index);
            setVariants(newVariants);
        } else {
            alert("Produk harus memiliki setidaknya satu varian.");
        }
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
        const finalVariants: Variant[] = variants.map((v, index) => ({
            id: product?.variants[index]?.id || `${new Date().getTime()}-${index}`,
            name: v.name,
            price: Number(v.price) || 0,
            stock: Number(v.stock) || 0,
        }));

        const productData = {
            name: formData.name,
            description: formData.description,
            imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.name}/400/400`,
            category: formData.category,
            discountCodeId: formData.discountCodeId || undefined,
            variants: finalVariants,
            ecommerceLinks: {
                tiktok: formData.tiktok,
                tokopedia: formData.tokopedia,
                shopee: formData.shopee,
                lazada: formData.lazada,
            }
        };

        if (product) {
            updateProduct({ 
                ...product, 
                ...productData 
            });
        } else {
            addProduct(productData);
        }
        onDone();
    };

    const inputClass = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className={labelClass}>Nama Produk</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="category" className={labelClass}>Kategori</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange} className={inputClass}>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="discountCodeId" className={labelClass}>Kode Diskon (Opsional)</label>
                    <select name="discountCodeId" id="discountCodeId" value={formData.discountCodeId} onChange={handleChange} className={inputClass}>
                        <option value="">Tanpa Diskon</option>
                        {discounts.map(disc => (
                            <option key={disc.id} value={disc.id}>
                                {disc.code} ({disc.type === 'percentage' ? `${disc.value}%` : `Rp ${disc.value}`})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="imageUrl" className={labelClass}>URL Gambar</label>
                    <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass} placeholder="Kosongkan untuk gambar acak" />
                </div>
                <div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="description" className={labelClass}>Deskripsi</label>
                        <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400">
                            <Icon name="sparkles" className="w-4 h-4" />
                            {isGenerating ? 'Membuat...' : 'Buat dengan AI'}
                        </button>
                    </div>
                    <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className={inputClass} required></textarea>
                </div>
                
                {/* Variant Management */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">Varian Produk</h3>
                    <div className="space-y-4">
                        {variants.map((variant, index) => (
                             <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex-grow">
                                        <label htmlFor={`variant-name-${index}`} className={labelClass}>Nama Varian (e.g., 100g)</label>
                                        <input type="text" name="name" id={`variant-name-${index}`} value={variant.name} onChange={e => handleVariantChange(index, e)} className={inputClass} required />
                                    </div>
                                    <button type="button" onClick={() => removeVariant(index)} className="mt-6 p-2 text-gray-500 dark:text-gray-400 hover:text-red-500"><Icon name="trash" /></button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={`variant-price-${index}`} className={labelClass}>Harga</label>
                                        <input type="number" name="price" id={`variant-price-${index}`} value={variant.price} onChange={e => handleVariantChange(index, e)} className={inputClass} required />
                                    </div>
                                    <div>
                                        <label htmlFor={`variant-stock-${index}`} className={labelClass}>Stok</label>
                                        <input type="number" name="stock" id={`variant-stock-${index}`} value={variant.stock} onChange={e => handleVariantChange(index, e)} className={inputClass} required />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={addVariant} className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
                        <Icon name="plus" className="w-4 h-4" />
                        Tambah Varian
                    </button>
                </div>
                 
                 <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">Link E-commerce</h3>
                    <div className="space-y-2">
                         <input type="text" name="tiktok" placeholder="Link TikTok Shop" value={formData.tiktok} onChange={handleChange} className={inputClass} />
                         <input type="text" name="tokopedia" placeholder="Link Tokopedia" value={formData.tokopedia} onChange={handleChange} className={inputClass} />
                         <input type="text" name="shopee" placeholder="Link Shopee" value={formData.shopee} onChange={handleChange} className={inputClass} />
                         <input type="text" name="lazada" placeholder="Link Lazada" value={formData.lazada} onChange={handleChange} className={inputClass} />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <button type="button" onClick={onDone} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
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