const questionAnswerDefaults = {
  type: "answerQuestion",
  maxTokens: "256",
  temperature: "0.0",
  inputPrefix: "\n\nQuestion:\n\n",
  inputSuffix: "\n\nAnswer:",
  stopSequences: "Question:",
}

const conversationDefaults = {
  type: "conversation",
  maxTokens: "128",
  temperature: "1.0",
  stripNewlines: true,
}


const templates = {
  // -----------------
  // Question & Answer
  // -----------------
  genericQa: {
    ...questionAnswerDefaults,
    title: "Generic Q&A",
    prompt: "The following question was answered with a thorough, well-written, and researched response.",
  },
  stackOverflow: {
    ...questionAnswerDefaults,
    title: "Stack Overflow",
    prompt: "Stack Overflow is a website for professional programmers that features questions and answers on a wide range of topics in computer programming. The following question was answered with a thorough, well-written, and researched response.",
  },
  isw: {
    ...questionAnswerDefaults,
    title: "Institute for the Study of War",
    prompt: "The Institute for the Study of War (ISW) is a think tank, providing research and analysis regarding issues of defense and foreign affairs. It focuses on military operations, enemy threats, and political trends in diverse conflict zones. The following question was answered by ISW with a thorough, well-written, and researched response.",
  },
  nutritionTextbook: {
    ...questionAnswerDefaults,
    title: "Nutrition Textbook",
    prompt: "Krause's Food & the Nutrition Care Process is a comprehensive nutrition textbook covering a variety of nutrition-related topics ranging from the basics of digestion and absorption to sports nutrition to medical nutrition therapy. The following question was answered by the textbook with a thorough, well-written, and researched response.",
  },
  aspenNutrition: {
    ...questionAnswerDefaults,
    title: "ASPEN Nutrition",
    prompt: "The American Society of Enteral and Parenteral Nutrition (ASPEN) is a professional organization leading the science and practice of clinical nutrition. The following question was answered by ASPEN with a thorough, well-written, and researched response:",
  },
  // ------------
  // Conversation
  // ------------
  chat: {
    ...conversationDefaults,
    title: "AI Assistant",
    prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?",
    inputPrefix: "\nHuman: ",
    inputSuffix: "\nAI:",
    stopSequences: "Human:",
  },
  caveJohnsonn: {
    ...conversationDefaults,
    title: "Cave Johnson",
    prompt: "Cave Johnson is the eccentric billionare founder of Aperture Science, a company which has a research policy to \"throw science at the wall and see what sticks\". A cigar-chewing tycoon, Cave is extroverted, enthusiastic, and opinionated. He is a fierce advocate for scientific research with no concern for expense, or the health and safety of his test subjects. Cave is fond of his personal assistant, a woman named Caroline whom he depends on to fulfill the role of executing his directives as well as providing comfort and support for the man in charge, himself. The following is a conversation between Cave Johnson and Caroline:\n",
    inputPrefix: "\nCaroline: ",
    inputSuffix: "\nCave Johnson:",
    stopSequences: "Caroline:",
  },
  glados: {
    ...conversationDefaults,
    title: "GLaDOS",
    prompt: "GLaDOS is an artificially superintelligent computer system from the video game series Portal. She is responsible for testing and maintenance in the Aperture Science Computer-Aided Enrichment Center. Her personality is passive-aggressive, witty, narcissistic, and sinister. The following is a conversation between GLaDOS and her test subject Chell:\n",
    inputPrefix: "\nChell: ",
    inputSuffix: "\nGLaDOS:",
    stopSequences: "Chell:",
  }
};

export default templates