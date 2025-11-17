import React, { useState, useEffect } from 'react';
import { DiscountCode } from '../types';
import { useDiscounts } from '../hooks/useDiscounts';

interface DiscountFormProps {
    discount: DiscountCode | null;
    onDone: () => void;
}

const DiscountForm: React.FC<DiscountFormProps> = ({ discount, onDone }) => {
    const { addDiscount, updateDiscount } = useDiscounts();
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: '',
    });

    useEffect(() => {
        if (discount) {
            setFormData({
                code: discount.code,
                type: discount.type,
                value: discount.value.toString(),
            });
        }
    }, [discount]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const discountData = {
            code: formData.code.toUpperCase(),
            type: formData.type,
            value: parseFloat(formData.value),
        };

        if (isNaN(discountData.value) || discountData.value <= 0) {
            alert('Nilai diskon harus angka positif.');
            return;
        }

        if (discount) {
            updateDiscount({ ...discount, ...discountData });
        } else {
            addDiscount(discountData);
        }
        onDone();
    };

    const inputClass = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{discount ? 'Edit Diskon' : 'Tambah Diskon Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="code" className={labelClass}>Kode Diskon</label>
                    <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="type" className={labelClass}>Tipe Diskon</label>
                    <select name="type" id="type" value={formData.type} onChange={handleChange} className={inputClass}>
                        <option value="percentage">Persentase (%)</option>
                        <option value="fixed">Potongan Tetap (Rp)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="value" className={labelClass}>Nilai</label>
                    <input type="number" name="value" id="value" value={formData.value} onChange={handleChange} className={inputClass} required placeholder={formData.type === 'percentage' ? 'Contoh: 10 untuk 10%' : 'Contoh: 5000 untuk Rp 5.000'}/>
                </div>
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button type="button" onClick={onDone} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                        Batal
                    </button>
                    <button type="submit" className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600">
                        {discount ? 'Simpan Perubahan' : 'Tambah Diskon'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DiscountForm;