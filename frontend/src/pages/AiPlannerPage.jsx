import { useState, useEffect } from "react";
import { aiService } from "../services";
import { Button, Input, Textarea, Card, PageHeader, Badge, AIResultBox, EmptyState } from "../components/common/UI";
import toast from "react-hot-toast";

const TABS = [
  { key: "roadmap",    label: "🗺️ Roadmap"     },
  { key: "strategy",   label: "📊 Market Strategy" },
  { key: "adcopy",     label: "📢 Ad Copy"      },
  { key: "proddesc",   label: "📝 Product Desc" },
  { key: "history",    label: "🕐 History"      },
];

export default function AiPlannerPage() {
  const [tab, setTab]         = useState("roadmap");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState("");
  const [history, setHistory] = useState([]);
  const [hLoading, setHLoading] = useState(false);

  // Per-tab form state
  const [roadmap,   setRoadmap]   = useState({ input: "", extra: "" });
  const [strategy,  setStrategy]  = useState({ input: "", extra: "" });
  const [adcopy,    setAdcopy]    = useState({ input: "", extra: "" });
  const [proddesc,  setProddesc]  = useState({ input: "", extra: "" });

  useEffect(() => {
    if (tab === "history") loadHistory();
    else setResult("");
  }, [tab]);

  const loadHistory = async () => {
    setHLoading(true);
    try {
      const res = await aiService.getHistory();
      setHistory(res.data.data || []);
    } catch { toast.error("Failed to load history"); }
    finally { setHLoading(false); }
  };

  const call = async (fn, payload) => {
    setLoading(true); setResult("");
    try {
      const res = await fn(payload);
      setResult(res.data.data?.result || "");
      toast.success("Generated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Generation failed");
    } finally { setLoading(false); }
  };

  const typeLabel = { ROADMAP: "info", MARKET_STRATEGY: "success", AD_COPY: "warning", PRODUCT_DESCRIPTION: "default", TRANSLATION: "danger", POSTER_PROMPT: "default", FAQ_ANSWER: "info" };

  return (
    <div className="animate-fade-in">
      <PageHeader title="AI Business Planner" subtitle="GPT-4 powered — roadmap, strategy, ad copy & more" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-[#1a1a26] p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-medium font-dm transition-all ${
              tab === t.key ? "bg-white dark:bg-[#12121a] text-gray-800 dark:text-white shadow-sm" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Roadmap ── */}
      {tab === "roadmap" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">6-Month Startup Roadmap</h3>
            <div className="space-y-4">
              <Input label="Business Idea *" placeholder="e.g. Homemade pickle brand" value={roadmap.input}
                onChange={(e) => setRoadmap({ ...roadmap, input: e.target.value })} />
              <Input label="Target Market" placeholder="e.g. Delhi, UP, Haryana" value={roadmap.extra}
                onChange={(e) => setRoadmap({ ...roadmap, extra: e.target.value })} />
              <Button onClick={() => { if (!roadmap.input) return toast.error("Enter your business idea"); call(aiService.roadmap, roadmap); }} loading={loading} className="w-full">
                ✦ Generate Roadmap with GPT-4
              </Button>
            </div>
            <AIResultBox result={result} loading={loading} />
          </Card>
          <Card className="bg-indigo-50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20">
            <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-3">What you'll get</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-dm">
              {["Month-by-month milestone plan","Marketing steps for each phase","Revenue targets per month","Team & resource planning","Key metrics to track","Risk mitigation strategies"].map((i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-teal-500 mt-0.5">✓</span>{i}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* ── Market Strategy ── */}
      {tab === "strategy" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">Market Strategy Generator</h3>
            <div className="space-y-4">
              <Input label="Product/Business *" placeholder="e.g. Aam Ka Achar" value={strategy.input}
                onChange={(e) => setStrategy({ ...strategy, input: e.target.value })} />
              <Input label="Target Region" placeholder="e.g. North India, Mumbai" value={strategy.extra}
                onChange={(e) => setStrategy({ ...strategy, extra: e.target.value })} />
              <Button onClick={() => { if (!strategy.input) return toast.error("Enter your product"); call(aiService.marketStrategy, strategy); }} loading={loading} className="w-full">
                ✦ Generate Market Strategy
              </Button>
            </div>
            <AIResultBox result={result} loading={loading} />
          </Card>
          <Card className="bg-teal-50 dark:bg-teal-500/5 border-teal-100 dark:border-teal-500/20">
            <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-3">Strategy covers</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-dm">
              {["Target audience definition","Unique Selling Proposition (USP)","Pricing strategy","Distribution channels","Competitor analysis","Digital marketing plan"].map((i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-teal-500 mt-0.5">✓</span>{i}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* ── Ad Copy ── */}
      {tab === "adcopy" && (
        <Card className="max-w-2xl">
          <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">Social Media Ad Copy Generator</h3>
          <div className="space-y-4">
            <Input label="Product Name *" placeholder="e.g. Homemade Masala Chai" value={adcopy.input}
              onChange={(e) => setAdcopy({ ...adcopy, input: e.target.value })} />
            <Input label="Target Audience" placeholder="e.g. Working professionals 25-40 in Delhi" value={adcopy.extra}
              onChange={(e) => setAdcopy({ ...adcopy, extra: e.target.value })} />
            <Button onClick={() => { if (!adcopy.input) return toast.error("Enter product name"); call(aiService.adCopy, adcopy); }} loading={loading} className="w-full">
              ✦ Generate Ad Copy
            </Button>
          </div>
          <AIResultBox result={result} loading={loading} />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 font-dm">
            Generates: Instagram caption + Facebook ad + Google Ads headline
          </p>
        </Card>
      )}

      {/* ── Product Description ── */}
      {tab === "proddesc" && (
        <Card className="max-w-2xl">
          <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">SEO Product Description Generator</h3>
          <div className="space-y-4">
            <Input label="Product Name *" placeholder="e.g. Handmade Beeswax Candle Set" value={proddesc.input}
              onChange={(e) => setProddesc({ ...proddesc, input: e.target.value })} />
            <Input label="Category" placeholder="e.g. Home Decor" value={proddesc.extra}
              onChange={(e) => setProddesc({ ...proddesc, extra: e.target.value })} />
            <Button onClick={() => { if (!proddesc.input) return toast.error("Enter product name"); call(aiService.productDescription, proddesc); }} loading={loading} className="w-full">
              ✦ Generate Description
            </Button>
          </div>
          <AIResultBox result={result} loading={loading} />
        </Card>
      )}

      {/* ── History ── */}
      {tab === "history" && (
        <Card className="overflow-hidden p-0">
          {hLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="p-6"><EmptyState icon="🕐" title="No AI generations yet" subtitle="Use any AI tool above to get started" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1a1a26] border-b border-gray-100 dark:border-[#2a2a3d]">
                  {["Type", "Prompt (preview)", "Generated At"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-gray-50 dark:border-[#1e1e2e] hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <Badge variant={typeLabel[h.type] || "default"}>{h.type?.replace(/_/g, " ")}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs truncate font-dm">
                      {h.prompt?.slice(0, 80)}...
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
                      {h.createdAt ? new Date(h.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  );
}
