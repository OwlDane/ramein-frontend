"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { Camera, Calendar, MapPin, Users, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import type { GalleryItem, GalleryResponse } from "@/types/gallery";

// Helper function to convert file path to absolute URL
const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // If already an absolute URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If relative path (e.g., uploads/gallery/... or gallery/...), convert to absolute URL
  if (imagePath.startsWith('uploads/') || imagePath.startsWith('gallery/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    // Remove trailing /api if present to avoid double /api
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    // Remove 'uploads/' prefix if present (backend serves from /api/files which maps to uploads/)
    const cleanPath = imagePath.startsWith('uploads/') ? imagePath.slice(8) : imagePath;
    return `${cleanBaseUrl}/api/files/${cleanPath}`;
  }
  
  // If starts with /, it's already a relative path for Next.js
  return imagePath;
};

export default function GaleriPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fixed categories from database
  const categories = [
    { id: "all", name: "Semua Kegiatan" },
    { id: "Webinar", name: "Webinar" },
    { id: "Training", name: "Training" },
    { id: "Conference", name: "Conference" },
    { id: "Workshop", name: "Workshop" },
    { id: "Seminar", name: "Seminar" }
  ];

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch<GalleryResponse>('/gallery?limit=12&page=1');
        setGalleryItems(response.data);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
        // Fallback to empty array
        setGalleryItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Filter items berdasarkan category
  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openModal = (item: GalleryItem) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView="galeri" />

      <main className="pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Camera className="w-8 h-8 text-green-600" />
                <h1 className="text-4xl font-bold text-gray-900">
                  Galeri Kegiatan
                </h1>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dokumentasi visual dari berbagai kegiatan dan event yang telah diselenggarakan oleh RAMEIN
              </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">Tidak ada galeri untuk kategori ini</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => openModal(item)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={getImageUrl(item.image) || `https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop&seed=${item.id}`}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>{item.participants} peserta</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mt-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="mt-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        item.category === 'workshop' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'seminar' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Lainnya'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="relative h-96">
                <Image
                  src={getImageUrl(selectedImage.image) || `https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop&seed=${selectedImage.id}`}
                  alt={selectedImage.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 90vw"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedImage.title}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span>{selectedImage.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span>{selectedImage.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5 text-green-600" />
                    <span>{selectedImage.participants} peserta</span>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
}
