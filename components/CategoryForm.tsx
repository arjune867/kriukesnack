
import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { useCategories } from '../hooks/useCategories';

interface CategoryFormProps {
    category: Category | null;
    onDone: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onDone }) => {
    const { addCategory, updateCategory } = useCategories();
    const [name, setName] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Nama kategori tidak boleh kosong.');
            return;
        }

        if (category) {
            updateCategory({ ...category, name });
        } else {
            addCategory(name);
        }
        onDone();
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">{category ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Kategori</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" 
                        required 
                    />
                </div>
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button type="button" onClick={onDone} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                        Batal
                    </button>
                    <button type="submit" className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600">
                        {category ? 'Simpan Perubahan' : 'Tambah Kategori'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
