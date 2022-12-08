const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const {createError} = require('../ultilities/createError');


const createComment = async (req, res, next) => {
  const {comment, tutor, parentID} = req.body; //tutor -> account tutor id
  try {
    
    //Check comment
    if(!comment)
      return next(createError(400, "Thiếu dữ liệu bình luận!"));

    const newComment = new Comment({
      content: comment.content,
      reviewer: comment.reviewer,
      tutor: tutor,
      parentID: parentID,
      createdAt: new Date()
    });

    await newComment.save();
    let message = "";
    if(parentID === null){
      message = `${comment.reviewer} đã bình luận ở trang thông tin cá nhân của bạn.`;
      const type = "COMMENT";
      const isRead = false;
      const newNotification = new Notification({
        receiver: tutor,
        sender: comment.reviewer,
        type: type,
        message: message,
        isRead: isRead,
        typeID: tutor
      });

      await newNotification.save();
    }

    res.status(200).json({success: true, message: "Tạo bình luận thành công!"});

  } catch (error) {
    next(error);
  }
}

const editComment = async (req, res, next) => {
  const commentID = req.params.id;
  const {comment} = req.body;
  try {
    //check comment
    const commentInfo = await Comment.findById(commentID);

    if(!commentInfo)
      return next(createError(404, "Không tìm thấy thông tin bình luận"));
    
    // if(commentInfo.reviewer !== user)
    //   return next(createError(401, "Bạn không có quyền sửa bình luận này"));

    if(!comment)
      return next(createError(400, "Dữ liệu bình luận bị thiếu!"));

    //OK
    await Comment.findByIdAndUpdate(commentID, {$set: {
      content: comment.content
    }}, {new:true});

    const message = `${comment.reviewer} vừa sửa bình luận ở trang thông tin cá nhân của bạn.`;
    const type = "COMMENT";
    const isRead = false;
    const newNotification = new Notification({
      receiver: comment.tutor,
      sender: comment.reviewer,
      type: type,
      message: message,
      isRead: isRead,
      typeID: comment.tutor
    });

    await newNotification.save();

    res.status(200).json({success: true, message: "Sửa bình luận thành công!"});

  } catch (error) {
    next(error);
  }
}


const getComments = async (req, res, next) => {
  const tutor_id = req.params.tutor;
  try {
    
    let total = 0;
    const comments = await Comment.find({tutor: tutor_id}).sort({'createdAt': -1});

    if(comments.length > 0){
      total = comments.length;
    }

    res.status(200).json({total: total, comments: comments});

  } catch (error) {
    next(error);
  }
}

const deleteComment = async (req, res, next) => {
  const commentID = req.params.id;
  try {
    
    await Comment.findByIdAndDelete(commentID);

    res.status(200).json({success: true, message: "Xóa bình luận thành công!"});

  } catch (error) {
    next(error);
  }
}


module.exports = {createComment, editComment, getComments, deleteComment}