"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ProfileSettingsProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    education?: string;
    avatar?: string | null;
  };
  userToken: string;
  onUpdate: (user: ProfileSettingsProps["user"]) => void;
}

export function ProfileSettings({
  user,
  userToken,
  onUpdate,
}: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    email: user.email || "",
    name: user.name || "",
    phone: user.phone || "",
    address: user.address || "",
    education: user.education || "",
    dateOfBirth: "",
    gender: "",
    country: "Indonesia",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Nama harus minimal 3 karakter";
    }

    if (
      formData.phone &&
      !/^[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ""))
    ) {
      newErrors.phone = "Nomor telepon tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Mohon periksa kembali form Anda");
      return;
    }

    if (!userToken) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    try {
      setSaving(true);

      const { authAPI } = await import("@/lib/auth");

      const updateData = {
        name: formData.name,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        education: formData.education || undefined,
      };

      const updatedUser = await authAPI.updateProfile(userToken, updateData);

      onUpdate(updatedUser);

      toast.success("Profil berhasil diperbarui", {
        icon: <CheckCircle className="w-4 h-4" />,
      });
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui profil",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: user.email || "",
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      education: user.education || "",
      dateOfBirth: "",
      gender: "",
      country: "Indonesia",
    });
    setErrors({});
    toast.info("Perubahan dibatalkan");
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Pengaturan Akun</h2>

        <div className="space-y-5 max-w-2xl">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Alamat Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
              placeholder="byeclsss@gmail.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email tidak dapat diubah untuk login dan notifikasi
            </p>
          </div>

          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.name
                  ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              No. Handphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.phone
                  ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="08123456789"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Alamat</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              placeholder="Masukkan alamat lengkap"
            />
          </div>

          {/* Education Level Field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Pendidikan Terakhir
            </label>
            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white cursor-pointer"
            >
              <option value="">Pilih pendidikan terakhir</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>

          {/* Date of Birth Field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="mm/dd/yyyy"
            />
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Jenis Kelamin
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white cursor-pointer"
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* Country Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Negara</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white cursor-pointer"
            >
              <option value="Indonesia">Indonesia</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Singapore">Singapore</option>
              <option value="Thailand">Thailand</option>
              <option value="Philippines">Philippines</option>
              <option value="Vietnam">Vietnam</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="px-6"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 bg-primary hover:bg-primary/90"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
