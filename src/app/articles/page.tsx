"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HeaderNew as Header } from "@/components/layout/HeaderNew";
import { FooterNew as Footer } from "@/components/layout/FooterNew";
import { Clock, Calendar, ArrowRight, Search } from "lucide-react";
import { articleAPI } from "@/lib/articleApi";
import type { Article, ArticleCategory } from "@/types/article";
import { format } from "date-fns";
import Link from "next/link";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await articleAPI.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await articleAPI.getArticles({
          category: selectedCategory === "all" ? undefined : selectedCategory,
          search: searchQuery || undefined,
        });
        setArticles(response.data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header onViewChange={() => {}} currentView="articles" />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-medium block mb-4">
                BLOG
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                News, Insight, <span className="italic">and more</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Stay updated with the latest stories, tips, and insights from
                the event world
              </p>
            </motion.div>

            {/* Search & Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-foreground/30 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-foreground text-background"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  All Articles
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.slug
                        ? "bg-foreground text-background"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found.</p>
              </div>
            ) : (
              <>
                {/* Featured Article */}
                {featuredArticle && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-16"
                  >
                    <Link href={`/articles/${featuredArticle.slug}`}>
                      <div className="group cursor-pointer bg-card rounded-3xl overflow-hidden border border-border hover:border-foreground/30 transition-all duration-300">
                        <div className="grid md:grid-cols-2 gap-0">
                          {/* Image */}
                          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[400px] overflow-hidden">
                            <Image
                              src={featuredArticle.coverImage}
                              alt={featuredArticle.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              priority
                            />
                            <div className="absolute top-6 left-6">
                              <span className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm text-sm font-medium">
                                Featured
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-8 md:p-12 flex flex-col justify-center">
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-foreground inline-block w-fit mb-4">
                              {featuredArticle.category}
                            </span>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                              {featuredArticle.title}
                            </h2>

                            <p className="text-muted-foreground mb-6 line-clamp-3">
                              {featuredArticle.excerpt}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(
                                    new Date(featuredArticle.publishedAt),
                                    "MMM dd, yyyy",
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{featuredArticle.readTime}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-foreground font-medium group-hover:gap-3 transition-all">
                              <span>Read More</span>
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Regular Articles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    >
                      <Link href={`/articles/${article.slug}`}>
                        <article className="group cursor-pointer h-full">
                          <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-foreground/30 transition-all duration-300 h-full flex flex-col">
                            {/* Image */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
                                  {article.category}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                <span>
                                  {format(
                                    new Date(article.publishedAt),
                                    "MMM dd, yyyy",
                                  )}
                                </span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{article.readTime}</span>
                                </div>
                              </div>

                              <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {article.title}
                              </h3>

                              <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                                {article.excerpt}
                              </p>

                              <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                                <span>Read More</span>
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
