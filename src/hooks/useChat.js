import { useState, useEffect } from 'react';
import axios from 'axios';

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

export const useChat = ({ iss, news }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('iss_chat_history_v4');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Hello. How can I help you with the ISS or News data?' }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('iss_chat_history_v4', JSON.stringify(messages.slice(-30)));
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    const query = text.toLowerCase();
    
    // Intelligent rule-based responses to ensure data is always provided
    let responseText = "";

    if (query.includes('nearest place') || query.includes('where is it')) {
      responseText = `The ISS is currently near: ${iss.nearestPlace || 'Open Ocean'}.`;
    } else if (query.includes('speed') || query.includes('velocity')) {
      responseText = `The current speed of the ISS is ${Math.round(iss.speed || 0)} km/h.`;
    } else if (query.includes('location') || query.includes('position') || query.includes('coordinates') || query.includes('lat') || query.includes('lng')) {
      responseText = `The ISS coordinates are Lat ${iss.position?.lat?.toFixed(3)}, Lng ${iss.position?.lng?.toFixed(3)}.`;
    } else if (query.includes('tracked') || query.includes('positions')) {
      responseText = `We have tracked ${iss.history?.length || 0} positions in this session.`;
    } else if (query.includes('people') || query.includes('astronauts')) {
      responseText = `There are currently ${iss.astros?.number || 0} people in space.`;
    } else if (query.includes('news') || query.includes('breaking')) {
      const topNews = news.articles?.[0]?.title || 'Space exploration continues normally.';
      responseText = `The latest news headline is: "${topNews}".`;
    } else if (query === 'hi' || query === 'hello') {
      responseText = 'Hello. How can I help you with the ISS or News data?';
    } else if (query.includes('dashboard data') || query.includes('provide data')) {
      responseText = `I can provide data on ISS location (${iss.position?.lat.toFixed(2)}, ${iss.position?.lng.toFixed(2)}), speed (${Math.round(iss.speed)} km/h), nearest place, and the latest news. What would you like to know?`;
    } else {
      // Catch-all for non-data questions
      responseText = "I only know dashboard data. Please ask about the ISS location, speed, or news.";
    }

    // Optional: Try to use AI for more natural phrasing, but the rules above guarantee an answer
    try {
      const token = import.meta.env.VITE_HF_API_TOKEN;
      if (token) {
        const context = `ISS: Lat ${iss.position?.lat}, Lng ${iss.position?.lng}, Speed ${iss.speed} km/h, Near ${iss.nearestPlace}. News: ${news.articles?.[0]?.title}`;
        const aiResponse = await axios.post(HF_API_URL, {
          inputs: `[INST] Answer this question using ONLY this dashboard data: ${context}. User: ${text} [/INST]`,
        }, { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 });
        
        const result = aiResponse.data[0]?.generated_text?.split('[/INST]').pop().trim();
        if (result && result.length > 5) {
          responseText = result;
        }
      }
    } catch (e) {
      console.log("Using rule-based response");
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      setIsTyping(false);
    }, 600);
  };

  const clearChat = () => setMessages([{ role: 'assistant', content: 'Hello. How can I help you with the ISS or News data?' }]);

  return { messages, sendMessage, isTyping, clearChat };
};
