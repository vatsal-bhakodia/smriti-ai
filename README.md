# 📚 Smriti AI – Your Smart Learning Companion

Smriti AI is an intelligent, all-in-one learning assistant that helps you **organize**, **understand**, and **retain** everything you study 🧠. Whether you're a student, a self-learner, or a professional, Smriti AI transforms passive content into active learning tools.

---

## ✨ Why Smriti AI?

In today's world of scattered PDFs, YouTube videos, and online tutorials — **Smriti AI brings it all together.**

🚀 **Capture** resources from YouTube, PDFs, and links  
🧠 **Convert** them into summaries, mind maps, and personalized quizzes  
⏰ **Revise** smarter with spaced repetition and WhatsApp reminders  
📈 **Track** progress and stay motivated with performance dashboards

---

## 🌟 Features

📁 **Centralized Learning Hub**  
Organize your learning by creating topic-wise folders. Store PDFs, videos, and links all in one place.

🪄 **Smart Content Processing**  
Smriti breaks down your content into:
- 📄 AI-generated summaries  
- 🧭 Mind maps for visual learners  
- ❓ Interactive quizzes to boost recall

⏳ **Spaced Revision with WhatsApp Reminders**  
Receive gentle reminders every 3 days to revise. Quizzes are delivered directly on WhatsApp for on-the-go revision.

📊 **Progress Tracking**  
See how much you’ve improved over time, identify weak areas, and never lose track of your learning.

💬 **Multimodal Interface**  
Use it on web, and soon — on WhatsApp & mobile apps too!

## Project Architecture

Smriti AI is built on a modern, modular stack to handle conversational AI tasks efficiently. The core components work together as follows:

- 🖥️ **Streamlit:** Serves as the web app framework that creates the user interface. It is responsible for displaying the chat window, handling file uploads, and managing user interaction. The main application logic can be found in `app.py`.

- 🧠 **LlamaIndex:** This is the core data framework that powers the Retrieval-Augmented Generation (RAG) pipeline. It is responsible for:
  - **Data Ingestion:** Processing and chunking documents and websites.
  - **Indexing:** Creating vector embeddings from the data chunks.
  - **Querying:** Finding the most relevant context from the knowledge base to answer a user's question.

- 💾 **Qdrant:** Acts as the specialized vector database. When documents are indexed, the resulting vector embeddings are stored in Qdrant. Its job is to perform ultra-fast similarity searches to retrieve the context that LlamaIndex needs to formulate an answer.

---

## 👥 Who Is It For?

👨‍🎓 **Students** – Preparing for exams, juggling multiple subjects  
🧑‍💻 **Self-learners** – Taking online courses or watching tutorials  
👩‍💼 **Professionals** – Upskilling with limited time  
👨‍🏫 **Educators & Coaching Institutes** – To create structured, AI-enhanced revision modules

---

## 🔮 Future Scope

📱 **Mobile App** for iOS & Android  
🧠 **Chat-based Learning Assistant** – Ask questions about your saved content  
🧾 **Support for More File Types** – eBooks, slides, lecture notes  
🏫 **Institute Portal** – For coaching centers and colleges to manage & monitor students’ learning

---

## 🛠️ Tech Stack

- 🧩 **Frontend**: Next.js, TypeScript, Tailwind CSS  
- 🧠 **AI Layer**: Gemini APIS,LLMs 
- 🔐 **Auth**: Clerk  
- ☁️ **Backend**: Next.js,Prisma,Mongodb  (shifted to postgres )
- 🤖 **Bot Layer**: WhatsApp + Twilio Integration  
- 🧪 **Chrome Extension**: Capture videos directly from YouTube //upcoming

---

## 🚀 Getting Started (Developer Mode)

```bash
git clone https://github.com/vatsal-bhakodia/smriti-ai
cd smriti-ai
npm install
npm run dev

