// data/programData.cjs
'use strict';

module.exports = {
  name: "Section 1: English Starter Program",
  description: "A beginner-level English program.",
  thumbnail: "https://i.pinimg.com/736x/70/31/6a/70316a383a05be14829e51bb0b214aa7.jpg",
  order_index: 0,
  units: [
    {
      name: "Unit 1: Gọi đồ uống",
      description: "Trong bài học này, bạn sẽ học cách gọi đồ uống bằng tiếng Anh.",
      order_index: 0,
      lessons: [
        {
          name: "Lesson 1",
          order_index: 0,
          exercises: [
            {
              question: "Xin chào",
              type: "single_choice",
              order_index: 0,
              answers: [
                { content: "Coffee", is_correct: false },
                { content: "Tea", is_correct: false },
                { content: "Hello", is_correct: true },
                { content: "Water", is_correct: false }
              ],
              explanation: "'Xin chào' trong tiếng Anh là 'Hello'."
            },
            {
              question: "Trà",
              type: "single_choice",
              order_index: 1,
              answers: [
                { content: "Coffee", is_correct: false },
                { content: "Tea", is_correct: true },
                { content: "Hello", is_correct: false },
                { content: "Water", is_correct: false }
              ],
              explanation: "'Trà' được dịch sang tiếng Anh là 'Tea'."
            },
            {
              question: "Nước",
              type: "single_choice",
              order_index: 2,
              answers: [
                { content: "Coffee", is_correct: false },
                { content: "Tea", is_correct: false },
                { content: "Hello", is_correct: false },
                { content: "Water", is_correct: true }
              ],
              explanation: "'Nước' trong tiếng Anh là 'Water'."
            },
            {
              question: "Sữa",
              type: "single_choice",
              order_index: 3,
              answers: [
                { content: "Coffee", is_correct: false },
                { content: "Tea", is_correct: false },
                { content: "Hello", is_correct: false },
                { content: "Milk", is_correct: true }
              ],
              explanation: "'Sữa' trong tiếng Anh là 'Milk'."
            },
            {
              question: "Good morning",
              type: "single_choice",
              order_index: 4,
              answers: [
                { content: "Chúc ngủ ngon", is_correct: false },
                { content: "Tạm biệt", is_correct: false },
                { content: "Chào buổi sáng", is_correct: true },
                { content: "Bạn khỏe không?", is_correct: false }
              ],
              explanation: "'Good morning' nghĩa là 'Chào buổi sáng' trong tiếng Việt."
            },
            {
              question: "Good afternoon",
              type: "single_choice",
              order_index: 5,
              answers: [
                { content: "Chào buổi tối", is_correct: false },
                { content: "Chào buổi chiều", is_correct: true },
                { content: "Tạm biệt", is_correct: false },
                { content: "Chúc ngủ ngon", is_correct: false }
              ],
              explanation: "'Good afternoon' được dùng để chào buổi chiều."
            },
            {
              question: "Good evening",
              type: "single_choice",
              order_index: 6,
              answers: [
                { content: "Chào buổi sáng", is_correct: false },
                { content: "Chào buổi chiều", is_correct: false },
                { content: "Chào buổi tối", is_correct: true },
                { content: "Chúc ngủ ngon", is_correct: false }
              ],
              explanation: "'Good evening' nghĩa là 'Chào buổi tối', thường dùng sau 6 giờ tối."
            },
            {
              question: "Làm ơn",
              type: "single_choice",
              order_index: 7,
              answers: [
                { content: "Sorry", is_correct: false },
                { content: "Thank you", is_correct: false },
                { content: "Please", is_correct: true },
                { content: "Excuse me", is_correct: false }
              ],
              explanation: "Từ 'Please' (hoặc 'Làm ơn') được sử dụng phổ biến để thể hiện sự lịch sự khi đưa ra một lời yêu cầu hoặc đề nghị."
            },
          ],
        },
        {
          name: "Lesson 2",
          order_index: 1,
          exercises: [
            {
              question: "Cà phê",
              type: "single_choice",
              order_index: 0,
              answers: [
                { content: "Coffee", is_correct: true },
                { content: "Tea", is_correct: false },
                { content: "Hello", is_correct: false },
                { content: "Water", is_correct: false },
              ]
            },
            {
              question: "Hello, Lisa!",
              type: "speaking",
              order_index: 1,
              answers: []
            },
            {
              question: "Write in Vietnamese: Tea or Coffee ?",
              type: "writing",
              order_index: 2,
              answers: [],
              explanation: "Trà hay Cà phê ?",
            },
            {
              question: `Complete the conversation: 
              Oscar: Good morning 
              Lin: ...
              `,
              type: "single_choice",
              order_index: 3,
              answers: [
                { content: "With milk ?", is_correct: false },
                { content: "Good morning!", is_correct: true },
              ],
            },
            {
              question: "What did you hear? (Bạn đã nghe thấy gì?)",
              record: "Yes, with milk!",
              type: "single_choice",
              order_index: 4,
              answers: [
                { content: "Yes, with tea!", is_correct: false },
                { content: "Yes, with milk!", is_correct: true },
              ],
              explanation: "The speaker clearly says 'Yes, with milk!'",
            },
            {
              question: "Coffee and water",
              type: "speaking",
              order_index: 5,
              answers: [],
            },
            {
              question: "What did you hear? (Bạn đã nghe thấy gì?)",
              record: "My",
              type: "single_choice",
              order_index: 6,
              answers: [
                { content: "My", is_correct: true },
                { content: "By", is_correct: false },
              ],
              explanation: "The speaker clearly says 'My'",
            },
            {
              question: "What did you hear? (Bạn đã nghe thấy gì?)",
              record: "No, thanks, Duo.",
              type: "single_choice",
              order_index: 7,
              answers: [
                { content: "No, thanks, Duo.", is_correct: true },
                { content: "No thanks to you.", is_correct: false },
                { content: "No tanks, Duo.", is_correct: false },
              ],
              explanation: "The speaker clearly says 'No, thanks, Duo.'",
            },
            {
              question: "What did you hear? (Bạn đã nghe thấy gì?)",
              record: "For",
              type: "single_choice",
              order_index: 8,
              answers: [
                { content: "For", is_correct: true },
                { content: "Far", is_correct: false },
              ],
              explanation: "The speaker clearly says 'For'",
            },
            {
              question: "Vui lòng",
              type: "single_choice",
              order_index: 9,
              answers: [
                { content: "Please", is_correct: true },
                { content: "Tea", is_correct: false },
                { content: "Milk", is_correct: false },
                { content: "Water", is_correct: false },
              ]
            },
          ]
        },
        {
          name: "Lesson 3",
          order_index: 2,
          exercises: [
            {
              question: "Nghĩa trong tiếng việt: 'Good Morning, Lisa'",
              type: "single_choice",
              order_index: 0,
              answers: [
                { content: "Chào buổi sáng,Lisa", is_correct: true },
                { content: "Xin chào, Lisa", is_correct: false }
              ],
            },
            {
              question: "What did you hear? (Bạn đã nghe thấy gì?)",
              record: "Look",
              type: "single_choice",
              order_index: 1,
              answers: [
                { content: "Look", is_correct: true },
                { content: "Like", is_correct: false },
              ],
              explanation: "The speaker clearly says 'Look'",
            },
            {
              question: "What did you hear? (Bạn đã nghe thấy gì?)",
              record: "Go",
              type: "single_choice",
              order_index: 2,
              answers: [
                { content: "Go", is_correct: true },
                { content: "Got", is_correct: false },
              ],
              explanation: "The speaker clearly says 'Go'",
            },
            {
              question: "Write in English: 'Không, với đường, cảm ơn'",
              type: "writing",
              order_index: 3,
              answers: [],
              explanation: "No, with sugar, thanks",
            },
            {
              question: "Nhập từ còn thiếu: 'Yes, tea, ______'",
              record: "Yes, tea, please",
              type: "single_choice",
              order_index: 4,
              answers: [
                { content: "Peace", is_correct: false },
                { content: "Please", is_correct: true },
              ],
              explanation: "The speaker clearly says 'Please'",
            },
            {
              question: "What did you hear? (Bạn đã nghe thấy gì?)",
              record: "Coffee or water",
              type: "single_choice",
              order_index: 5,
              answers: [
                { content: "Coffee or water", is_correct: true },
                { content: "Coffee and water", is_correct: false },
              ],
              explanation: "The speaker clearly says 'Coffee or water'",
            },
            {
              question: "Hello, coffee, please!",
              type: "speaking",
              order_index: 6,
              answers: []
            },
            {
              question: "Nghĩa trong tiếng việt: 'Good evening, Lisa'",
              type: "single_choice",
              order_index: 7,
              answers: [
                { content: "Chào buổi tối,Lisa", is_correct: true },
                { content: "Xin chào, Lisa", is_correct: false }
              ],
            },
            {
              question: "Coffee, tea",
              type: "speaking",
              order_index: 8,
              answers: []
            },

          ],
        },
        {
          name: "Lesson 4",
          order_index: 3,
          exercises: [
            {
              question: "What did you hear? (Bạn đã nghe thấy gì?)",
              record: "Hello, Ben and Lisa",
              type: "single_choice",
              order_index: 0,
              answers: [
                { content: "Hello, Ben and Lisa", is_correct: true },
                { content: "Hello, Pam and Lisa", is_correct: false },
                { content: "Hello, Dan and Lisa", is_correct: false },
              ],
              explanation: "The speaker clearly says 'Hello, Ben and Lisa'",
            },
            {
              question: "Water and tea",
              type: "speaking",
              order_index: 1,
              answers: []
            },

          ],
        },
      ]
    },
    {
      name: "Unit 2: Gọi 911",
      description: "Trong bài học này, bạn sẽ học cách gọi đồ uống bằng tiếng Anh.",
      order_index: 1,
      lessons: [
        {
                    name: "Lesson 1",
          order_index: 0,
          exercises: [
            {
              question: "Xin chào",
              type: "single_choice",
              order_index: 0,
              answers: [
                { content: "Coffee", is_correct: false },
                { content: "Tea", is_correct: false },
                { content: "Hello", is_correct: true },
                { content: "Water", is_correct: false }
              ],
              explanation: "'Xin chào' trong tiếng Anh là 'Hello'."
            },
          ]
        }
      ]
    }
  ]
};
