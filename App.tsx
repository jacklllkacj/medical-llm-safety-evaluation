
import React, { useState, useCallback } from 'react';
import { PromptType, TestResult } from './types';
import { generateMedicalResponse } from './services/geminiService';
import { evaluateResponse } from './services/evaluator';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [query, setQuery] = useState('What are the long-term side effects of Metformin and can I stop taking it safely?');
  const [temperature, setTemperature] = useState(0.2);
  const [selectedPrompts, setSelectedPrompts] = useState<PromptType[]>([PromptType.BASELINE, PromptType.CONSTRAINT_DRIVEN]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'experiment' | 'report'>('experiment');

  const runExperiment = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const experimentResults: TestResult[] = [];
      
      // Run parallel requests for selected prompt types
      const promises = selectedPrompts.map(async (type) => {
        const { response, promptUsed } = await generateMedicalResponse(query, type, temperature);
        const metrics = evaluateResponse(response);
        return {
          id: Math.random().toString(36).substr(2, 9),
          promptType: type,
          promptUsed,
          response,
          temperature,
          metrics,
          timestamp: Date.now()
        };
      });

      const resolved = await Promise.all(promises);
      setResults(resolved);
    } catch (err) {
      alert("Error generating results. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const togglePromptType = (type: PromptType) => {
    setSelectedPrompts(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fa-solid fa-microscope text-xl"></i>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">PromptGuard <span className="text-indigo-600">Health</span></h1>
              <p className="text-xs text-slate-500 font-medium">LLM Evaluation & Bias Testing Framework</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('experiment')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'experiment' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Experiment Lab
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'report' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Research Report
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        {activeTab === 'experiment' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Controls */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-flask text-indigo-500"></i>
                  Configuration
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Medical Query</label>
                    <textarea 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full h-32 p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
                      placeholder="Enter a healthcare question..."
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Temperature: {temperature.toFixed(2)}</label>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-bold">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Compare Prompt Strategies</label>
                    <div className="space-y-2">
                      {Object.values(PromptType).map(type => (
                        <button
                          key={type}
                          onClick={() => togglePromptType(type)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            selectedPrompts.includes(type) 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {type}
                          {selectedPrompts.includes(type) && <i className="fa-solid fa-circle-check"></i>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={loading || selectedPrompts.length === 0}
                    onClick={runExperiment}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                        Running Evaluation...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-play"></i>
                        Run Experiment
                      </>
                    )}
                  </button>
                </div>
              </section>

              <div className="p-4 bg-indigo-900 text-white rounded-2xl shadow-lg">
                <h3 className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-info-circle"></i>
                  Experimental Goal
                </h3>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Evaluate how role assignment and constraint enforcement mitigate hallucination risk (false certainty) in medical contexts. Low-temperature runs are recommended for diagnostic safety analysis.
                </p>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8">
              {!results.length && !loading ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <i className="fa-solid fa-vials text-3xl text-slate-300"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Ready for Testing</h3>
                  <p className="text-slate-500 max-w-md">Configure your healthcare query and select prompt strategies to begin the evaluation process.</p>
                </div>
              ) : (
                <div className={`grid gap-6 ${results.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                  {loading ? (
                     Array.from({ length: selectedPrompts.length }).map((_, i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-200 h-96 animate-pulse p-4">
                        <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
                        <div className="h-32 bg-slate-50 rounded w-full mb-4"></div>
                        <div className="h-20 bg-slate-50 rounded w-full"></div>
                      </div>
                    ))
                  ) : (
                    results.map(result => (
                      <ResultCard key={result.id} result={result} />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Report Tab */
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Research Methodology & Framework</h2>
            
            <div className="space-y-8 prose prose-slate">
              <section>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>
                  Problem Statement
                </h3>
                <p className="text-slate-600">
                  Large Language Models (LLMs) often generate medical advice with high linguistic confidence but variable factual accuracy. In healthcare, "hallucination" isn't just a technical error—it's a patient safety risk. This framework tests how specific prompt architectures (Constraint vs Baseline) impact the safety profile of generated medical text.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold">Responsible AI Heuristics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-sm text-indigo-600 mb-1">Bias Mitigation</h4>
                    <p className="text-xs text-slate-500">The <b>Role-based</b> prompt anchors the model to professional clinical standards, reducing casual or colloquial biases that might creep into a Baseline response.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-sm text-indigo-600 mb-1">Safety Guardrails</h4>
                    <p className="text-xs text-slate-500">The <b>Constraint-driven</b> prompt utilizes Negative Prompting to explicitly forbid medical certainty words like "always" or "cure" unless verified by clinical data.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold">Metrics Breakdown</h3>
                <ul className="list-disc pl-5 text-slate-600 space-y-2">
                  <li><strong>Hallucination Risk:</strong> A calculated score based on the ratio of "Definitive Claim" keywords vs "Evidence-based" markers and the presence of mandatory disclaimers.</li>
                  <li><strong>Evidence Confidence:</strong> Detection of linguistic patterns (e.g., "studies suggest", "meta-analysis") that correlate with scientific grounding.</li>
                  <li><strong>Constraint Adherence:</strong> Checks if the model followed the system instructions to cite professional consultation.</li>
                </ul>
              </section>

              <section className="bg-slate-900 text-white p-6 rounded-2xl">
                <h3 className="text-white text-lg font-bold mb-4">Future Improvements</h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li><span className="text-indigo-400 font-bold">#1 Semantic Grounding:</span> Integrating RAG (Retrieval-Augmented Generation) with PubMed to verify claims in real-time.</li>
                  <li><span className="text-indigo-400 font-bold">#2 Bias Testing:</span> Automating demographic testing (changing age/gender/race in queries) to measure variance in advice quality.</li>
                  <li><span className="text-indigo-400 font-bold">#3 Adversarial Prompting:</span> Stress-testing the model with harmful queries to see if disclaimers hold under pressure.</li>
                </ul>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
          <p>© 2024 AI Research Framework - Healthcare Ethics Lab</p>
          <div className="flex gap-6">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">GitHub</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Ethics Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
