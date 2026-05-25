import { Navbar } from "@/components/dashboard/Navbar";
import { Hero } from "@/components/dashboard/Hero";
import { GoldDashboard, type GoldData } from "@/components/dashboard/GoldDashboard";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { fetchTwelveData, fetchThaiGoldPrice } from "@/lib/gold-price";

async function getGoldPrice(): Promise<GoldData | null> {
  try {
    const spot = await fetchTwelveData();
    const thai = await fetchThaiGoldPrice(spot);
    return {
      xauUsd: spot.xauUsd,
      usdThb: spot.usdThb,
      thaiGold: {
        ornamentSell: thai.ornamentSell,
        ornamentBuy:  thai.ornamentBuy,
        barSell:      thai.barSell,
        barBuy:       thai.barBuy,
        updatedAt:    thai.updatedAt,
      },
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function getUserCount(): Promise<number> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    return data?.users?.length ?? 0;
  } catch {
    return 0;
  }
}

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [initialData, userCount] = await Promise.all([
    getGoldPrice(),
    getUserCount(),
  ]);

  return (
    <main className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-6 sm:py-8 pb-20">
      <Navbar
        userEmail={user?.email}
        userAvatar={user?.user_metadata?.avatar_url}
        userCount={userCount}
      />
      <Hero />
      <GoldDashboard initialData={initialData} />
      <footer className="mt-12 sm:mt-16 text-center text-[11px] sm:text-xs text-ink-faint max-w-2xl mx-auto leading-relaxed">
        ข้อมูลที่แสดงเป็นเพียงการวิเคราะห์ทางเทคนิคจากข้อมูลในอดีต ไม่ใช่คำแนะนำการลงทุน
        ผู้ใช้ควรศึกษาข้อมูลและตัดสินใจด้วยตนเอง
      </footer>
    </main>
  );
}
