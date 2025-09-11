"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, RotateCcw } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pot1 = [
  "أصدقاء أمين عبدلي", "آفاق جنين", "قلعة الشيخ بوعمامة", "نجم صفيصيفة",
  "شبيبة بلحنجير", "شباب أولقاق", "شبيبة البيّض", "شباب بني ونيف",
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
      className="px-2 py-1 rounded-md text-xs md:text-sm font-semibold text-center bg-white text-black shadow border-2 border-gray-300 min-w-0 w-full"
    >
      <div className="truncate">{name}</div>
    </motion.div>
  );
}

function GroupCard({ title, teams }: { title: string; teams: string[] }) {
  return (
    <Card className="rounded-lg shadow-lg bg-white/10 backdrop-blur-md flex flex-col h-auto min-h-[140px]">
      <CardHeader className="p-2 border-b bg-blue-500/80 text-white rounded-t-lg">
        <CardTitle className="text-xs md:text-sm font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 items-stretch justify-start px-2 pt-3 pb-1 flex-1">
        {teams.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-2">— في انتظار —</div>
        )}
        {teams.map((t, i) => (
          <TeamPill key={t + i} name={t} />
        ))}
      </CardContent>
    </Card>
  );
}

function PotCard({ title, teams, potNumber }: { title: string; teams: string[]; potNumber: number }) {
  const potColors = [
    "bg-blue-500", // Pot 1 - Gold
    "bg-blue-500",     // Pot 2 - Silver
    "bg-blue-500"    // Pot 3 - Bronze
  ];

  return (
    <Card className="rounded-lg shadow-lg bg-white/50 backdrop-blur-md flex flex-col h-auto max-h-[350px] pt-2 pb-1">
      <CardHeader className={`p-2 border-b text-white rounded-t-lg ${potColors[potNumber - 1]}`}>
        <CardTitle className="text-sm md:text-base font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 items-stretch justify-start px-2 pt-2 pb-1 flex-1 overflow-y-auto">
        {teams.map((team, i) => (
          <div
            key={team + i}
            className="px-2 py-1 rounded-md text-xs font-semibold text-center bg-white text-black shadow border border-gray-300 min-w-0 w-full"
          >
            <div className="truncate">{team}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ClassificationScreen({ onStartDraw }: { onStartDraw: () => void }) {
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
        <header className="py-5 shrink-0 flex items-center gap-4 justify-start pl-6 pr-4">
          <Image
            src="/3.jpg"
            alt="شعار الدورة"
            width={72}
            height={72}
            className="w-16 h-16 rounded-full shadow-md"
            priority
          />
          <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-lg text-green-600">
            تصنيف الفرق المشاركة في دورة أبطال أمة الأقصى
          </h1>
        </header>

        {/* تصنيف الفرق */}
        <main className="flex justify-center items-center flex-1  pr-24 py-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-6xl">
            <PotCard title="الوعاء الأول" teams={pot1} potNumber={1} />
            <PotCard title="الوعاء الثاني" teams={pot2} potNumber={2} />
            <PotCard title="الوعاء الثالث" teams={pot3} potNumber={3} />
          </div>
        </main>

        {/* زر بدء القرعة */}
        <div className="flex justify-center items-center py-4">
          <Button
            onClick={onStartDraw}
            className="bg-green-500 text-white text-lg font-bold hover:bg-green-600 px-6 py-2"
          >
            <Shuffle className="w-5 h-5 ml-2" />
            ابدأ القرعة
          </Button>
        </div>
      </div>
    </div>
  );
}
export default function TournamentDraw() {
  const [groups, setGroups] = useState<string[][]>(Array.from({ length: 8 }, () => []));
  const [pots, setPots] = useState<string[][]>([]);
  const [currentTeam, setCurrentTeam] = useState<string | null>(null);
  const [step, setStep] = useState(0); // 0 = pot1, 1 = pot2, 2 = pot3
  const [index, setIndex] = useState(0);
  const [showClassification, setShowClassification] = useState(true); // New state for initial screen

  function startDraw() {
    setGroups(Array.from({ length: 8 }, () => []));
    setPots([shuffleArray(pot1), shuffleArray(pot2), shuffleArray(pot3)]);
    setCurrentTeam(null);
    setStep(0);
    setIndex(0);
    setShowClassification(false); // Hide classification and show tournament draw
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
    setShowClassification(true); // Return to classification screen
  }

  // Show classification screen first
  if (showClassification) {
    return <ClassificationScreen onStartDraw={startDraw} />;
  }

  // Show tournament draw screen
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
        <header className="py-5 shrink-0 flex items-center gap-4 justify-start pl-6 pr-4">
          <Image
            src="/3.jpg"
            alt="شعار الدورة"
            width={56}
            height={56}
            className="w-16 h-16 rounded-full shadow-md"
            priority
          />
          <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-lg text-green-600">
            قرعة دورة أبطال أمة الأقصى
          </h1>
        </header>

        {/* الفريق الحالي */}
        <div className="flex justify-center items-center h-16">
          <AnimatePresence>
            {currentTeam && (
              <motion.div
                key={currentTeam}
                initial={{ y: -30, opacity: 0, scale: 1.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 30, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="text-center text-lg md:text-4xl font-bold text-red-500 drop-shadow-lg"
              >
                {currentTeam}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* مجموعات */}
<main className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-1 pr-12 py-2 flex-1 overflow-y-auto h-[400px]">
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
