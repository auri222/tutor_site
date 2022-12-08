import "./comment.css";
import CommentForm from "../commentForm/CommentForm";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Comment = ({
  item,
  handleDeleteComment,
  activeComment,
  setActiveComment,
  addComment,
  updateComment,
  replies, 
  parentID = null
}) => {
  const {user} = useContext(AuthContext);
  const isEditing =
    activeComment &&
    activeComment?.type === "edit" &&
    activeComment?.commentID === item._id;
  const isReplying =
    activeComment &&
    activeComment?.type === "reply" &&
    activeComment?.commentID === item._id;
  const replyID = parentID ? parentID : item._id;
    const canReply = user !== null; //Logged in
    const canEdit = item.reviewer === user?.username;
    const canDelete = item.reviewer === user?.username;

  const handleCreatedDate = (date) => {
    let d = new Date(date);
    return `${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${
      d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
    }:${d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()} ${
      d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
    }/${
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    }/${d.getFullYear()}`;
  };

  return (
    <div className="commentwrapper">
      <div className="row mb-3">
        {isEditing ? (
          <div className="row mb-3">
            <div className="col-md-12">
              <span className="commentTitle">{item.reviewer}</span>
            </div>
            <div className="col-md-12">
              <CommentForm
                handleSubmit={(text) => updateComment(text, item._id)}
                submitLabel="Sửa bình luận"
                initialText={item.content}
                hasCancelButton
                handleCancel={() => setActiveComment(null)}
              />
            </div>
          </div>
        ) : (
          <>
          <div className="col-md-12">
            <span className="commentTitle">{item.reviewer} </span>
            <span className="commentContent">{item.content}</span>
          </div>
          <div className="col-md-12">
          <span className="commentDatetime">
            {handleCreatedDate(item.createdAt)}
          </span>
          {canEdit  ? (
              <span
                className="commentAction"
                onClick={() =>
                  setActiveComment({ commentID: item._id, type: "edit" })
                }
              >
                Sửa
              </span>
          ) : (
            ""
          )}

          {canDelete ? (
            <span
            className="commentAction"
            onClick={() => {
              handleDeleteComment(item._id);
            }}
          >
            Xóa
          </span>
          ) : ""}


          {canReply ? (
            <span
              className="commentAction"
              onClick={() =>
                setActiveComment({ commentID: item._id, type: "reply" })
              }
            >
              Phản hồi
            </span>
          ) : (
            ""
          )}
        </div>
          </>
        )}
        {isReplying ? (
          <div className="row my-2">
            <div className="col-md-12">
              <CommentForm handleSubmit={(text) => addComment(text, replyID)} submitLabel="Phản hồi" hasCancelButton handleCancel={() => setActiveComment(null)} />
            </div>
          </div>
        ) : (
          ""
        )}

        
        {replies.length > 0 ? (
          <div className="commentReplies">
            {replies.map((reply) => (
              <Comment item={reply} key={reply._id} replies={[]} handleDeleteComment={handleDeleteComment} parentID={item._id}  addComment={addComment} updateComment={updateComment} activeComment={activeComment} setActiveComment={setActiveComment} />
            ))}
          </div>
        ) : ""}
      </div>
    </div>
  );
};

export default Comment;
