// controllers/geminiController.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchCourseInSentences, getTopRatedCourses , mappingRecommendList} from '../services/course.service.js';
import axios from "axios";

const FASTAPI_CHATBOT_URL = process.env.FASTAPI_CHATBOT_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new GoogleGenerativeAI(
  GEMINI_API_KEY,
);
const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
export const generateResponseController = async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await model.generateContent("Limit in 5 sentences: " + prompt);
    // console.log(result.response.text())
    res.json(result.response.text());
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Integrate web data into chatbot 
const intents = [
  { type: "price", keywords: ["giá", "bao nhiêu", "cost", "price"] },
  { type: "rating", keywords: ["đánh giá", "rating", "review", "stars"] },
  { type: "description", keywords: ["khóa học gì", "nội dung", "describe"] },
];

function detectIntent(userInput) {
  const lowerInput = userInput.toLowerCase();
  for (const intent of intents) {
    if (intent.keywords.some(keyword => lowerInput.includes(keyword))) return intent.type;
  }
  return "general"; // Nếu không nhận diện được thì mặc định là câu hỏi chung
}


async function getCourseInfo(prompt, intent) {
  var course = await searchCourseInSentences(prompt, 1);
  if (!course || course.length == 0) return null;
  course = course[0]

  const MAX_LENGTH = 200; // Độ dài tối đa cho phép
  const SUFFIX = '...'; // Hậu tố thêm vào cuối chuỗi nếu bị cắt
  if (course.description && course.description.length > MAX_LENGTH)
    course.description = course.description.slice(0, MAX_LENGTH - SUFFIX.length) + SUFFIX;

  switch (intent) {
    case "price":
      return `Course "${course.name}" has price: ${course.price}$.`;
    case "rating":
      return `Course "${course.name}" has rating: ${course.rating}.`;
    case "description":
      return `Course "${course.name}": ${course.description} and has price: ${course.price}$.`;
    default:
      return `Course data: ${JSON.stringify(course)}`;
  }
}
export const generateResponseWithWebDataController = async (req, res) => {
  try {
    var { prompt } = req.body;
    const intent = detectIntent(prompt);
    const courseInfo = await getCourseInfo(prompt, intent);

    prompt = "Respond clearly in no more than 9 sentences: " + prompt;

    if (courseInfo) {
      prompt = `${courseInfo}. ${prompt}`;
    }

    // console.log(prompt)
    const result = await model.generateContent(prompt);
    res.json(result.response.text());
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).send('Internal Server Error');
  }
}


// Writing Exercise Checking
export const checkWritingController = async (req, res) => {
  try {
    const { question, userAnswer } = req.body;
    const myprompt = `
You are an English teacher. Grade the student's answer.
Question:
"${question}"
Student's answer:
"${userAnswer}"
Give a score of 1 if the student's answer fulfills the question's requirement in meaning, even if there are grammar or spelling issues. Otherwise, score 0.
Respond ONLY with "1" or "0".
  `;

    const result = await model.generateContent(myprompt);
    const raw = result.response.text().trim();
    res.json(parseInt(raw));
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).send('Internal Server Error');
  }
};


//
// AI Backend API (FastAPI)	
//
// API call My chatbot (FastAPI server)
export const myChatbotController = async (req, res) => {
  try {
    const { prompt } = req.body;
    var userId = "";
    if (req?.user?.id) userId = req.user.id;

    // console.log("📤 Sending to chatbot:", { prompt, userId });

    const response = await axios.post(`${FASTAPI_CHATBOT_URL}/chat`, { msg: prompt, userId });

    // console.log("📥 Chatbot response:", response.data);

    res.status(200).json(response.data.response);
  } catch (error) {
    console.error('FastAPI chatbot error:', error.message);
    res.status(500).json({ error: 'Chatbot API error', details: error.message });
  }
};



// Recommend system 
export const getCourseRecommendations = async (req, res) => {
  const user_id = req?.user?.id;

  if (!user_id) {
    const topCourses = await getTopRatedCourses(18);
    return res.status(200).json({ recommendations: topCourses });
  }

  const { n_recommendations = 5 } = req.body;

  try {
    const response = await axios.post(`${FASTAPI_CHATBOT_URL}/recommendations`, {
      user_id,
      n_recommendations,
    });
    console.log(response.data)
    let recommendedCourseIds = response.data.recommendations.map(item => item.course_id);
    const detailedCourses = await mappingRecommendList(recommendedCourseIds, user_id ?? -1);

    return res.status(200).json({ recommendations: detailedCourses });
  } catch (err) {
    console.error('AI Server Error:', err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.detail || 'Error fetching recommendations from AI server';

    try {
      const topCourses = await getTopRatedCourses(18);
      return res.status(200).json({ recommendations: topCourses, error: message });
    } catch (fallbackErr) {
      console.error('Fallback Error:', fallbackErr.message);
      return res.status(status).json({ error: message });
    }

  }
};


// Reload Recommend system
export const reloadRecommendationModel = async (req, res) => {
  try {
    const response = await axios.post(`${FASTAPI_CHATBOT_URL}/reload-model`); // URL FastAPI
    res.status(200).json({ success: true, message: 'Model reloaded', detail: response.data });
  } catch (error) {
    console.error('❌ Error calling FastAPI:', error.message);
    res.status(500).json({ success: false, message: 'Failed to reload model', error: error.message });
  }
};


