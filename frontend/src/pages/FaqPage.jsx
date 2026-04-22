import { useState, useEffect } from "react";
import { faqService, aiService } from "../services";
import { Button, Input, Textarea, Card, PageHeader, AIResultBox, EmptyState, Spinner } from "../components/common/UI";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function FaqPage() {
  const [faqs, setFaqs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult]   = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer]     = useState("");
  const [askQ, setAskQ]         = useState("");

  const load = async () => {
    try {
      const res = await faqService.getAll();
      setFaqs(res.data.data || []);
    } catch { toast.error("Failed to load FAQs"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleTrain = async () => {
    if (!question || !answer) return toast.error("Both question and answer required");
    setSaving(true);
    try {
      await faqService.train({ question, answer });
      toast.success("FAQ added to knowledge base!");
      setQuestion(""); setAnswer("");
      load();
    } catch { toast.error("Failed to save FAQ"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await faqService.delete(id);
      toast.success("FAQ deleted");
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch { toast.error("Delete failed"); }
  };

  const handleAsk = async () => {
    if (!askQ) return toast.error("Enter a customer question");
    setAiLoading(true); setAiResult("");
    try {
      const res = await aiService.faqAsk({ input: askQ });
      setAiResult(res.data.data?.result || "");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI response failed");
    } finally { setAiLoading(false); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Customer FAQ Bot" subtitle="Train your bot — AI handles customer queries 24/7" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Train + Ask */}
        <div className="space-y-5">
          {/* Train */}
          <Card>
            <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">📚 Train Your Bot</h3>
            <div className="space-y-4">
              <Input label="Customer Question *" placeholder="What are your delivery timings?" value={question}
                onChange={(e) => setQuestion(e.target.value)} />
              <Textarea label="Your Answer *" placeholder="We deliver between 9 AM and 7 PM, Mon–Sat." value={answer}
                onChange={(e) => setAnswer(e.target.value)} rows={3} />
              <Button onClick={handleTrain} loading={saving} className="w-full">
                + Add to Knowledge Base
              </Button>
            </div>
          </Card>

          {/* Ask */}
          <Card>
            <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">💬 Ask Customer Question (AI)</h3>
            <div className="space-y-4">
              <Input label="Customer Query" placeholder="Do you deliver on Sundays?" value={askQ}
                onChange={(e) => setAskQ(e.target.value)} />
              <Button onClick={handleAsk} loading={aiLoading} variant="success" className="w-full">
                ✦ Get AI Answer
              </Button>
            </div>
            <AIResultBox result={aiResult} loading={aiLoading} />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 font-dm">
              AI answers based on your knowledge base entries above
            </p>
          </Card>
        </div>

        {/* Right — Knowledge Base */}
        <Card>
          <h3 className="font-syne font-bold text-gray-700 dark:text-white mb-4">
            Knowledge Base
            <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">({faqs.length} entries)</span>
          </h3>

          {loading ? <Spinner size="sm" /> : faqs.length === 0 ? (
            <EmptyState icon="📭" title="No FAQs yet" subtitle="Add your first Q&A pair to train the bot" />
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-gray-50 dark:bg-[#1a1a26] rounded-xl p-4 group relative">
                  <button onClick={() => handleDelete(faq.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all">
                    <Trash2 size={13} />
                  </button>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 pr-8 font-dm">
                    Q: {faq.question}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-dm">
                    A: {faq.answer}
                  </p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
                    {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
