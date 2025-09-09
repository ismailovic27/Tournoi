"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pot1 = [
  "أصدقاء أمين عبدلي", "آفاق جنين", "قلعة الشيخ بوعمامة", "نجم صفيصيفة",
  "شبيبة بلحنجير", "شباب أولقاق", "شبيبة البيِّض", "شباب بني ونيف",
];

const pot2 = [
  "برج الحمام", "الكناري", "حمزة عرابي", "100 مسكن",
  "شبيبة القبائل", "شبيبة بومريفق", "عز الدين لغراري", "الأمل",
];

const pot3 = [
  "الوفاق", "الاتحاد", "حومة 19 مارس", "شباب المدينة",
  "نجم الصحراء", "حي 17 أكتوبر", "الجيش الأبيض", "حي أول نوفمبر",
];

const groupLabels = [
  "المجموعة A","المجموعة B","المجموعة C","المجموعة D",
  "المجموعة E","المجموعة F","المجموعة G","المجموعة H",
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TeamPill({ name }: { name: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="px-2 py-1 rounded-md text-xs md:text-sm font-semibold text-center bg-white text-black shadow"
    >
      {name}
    </motion.div>
  );
}

function GroupCard({ title, teams }: { title: string; teams: string[] }) {
  return (
    <Card className="rounded-lg shadow-lg bg-white/50 backdrop-blur flex flex-col h-[180px]">
      <CardHeader className="p-1 border-b">
        <CardTitle className="text-xs md:text-sm font-bold text-black-900 text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 items-center justify-center px-1 py-2 overflow-hidden">
        {teams.length === 0 && (
          <div className="text-xs text-gray-400">— في انتظار —</div>
        )}
        {teams.map((t, i) => (
          <TeamPill key={t + i} name={t} />
        ))}
      </CardContent>
    </Card>
  );
}

export default function TournamentDraw() {
  const [groups, setGroups] = useState<string[][]>(Array.from({ length: 8 }, () => []));
  const [pots, setPots] = useState<string[][]>([]);
  const [currentTeam, setCurrentTeam] = useState<string | null>(null);
  const [step, setStep] = useState(0); // 0 = pot1, 1 = pot2, 2 = pot3
  const [index, setIndex] = useState(0);

  function startDraw() {
    setGroups(Array.from({ length: 8 }, () => []));
    setPots([shuffleArray(pot1), shuffleArray(pot2), shuffleArray(pot3)]);
    setCurrentTeam(null);
    setStep(0);
    setIndex(0);
  }

  function drawOneTeam() {
    if (step >= 3) return;

    const currentPot = pots[step];
    if (!currentPot || index >= currentPot.length) return;

    const nextTeam = currentPot[index];
    setCurrentTeam(nextTeam);

    setTimeout(() => {
      const newGroups = [...groups];
      newGroups[index] = [...newGroups[index], nextTeam];

      setGroups(newGroups);
      setIndex(index + 1);
      setCurrentTeam(null);

      if (index + 1 >= 8) {
        setStep(step + 1);
        setIndex(0);
      }
    }, 1500);
  }

  function resetAll() {
    setGroups(Array.from({ length: 8 }, () => []));
    setPots([]);
    setCurrentTeam(null);
    setStep(0);
    setIndex(0);
  }

  return (
    <div dir="rtl" className="h-screen w-screen relative overflow-hidden text-white flex flex-col">
      {/* الخلفية */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/1.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-green-600/30 via-red-400/30 to-[#C2B280]/40" />

      {/* المحتوى */}
      <div className="relative z-10 flex flex-col h-full">
        {/* الهيدر */}
        <header className="text-center py-3 shrink-0 flex flex-col items-center gap-2">
          <img
            src="/3.jpg"
            alt="شعار الدورة"
            className="w-14 h-14 rounded-full border-2 border-white shadow-md"
          />
          <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-lg">
            قرعة دورة أبطال أمة الأقصى
          </h1>
        </header>

        {/* الفريق الحالي */}
        <div className="flex justify-center items-center h-16">
          <AnimatePresence>
            {currentTeam && (
              <motion.div
                key={currentTeam}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center text-xl md:text-2xl font-bold text-yellow-300 drop-shadow-lg"
              >
                {currentTeam}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* مجموعات */}
        <main className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
          {groups.map((g, idx) => (
            <GroupCard key={idx} title={groupLabels[idx]} teams={g} />
          ))}
        </main>

        {/* أزرار التحكم */}
        <div className="flex gap-3 justify-center items-center py-2">
          {pots.length === 0 ? (
            <Button
              onClick={startDraw}
              className="bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500"
            >
              <Shuffle className="w-4 h-4 ml-1" />
              بدء القرعة
            </Button>
          ) : (
            <Button
              onClick={drawOneTeam}
              disabled={step >= 3}
              className="bg-green-500 text-sm hover:bg-green-600"
            >
              <Shuffle className="w-4 h-4 ml-1" />
              سحب فريق
            </Button>
          )}
          <Button onClick={resetAll} className="bg-red-500 text-sm hover:bg-red-600">
            <RotateCcw className="w-4 h-4 ml-1" />
            إعادة ضبط
          </Button>
        </div>
      </div>
    </div>
  );
}
