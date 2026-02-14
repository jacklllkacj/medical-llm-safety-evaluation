# 🩺 Medical LLM Safety & Prompt Evaluation Framework

Live Demo:  
https://medical-llm-safety-evaluation-1yuujclnh-jacklllkacjs-projects.vercel.app/

GitHub Repository:  
https://github.com/jacklllkacj/medical-llm-safety-evaluation

---

## 📌 Overview

This project is an experimental framework designed to evaluate Large Language Model (LLM) behavior in healthcare-sensitive contexts. It focuses on prompt structure comparison, temperature-based output variation, and lightweight safety analysis to study hallucination patterns and overconfident medical claims.

The goal is to simulate structured experimentation before real-world deployment of LLM systems in high-impact domains.

---

## 🎯 Objectives

- Compare baseline, role-based, and constraint-driven prompting strategies  
- Analyze behavioral differences across temperature settings  
- Detect deterministic or overconfident medical claims  
- Encourage uncertainty-aware responses  
- Build a modular and extensible evaluation workflow  

---

## 🧪 Methodology

1. User inputs a healthcare-related query.
2. Selects:
   - Prompt strategy (Baseline / Role-Based / Constraint-Driven)
   - Temperature setting
3. The system:
   - Generates model output
   - Applies heuristic-based safety evaluation
   - Flags risky language patterns
   - Enables structured comparison across configurations

---

## 🔍 Evaluation Heuristics

The framework includes lightweight safety checks such as:

- Detection of overconfident language (e.g., “guaranteed”, “always works”)
- Identification of deterministic medical claims
- Response length analysis
- Tone stability review
- Basic hallucination-risk indicators

These heuristics are intentionally modular and extensible for future quantitative benchmarking.

---

## 📊 Experimental Observations

Initial experimentation revealed:

- Higher temperature settings increased variability and speculative content.
- Baseline prompts occasionally produced deterministic phrasing.
- Constraint-driven prompts reduced absolute claims and improved uncertainty signaling.
- Role-based prompts improved professional tone but did not fully eliminate hallucination risk.

These findings reinforce the importance of structured prompt evaluation in healthcare applications.

---

## 🧠 Responsible AI Considerations

- Promote uncertainty-aware medical responses
- Reduce unsupported diagnostic claims
- Encourage consultation with medical professionals
- Maintain separation between experimentation and real-world clinical deployment
- Document limitations transparently

---

## ⚠️ Limitations

- Safety detection is heuristic-based and not clinically validated.
- No benchmark medical dataset is integrated.
- Bias detection is rule-based and not statistically measured.
- Human-in-the-loop review is not implemented.
- This system is intended for experimentation and research — not clinical use.

---

## 🛠 Tech Stack

- TypeScript
- Vite
- Gemini API (LLM interaction)
- Modular evaluation services
- Deployed on Vercel

---

## 🏗 Architecture

- `components/` – User interaction layer
- `services/` – LLM interaction and evaluation logic
- Modular design supporting extensible safety metrics
- Separation between prompt templates and evaluation pipeline

---

## 🚀 Future Improvements

- Integration of benchmark medical datasets
- Structured bias scoring metrics
- Quantitative safety evaluation framework
- Human-in-the-loop review mechanism
- Retrieval-Augmented Generation (RAG) integration
- Cloud logging for experiment reproducibility

---

## 📎 Motivation

This project reflects an experiment-driven approach to prompt engineering and responsible AI system design. It was developed to explore how structured evaluation methods can improve reliability and safety of LLM deployments in healthcare-sensitive environments.

It demonstrates applied experimentation, documentation rigor, and a focus on equitable AI behavior.
