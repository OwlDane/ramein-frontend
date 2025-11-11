"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Clock,
  SlidersHorizontal,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { apiFetch, buildQuery } from "@/lib/api";
import type { BackendEvent } from "@/types/event";
import { format, parseISO } from "date-fns";

interface EventCatalogProps {
  onEventSelect: (eventId: string) => void;
}

export function EventCatalog({ onEventSelect }: EventCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("nearest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<BackendEvent[]>([]);

  const categories = [
    "all",
    "Technology",
    "Marketing",
    "Business",
    "Design",
    "Creative",
  ];

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const q = buildQuery({
          search: searchQuery || undefined,
          sort: sortBy,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
        });
        const data = await apiFetch<BackendEvent[]>(`/events${q}`);
        setEvents(data);
      } catch (e) {
        console.error("Failed to fetch events:", e);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchQuery, sortBy, selectedCategory]);

  const formatEventDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return {
        day: format(date, "dd"),
        month: format(date, "MMM"),
        year: format(date, "yyyy"),
        full: format(date, "MMM dd, yyyy"),
      };
    } catch {
      return { day: "01", month: "Jan", year: "2025", full: "TBA" };
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-medium block mb-4">
              DISCOVER
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              All <span className="italic">Events</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Explore amazing events and find your next experience
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-foreground/30 transition-colors text-lg"
                />
              </div>

              {/* Filter Button */}
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                size="lg"
                variant={isFilterOpen ? "default" : "outline"}
                className="rounded-2xl px-8"
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
                {(selectedCategory !== "all" || sortBy !== "nearest") && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-6 rounded-2xl bg-card border border-border">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-medium mb-3">
                          Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === cat
                                  ? "bg-foreground text-background"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              {cat === "all" ? "All Categories" : cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort Filter */}
                      <div>
                        <label className="block text-sm font-medium mb-3">
                          Sort By
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSortBy("nearest")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              sortBy === "nearest"
                                ? "bg-foreground text-background"
                                : "bg-muted hover:bg-muted/80"
                            }`}
                          >
                            Nearest First
                          </button>
                          <button
                            onClick={() => setSortBy("furthest")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              sortBy === "furthest"
                                ? "bg-foreground text-background"
                                : "bg-muted hover:bg-muted/80"
                            }`}
                          >
                            Furthest First
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {(selectedCategory !== "all" || sortBy !== "nearest") && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <Button
                          onClick={() => {
                            setSelectedCategory("all");
                            setSortBy("nearest");
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `${events.length} events found`}
            </p>
          </motion.div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSortBy("nearest");
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {events.map((event, index) => {
                const dateInfo = formatEventDate(event.date);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => onEventSelect(event.id)}
                    className="group cursor-pointer"
                  >
                    <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-foreground/30 transition-all duration-300 shadow-soft hover:shadow-soft-hover h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <Image
                          src={
                            event.flyer ||
                            `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&seed=${event.id}`
                          }
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Date Badge */}
                        <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-2xl p-3 text-center min-w-[70px]">
                          <div className="text-2xl font-bold leading-none">
                            {dateInfo.day}
                          </div>
                          <div className="text-xs font-medium uppercase mt-1">
                            {dateInfo.month}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {event.description}
                        </p>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          {event.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">
                                {event.location}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mb-4 pb-4 border-t border-border pt-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary">
                              {"price" in event && event.price
                                ? new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  }).format(event.price as number)
                                : "Gratis"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              /orang
                            </span>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className="flex items-center gap-2 text-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm">View Details</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
