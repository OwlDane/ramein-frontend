'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HeaderNew as Header } from '@/components/layout/HeaderNew';
import { FooterNew as Footer } from '@/components/layout/FooterNew';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { getArticleBySlug, getArticles } from '@/lib/dummyArticles';
import type { Article } from '@/types/article';
import { format } from 'date-fns';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function ArticleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            const data = await getArticleBySlug(slug);
            setArticle(data);
            
            if (data) {
                // Fetch related articles from same category
                const related = await getArticles({ category: data.category, limit: 3 });
                setRelatedArticles(related.filter(a => a.id !== data.id));
            }
            
            setLoading(false);
        };

        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
                    <Button onClick={() => router.push('/articles')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Articles
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header onViewChange={() => {}} currentView="articles" />

            <main className="pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button & Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center justify-between mb-8"
                        >
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/articles')}
                                className="gap-2 hover:gap-3 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Articles
                            </Button>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                                    <Bookmark className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>

                        {/* Article Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-8"
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-muted text-sm font-medium mb-6">
                                {article.category}
                            </span>
                            
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {article.title}
                            </h1>

                            {/* Author & Meta Info */}
                            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={article.author.avatar}
                                        alt={article.author.name}
                                        className="w-14 h-14 rounded-full border-2 border-border"
                                    />
                                    <div>
                                        <div className="font-semibold text-lg">{article.author.name}</div>
                                        {article.author.role && (
                                            <div className="text-sm text-muted-foreground">{article.author.role}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{format(new Date(article.publishedAt), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{article.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Featured Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-12"
                        >
                            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-muted">
                                <img
                                    src={article.coverImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-12"
                        >
                            {/* Article Content with Better Typography */}
                            <div className="prose prose-lg prose-slate max-w-none
                                prose-headings:font-bold prose-headings:tracking-tight
                                prose-h1:text-4xl prose-h1:mb-4
                                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-strong:font-semibold prose-strong:text-foreground
                                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                                prose-li:my-2 prose-li:text-lg
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic
                                prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                                prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-xl
                                prose-img:rounded-2xl prose-img:my-8"
                            >
                                <ReactMarkdown>{article.content}</ReactMarkdown>
                            </div>
                        </motion.div>

                        {/* Related Articles */}
                        {relatedArticles.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
                                
                                <div className="grid md:grid-cols-3 gap-6">
                                    {relatedArticles.map((relatedArticle) => (
                                        <Link key={relatedArticle.id} href={`/articles/${relatedArticle.slug}`}>
                                            <div className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border hover:border-foreground/30 transition-all duration-300">
                                                <div className="relative aspect-[16/10] overflow-hidden">
                                                    <img
                                                        src={relatedArticle.coverImage}
                                                        alt={relatedArticle.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                        {relatedArticle.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {relatedArticle.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
