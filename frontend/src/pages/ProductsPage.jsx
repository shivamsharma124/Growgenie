import { useState, useEffect } from "react";
import { productService } from "../services";
import { Button, Input, Textarea, Select, Card, PageHeader, Modal, Badge, EmptyState, Spinner } from "../components/common/UI";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

const EMPTY_FORM = { name: "", description: "", category: "", price: "", stock: "" };
const CATEGORIES = ["Food & Beverage", "Home Decor", "Clothing", "Electronics", "Health & Beauty", "Handicrafts", "Services", "Other"];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try {
      const res = await productService.getAll();
      setProducts(res.data.data || []);
    } catch { toast.error("Failed to load products"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY_FORM); setErrors({}); setEditId(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ name: p.name, description: p.description || "", category: p.category || "", price: p.price, stock: p.stock }); setErrors({}); setEditId(p.id); setShowModal(true); };

  const validate = () => {
    const errs = {};
    if (!form.name)           errs.name  = "Name is required";
    if (!form.price || form.price <= 0) errs.price = "Valid price required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
      if (editId) {
        await productService.update(editId, payload);
        toast.success("Product updated!");
      } else {
        await productService.create(payload);
        toast.success("Product added!");
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await productService.delete(id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(null); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Product Catalog"
        subtitle="POST /api/products — manage your products & services"
        action={<Button onClick={openAdd}><Plus size={15} /> Add Product</Button>}
      />

      {loading ? <Spinner /> : products.length === 0 ? (
        <EmptyState icon="📦" title="No products yet" subtitle="Click 'Add Product' to add your first product" />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1a1a26] border-b border-gray-100 dark:border-[#2a2a3d]">
                  {["ID", "Name", "Category", "Price", "Stock", "Added", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-[#1e1e2e] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500 font-mono text-xs">#{p.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{p.name}</td>
                    <td className="px-4 py-3"><Badge>{p.category || "—"}</Badge></td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{p.price?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.stock > 10 ? "success" : p.stock > 0 ? "warning" : "danger"}>
                        {p.stock ?? 0} units
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-500 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editId ? "Edit Product" : "Add New Product"}>
        <div className="space-y-4">
          <Input label="Product Name *" placeholder="Masala Chai (250g)" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Textarea label="Description" placeholder="Describe your product..." value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (₹) *" type="number" placeholder="299" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} error={errors.price} />
            <Input label="Stock" type="number" placeholder="50" value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleSave} loading={saving}>{editId ? "Update" : "Add"} Product</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
