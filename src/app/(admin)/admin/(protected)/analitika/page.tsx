import Link from "next/link";
import { getOverview, parseRange, RANGE_UZ } from "@/lib/analytics/queries";
import { REF_TYPE_UZ, type RefType } from "@/lib/analytics/referrer";
import { countryLabel, deviceLabel, localeLabel } from "@/lib/analytics/labels";
import { delta, formatCount, formatDuration, formatPercent, stripLocale } from "@/lib/analytics/format";
import { BarList, EmptyLine, KpiCard, Panel } from "@/components/admin/analytics/primitives";
import { TrendChart } from "@/components/admin/analytics/TrendChart";
import { RangeTabs } from "@/components/admin/analytics/RangeTabs";
import { LiveBadge } from "@/components/admin/analytics/LiveBadge";
import { LiveRefresher } from "@/components/admin/analytics/LiveRefresher";
import {
  Bag,
  Clock,
  ExternalLink,
  Eye,
  Info,
  MapPin,
  Megaphone,
  Package,
  Search,
  Sparkle,
  Storefront,
  Tag,
  TrendingUp,
  Users,
} from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export const metadata = { title: "Analitika" };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const range = parseRange((await searchParams).range);
  const o = await getOverview(range);
  const { kpi, prev } = o;

  return (
    <div>
      <LiveRefresher />

      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl">Analitika</h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            Nechta odam kirdi, qayerdan keldi, qaysi sahifani ochdi va qaysi tugmani bosdi.
            Ma&apos;lumot o&apos;z serverimizda — tashqi servis yo&apos;q.
          </p>
        </div>
        <LiveBadge visitors={o.live.visitors} />
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      <div className="mt-6">
        <RangeTabs current={range} />
      </div>

      {/* ───────────────────────── Measurements ───────────────────────── */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          icon={Users}
          label="Tashrifchilar"
          value={formatCount(kpi.visitors)}
          change={delta(kpi.visitors, prev.visitors)}
          hint="noyob odamlar"
        />
        <KpiCard
          icon={Sparkle}
          label="Sessiyalar"
          value={formatCount(kpi.sessions)}
          change={delta(kpi.sessions, prev.sessions)}
          hint="tashriflar soni"
        />
        <KpiCard
          icon={Eye}
          label="Sahifa ko'rishlari"
          value={formatCount(kpi.pageviews)}
          change={delta(kpi.pageviews, prev.pageviews)}
        />
        <KpiCard
          icon={Clock}
          label="O'rtacha vaqt"
          value={formatDuration(kpi.avgDuration)}
          change={delta(kpi.avgDuration, prev.avgDuration)}
          hint="bir sessiyada"
        />
        <KpiCard
          icon={TrendingUp}
          label="Bir sahifada ketgan"
          value={formatPercent(kpi.bounceRate)}
          change={delta(kpi.bounceRate, prev.bounceRate)}
          invertChange
          hint="bounce rate"
        />
        <KpiCard
          icon={Info}
          label="Sahifa / sessiya"
          value={kpi.pagesPerSession.toFixed(1)}
          change={delta(kpi.pagesPerSession, prev.pagesPerSession)}
        />
      </div>

      {/* ──────────────── Small multiples: one measure each ──────────────── */}
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <section className="card p-5 md:p-6">
          <span className="seam absolute inset-x-0 top-0" aria-hidden="true" />
          <TrendChart
            points={o.series.map((p) => ({ label: p.label, value: p.visitors }))}
            title={`Tashrifchilar · ${RANGE_UZ[range]}`}
            unit="tashrifchi"
          />
        </section>
        <section className="card p-5 md:p-6">
          <span className="seam absolute inset-x-0 top-0" aria-hidden="true" />
          <TrendChart
            points={o.series.map((p) => ({ label: p.label, value: p.pageviews }))}
            title={`Sahifa ko'rishlari · ${RANGE_UZ[range]}`}
            unit="ko'rish"
          />
        </section>
      </div>

      {/* ───────────────────────── Acquisition ───────────────────────── */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <Panel icon={Search} title="Qayerdan kirgan" hint="Manba turi bo'yicha">
          <BarList
            rows={o.sources.map((r) => ({
              key: REF_TYPE_UZ[r.key as RefType] ?? r.key,
              value: r.visitors,
              sub: `${formatCount(r.sessions)} sessiya`,
            }))}
          />
        </Panel>

        <Panel icon={ExternalLink} title="Havola bergan saytlar" hint="Aniq domenlar">
          <BarList
            rows={o.referrers.map((r) => ({ key: r.key, value: r.visitors }))}
            empty="Hozircha faqat to'g'ridan-to'g'ri kirishlar"
          />
        </Panel>

        <Panel icon={Megaphone} title="Reklama kampaniyalari" hint="utm_campaign">
          <BarList
            rows={o.campaigns.map((r) => ({ key: r.key, value: r.visitors }))}
            empty="UTM belgilangan havola ishlatilmagan"
          />
        </Panel>
      </div>

      {/* ───────────────────────── Behaviour ───────────────────────── */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel icon={Eye} title="Eng ko'p ko'rilgan sahifalar">
          <BarList
            rows={o.pages.map((p) => ({
              key: stripLocale(p.path),
              value: p.views,
              sub: `${formatCount(p.sessions)} sessiya`,
            }))}
            unitLabel="ko'rish"
          />
        </Panel>

        <Panel icon={Tag} title="Eng ko'p bosilgan tugmalar" hint="Har bir bosish avtomatik yoziladi">
          <BarList
            rows={o.clicks.map((c) => ({
              key: c.name,
              value: c.count,
              sub: `${formatCount(c.sessions)} sessiya`,
            }))}
            unitLabel="bosish"
            empty="Hali bosilgan tugma yo'q"
          />
        </Panel>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <Panel icon={Bag} title="Eng qiziqilgan mahsulotlar">
          {o.products.length === 0 ? (
            <EmptyLine />
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
              {o.products.map((p) => (
                <li key={p.slug} className="flex items-center justify-between gap-3 py-3">
                  {p.id ? (
                    <Link
                      href={`/admin/mahsulotlar/${p.id}`}
                      className="min-w-0 flex-1 truncate text-sm font-semibold transition-colors duration-200 hover:text-gold-dk"
                    >
                      {p.name}
                    </Link>
                  ) : (
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.name}</span>
                  )}
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-sm tabular-nums" style={{ color: "var(--fg-muted)" }}>
                    <Eye size={15} />
                    {formatCount(p.views)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel icon={Sparkle} title="Maxsus hodisalar" hint="track() bilan yozilganlar">
          <BarList
            rows={o.customEvents.map((c) => ({ key: c.name, value: c.count }))}
            unitLabel="marta"
            empty="Maxsus hodisa yo'q"
          />
        </Panel>

        <Panel icon={Storefront} title="Kirish sahifalari" hint="Sayt qaysi sahifadan boshlangan">
          <BarList rows={o.landings.map((r) => ({ key: stripLocale(r.key), value: r.visitors }))} />
        </Panel>
      </div>

      {/* ───────────────────────── Audience ───────────────────────── */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Panel icon={Package} title="Qurilmalar">
          <BarList rows={o.devices.map((r) => ({ key: deviceLabel(r.key), value: r.visitors }))} />
        </Panel>

        <Panel icon={Info} title="Brauzerlar">
          <BarList rows={o.browsers.map((r) => ({ key: r.key, value: r.visitors }))} />
        </Panel>

        <Panel icon={Info} title="Tizimlar" hint="Operatsion tizim">
          <BarList rows={o.systems.map((r) => ({ key: r.key, value: r.visitors }))} />
        </Panel>

        <Panel icon={MapPin} title="Davlatlar" hint="Nginx GeoIP kerak">
          <BarList
            rows={o.countries.map((r) => ({ key: countryLabel(r.key), value: r.visitors }))}
            empty="GeoIP yoqilmagan"
          />
        </Panel>
      </div>

      {/* ───────────────────────── Right now ───────────────────────── */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel icon={Users} title="Hozir qaysi sahifada" hint="So'nggi 5 daqiqa">
          <BarList
            rows={o.live.pages.map((p) => ({ key: stripLocale(p.path), value: p.count }))}
            unitLabel="tashrifchi"
            empty="Hozir saytda hech kim yo'q"
          />
        </Panel>

        <Panel icon={Info} title="Sayt tili">
          <BarList rows={o.languages.map((r) => ({ key: localeLabel(r.key), value: r.visitors }))} />
        </Panel>
      </div>
    </div>
  );
}
