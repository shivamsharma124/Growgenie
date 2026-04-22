import { useState } from "react";
import { aiService } from "../services";
import { Button, Input, Textarea, Card, PageHeader, AIResultBox } from "../components/common/UI";
import toast from "react-hot-toast";

const LANGS = ["Hindi", "Tamil", "Bengali", "Marathi", "Telugu", "Gujarati"];
const TABS  = [
  { key: "adcopy",  label: "📢 Ad Copy"    },
  { key: "desc",    label: "📝 Product Desc"},
  { key: "trans",   label: "🌐 Translate"   },
  { key: "poster",  label: "🖼️ Poster Prompt"},
];

export default function MarketingPage() {
  const [tab, setTab]         = useState("adcopy");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState("");

  const [adcopy,  setAdcopy]  = useState({ input: "", extra: "" });
  const [desc,    setDesc]    = useState({ input: "", extra: "" });
  const [trans,   setTrans]   = useState({ input: "", extra: "Hindi" });
  const [poster,  setPoster]  = useState({ input: "" });

  const call = async (fn, payload, errorMsg) => {
    if (!payload.input) return toast.error(errorMsg || "Input is required");
    setLoading(true); setResult("");
    try {
      const res = await fn(payload);
      setResult(res.data.data?.result || "");
      toast.success("Content generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Generation failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Marketing & Ad Copy" subtitle="AI-powered marketing content for your business" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-[#1a1a26] p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setResult(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-medium font-dm transition-all ${
              tab === t.key ? "bg-white dark:bg-[#12121a] text-gray-800 dark:text-white shadow-sm" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Ad Copy ── */}
        {tab === "adcopy" && (
          <>
            <Card>
              <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">Social Media Ad Copy</h3>
              <div className="space-y-4">
                <Input label="Product Name *" placeholder="e.g. Homemade Masala Chai" value={adcopy.input}
                  onChange={(e) => setAdcopy({ ...adcopy, input: e.target.value })} />
                <Input label="Target Audience" placeholder="e.g. Young professionals, 25-35" value={adcopy.extra}
                  onChange={(e) => setAdcopy({ ...adcopy, extra: e.target.value })} />
                <Button onClick={() => call(aiService.adCopy, adcopy, "Enter product name")} loading={loading} className="w-full">
                  ✦ Generate Ad Copy
                </Button>
              </div>
              <AIResultBox result={result} loading={loading} />
            </Card>
            <Card className="bg-indigo-50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20">
              <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-3">What's included</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-dm">
                {["Instagram caption + hashtags","Facebook ad copy","Google Ads headline","Call-to-action phrases","Emoji-enhanced content","India-specific tone"].map((i) => (
                  <li key={i} className="flex items-center gap-2"><span className="text-indigo-500">✓</span>{i}</li>
                ))}
              </ul>
            </Card>
          </>
        )}

        {/* ── Product Description ── */}
        {tab === "desc" && (
          <>
            <Card>
              <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">SEO Product Description</h3>
              <div className="space-y-4">
                <Input label="Product Name *" placeholder="e.g. Beeswax Candle Set" value={desc.input}
                  onChange={(e) => setDesc({ ...desc, input: e.target.value })} />
                <Input label="Category" placeholder="e.g. Home Decor, Food & Beverage" value={desc.extra}
                  onChange={(e) => setDesc({ ...desc, extra: e.target.value })} />
                <Button onClick={() => call(aiService.productDescription, desc, "Enter product name")} loading={loading} className="w-full">
                  ✦ Generate Description
                </Button>
              </div>
              <AIResultBox result={result} loading={loading} />
            </Card>
            <Card className="bg-teal-50 dark:bg-teal-500/5 border-teal-100 dark:border-teal-500/20">
              <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-3">Description includes</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-dm">
                {["SEO-optimised title","Bullet features list","Persuasive benefits copy","Call-to-action","Under 150 words","E-commerce ready"].map((i) => (
                  <li key={i} className="flex items-center gap-2"><span className="text-teal-500">✓</span>{i}</li>
                ))}
              </ul>
            </Card>
          </>
        )}

        {/* ── Translation ── */}
        {tab === "trans" && (
          <>
            <Card>
              <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">Multi-Language Translator</h3>
              <div className="space-y-4">
                <Textarea label="Content to Translate *" placeholder="Taste the authentic flavors of India..." value={trans.input}
                  onChange={(e) => setTrans({ ...trans, input: e.target.value })} rows={4} />
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Target Language</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGS.map((lang) => (
                      <button key={lang} onClick={() => setTrans({ ...trans, extra: lang })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all font-dm ${
                          trans.extra === lang
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-gray-200 dark:border-[#2a2a3d] text-gray-500 dark:text-gray-400 hover:border-indigo-400"
                        }`}>
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={() => call(aiService.translate, trans, "Enter content to translate")} loading={loading} className="w-full">
                  ✦ Translate to {trans.extra}
                </Button>
              </div>
              <AIResultBox result={result} loading={loading} />
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-500/5 border-yellow-100 dark:border-yellow-500/20">
              <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-3">Why translate?</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-dm">
                {["Reach regional customers","Culturally appropriate tone","Increase brand trust","Expand market reach","Hindi — 500M+ speakers","Tamil/Bengali/Marathi markets"].map((i) => (
                  <li key={i} className="flex items-center gap-2"><span className="text-yellow-500">✓</span>{i}</li>
                ))}
              </ul>
            </Card>
          </>
        )}

        {/* ── Poster Prompt ── */}
        {tab === "poster" && (
          <>
            <Card>
              <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">DALL·E Poster Prompt</h3>
              <div className="space-y-4">
                <Input label="Brand Name & Style *" placeholder="e.g. Desi Tadka — warm, traditional Indian aesthetic" value={poster.input}
                  onChange={(e) => setPoster({ input: e.target.value })} />
                <div className="bg-gray-50 dark:bg-[#1a1a26] rounded-xl p-3 text-xs text-gray-400 dark:text-gray-500 font-dm">
                  💡 Tip: Describe your brand style — rustic, modern, festive, minimalist, etc. The AI will generate a detailed DALL·E prompt you can use directly.
                </div>
                <Button onClick={() => call(aiService.posterPrompt, poster, "Describe your brand")} loading={loading} className="w-full">
                  ✦ Generate DALL·E Prompt
                </Button>
              </div>
              <AIResultBox result={result} loading={loading} />
              {result && (
                <Button variant="secondary" size="sm" className="mt-3"
                  onClick={() => { navigator.clipboard.writeText(result); toast.success("Prompt copied!"); }}>
                  📋 Copy Prompt
                </Button>
              )}
            </Card>
            <Card className="bg-pink-50 dark:bg-pink-500/5 border-pink-100 dark:border-pink-500/20">
              <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-3">How to use</h3>
              <ol className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-dm list-none">
                {["Enter your brand name and style preferences","Click 'Generate DALL·E Prompt'","Copy the generated prompt","Paste it into DALL·E, Midjourney, or Stable Diffusion","Download your branded poster!"].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-pink-200 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
