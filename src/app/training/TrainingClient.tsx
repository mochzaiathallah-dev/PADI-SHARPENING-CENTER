"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Calendar, Users, Star, ArrowRight, ShieldCheck } from "lucide-react";

type TrainingFromDb = {
  id: string;
  title_id: string;
  title_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: any;
  date: any;
  location: string;
  capacity: number;
  registeredCount: number;
  imageUrl?: string | null;
};

type TrainingClientProps = {
  initialTrainings: TrainingFromDb[];
};

// Fallback preset courses for professional visual rendering
const FALLBACK_COURSES = [
  {
    id: "fallback-private-asah",
    titleId: "Private Asah Presisi (1-on-1)",
    titleEn: "Private Precision Sharpening (1-on-1)",
    descId: "Pelatihan intensif 1-on-1 mengenai teori sudut asah, penggunaan whetstone batu alam premium, honing steel, dan strop kulit.",
    descEn: "Intensive 1-on-1 coaching covering bevel angle theories, premium natural whetstones, honing steels, and leather strops.",
    price: 1500000,
    scheduleId: "Setiap Akhir Pekan (Sabtu/Minggu)",
    scheduleEn: "Every Weekend (Saturday/Sunday)",
    capacity: 1,
    registered: 0,
    isPrivate: true,
  },
  {
    id: "fallback-sembelih",
    titleId: "Pelatihan Sembelih Profesional",
    titleEn: "Professional Slaughter Training",
    descId: "Pelatihan teknik pemakaian bilah sembelih, pengasahan cepat tanggap darurat, dan standar kelayakan tajam bilah untuk RPH.",
    descEn: "Instruction in slaughter blade handling, quick emergency edge maintenance, and blade sharpness testing guidelines for abattoirs.",
    price: 750000,
    scheduleId: "15 Agustus 2026, 09:00 - 16:00 WIB",
    scheduleEn: "August 15, 2026, 09:00 AM - 04:00 PM",
    capacity: 20,
    registered: 14,
    isPrivate: false,
  },
  {
    id: "fallback-others",
    titleId: "Workshop & Group Masterclass",
    titleEn: "Workshop & Group Masterclass",
    descId: "Pelatihan asah kelompok (min 5 orang) untuk komunitas hobiis, koki restoran, atau staf jagal di RPH/industri kuliner.",
    descEn: "Group sharpening workshops (min 5 people) for hobbyists, kitchen crews, or slaughterhouse butchers.",
    price: 2500000,
    scheduleId: "Jadwal Fleksibel (Sesuai Perjanjian)",
    scheduleEn: "Flexible Schedule (By Appointment)",
    capacity: 10,
    registered: 3,
    isPrivate: false,
  },
];

export default function TrainingClient({ initialTrainings }: TrainingClientProps) {
  const { t, language, footerPhone } = useApp();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getWhatsAppLink = (courseTitle: string) => {
    const text = language === "id"
      ? `Halo Padi Sharpening Center, saya tertarik untuk mendaftar program pelatihan: ${courseTitle}. Mohon informasi ketersediaan slot dan cara pembayarannya.`
      : `Hello Padi Sharpening Center, I am interested in registering for the training program: ${courseTitle}. Please provide slot availability and payment details.`;
    const cleanPhone = footerPhone.replace(/\D/g, "");
    const waPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    return `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
  };

  const formatDate = (dateVal: any) => {
    return new Date(dateVal).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Maps database entries if present. Otherwise, displays default fallback course templates.
  const displayCourses = initialTrainings.length > 0 
    ? initialTrainings.map((tDb) => {
        const isPrivate = tDb.capacity === 1;
        return {
          id: tDb.id,
          titleId: tDb.title_id,
          titleEn: tDb.title_en,
          descId: tDb.description_id,
          descEn: tDb.description_en,
          price: Number(tDb.price),
          scheduleId: formatDate(tDb.date),
          scheduleEn: formatDate(tDb.date),
          capacity: tDb.capacity,
          registered: tDb.registeredCount,
          isPrivate,
          imageUrl: tDb.imageUrl,
        };
      })
    : FALLBACK_COURSES.map(c => ({ ...c, imageUrl: null }));

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {t("trainingTitle")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("trainingSubtitle")}
            </p>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-2" />
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {displayCourses.map((course) => {
              const title = language === "id" ? course.titleId : course.titleEn;
              const desc = language === "id" ? course.descId : course.descEn;
              const schedule = language === "id" ? course.scheduleId : course.scheduleEn;
              
              // Progress Bar Math
              const fillPercent = course.isPrivate 
                ? (course.registered > 0 ? 100 : 0)
                : Math.min((course.registered / course.capacity) * 100, 100);

              return (
                <div
                  key={course.id}
                  className="flex flex-col h-full justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/45 transition-all relative overflow-hidden"
                >
                  <div className="space-y-6">
                    {course.imageUrl && (
                      <div className="w-full h-40 rounded-xl overflow-hidden border border-border bg-muted/20">
                        <img src={course.imageUrl} alt={title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    {/* Badge and Title */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-primary">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-xs uppercase font-extrabold tracking-wider">
                          {course.isPrivate ? "1-on-1 Class" : "Group Class"}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground leading-tight">
                        {title}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Schedule & Capacity Details */}
                    <div className="space-y-3.5 pt-4 border-t border-border/80 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2.5">
                        <Calendar className="h-4.5 w-4.5 text-primary shrink-0" />
                        <span><strong>{t("courseSchedule")}:</strong> {schedule}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2.5">
                        <Users className="h-4.5 w-4.5 text-primary shrink-0" />
                        <span>
                          <strong>{t("courseCapacity")}:</strong> {course.isPrivate ? (course.registered > 0 ? "Booked" : "1 Person Slot") : `${course.capacity} Slots`}
                        </span>
                      </div>
                    </div>

                    {/* Registration Progress Bar (Exclude for Private Class if not booked) */}
                    {!course.isPrivate && (
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">{t("courseRegistered")}</span>
                          <span className="text-foreground">{course.registered} / {course.capacity}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500 rounded-full" 
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing and Booking CTA */}
                  <div className="mt-8 pt-4 border-t border-border/80 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Investment</span>
                      <span className="text-2xl font-black text-foreground">{formatPrice(course.price)}</span>
                    </div>

                    <a
                      href={getWhatsAppLink(title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 text-xs font-bold bg-primary text-primary-foreground rounded-md text-center shadow-sm hover:bg-primary/95 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>{t("courseRegisterNow")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Professional Quality Badges */}
          <div className="mt-16 p-8 rounded-2xl border border-border bg-card/45 flex flex-col md:flex-row items-center justify-around gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-foreground">Sertifikat Kelulusan</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Dapatkan sertifikat resmi dari Padi Sharpening Center.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-10 w-10 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-foreground">Instruktur Berpengalaman</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Dilatih langsung oleh praktisi asah presisi bersertifikasi.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
