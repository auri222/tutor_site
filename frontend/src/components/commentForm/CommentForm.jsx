import "./commentForm.css";
import React from "react";
import { useState } from "react";

const CommentForm = ({ handleSubmit, submitLabel, hasCancelButton = false, handleCancel, initialText = '' }) => {
  const [text, setText] = useState(initialText);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={onSubmit} className='commentForm'>
      <textarea
        type="text"
        id="text"
        className="form-control"
        rows={2}
        placeholder="Nhập bình luận"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      ></textarea>
      <div className="text-end">
        <button className="btnReview" disabled={text.length === 0}>{submitLabel}</button>
      
      {hasCancelButton ? (
        <button type="button" className="btnCancelForm ms-2" onClick={() => {handleCancel()}}>Hủy</button>
      ) : ""}
      </div>
    </form>
  );
};

export default CommentForm;
