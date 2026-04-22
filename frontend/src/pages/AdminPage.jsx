import { useState, useEffect } from "react";
import { adminService } from "../services";
import { Button, Card, PageHeader, Badge, EmptyState, Spinner } from "../components/common/UI";
import toast from "react-hot-toast";
import { Trash2, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const [users, setUsers]   = useState([]);
  const [stats, setStats]   = useState({});
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  const load = async () => {
    try {
      const [uRes, sRes] = await Promise.all([adminService.getUsers(), adminService.getStats()]);
      setUsers(uRes.data.data || []);
      setStats(sRes.data.data || {});
    } catch { toast.error("Failed to load admin data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (email) => {
    const user = users.find((u) => u.email === email);
    if (!user || !confirm(`Delete user ${user.name}?`)) return;
    setActing(email);
    try {
      // We use email to find id from list — in production pass id
      const id = users.indexOf(user) + 1; // simplified; use real id from backend
      await adminService.deleteUser(id);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u.email !== email));
    } catch { toast.error("Delete failed"); }
    finally { setActing(null); }
  };

  const handlePromote = async (email) => {
    const user = users.find((u) => u.email === email);
    if (!user || !confirm(`Promote ${user.name} to ADMIN?`)) return;
    setActing(email);
    try {
      const id = users.indexOf(user) + 1;
      await adminService.promoteAdmin(id);
      toast.success(`${user.name} promoted to Admin`);
      setUsers((prev) => prev.map((u) => u.email === email ? { ...u, role: "ADMIN" } : u));
    } catch { toast.error("Promote failed"); }
    finally { setActing(null); }
  };

  const planVariant = { MONTHLY: "info", YEARLY: "success", FREE_TRIAL: "warning", NONE: "default" };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Admin Panel" subtitle="Manage all users — ADMIN role only" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Total Users</p>
          <p className="font-syne text-3xl font-bold text-gray-800 dark:text-white">{stats.totalUsers ?? "—"}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Admins</p>
          <p className="font-syne text-3xl font-bold text-gray-800 dark:text-white">
            {users.filter((u) => u.role === "ADMIN").length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Subscribed</p>
          <p className="font-syne text-3xl font-bold text-gray-800 dark:text-white">
            {users.filter((u) => u.subscriptionPlan && u.subscriptionPlan !== "NONE" && u.subscriptionPlan !== "FREE_TRIAL").length}
          </p>
        </Card>
      </div>

      {/* Users table */}
      {loading ? <Spinner /> : users.length === 0 ? (
        <EmptyState icon="👥" title="No users found" subtitle="No registered users yet" />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1a1a26] border-b border-gray-100 dark:border-[#2a2a3d]">
                  {["Name", "Email", "Role", "Plan", "Expires", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className="border-b border-gray-50 dark:border-[#1e1e2e] hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{user.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs font-mono">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === "ADMIN" ? "danger" : "default"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={planVariant[user.subscriptionPlan] || "default"}>
                        {user.subscriptionPlan || "NONE"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">{user.subscriptionExpiry || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.role !== "ADMIN" && (
                          <button onClick={() => handlePromote(user.email)} disabled={acting === user.email}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-500 transition-colors"
                            title="Promote to Admin">
                            <ShieldCheck size={13} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(user.email)} disabled={acting === user.email}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete user">
                          {acting === user.email
                            ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin block" />
                            : <Trash2 size={13} />}
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

      {/* API info */}
      <Card className="mt-6 bg-gray-50 dark:bg-[#12121a]">
        <h3 className="font-syne font-bold text-gray-600 dark:text-gray-300 mb-3 text-sm">Admin API Endpoints</h3>
        <div className="font-mono text-xs space-y-1.5 text-gray-400 dark:text-gray-500">
          <p><span className="text-teal-500">GET</span>    /api/admin/users — All users</p>
          <p><span className="text-red-400">DELETE</span> /api/admin/users/{"{id}"} — Delete user</p>
          <p><span className="text-yellow-500">PUT</span>    /api/admin/users/{"{id}"}/promote — Promote to ADMIN</p>
          <p><span className="text-teal-500">GET</span>    /api/admin/stats — Platform stats</p>
        </div>
      </Card>
    </div>
  );
}
