import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productService, invoiceService, aiService, faqService } from "../services";
import { StatCard, Card, Button, Modal, Badge } from "../components/common/UI";
import toast from "react-hot-toast";

const MODULES = [
  { to: "/ai",        icon: "🗺️", name: "AI Business Planner",   desc: "Startup roadmap & market strategy via GPT-4" },
  { to: "/marketing", icon: "📣", name: "Marketing & Ads",        desc: "Ad copy, descriptions & multilingual campaigns" },
  { to: "/invoices",  icon: "🧾", name: "Invoice Generator",      desc: "GST-compliant PDF invoices via iText" },
  { to: "/products",  icon: "📦", name: "Product Catalog",        desc: "Full CRUD — manage your products & services" },
  { to: "/faq",       icon: "💬", name: "FAQ Bot",                desc: "Train your bot — AI handles queries 24/7" },
  { to: "/marketing", icon: "🌐", name: "Multilingual Translator", desc: "Campaigns in Hindi, Tamil, Bengali, Marathi" },
];

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats]     = useState({ products: 0, ai: 0, invoices: 0, faq: 0 });
  const [loading, setLoading] = useState(true);
  const [showSub, setShowSub] = useState(false);
  const [selPlan, setSelPlan] = useState(user?.subscriptionPlan || "MONTHLY");
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      invoiceService.getAll(),
      aiService.getHistory(),
      faqService.getAll(),
    ]).then(([p, inv, ai, faq]) => {
      setStats({
        products: p.data.data?.length  || 0,
        invoices: inv.data.data?.length || 0,
        ai:       ai.data.data?.length  || 0,
        faq:      faq.data.data?.length || 0,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async () => {
    setSubLoading(true);
    try {
      const { authService } = await import("../services");
      const res  = await authService.updateSubscription(selPlan);
      const data = res.data.data;
      updateUser({ ...user, subscriptionPlan: data.subscriptionPlan, subscriptionExpiry: data.subscriptionExpiry });
      toast.success(`Subscription updated to ${selPlan} plan!`);
      setShowSub(false);
    } catch {
      toast.error("Subscription update failed");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold text-gray-800 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 font-dm">
          Your AI business dashboard — Spring Boot + JWT + OpenAI
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Products"      value={loading ? "—" : stats.products} change="Catalog items"    positive={null} />
        <StatCard label="AI Generations" value={loading ? "—" : stats.ai}      change="Total queries"    positive={true} />
        <StatCard label="Invoices Sent" value={loading ? "—" : stats.invoices} change="GST-compliant"    positive={null} />
        <StatCard label="FAQ Entries"   value={loading ? "—" : stats.faq}      change="Knowledge base"   positive={true} />
      </div>

      {/* Modules */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-bold text-gray-700 dark:text-white">AI Modules</h2>
          <Badge variant="warning">6 Modules Active</Badge>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <Card key={m.name}
              className="cursor-pointer hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-200 group"
              onClick={() => navigate(m.to)}>
              <span className="text-2xl block mb-3">{m.icon}</span>
              <p className="font-syne text-sm font-semibold text-gray-700 dark:text-white mb-1">{m.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-dm">{m.desc}</p>
              <p className="text-xs text-indigo-400 mt-3 group-hover:translate-x-1 transition-transform font-dm">
                Open →
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription card */}
        <Card>
          <h2 className="font-syne font-bold text-gray-700 dark:text-white mb-4">Your Plan</h2>
          <div className="flex items-center justify-between mb-3">
            <div>
              <Badge variant={user?.subscriptionPlan === "YEARLY" ? "success" : "info"}>
                {user?.subscriptionPlan || "FREE TRIAL"}
              </Badge>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-dm">
                Expires: {user?.subscriptionExpiry || "—"}
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowSub(true)}>
              Upgrade Plan ↗
            </Button>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 font-dm space-y-1 pt-3 border-t border-gray-100 dark:border-[#2a2a3d]">
            <p>✓ All 6 AI modules • ✓ PDF invoices • ✓ FAQ bot</p>
            <p>✓ Multi-language • ✓ Unlimited products</p>
          </div>
        </Card>
      </div>

      {/* Subscription Modal */}
      <Modal open={showSub} onClose={() => setShowSub(false)} title="Upgrade Subscription">
        <div className="grid grid-cols-2 gap-4 mb-5">
          {[
            { key: "MONTHLY", price: "₹299", period: "/mo",  features: ["All 6 AI modules","PDF invoices","FAQ bot","Multi-language"], color: "indigo" },
            { key: "YEARLY",  price: "₹2,499", period: "/yr", features: ["Everything in Monthly","Priority AI","Custom branding","Dedicated support"], color: "teal", badge: "SAVE 30%" },
          ].map((plan) => (
            <div key={plan.key} onClick={() => setSelPlan(plan.key)}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all relative ${
                selPlan === plan.key
                  ? plan.color === "teal"
                    ? "border-teal-400 bg-teal-50 dark:bg-teal-500/10"
                    : "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                  : "border-gray-200 dark:border-[#2a2a3d] hover:border-indigo-300 dark:hover:border-indigo-500"
              }`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {plan.badge}
                </span>
              )}
              <p className="font-syne font-bold text-sm text-gray-700 dark:text-white">{plan.key}</p>
              <p className={`font-syne text-2xl font-black mt-1 ${plan.color === "teal" ? "text-teal-500" : "text-indigo-500"}`}>
                {plan.price}<span className="text-xs font-normal text-gray-400 ml-1">{plan.period}</span>
              </p>
              <ul className="text-xs text-gray-400 dark:text-gray-500 mt-3 space-y-1 font-dm">
                {plan.features.map((f) => <li key={f}>✓ {f}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <Button className="w-full" loading={subLoading} onClick={handleSubscribe}>
          Confirm {selPlan} Plan →
        </Button>
      </Modal>
    </div>
  );
}
