import { useState, useEffect } from "react";
import { invoiceService } from "../services";
import { Button, Input, Card, PageHeader, Modal, Badge, EmptyState, Spinner } from "../components/common/UI";
import toast from "react-hot-toast";
import { Plus, Download, Trash2 } from "lucide-react";

const STATUS_COLORS = { PAID: "success", UNPAID: "danger", PENDING: "warning" };
const EMPTY_ITEM = { name: "", quantity: 1, price: "" };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [downloading, setDownloading] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);

  const load = async () => {
    try {
      const res = await invoiceService.getAll();
      setInvoices(res.data.data || []);
    } catch { toast.error("Failed to load invoices"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const addItem    = () => setItems([...items, { ...EMPTY_ITEM }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: val };
    setItems(updated);
  };

  const subtotal = items.reduce((sum, it) => sum + (parseFloat(it.price) || 0) * (parseInt(it.quantity) || 0), 0);
  const gst      = subtotal * 0.18;
  const total    = subtotal + gst;

  const handleGenerate = async () => {
    if (!customerName) return toast.error("Customer name is required");
    if (items.some((it) => !it.name || !it.price)) return toast.error("Fill all item fields");
    setSaving(true);
    try {
      await invoiceService.generate({
        customerName, customerEmail,
        items: items.map((it) => ({ name: it.name, quantity: parseInt(it.quantity), price: parseFloat(it.price) })),
      });
      toast.success("Invoice generated & PDF created!");
      setShowModal(false);
      setCustomerName(""); setCustomerEmail(""); setItems([{ ...EMPTY_ITEM }]);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate invoice");
    } finally { setSaving(false); }
  };

  const handleDownload = async (id) => {
    setDownloading(id);
    try {
      const res  = await invoiceService.downloadPdf(id);
      const url  = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url; link.download = `INV-${id}.pdf`; link.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch { toast.error("Download failed"); }
    finally { setDownloading(null); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await invoiceService.updateStatus(id, status);
      setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status } : inv));
      toast.success("Status updated");
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Invoice Generator"
        subtitle="GST-compliant PDF invoices — POST /invoices/generate"
        action={<Button onClick={() => setShowModal(true)}><Plus size={15} /> New Invoice</Button>}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: invoices.length, variant: "default" },
          { label: "Paid",  value: invoices.filter((i) => i.status === "PAID").length,    variant: "success" },
          { label: "Pending", value: invoices.filter((i) => i.status === "PENDING").length, variant: "warning" },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{s.label}</p>
            <p className="font-syne text-3xl font-bold text-gray-800 dark:text-white">{s.value}</p>
          </Card>
        ))}
      </div>

      {loading ? <Spinner /> : invoices.length === 0 ? (
        <EmptyState icon="🧾" title="No invoices yet" subtitle="Click 'New Invoice' to generate your first GST invoice" />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1a1a26] border-b border-gray-100 dark:border-[#2a2a3d]">
                  {["Invoice #", "Customer", "Subtotal", "GST 18%", "Total", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50 dark:border-[#1e1e2e] hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">INV-{inv.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{inv.customerName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">₹{inv.subtotal?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-yellow-600 dark:text-yellow-400">₹{inv.gst?.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">₹{inv.total?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select value={inv.status}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                        className="text-xs rounded-lg px-2 py-1 border border-gray-200 dark:border-[#2a2a3d] bg-white dark:bg-[#1a1a26] text-gray-700 dark:text-gray-300 outline-none cursor-pointer">
                        {["PAID", "UNPAID", "PENDING"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDownload(inv.id)} disabled={downloading === inv.id}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#2a2a3d] text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all">
                        {downloading === inv.id ? <span className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /> : <Download size={12} />}
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Invoice Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Generate New Invoice">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Customer Name *" placeholder="Ramesh Kumar" value={customerName}
              onChange={(e) => setCustomerName(e.target.value)} />
            <Input label="Customer Email" placeholder="customer@email.com" value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Items *</label>
              <button onClick={addItem} className="text-xs text-indigo-500 hover:text-indigo-600 font-dm">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end">
                  <Input placeholder="Item name" value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} />
                  <Input placeholder="Qty" type="number" value={item.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} />
                  <Input placeholder="₹ Price" type="number" value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} />
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mb-0">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live calculation */}
          <div className="bg-gray-50 dark:bg-[#1a1a26] rounded-xl p-4 space-y-2 text-sm font-dm">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-yellow-600 dark:text-yellow-400">
              <span>GST (18%)</span><span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 dark:text-white border-t border-gray-200 dark:border-[#2a2a3d] pt-2">
              <span>Total Payable</span><span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleGenerate} loading={saving}>Generate PDF Invoice 📄</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
