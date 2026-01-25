
import React, { useState, useCallback, useRef } from 'react';
import { DataObject, DataSourceType, TransformationSchema, VectorEntry } from './types';
import { SCHEMAS } from './constants';
import { geminiService } from './services/geminiService';
import { 
  FileUp, 
  Database, 
  Code2, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  History,
  Trash2,
  Maximize2
} from 'lucide-react';

const App: React.FC = () => {
  const [activeSchema, setActiveSchema] = useState<TransformationSchema>(SCHEMAS[0]);
  const [dataObjects, setDataObjects] = useState<DataObject[]>([]);
  const [vectorDb, setVectorDb] = useState<VectorEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly cast to File[] and type the callback parameter to avoid 'unknown' type errors
    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newObj: DataObject = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          rawContent: content,
          type: file.name.endsWith('.log') ? DataSourceType.LOGS : DataSourceType.TEXT,
          timestamp: new Date().toISOString(),
          status: 'pending'
        };
        setDataObjects(prev => [newObj, ...prev]);
      };
      // reader.readAsText expects a Blob, ensuring file is typed correctly as File (which is a Blob)
      reader.readAsText(file);
    });
  };

  const runTransformation = async (objId: string) => {
    const obj = dataObjects.find(d => d.id === objId);
    if (!obj || obj.status === 'completed') return;

    setIsProcessing(true);
    setDataObjects(prev => prev.map(d => d.id === objId ? { ...d, status: 'processing' } : d));

    try {
      const result = await geminiService.transformData(obj.rawContent, activeSchema);
      
      setDataObjects(prev => prev.map(d => d.id === objId ? { 
        ...d, 
        status: 'completed', 
        structuredData: result.structuredData,
        confidence: result.confidence,
        explanation: result.explanation
      } : d));

      // Simulate Vector DB ingestion
      const newVectorEntry: VectorEntry = {
        id: Math.random().toString(36).substr(2, 9),
        chunk: obj.rawContent.slice(0, 500),
        embedding: Array.from({ length: 8 }, () => Math.random()),
        metadata: { source: obj.name, schema: activeSchema.id }
      };
      setVectorDb(prev => [newVectorEntry, ...prev]);
      
      setSelectedId(objId);
    } catch (error) {
      console.error(error);
      setDataObjects(prev => prev.map(d => d.id === objId ? { ...d, status: 'failed' } : d));
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedObject = dataObjects.find(d => d.id === selectedId);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Layers className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-slate-800 tracking-tight">AetherData</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Data Pipelines</h3>
            <ul className="space-y-1">
              {SCHEMAS.map(s => (
                <li key={s.id}>
                  <button
                    onClick={() => setActiveSchema(s)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                      activeSchema.id === s.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm font-medium">{s.name}</span>
                    {activeSchema.id === s.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
              <Database className="w-3 h-3" /> Vector Index (Simulated)
            </h3>
            <div className="space-y-2">
              {vectorDb.length === 0 && (
                <div className="text-[10px] text-slate-400 italic px-2">No records indexed yet.</div>
              )}
              {vectorDb.slice(0, 5).map(v => (
                <div key={v.id} className="p-2 bg-slate-50 border border-slate-100 rounded text-[10px] font-mono truncate text-slate-500">
                  {v.id} | {v.metadata.source}
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>API Status</span>
            <span className="flex items-center gap-1 text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">Workspace</h2>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 rounded">GET</span>
              <span>v1/translate/{activeSchema.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              <FileUp className="w-4 h-4" />
              Ingest Data
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={handleFileUpload} 
            />
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Column: List of Ingested Objects */}
          <div className="w-1/3 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Incoming Streams</span>
              <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-bold">
                {dataObjects.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {dataObjects.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <History className="text-slate-300 w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-400">No data ingested. Drag and drop files or use the ingest button.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {dataObjects.map(obj => (
                    <div 
                      key={obj.id} 
                      onClick={() => setSelectedId(obj.id)}
                      className={`p-4 cursor-pointer transition-all hover:bg-slate-50 ${selectedId === obj.id ? 'bg-indigo-50/50 border-l-2 border-indigo-500' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-semibold text-slate-700 truncate max-w-[160px]">{obj.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          obj.status === 'completed' ? 'bg-green-100 text-green-700' :
                          obj.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                          obj.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {obj.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="capitalize">{obj.type}</span>
                        <span>•</span>
                        <span>{new Date(obj.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Comparison / Details */}
          <div className="flex-1 bg-white overflow-y-auto p-8">
            {!selectedObject ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Code2 className="w-16 h-16 text-slate-300 mb-6" />
                <h3 className="text-xl font-medium text-slate-800">Translation Engine Ready</h3>
                <p className="text-slate-500 max-w-sm mt-2">Select a data stream from the left panel to begin structural analysis and translation.</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedObject.name}</h2>
                    <p className="text-slate-500 text-sm mt-1">Applying schema: <span className="text-indigo-600 font-semibold">{activeSchema.name}</span></p>
                  </div>
                  {selectedObject.status === 'pending' && (
                    <button 
                      onClick={() => runTransformation(selectedObject.id)}
                      disabled={isProcessing}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-100"
                    >
                      {isProcessing ? <Activity className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                      Start Translation
                    </button>
                  )}
                </div>

                {selectedObject.status === 'completed' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Confidence Score</div>
                      <div className="flex items-end gap-2">
                        <span className={`text-2xl font-bold ${selectedObject.confidence! > 0.8 ? 'text-green-600' : 'text-amber-600'}`}>
                          {(selectedObject.confidence! * 100).toFixed(0)}%
                        </span>
                        <CheckCircle2 className="w-5 h-5 text-green-500 mb-1" />
                      </div>
                    </div>
                    <div className="col-span-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <div className="text-[10px] text-indigo-400 font-bold uppercase mb-1">AI Reasoning</div>
                      <p className="text-sm text-indigo-800 italic leading-relaxed">
                        "{selectedObject.explanation}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8 h-[500px]">
                  {/* Unstructured View */}
                  <div className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Raw Unstructured</span>
                      <Trash2 className="w-4 h-4 text-slate-300 cursor-pointer hover:text-red-400 transition-colors" />
                    </div>
                    <div className="flex-1 p-6 bg-slate-900 overflow-y-auto">
                      <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {selectedObject.rawContent}
                      </pre>
                    </div>
                  </div>

                  {/* Structured View */}
                  <div className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Model-Ready Structured</span>
                      <Maximize2 className="w-4 h-4 text-slate-300 cursor-pointer" />
                    </div>
                    <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                      {selectedObject.status === 'completed' ? (
                        <pre className="text-xs text-indigo-900 font-mono leading-relaxed">
                          {JSON.stringify(selectedObject.structuredData, null, 2)}
                        </pre>
                      ) : selectedObject.status === 'processing' ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                          <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                          </div>
                          <p className="text-xs text-slate-400 animate-pulse font-medium">Analyzing patterns...</p>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-sm">
                          Structured preview will appear after translation.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
