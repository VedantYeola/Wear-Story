
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Product } from '../types';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, LogOut } from 'lucide-react';
import { Button } from './Button';

interface AdminPanelProps {
    onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        category: 'Tops',
        price: 0,
        description: '',
        image: '',
        tags: []
    });

    const CATEGORIES = ['Outerwear', 'Dresses', 'Jackets', 'Knitwear', 'Bottoms', 'Footwear', 'Tops'];

    const [activeTab, setActiveTab] = useState<'products' | 'logs'>('products');
    const [logs, setLogs] = useState<any[]>([]);

    // Fetch products on load if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
            fetchLogs();
        }
    }, [isAuthenticated]);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (data) setProducts(data);
        setLoading(false);
    };

    const fetchLogs = async () => {
        let dbLogs: any[] = [];
        try {
            const { data, error } = await supabase
                .from('user_activity_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);
            if (data) dbLogs = data;
            if (error) console.warn("Supabase log fetch warning:", error.message);
        } catch (e) {
            console.warn("Supabase fetch exception", e);
        }

        // Merge with local logs (fallback for demo environments)
        let localLogs: any[] = [];
        try {
            const stored = localStorage.getItem('local_activity_logs');
            if (stored) {
                localLogs = JSON.parse(stored);
            }
        } catch (e) { console.error("Local log read error", e); }

        // Combine and dedup (concat for viewing)
        const combined = [...localLogs, ...dbLogs].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setLogs(combined.slice(0, 50)); // Limit display to 50
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded check for demo purposes
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid password');
        }
    };

    /* ... handlers ... */
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Error deleting product');
        } else {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        const payload = {
            ...formData,
            tags: [formData.category?.toLowerCase() || '', 'manual'],
            rating: formData.rating || 5.0,
            reviews: formData.reviews || 0
        };

        if (isEditing) {
            // Update
            const { error } = await supabase
                .from('products')
                .update(payload)
                .eq('id', isEditing.id);

            if (!error) {
                setProducts(prev => prev.map(p => p.id === isEditing.id ? { ...p, ...payload } : p));
                resetForm();
            }
        } else {
            // Create
            const { data, error } = await supabase
                .from('products')
                .insert([payload])
                .select();

            if (!error && data) {
                setProducts(prev => [data[0], ...prev]);
                resetForm();
            }
        }
    };

    const resetForm = () => {
        setIsAdding(false);
        setIsEditing(null);
        setFormData({
            name: '',
            category: 'Tops',
            price: 0,
            description: '',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
            tags: []
        });
    };

    const startEdit = (product: Product) => {
        setIsEditing(product);
        setFormData(product);
        setIsAdding(true);
    };

    /* ... render auth ... */
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                                placeholder="Enter admin password"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-black text-white py-2 rounded-lg">
                            Login
                        </Button>
                        <button type="button" onClick={onBack} className="w-full text-sm text-gray-500 hover:text-gray-900">
                            Back to Store
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold font-serif text-gray-900">Store Admin</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'products' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => { setActiveTab('logs'); fetchLogs(); }}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'logs' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            Activity Log
                        </button>
                    </div>
                </div>
                <div className="flex gap-3">
                    {!isAdding && activeTab === 'products' && (
                        <Button onClick={() => { resetForm(); setIsAdding(true); }} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add Product
                        </Button>
                    )}
                    <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Exit
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 flex gap-6">
                {/* Editor Sidebar (Conditional) - Only for Products Tab */}
                {isAdding && activeTab === 'products' && (
                    <div className="w-96 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">{isEditing ? 'Edit Product' : 'New Product'}</h3>
                            <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            {/* ... form fields same as before ... */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                <input
                                    className="w-full border p-2 rounded text-sm"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full border p-2 rounded text-sm"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                    <select
                                        className="w-full border p-2 rounded text-sm"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        className="w-full border p-2 rounded text-sm"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        required
                                    />
                                </div>
                                {formData.image && (
                                    <div className="mt-2 h-32 w-full rounded-lg overflow-hidden border border-gray-200">
                                        <img src={formData.image} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea
                                    className="w-full border p-2 rounded text-sm h-24"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                <Save className="h-4 w-4" /> {isEditing ? 'Update Product' : 'Create Product'}
                            </Button>
                        </form>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === 'products' ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                                        <img src={product.image} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">${product.price}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => startEdit(product)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {products.length === 0 && !loading && (
                                <div className="p-12 text-center text-gray-500">
                                    No products found. Start by adding one!
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Action</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Details</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                                {log.user_email || log.user_id}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                <span className={`px-2 py-1 rounded text-xs ${log.action_type === 'PURCHASE_SUCCESS' ? 'bg-green-100 text-green-800' :
                                                    log.action_type === 'ADD_TO_CART' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {log.action_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden">
                                                {log.details ? (
                                                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {logs.length === 0 && (
                                <div className="p-12 text-center text-gray-500">
                                    No logs found yet.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
