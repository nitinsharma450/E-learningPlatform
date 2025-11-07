import { useState } from "react";


function QuizAddPage() {
  const [quiz, setQuiz] = useState({
    title: "",
    subject: "",
    description: "",
    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: 0 }],
  });

  const handleQuestionChange = (index:any, field:any, value:any) => {
    const updated:any = [...quiz.questions];
    updated[index][field] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }],
    });
  };

  // const handleSubmit = async () => {
  //   await axios.post("http://localhost:5000/api/quizzes/create", quiz);
  //   alert("Quiz uploaded successfully!");
  // };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Upload New Quiz</h2>

      <input
        type="text"
        placeholder="Quiz Title"
        value={quiz.title}
        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
        className="border p-2 w-full mb-3"
      />
      <input
        type="text"
        placeholder="Subject"
        value={quiz.subject}
        onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
        className="border p-2 w-full mb-3"
      />

      {quiz.questions.map((q, index) => (
        <div key={index} className="border p-3 rounded mb-3">
          <input
            type="text"
            placeholder="Question text"
            value={q.questionText}
            onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
            className="border p-2 w-full mb-2"
          />
          {q.options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => {
                const opts = [...q.options];
                opts[i] = e.target.value;
                handleQuestionChange(index, "options", opts);
              }}
              className="border p-2 w-full mb-1"
            />
          ))}
          <label>Correct Option Index:</label>
          <input
            type="number"
            min="0"
            max="3"
            value={q.correctAnswer}
            onChange={(e) => handleQuestionChange(index, "correctAnswer", Number(e.target.value))}
            className="border p-2 w-20"
          />
        </div>
      ))}
      <button onClick={addQuestion} className="bg-blue-500 text-white px-4 py-2 rounded">Add Question</button>
      {/* <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded ml-3">Upload Quiz</button> */}
    </div>
  );
}

export default QuizAddPage;
