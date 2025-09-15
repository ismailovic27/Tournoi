"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pot1 = [
  "فريق مغرار", " آفاق جنين بورزق", "قلعة الشيخ بوعمامة", "نجم صفيصيفة",
  "شباب بلحنجير", "الشبيبة", "مولودية البيّض", "شبيبة بني ونيف",
];

const pot2 = [
  "برج الحمام", "الكناري", "فريق حمزة عرابي", "حي 100 مسكن",
  "شبيبة القبائل", "شبيبة بومريفق", "فريق عز الدين قراري", "الأمل",
];

const pot3 = [
  "الوفاق", "الاتحاد", "حومة 19 مارس", "شباب المدينة",
  "شبيبة عين الصفراء الجديدة", "حي 17 أكتوبر", "الجيش الأبيض", "حي أول نوفمبر",
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
      className="px-2 py-1 rounded-md text-xs md:text-sm font-semibold text-center bg-white text-black shadow-sm border-2 border-gray-300 min-w-0 w-full"
    >
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</div>
    </motion.div>
  );
}

function GroupCard({ title, teams }: { title: string; teams: string[] }) {
  return (
    <Card style={{
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      height: '180px'
    }}>
      <CardHeader style={{
        padding: '8px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        color: 'white',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px'
      }}>
        <CardTitle className="text-xs md:text-sm font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        padding: '12px 8px 4px 8px',
        flex: '1'
      }}>
        {teams.length === 0 && (
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            textAlign: 'center',
            padding: '8px 0'
          }}>— في انتظار —</div>
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
    "#3b82f6",
    "#3b82f6",
    "#3b82f6"
  ];

  return (
    <Card style={{
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      height: 'auto'
    }}>
      <CardHeader style={{
        padding: '12px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        color: 'white',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        backgroundColor: potColors[potNumber - 1]
      }}>
        <CardTitle className="text-base md:text-lg font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        padding: '12px 12px 4px 12px',
        flex: '1'
      }}>
        {teams.map((team, i) => (
          <div
            key={team + i}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'center',
              backgroundColor: 'white',
              color: 'black',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #d1d5db',
              minWidth: '0',
              width: '100%'
            }}
          >
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>{team}</div>
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
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 " />

      {/* المحتوى */}
      <div className="relative z-10 flex flex-col h-full">
        {/* الهيدر */}
        <header
  style={{
    paddingTop: "1.25rem",   // py-5
    paddingBottom: "1.25rem",
    flexShrink: 0,           // shrink-0
    display: "flex",         // flex
    alignItems: "center",    // items-center
    gap: "1rem",             // gap-4
    justifyContent: "flex-start", // justify-start
    paddingLeft: "1.5rem",   // pl-6
    paddingRight: "1rem",    // pr-4
  }}
>
</header>

        {/* تصنيف الفرق */}
<main style={{
    display: "flex",              // flex
    justifyContent: "center",     // justify-center
    alignItems: "center",         // items-center
    flex: 1,                      // flex-1
    paddingRight: "6rem",         // pr-24
    paddingTop: "1rem",           // py-4 (top)
    paddingBottom: "1rem",        // py-4 (bottom)
    overflowY: "auto",            // overflow-y-auto
  }}
>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl">
            <PotCard title="الجزائر المنتصرة" teams={pot1} potNumber={1} />
            <PotCard title="عين الصفراء أمانة و وفاء" teams={pot2} potNumber={2} />
            <PotCard title=" غزة أرض العزة" teams={pot3} potNumber={3} />
          </div>
        </main>

        {/* زر بدء القرعة */}
        <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem", // py-4 px-4
  }}
>
  <Button
    onClick={onStartDraw}
    style={{
      backgroundColor: "#d4a373", // green-500
      color: "white",
      fontSize: "1.125rem", // text-lg
      fontWeight: "bold",
      padding: "0.5rem 1.5rem", // px-6 py-2
      borderRadius: "30px",
      cursor: "pointer",
    }}
  >
    <Shuffle style={{ width: "20px", height: "20px", marginLeft: "0.5rem" }} />
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
  const [saving, setSaving] = useState(false);

  // Create tournament and save draw to database
  async function saveTournamentToDatabase(finalGroups: string[][]) {
    try {
      setSaving(true);
      
      // Create tournament
      const tournamentResponse = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'دورة أبطال أمة الأقصى',
          description: 'البطولة المحلية للكرة'
        })
      });
      
      if (!tournamentResponse.ok) {
        throw new Error('فشل في إنشاء البطولة');
      }
      
      const tournament = await tournamentResponse.json();
      console.log('Tournament created with ID:', tournament.id);
      
      // Prepare teams data with pot information
      const teamsData: unknown[] = [];
      const groupsData = groupLabels.map(label => ({ name: label }));
      
      finalGroups.forEach((group, groupIndex) => {
        group.forEach((teamName) => {
          // Determine which pot this team came from
          let pot = 1;
          if (pot2.includes(teamName)) pot = 2;
          else if (pot3.includes(teamName)) pot = 3;
          
          teamsData.push({
            name: teamName,
            pot: pot,
            groupIndex: groupIndex
          });
        });
      });
      
      // Save draw completion
      const drawResponse = await fetch(`/api/tournaments/${tournament.id}/complete-draw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teams: teamsData,
          groups: groupsData
        })
      });
      
      if (!drawResponse.ok) {
        throw new Error('فشل في حفظ القرعة');
      }
      
      console.log('تم حفظ القرعة بنجاح في قاعدة البيانات');
    } catch (error) {
      console.error('خطأ في حفظ القرعة:', error);
      // Don't show error to user, just log it
    } finally {
      setSaving(false);
    }
  }

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
        
        // If this was the last step, save to database
        if (step + 1 >= 3) {
          saveTournamentToDatabase(newGroups);
        }
      }
    }, 1500);
  }

  // Remove unused resetAll function

  // Show classification screen first
  if (showClassification) {
    return <ClassificationScreen onStartDraw={startDraw} />;
  }

  // Show tournament draw screen
  return (
    <div
  dir="rtl"
  style={{
    height: "100vh",            // h-screen
    width: "100vw",             // w-screen
    position: "relative",       // relative
    overflow: "hidden",         // overflow-hidden
    color: "white",             // text-white
    display: "flex",            // flex
    flexDirection: "column",    // flex-col
  }}
>
  {/* الخلفية */}
  <div
    style={{
      position: "absolute",     // absolute
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,                  // inset-0
      backgroundSize: "cover",  // bg-cover
      backgroundPosition: "center", // bg-center
      backgroundImage: "url('/bg2.jpg')",
    }}
  />
  <div
    style={{
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,                  // absolute inset-0
    }}
  />

  {/* المحتوى */}
  <div
    style={{
      position: "relative",     // relative
      zIndex: 10,               // z-10
      display: "flex",          // flex
      flexDirection: "column",  // flex-col
      height: "100%",           // h-full
    }}
  >
        {/* الهيدر */}
        <header
  style={{
    paddingTop: "1.25rem",     // py-5
    paddingBottom: "3rem",
    flexShrink: 0,             // shrink-0
    display: "flex",           // flex
    alignItems: "center",      // items-center
    gap: "1rem",               // gap-4
    justifyContent: "flex-start", // justify-start
    paddingLeft: "1.5rem",     // pl-6
    paddingRight: "1rem",      // pr-4
  }}
>
</header>

{/* الفريق الحالي */}
<div
  style={{
    display: "flex",           // flex
    justifyContent: "center",  // justify-center
    alignItems: "center",      // items-center
    height: "4rem",            // h-16
  }}
>
  <AnimatePresence>
    {currentTeam && (
      <motion.div
        key={currentTeam}
        initial={{ y: -30, opacity: 0, scale: 1.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4 }}
        style={{
          textAlign: "center",    // text-center
          fontSize: "3rem",   // text-lg
          fontWeight: "bold",     // font-bold
          color: "#ef4444",       // text-red-500
          textShadow: "0 2px 6px rgba(0,0,0,0.4)", // drop-shadow-lg
        }}
      >
        {currentTeam}
      </motion.div>
    )}
  </AnimatePresence>
</div>

{/* مجموعات */}
<main
  style={{
    display: "grid",                   // grid
    gridTemplateColumns: "repeat(4, 1fr)", // grid-cols-2
                          // gap-2
    paddingLeft: "0.25rem",             // pl-1
    paddingRight: "3rem",               // pr-12
    paddingTop: "0.5rem",               // py-2 (top)
    paddingBottom: "0.5rem",            // py-2 (bottom)
    flex: 1,                            // flex-1
    overflowY: "auto",                  // overflow-y-auto
    height: "400px",                    // h-[400px]
  }}
>
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
          
        </div>
        
        {/* رسالة إتمام القرعة */}
        {step >= 3 && (
          <div className="flex justify-center items-center py-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
              <p className="font-bold">تمت القرعة بنجاح ⚽</p>
              <p className="text-sm">سيتم نشر نتائج القرعة عبر صفحتنا على الفيسبوك</p>
              {saving && <p className="text-sm mt-2">جاري الحفظ...</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
