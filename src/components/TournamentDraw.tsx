"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ====== الفرق ======
const defaultTeams = [
  "الفريق 1","الفريق 2","الفريق 3","الفريق 4","الفريق 5","الفريق 6",
  "الفريق 7","الفريق 8","الفريق 9","الفريق 10","الفريق 11","الفريق 12",
  "الفريق 13","الفريق 14","الفريق 15","الفريق 16","الفريق 17","الفريق 18",
  "الفريق 19","الفريق 20","الفريق 21","الفريق 22","الفريق 23","الفريق 24",
];

const groupLabels = [
  "المجموعة A","المجموعة B","المجموعة C","المجموعة D",
  "المجموعة E","المجموعة F","المجموعة G","المجموعة H",
];

// ====== خوارزمية خلط ======
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ====== شارة فريق ======
function TeamPill({ name, highlight = false }: { name: string; highlight?: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`px-3 py-1 rounded-2xl text-sm font-semibold whitespace-nowrap border shadow-sm ${
        highlight ? "bg-green-50 border-green-300" : "bg-white border-gray-200"
      }`}
    >
      {name}
    </motion.div>
  );
}

// ====== بطاقة مجموعة ======
function GroupCard({ title, teams }: { title: string; teams: string[] }) {
  return (
    <Card className="rounded-2xl shadow-md bg-white/80 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {teams.map((t, i) => (
            <AnimatePresence key={t + i}>
              {t && <TeamPill name={t} highlight={i < 2 && teams.length >= 2} />}
            </AnimatePresence>
          ))}
          {teams.length === 0 && (
            <div className="text-sm text-gray-400">— في انتظار السحب —</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ====== المكوّن الرئيسي ======
export default function TournamentDraw() {
  const [groups, setGroups] = useState<string[][]>(Array.from({ length: 8 }, () => []));
  const [remaining, setRemaining] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // لمتابعة الدور

  function startDraw() {
    setRemaining(shuffleArray(defaultTeams));
    setGroups(Array.from({ length: 8 }, () => []));
    setCurrentIndex(0);
  }

  function drawOneTeam() {
    if (remaining.length === 0) return;

    const nextTeam = remaining[0];
    const rest = remaining.slice(1);

    const groupIndex = currentIndex % 8;
    const newGroups = [...groups];
    newGroups[groupIndex] = [...newGroups[groupIndex], nextTeam];

    setGroups(newGroups);
    setRemaining(rest);
    setCurrentIndex(currentIndex + 1);
  }

  function resetAll() {
    setGroups(Array.from({ length: 8 }, () => []));
    setRemaining([]);
    setCurrentIndex(0);
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-cover bg-center text-gray-800 p-4 md:p-8 relative"
      style={{ backgroundImage: "url('/1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/3.jpg"
              alt="شعار الدورة"
              className="w-16 h-16 rounded-full shadow-md border bg-white"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">
              دورة أبطال أمة الأقصى
              </h1>
              <p className="text-sm text-gray-200 mt-1 drop-shadow">
                قرعة دور المجموعات
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {groups.map((g, idx) => (
            <GroupCard key={idx} title={groupLabels[idx]} teams={g} />
          ))}
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          {remaining.length === 0 && currentIndex === 0 ? (
            <Button onClick={startDraw} variant="secondary">
              <Shuffle className="w-4 h-4 ml-2" />
              بدء السحب
            </Button>
          ) : (
            <Button onClick={drawOneTeam} variant="secondary" disabled={remaining.length === 0}>
              <Shuffle className="w-4 h-4 ml-2" />
              سحب فريق
            </Button>
          )}
          <Button onClick={resetAll} variant="destructive">
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة ضبط
          </Button>
        </div>

        <footer className="mt-6 text-xs text-gray-200 drop-shadow">
          صُممت هذه الصفحة لعرض القرعة مباشرة مع شعار الدورة وخلفية مخصصة.
        </footer>
      </div>
    </div>
  );
}
