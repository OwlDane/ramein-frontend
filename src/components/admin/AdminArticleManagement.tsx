'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { articleAPI } from '@/lib/articleApi';
import type { Article, ArticleCategory } from '@/types/article';
import { format } from 'date-fns';

interface AdminArticleManagementProps {
    token: string;
}

export function AdminArticleManagement({ token }: AdminArticleManagementProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<ArticleCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    useEffect(() => {
        fetchCategories();
        fetchArticles();
    }, [statusFilter, categoryFilter]);

    const fetchCategories = async () => {
        try {
            const data = await articleAPI.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await articleAPI.getAllArticlesAdmin(token, {
                status: statusFilter,
                category: categoryFilter === 'all' ? undefined : categoryFilter,
                search: searchQuery || undefined,
            });
            setArticles(response.data);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; articleId: string; articleTitle: string }>({
        show: false,
        articleId: '',
        articleTitle: ''
    });

    const handleDelete = async (id: string, title: string) => {
        setDeleteConfirm({ show: true, articleId: id, articleTitle: title });
    };

    const confirmDelete = async () => {
        try {
            await articleAPI.deleteArticle(token, deleteConfirm.articleId);
            setDeleteConfirm({ show: false, articleId: '', articleTitle: '' });
            fetchArticles();
        } catch (error) {
            console.error('Failed to delete article:', error);
            alert('Gagal menghapus artikel');
        }
    };

    const handleTogglePublish = async (article: Article) => {
        try {
            await articleAPI.updateArticle(token, article.id, {
                isPublished: !article.isPublished,
            });
            fetchArticles();
        } catch (error) {
            console.error('Failed to toggle publish:', error);
            alert('Gagal mengubah status publikasi');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Article Management</h2>
                    <p className="text-muted-foreground mt-1">
                        Kelola artikel dan konten blog
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    Buat Artikel
                </button>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30"
                    >
                        <option value="all">Semua Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30"
                    >
                        <option value="all">Semua Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Articles Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Tidak ada artikel</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Judul</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Kategori</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Views</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Tanggal</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{article.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {article.excerpt}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-muted">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    article.isPublished
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {article.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {article.viewCount || 0}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {article.publishedAt
                                                ? format(new Date(article.publishedAt), 'dd MMM yyyy')
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleTogglePublish(article)}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title={article.isPublished ? 'Unpublish' : 'Publish'}
                                                >
                                                    {article.isPublished ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setEditingArticle(article)}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id, article.title)}
                                                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || editingArticle) && (
                <ArticleFormModal
                    token={token}
                    article={editingArticle}
                    categories={categories}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingArticle(null);
                    }}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        setEditingArticle(null);
                        fetchArticles();
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Hapus Artikel?</h3>
                                <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan</p>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-muted-foreground mb-1">Artikel yang akan dihapus:</p>
                            <p className="font-semibold line-clamp-2">{deleteConfirm.articleTitle}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, articleId: '', articleTitle: '' })}
                                className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

// Article Form Modal Component
function ArticleFormModal({
    token,
    article,
    categories,
    onClose,
    onSuccess,
}: {
    token: string;
    article: Article | null;
    categories: ArticleCategory[];
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        title: article?.title || '',
        authorName: article?.author?.name || '',
        excerpt: article?.excerpt || '',
        content: article?.content || '',
        coverImage: article?.coverImage || '',
        categoryId: article?.categoryId || '',
        tags: article?.tags?.join(', ') || '',
        isPublished: article?.isPublished || false,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                ...formData,
                tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
            };

            if (article) {
                await articleAPI.updateArticle(token, article.id, data);
            } else {
                await articleAPI.createArticle(token, data);
            }

            onSuccess();
        } catch (error) {
            console.error('Failed to save article:', error);
            alert('Gagal menyimpan artikel');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-border">
                    <h3 className="text-2xl font-bold">
                        {article ? 'Edit Artikel' : 'Buat Artikel Baru'}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Judul *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30"
                            placeholder="Masukkan judul artikel"
                        />
                    </div>

                    {/* Author Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Nama Penulis *</label>
                        <input
                            type="text"
                            required
                            value={formData.authorName}
                            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30"
                            placeholder="Masukkan nama penulis"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Nama penulis akan ditampilkan di artikel
                        </p>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Excerpt</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30"
                            rows={2}
                            placeholder="Ringkasan singkat artikel"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Konten (Markdown) *</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30 font-mono text-sm"
                            rows={12}
                            placeholder="Tulis konten artikel dalam format Markdown..."
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Cover Image URL</label>
                        <input
                            type="url"
                            value={formData.coverImage}
                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Kategori</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30"
                        >
                            <option value="">Pilih kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Tags (pisahkan dengan koma)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-foreground/30"
                            placeholder="tag1, tag2, tag3"
                        />
                    </div>

                    {/* Publish Status */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPublished"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <label htmlFor="isPublished" className="text-sm font-medium">
                            Publikasikan artikel
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? 'Menyimpan...' : article ? 'Update' : 'Buat Artikel'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
