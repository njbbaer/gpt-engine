const answer_question_defaults = {
  temperature: "0.0",
}

const templates = {
  stack_overflow: {
    ...answer_question_defaults,
    title: "Stack Overflow",
    prompt: "Stack Overflow is a website for professional programmers that features questions and answers on a wide range of topics in computer programming. The following question was answered with a thorough, well-written, and researched response.",
  },
  generic_qa: {
    ...answer_question_defaults,
    title: "Generic Q&A",
    prompt: "The following question was answered with a thorough, well-written, and researched response.",
  },
  isw: {
    ...answer_question_defaults,
    title: "Institute for the Study of War (ISW)",
    prompt: "The Institute for the Study of War (ISW) is a think tank, providing research and analysis regarding issues of defense and foreign affairs. It focuses on military operations, enemy threats, and political trends in diverse conflict zones. The following question was answered by ISW with a thorough, well-written, and researched response.",
  },
  nutrition_textbook: {
    ...answer_question_defaults,
    title: "Nutrition Textbook",
    prompt: "Krause's Food & the Nutrition Care Process is a comprehensive nutrition textbook covering a variety of nutrition-related topics ranging from the basics of digestion and absorption to sports nutrition to medical nutrition therapy. The following question was answered by the textbook with a thorough, well-written, and researched response.",
  },
  aspen_nutrition: {
    ...answer_question_defaults,
    title: "ASPEN Nutrition",
    prompt: "The American Society of Enteral and Parenteral Nutrition (ASPEN) is a professional organization leading the science and practice of clinical nutrition. The following question was answered by ASPEN with a thorough, well-written, and researched response:",
  }
};

export default templates