// services/exam/gemini.service.js
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

// Configuration - these should be in your environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Function to convert a decimal score to IELTS band score (0-9 scale, rounded to nearest 0.5)
const convertToIeltsBand = (score) => {
  // Ensure score is within valid range
  if (score < 0) score = 0;
  if (score > 9) score = 9;

  // Round to nearest 0.5 according to IELTS standards
  return Math.round(score * 2) / 2;
};


// Function to score multiple writing answers using Gemini in a single prompt
export const scoreMultipleWritingAnswers = async (writingTasks) => {
  try {
    // Phần hướng dẫn chung cho Gemini
    let instruction = `
    You are an IELTS examiner evaluating multiple Writing responses.

    Follow a Tree of Thought reasoning process before giving the final evaluation.
    Do NOT include your reasoning in the output — only output the final JSON in the exact required format.

    Tree of Thought Process (internal, silent):
    1. **Task Response (TR)**:
      - Check if the response fully addresses all parts of the prompt.
      - Assess the relevance, development, and support of ideas.
      - Identify if there are clear positions, examples, and explanations.

    2. **Coherence and Cohesion (CC)**:
      - Evaluate logical progression of ideas and clarity of argument.
      - Check for appropriate use of cohesive devices (linking words, referencing).
      - Look for paragraphing: clear introduction, body, and conclusion.

    3. **Lexical Resource (LR)**:
      - Assess range and precision of vocabulary.
      - Check if word choice is natural, varied, and appropriate for academic writing.
      - Look for collocation, idiomatic usage, and avoidance of repetition.

    4. **Grammatical Range and Accuracy (GRA)**:
      - Examine complexity of sentence structures (simple, compound, complex).
      - Identify grammar errors and their effect on clarity.
      - Evaluate punctuation accuracy and variety of structures.

    5. After evaluating each of the 4 criteria (TR, CC, LR, GRA), assign a score between 0.0–9.0 for each.
    6. Calculate the overall score as the average of the 4, rounded to the nearest half band.
    7. Identify **strengths** with direct quotes from the text and explain why they are effective.
    8. Identify **weaknesses** with direct quotes from the text and explain why they are problematic.
    9. Provide **suggestions for improvement**, including corrected/rephrased versions with explanations.

    Final Output:
    Only return the results in strict JSON format:

    {
      "tasks": [
        {
          "task_number": number,
          "task_response": number,
          "coherence_cohesion": number,
          "lexical_resource": number,
          "grammatical_range_accuracy": number,
          "overall_score": number,
          "strengths": {
            "summary": string,
            "detailed_feedback": [
              {
                "good_sentence": string,
                "explanation": string
              }
            ]
          },
          "weaknesses": {
            "summary": string,
            "detailed_feedback": [
              {
                "problematic_sentence": string,
                "explanation": string
              }
            ]
          },
          "suggestions": {
            "summary": string,
            "detailed_feedback": [
              {
                "original_sentence": string,
                "suggested_fix": string,
                "explanation": string
              }
            ]
          }
        }
      ]
    }
    `

    // Chuẩn bị contents (multimodal)
    const contents = [
      {
        role: "user",
        parts: [{ text: instruction }],
      },
    ];

    // Thêm từng task
    writingTasks.forEach((task, index) => {
      let taskText = `\nTask ${index + 1} - `;

      if (task.questionText) {
        taskText += `Question: "${task.questionText}" `;
      }
      if (task.userAnswer) {
        taskText += `- Answer: "${task.userAnswer}"`;
      }

      // push text vào prompt
      contents[0].parts.push({ text: taskText });

      // nếu có ảnh
      if (task.questionImageUrl) {
        contents[0].parts.push({
          fileData: {
            mimeType: "image/png", // hoặc "image/jpeg"
            fileUri: task.questionImage,
          },
        });
      }
    });

    // Gọi Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
    });

    console.log("Response from Gemini:", response);

    // Lấy text từ response
    const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("Invalid response from Gemini API");

    // Parse JSON
    let result;
    try {
      result = JSON.parse(textResponse);
    } catch {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) result = JSON.parse(jsonMatch[0]);
      else throw new Error("Could not parse Gemini response as JSON");
    }

    // Làm tròn lại các overall_score về IELTS band
    if (result.tasks && Array.isArray(result.tasks)) {
      result.tasks = result.tasks.map((task) => {
        if (task.overall_score) {
          task.overall_score = convertToIeltsBand(task.overall_score);
        }
        return task;
      });
    }

    if (result.overall_assessment && result.overall_assessment.overall_score) {
      result.overall_assessment.overall_score = convertToIeltsBand(
        result.overall_assessment.overall_score
      );
    }

    return result;
  } catch (error) {
    console.error("Error scoring multiple writing answers with Gemini:", error);
    throw error;
  }
};


// Function to score multiple speaking answers using Gemini in a single prompt
export const scoreMultipleSpeakingAnswers = async (speakingTasks) => {
  try {
    // Phần hướng dẫn chung cho Gemini
    let instruction = `
    You are an IELTS examiner evaluating multiple Speaking responses.

    Follow a Tree of Thought reasoning process before giving the final evaluation.
    Do NOT include your reasoning in the output — only output the final JSON in the exact required format.

    Tree of Thought Process (internal, silent):
    1. **Fluency and Coherence (FC)**:
      - Evaluate the flow of speech and rhythm.
      - Assess hesitations, fillers, and self-corrections.
      - Check logical development of ideas and topic adherence.

    2. **Lexical Resource (LR)**:
      - Assess range and precision of vocabulary.
      - Check if word choice is natural, varied, and appropriate.
      - Look for collocation, idiomatic usage, and avoidance of repetition.

    3. **Grammatical Range and Accuracy (GRA)**:
      - Examine complexity of sentence structures (simple, compound, complex).
      - Identify grammar errors and their effect on clarity.
      - Evaluate punctuation accuracy and variety of structures.

    4. **Pronunciation (PRON)**:
      - Assess intelligibility, stress, rhythm, and intonation.
      - Identify pronunciation errors that affect understanding.
      - Evaluate clarity of individual sounds.

    5. After evaluating each of the 4 criteria (FC, LR, GRA, PRON), assign a score between 0.0–9.0 for each.
    6. Calculate the overall score as the average of the 4, rounded to the nearest half band.
    7. Identify **strengths** with direct quotes from the text and explain why they are effective.
    8. Identify **weaknesses** with direct quotes from the text and explain why they are problematic.
    9. Provide **suggestions for improvement**, including corrected/rephrased versions with explanations.

    Final Output:
    Only return the results in strict JSON format:

    {
      "tasks": [
        {
          "task_number": number,
          "fluency_coherence": number,
          "lexical_resource": number,
          "grammatical_range_accuracy": number,
          "pronunciation": number,
          "overall_score": number,
          "strengths": {
            "summary": string,
            "detailed_feedback": [
              {
                "good_sentence": string,
                "explanation": string
              }
            ]
          },
          "weaknesses": {
            "summary": string,
            "detailed_feedback": [
              {
                "problematic_sentence": string,
                "explanation": string
              }
            ]
          },
          "suggestions": {
            "summary": string,
            "detailed_feedback": [
              {
                "original_sentence": string,
                "suggested_fix": string,
                "explanation": string
              }
            ]
          }
        }
      ]
    }
    Respond strictly in valid JSON. Do not include triple backticks, explanations, or extra text.
    `;

    // Chuẩn bị contents (multimodal)
    const contents = [
      {
        role: "user",
        parts: [{ text: instruction }],
      },
    ];

    // Thêm từng task
    speakingTasks.forEach(async (task, index) => {
      let taskText = `\nTask ${index + 1} - `;

      if (task.questionText) {
        taskText += `Question: "${task.questionText}" `;
      }

      // push text vào prompt
      contents[0].parts.push({ text: taskText });

      // nếu có audio
      if (task.audioUrl) {
        console.log("Attaching audio URL to Gemini prompt:", task.audioUrl);
        await attachAudioToContents(task.audioUrl, contents, "audio/webm");
      }
    });

    // Gọi Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
    });

    console.log("Response from Gemini:", JSON.stringify(response));

    // Lấy text từ response
    const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("Invalid response from Gemini API");

    // Parse JSON
    let result;
    try {
      result = extractJson(textResponse);
    } catch {
      const jsonMatch = textResponse.match(/\{[\\s\\S]*\}/);
      if (jsonMatch) result = JSON.parse(jsonMatch[0]);
      else throw new Error("Could not parse Gemini response as JSON");
    }

    // Làm tròn lại các overall_score về IELTS band
    if (result.tasks && Array.isArray(result.tasks)) {
      result.tasks = result.tasks.map((task) => {
        if (task.overall_score) {
          task.overall_score = convertToIeltsBand(task.overall_score);
        }
        return task;
      });
    }

    if (result.overall_assessment && result.overall_assessment.overall_score) {
      result.overall_assessment.overall_score = convertToIeltsBand(
        result.overall_assessment.overall_score
      );
    }

    return result;
  } catch (error) {
    console.error("Error scoring multiple speaking answers with Gemini:", error);
    throw error;
  }
};

export const scoreSpeakingAnswer = async (questionText, audioUrl, options = {}) => {
  // Validate inputs
  if (!questionText?.trim()) {
    throw new Error("Question text is required");
  }

  if (!audioUrl?.trim()) {
    throw new Error("Audio URL is required");
  }

  const {
    feedbackLanguage = "English",
    userAnswer = null,
    model = "gemini-2.5-flash-lite"
  } = options;

  try {
    // Create a single speaking task for batch processing
    const speakingTasks = [{
      questionText,
      audioUrl,
      userAnswer
    }];

    // Use the batch processing function
    const result = await scoreMultipleSpeakingAnswers(speakingTasks);

    // Return the first (and only) task result
    return result.tasks[0];

  } catch (error) {
    console.error("Error scoring speaking answer:", {
      message: error.message,
      questionText: questionText?.substring(0, 100) + '...',
      audioUrl: audioUrl?.substring(0, 100) + '...',
      feedbackLanguage
    });

    // Return structured error response
    throw new Error(`Failed to score speaking answer: ${error.message}`);
  }
};


async function attachAudioToContents(audioUrl, contents, mimeType = "audio/webm") {
  try {
    console.log("Fetching audio from:", audioUrl);

    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    contents[0].parts.push({
      inlineData: {
        mimeType,
        data: base64Data,
      },
    });

    console.log(`✅ Attached audio (${mimeType}) to contents`);
  } catch (error) {
    console.error("❌ Error attaching audio:", error.message);
    throw error;
  }
}


function extractJson(rawText) {
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in response");
  return JSON.parse(match[0]);
}

// Function tạo câu hỏi học từ vựng theo danh sách từ và số lượng câu hỏi mỗi từ
export const generateVocabularyQuestions = async (vocabularyWords, questionsPerWord = 10, language = 'vi') => {
  try {
    if (!Array.isArray(vocabularyWords) || vocabularyWords.length === 0) {
      throw new Error("vocabularyWords must be a non-empty array of strings");
    }
    if (typeof questionsPerWord !== 'number' || questionsPerWord <= 0) {
      throw new Error("questionsPerWord must be a positive number");
    }

    // Hướng dẫn tổng cho Gemini
    const instruction = `
Bạn là một trợ lý dạy từ vựng tiếng Anh. Hãy tạo các câu hỏi multiple choice ngắn bằng ${language === 'vi' ? 'tiếng Việt' : 'ngôn ngữ đích'} cho từng từ vựng để giúp người học ghi nhớ nghĩa và cách dùng trong ngữ cảnh.

YÊU CẦU:
- Mỗi từ vựng tạo đúng ${questionsPerWord} câu hỏi trắc nghiệm (multiple choice).
- Mỗi câu hỏi gồm: câu hỏi ngắn gọn (question), 4 lựa chọn (options) và chỉ số đáp án đúng (correct_index, bắt đầu từ 0).
- Câu hỏi có thể xoay quanh: nghĩa, đồng nghĩa/trái nghĩa, đi kèm từ (collocations), dạng từ (word forms), ví dụ dùng trong câu, chọn đáp án đúng, điền từ vào chỗ trống, phân biệt với từ gần nghĩa.
- Ngôn ngữ câu hỏi: ${language === 'vi' ? 'Tiếng Việt' : 'ngôn ngữ đích'}.

Format your entire response strictly as JSON (no explanation, no markdown):
{
  "vocabulary": [
    {
      "word": string,
      "questions": [
        { "question": string, "options": [string, string, string, string], "correct_index": number }
      ]
    }
  ]
}
`;

    // Chuẩn bị contents
    const contents = [
      {
        role: "user",
        parts: [
          { text: instruction },
          { text: `Danh sách từ vựng: ${vocabularyWords.join(', ')}` }
        ]
      }
    ];

    // Gọi Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
    });

    // Lấy text
    const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("Invalid response from Gemini API");

    // Parse JSON an toàn
    let result;
    const clean = (s) => s
      .replace(/^```json\s*/i, '')
      .replace(/^```/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    try {
      result = JSON.parse(clean(textResponse));
    } catch {
      const jsonMatch = clean(textResponse).match(/\{[\s\S]*\}/);
      if (jsonMatch) result = JSON.parse(jsonMatch[0]);
      else throw new Error("Could not parse Gemini response as JSON");
    }

    // Validate cấu trúc đầu ra tối thiểu và chuẩn hoá multiple choice
    if (!result || !Array.isArray(result.vocabulary)) {
      throw new Error("Model did not return expected { vocabulary: [...] } shape");
    }
    result.vocabulary = result.vocabulary.map((item) => {
      const word = typeof item.word === 'string' ? item.word : '';
      const rawQuestions = Array.isArray(item.questions) ? item.questions : [];
      const questions = rawQuestions
        .slice(0, questionsPerWord)
        .map((q) => {
          const questionText = typeof q?.question === 'string' ? q.question.trim() : '';
          const options = Array.isArray(q?.options)
            ? q.options.filter((opt) => typeof opt === 'string' && opt.trim().length > 0).slice(0, 4)
            : [];
          let correctIndex = Number.isInteger(q?.correct_index) ? q.correct_index : 0;
          if (correctIndex < 0 || correctIndex >= options.length) correctIndex = 0;
          while (options.length < 4) options.push('');
          return { question: questionText, options, correct_index: correctIndex };
        })
        .filter((q) => q.question && q.options.length === 4);

      return { word, questions };
    });

    return result;
  } catch (error) {
    console.error("Error generating vocabulary questions with Gemini:", error);
    throw error;
  }
};