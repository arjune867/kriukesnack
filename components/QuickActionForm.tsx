import React, { useState, useEffect } from 'react';
import { QuickAction, IconName } from '../types';
import { useQuickActions } from '../hooks/useQuickActions';
import { availableIcons } from './Icon';

interface QuickActionFormProps {
    quickAction: QuickAction | null;
    onDone: () => void;
}

// Predefined color themes matching the original component
const colorOptions = [
    { name: 'Red', value: 'bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400' },
    { name: 'Green', value: 'bg-green-100 dark:bg-green-500/20 text-green-500 dark:text-green-400' },
    { name: 'Blue', value: 'bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400' },
    { name: 'Purple', value: 'bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400' },
    { name: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-500 dark:text-yellow-400' },
    { name: 'Indigo', value: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400' },
    { name: 'Pink', value: 'bg-pink-100 dark:bg-pink-500/20 text-pink-500 dark:text-pink-400' },
    { name: 'Orange', value: 'bg-orange-100 dark:bg-orange-500/20 text-orange-500 dark:text-orange-400' },
    { name: 'Teal', value: 'bg-teal-100 dark:bg-teal-500/20 text-teal-500 dark:text-teal-400' },
    { name: 'Sky', value: 'bg-sky-100 dark:bg-sky-500/20 text-sky-500 dark:text-sky-400' },
];

const QuickActionForm: React.FC<QuickActionFormProps> = ({ quickAction, onDone }) => {
    const { addQuickAction, updateQuickAction } = useQuickActions();
    const [formData, setFormData] = useState({
        name: '',
        icon: 'ticket' as IconName,
        color: colorOptions[0].value,
        link: '',
    });

    useEffect(() => {
        if (quickAction) {
            setFormData({
                name: quickAction.name,
                icon: quickAction.icon,
                color: quickAction.color,
                link: quickAction.link || '',
            });
        }
    }, [quickAction]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as IconName }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const actionData = {
            name: formData.name,
            icon: formData.icon,
            color: formData.color,
            link: formData.link,
        };

        if (quickAction) {
            updateQuickAction({ ...quickAction, ...actionData });
        } else {
            addQuickAction(actionData);
        }
        onDone();
    };
    
    const inputClass = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";


    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{quickAction ? 'Edit Ikon Promosi' : 'Tambah Ikon Promosi'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className={labelClass}>Nama Aksi</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="link" className={labelClass}>Link URL (Opsional)</label>
                    <input type="text" name="link" id="link" value={formData.link} onChange={handleChange} className={inputClass} placeholder="Contoh: #diskon atau https://..." />
                </div>
                <div>
                    <label htmlFor="icon" className={labelClass}>Ikon</label>
                    <select name="icon" id="icon" value={formData.icon} onChange={handleChange} className={inputClass}>
                        {availableIcons.map(iconName => (
                            <option key={iconName} value={iconName}>
                                {iconName.charAt(0).toUpperCase() + iconName.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="color" className={labelClass}>Warna</label>
                    <select name="color" id="color" value={formData.color} onChange={handleChange} className={inputClass}>
                        {colorOptions.map(opt => (
                            <option key={opt.name} value={opt.value}>
                                {opt.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <button type="button" onClick={onDone} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                        Batal
                    </button>
                    <button type="submit" className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600">
                        {quickAction ? 'Simpan Perubahan' : 'Tambah Ikon'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuickActionForm;