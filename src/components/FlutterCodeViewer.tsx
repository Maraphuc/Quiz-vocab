import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Download, X, Layers, Smartphone, BookOpen } from 'lucide-react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterSourceCode';

interface FlutterCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeViewer: React.FC<FlutterCodeViewerProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[0]);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = [
    { id: 'ALL', label: 'Tất cả file' },
    { id: 'pubspec', label: 'pubspec.yaml' },
    { id: 'main', label: 'main.dart' },
    { id: 'models', label: 'Models' },
    { id: 'data', label: 'Vocabulary Data' },
    { id: 'services', label: 'Services' },
    { id: 'theme', label: 'Theme' },
    { id: 'screens', label: 'Screens' },
    { id: 'android', label: 'Android Config' },
    { id: 'guide', label: 'Google Play Guide' },
  ];

  const filteredFiles = FLUTTER_PROJECT_FILES.filter(
    (file) => filterCategory === 'ALL' || file.category === filterCategory
  );

  const handleCopyCode = (code: string, path: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Mã Nguồn Flutter + Guide Release Google Play (.aab)
              </h3>
              <p className="text-[11px] text-slate-400">
                Toàn bộ code Flutter + Dart sẵn sàng copy và build Android App Bundle
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 bg-slate-850 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                filterCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left File Tree Sidebar */}
          <div className="md:col-span-4 border-r border-slate-800 bg-slate-900/90 overflow-y-auto p-2 space-y-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-xs truncate">{file.path}</span>
                  </div>
                  {copiedPath === file.path ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 group-hover:text-slate-300 shrink-0 uppercase">
                      {file.category}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Code Display Area */}
          <div className="md:col-span-8 flex flex-col bg-slate-950 overflow-hidden">
            {/* File Info & Copy Header */}
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 font-mono">
                  {selectedFile.path}
                </span>
                <p className="text-[11px] text-slate-400">
                  {selectedFile.description}
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(selectedFile.code, selectedFile.path)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
              >
                {copiedPath === selectedFile.path ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Đã Copy!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content Box */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed selection:bg-indigo-500 selection:text-white">
              <pre className="whitespace-pre-wrap break-words">{selectedFile.code}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Build Android App Bundle (.aab) sẵn sàng Google Play
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
