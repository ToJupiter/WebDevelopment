# Design of functionalities

## AI notes:
1. General design:

- **Description:** While studying a specific module, the user interacts with the AI Assistant to clarify concepts and automatically take notes.

- **Actors & Actions:**

  - **User:**
    - Clicks on a node in the roadmap to view module details (read content, watch videos, etc.).
    - Opens the embedded AI Assistant chat window within the module interface.
    - Types a question (e.g., “Explain ‘virtual DOM’ in React?”) or a request (e.g., “Summarize this section in 3 bullet points”).
    - Reviews the chat history with the AI for revision, meaning we could see the history of AI chats within a page.

  - **AI Agent:**
    - Receives the user's question along with the current `module_id` context.
    - Uses the Groq API to generate an answer, summary, or explanation based on the question and module content.
    - Displays the response to the user.

  - **Backend System:**
    - Automatically saves the user's question and the AI's response to the `AINotes` table, linked to the corresponding `user_id` and `module_id`.
    - The `note_type` can be `user_question` or `ai_response`.

2. Flow of the functionality:
   - User clicking on a node in roadmap (technically a lesson), can click on a button of AI assistant. User asks questions, system saves the questions and answers of AI assistants. Users can see them later. API docs have been in ThietKeBackend_full.md.

## Interview system:
1. General design:

- **Description:** The user participates in a simulated interview session through a chat interface with the AI to improve their answering skills.

- **Actors & Actions:**

  - **User:**
    - Accesses the "Interview Practice" feature and starts a new session. User first chat about a topic that they want to be interviewed about, then an AI will process this and generate questions to ask. Examples on topic generation will be put below.
    - Responds to questions by typing text or **recording and sending an audio message**.
    - After the session ends, reviews the full "chat log" of the interview and reads detailed, overall feedback from the AI.
    - Examples of seed queries from the user:
        + "Please interview me about object oriented programming principles in Java. I want to be interviewed about Java core principles".
        + "Please ask me questions related to TypeScript programming and what is the difference from casual JavaScript".

  - **AI Agent & Backend:**
    - **Session Start:** Based on the skills the user has learned (from `UserProgress`), selects a suitable set of questions.
    - **During Session:** Sends each question to the user. If an audio message is received, uses a Speech-to-Text API (e.g., OpenAI Whisper) to convert it to text.
    - **Session End:**
      - Saves the entire interview session (questions, user responses, AI feedback) in JSON format into the `questions`, `user_answers`, and `ai_feedback` columns of the `InterviewSessions` table.
      - Aggregates all user responses and sends a large prompt to the LLM to request a comprehensive analysis and constructive feedback.

2. Flow of the functionality:
   - Step 1: User selects the chat interface, then they type in the seed query. The seed query will be sent to the Groq LLM to generate questions.
   - Step 2: Use text to speech API to ask every single question in the generated list, stream through WebSocket to the user's audio.
   - Step 3: Start recording the user's answer, stream through WebSocket to the backend, use Whisper Groq API call to transcribe to text. 
   - Step 4: Continue to step 2, with question n+1.

