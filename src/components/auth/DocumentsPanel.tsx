"use client";

import { useEffect, useState } from "react";
import { Upload, FileText, Download, Trash2, FileBadge, Loader2, Plus, X, FilePlus2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DocItem = {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string;
  createdAt: string;
};

type TemplateItem = {
  id: string;
  title: string;
  desc: string;
  body: string;
  createdAt: string;
};

const DEFAULT_TEMPLATES: Omit<TemplateItem, "id" | "createdAt">[] = [
  {
    title: "Даатгалын гэрээний загвар",
    desc: "Стандарт даатгалын гэрээ — TXT",
    body: "ДААТГАЛЫН ГЭРЭЭ\n\nins.monre платформын стандарт даатгалын гэрээний загвар.\n\n1. Гэрээний талууд\n2. Даатгалын зорилго\n3. Даатгалын дүн\n4. Нөхөн төлбөрийн нөхцөл\n5. Гэрээний хугацаа\n\nОгноо: ____________\nГарын үсэг: ____________",
  },
  {
    title: "Нөхөн төлбөрийн хүсэлт",
    desc: "Нөхөн төлбөр нэхэмжлэх форм — TXT",
    body: "НӨХӨН ТӨЛБӨРИЙН ХҮСЭЛТ\n\nХүсэлт гаргагчийн нэр: ____________\nРегистрийн дугаар: ____________\nГэрээний дугаар: ____________\nҮйл явдлын огноо: ____________\nҮйл явдлын тайлбар:\n\n\nНэхэмжлэх дүн: ____________",
  },
  {
    title: "Харилцагчийн мэдээллийн форм",
    desc: "Шинэ харилцагч бүртгэх — TXT",
    body: "ХАРИЛЦАГЧИЙН МЭДЭЭЛЛИЙН ФОРМ\n\nОвог: ____________  Нэр: ____________\nУтас: ____________  Имэйл: ____________\nХаяг: ____________\nБайгууллага: ____________\nРегистр: ____________",
  },
];

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileExt(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() ?? "" : "";
}

function fileLabel(name: string) {
  const ext = fileExt(name);
  if (["doc", "docx"].includes(ext)) return "Word";
  if (["xls", "xlsx", "csv"].includes(ext)) return "Excel";
  if (["pdf"].includes(ext)) return "PDF";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "Зураг";
  if (["txt", "rtf"].includes(ext)) return "Текст";
  return ext ? ext.toUpperCase() : "Файл";
}

const ACCEPT_TYPES =
  ".doc,.docx,.pdf,.xls,.xlsx,.csv,.txt,.rtf,.png,.jpg,.jpeg,.webp,.gif";

export function DocumentsPanel({ scopeKey, scopeLabel }: { scopeKey: string; scopeLabel: string }) {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newBody, setNewBody] = useState("");

  const docsKey = `company_docs_${scopeKey}`;
  const templatesKey = `company_templates_${scopeKey}`;

  useEffect(() => {
    try {
      const savedDocs = JSON.parse(localStorage.getItem(docsKey) ?? "[]") as DocItem[];
      setDocs(savedDocs);
    } catch {
      setDocs([]);
    }
    try {
      const savedTemplates = JSON.parse(localStorage.getItem(templatesKey) ?? "null") as TemplateItem[] | null;
      if (savedTemplates && savedTemplates.length) {
        setTemplates(savedTemplates);
      } else {
        const seeded = DEFAULT_TEMPLATES.map((t) => ({
          ...t,
          id: `default_${Date.now()}_${t.title}`,
          createdAt: new Date().toISOString(),
        }));
        setTemplates(seeded);
        localStorage.setItem(templatesKey, JSON.stringify(seeded));
      }
    } catch {
      setTemplates([]);
    }
  }, [scopeKey, docsKey, templatesKey]);

  const persistDocs = (items: DocItem[]) => {
    setDocs(items);
    try {
      localStorage.setItem(docsKey, JSON.stringify(items));
      setError("");
    } catch {
      setError("Файлын хэмжээ их байна. 2MB-аас бага файл оруулна уу.");
    }
  };

  const persistTemplates = (items: TemplateItem[]) => {
    setTemplates(items);
    try {
      localStorage.setItem(templatesKey, JSON.stringify(items));
    } catch {
      setError("Template хадгалахад алдаа гарлаа.");
    }
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError("");
    const readers = Array.from(files).map(
      (file) =>
        new Promise<DocItem>((resolve, reject) => {
          if (file.size > 2 * 1024 * 1024) {
            reject(new Error("2MB-аас бага файл оруулна уу"));
            return;
          }
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: `${Date.now()}_${file.name}`,
              name: file.name,
              size: file.size,
              type: file.type,
              data: reader.result as string,
              createdAt: new Date().toISOString(),
            });
          reader.onerror = () => reject(new Error("Файл уншиж чадсангүй"));
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers)
      .then((items) => persistDocs([...items, ...docs]))
      .catch((err) => setError(err instanceof Error ? err.message : "Алдаа гарлаа"))
      .finally(() => {
        setUploading(false);
        e.target.value = "";
      });
  };

  const downloadDoc = (doc: DocItem) => {
    const a = document.createElement("a");
    a.href = doc.data;
    a.download = doc.name;
    a.click();
  };

  const removeDoc = (id: string) => persistDocs(docs.filter((d) => d.id !== id));

  const addTemplate = () => {
    if (!newTitle.trim() || !newBody.trim()) {
      setError("Гарчиг болон агуулга оруулна уу");
      return;
    }
    const item: TemplateItem = {
      id: `tpl_${Date.now()}`,
      title: newTitle.trim(),
      desc: newDesc.trim() || "Байгууллагын template",
      body: newBody.trim(),
      createdAt: new Date().toISOString(),
    };
    persistTemplates([item, ...templates]);
    setNewTitle("");
    setNewDesc("");
    setNewBody("");
    setShowForm(false);
    setError("");
  };

  const removeTemplate = (id: string) => persistTemplates(templates.filter((t) => t.id !== id));

  return (
    <div className="flex flex-col gap-8">
      {/* Templates */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-300">
            <span className="h-4 w-1 rounded-full bg-gradient-to-b from-sky to-brand" aria-hidden="true" />
            {scopeLabel} template-үүд
          </h3>
          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            className="btn-glow flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            Template нэмэх
          </button>
        </div>

        {showForm && (
          <div className="mb-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Template-ийн гарчиг"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky/60"
              />
              <input
                type="text"
                placeholder="Тайлбар (сонголттой)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky/60"
              />
              <textarea
                placeholder="Template-ийн агуулга (text)"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky/60"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addTemplate}
                  className="btn-glow rounded-full bg-brand px-5 py-2 text-xs font-bold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark"
                >
                  Хадгалах
                </button>
              </div>
            </div>
          </div>
        )}

        {templates.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-10 text-center">
            <FilePlus2 className="h-8 w-8 text-slate-700" />
            <p className="text-sm text-slate-500">Template байхгүй байна</p>
            <p className="max-w-xs text-xs text-slate-600">Дээд талд байгаа &quot;Template нэмэх&quot; товчийг дарж өөрийн template-ээ үүсгэнэ үү</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <div
                key={t.id}
                className="group flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition-all hover:border-sky/30 hover:bg-white/[0.05]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky/20 to-brand/20 text-sky">
                  <FileBadge className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{t.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{t.desc}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => downloadText(`${t.title}.txt`, t.body)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-2 text-xs font-bold text-sky transition-all hover:bg-sky/20"
                  >
                    <Download className="h-3.5 w-3.5" /> Татах
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTemplate(t.id)}
                    aria-label="Устгах"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-red-400/50 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-300">
            <span className="h-4 w-1 rounded-full bg-gradient-to-b from-sky to-brand" aria-hidden="true" />
            {scopeLabel} баримтууд
          </h3>
          <label
            className={cn(
              "btn-glow flex cursor-pointer items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark",
              uploading && "pointer-events-none opacity-60"
            )}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Баримт оруулах
            <input type="file" multiple accept={ACCEPT_TYPES} className="hidden" onChange={onUpload} />
          </label>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300">
            {error}
          </p>
        )}

        {docs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-12 text-center">
            <FileText className="h-8 w-8 text-slate-700" />
            <p className="text-sm text-slate-500">Оруулсан баримт байхгүй байна</p>
            <p className="max-w-xs text-xs text-slate-600">
              DOCX, PDF, XLSX, TXT, зураг зэрэг бичиг баримтаа (2MB хүртэл) оруулж хадгалаарай
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 transition-all hover:border-sky/25"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky/20 to-brand/20 text-sky">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{doc.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                      {fileLabel(doc.name)}
                    </span>
                    <span>{fmtSize(doc.size)}</span>
                    <span>·</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString("mn-MN")}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadDoc(doc)}
                  aria-label="Татах"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-sky/50 hover:text-sky"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeDoc(doc.id)}
                  aria-label="Устгах"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-red-400/50 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
