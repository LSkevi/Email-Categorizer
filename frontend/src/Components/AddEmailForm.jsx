import React, { useState } from "react";

const AddEmailForm = ({ classifyEmail }) => {
  const [emailText, setEmailText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (emailText) {
      classifyEmail(emailText);
      setEmailText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        placeholder="Write or paste your email content here..."
        rows={4}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        type="submit"
        className="mt-3 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Classificar Email
      </button>
    </form>
  );
};

export default AddEmailForm;
