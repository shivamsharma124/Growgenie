import api from "./api";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  register: (data)              => api.post("/auth/register", data),
  login:    (data)              => api.post("/auth/login", data),
  getProfile: ()                => api.get("/auth/me"),
  updateSubscription: (plan)    => api.post("/auth/subscription", { plan }),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productService = {
  getAll:   ()           => api.get("/products"),
  getById:  (id)         => api.get(`/products/${id}`),
  create:   (data)       => api.post("/products", data),
  update:   (id, data)   => api.put(`/products/${id}`, data),
  delete:   (id)         => api.delete(`/products/${id}`),
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiService = {
  roadmap:            (data) => api.post("/ai/roadmap", data),
  marketStrategy:     (data) => api.post("/ai/market-strategy", data),
  adCopy:             (data) => api.post("/ai/ad-copy", data),
  productDescription: (data) => api.post("/ai/product-description", data),
  translate:          (data) => api.post("/ai/translate", data),
  posterPrompt:       (data) => api.post("/ai/poster-prompt", data),
  faqAsk:             (data) => api.post("/ai/faq-ask", data),
  getHistory:         ()     => api.get("/ai/history"),
};

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const invoiceService = {
  getAll:       ()              => api.get("/invoices"),
  getById:      (id)            => api.get(`/invoices/${id}`),
  generate:     (data)          => api.post("/invoices/generate", data),
  updateStatus: (id, status)    => api.put(`/invoices/${id}/status?status=${status}`),
  downloadPdf:  (id)            => api.get(`/invoices/${id}/download`, { responseType: "blob" }),
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const faqService = {
  getAll:  ()      => api.get("/faq"),
  train:   (data)  => api.post("/faq/train", data),
  delete:  (id)    => api.delete(`/faq/${id}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminService = {
  getUsers:      ()   => api.get("/admin/users"),
  deleteUser:    (id) => api.delete(`/admin/users/${id}`),
  promoteAdmin:  (id) => api.put(`/admin/users/${id}/promote`),
  getStats:      ()   => api.get("/admin/stats"),
};
