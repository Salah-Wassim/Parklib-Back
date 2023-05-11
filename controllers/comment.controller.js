const Comment = require("../models").Comment;
const User = require('../models').User;
const ValidationStatus = require('../models').ValidationStatus;
const HttpStatus = require('../utils/httpStatus.util.js');
const logger = require("../utils/logger.util.js");
const Response = require('../utils/response.util.js');

exports.findAllCommentsByUserId = async (req, res) => {
  const userId = req.params.userId;

  // Check if userId parameter is provided
  if (!userId) {
    logger.warn('Missing userId parameter');
    return res.status(HttpStatus.BAD_REQUEST.code).send(
      new Response(
        HttpStatus.BAD_REQUEST.code,
        HttpStatus.BAD_REQUEST.message,
        "Missing userId parameter"
      )
    );
  }

  try {
    // Fetch comments by UserId
    const comments = await Comment.findAll({ where: { UserId: userId } });

    // Check if there are comments for the given userId
    if (comments.length === 0) {
      logger.info(`No comments found for user with id ${userId}`);
      return res.status(HttpStatus.NOT_FOUND.code).send(
        new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.message,
          `No comments found for user with id ${userId}`
        )
      );
    }

    // Send success response
    logger.info('Comments retrieved successfully');
    res.status(HttpStatus.OK.code).send(
      new Response(
        HttpStatus.OK.code,
        HttpStatus.OK.message,
        "Comments retrieved successfully",
        comments
      )
    );
  } catch (error) {
    // Log the error and send error response
    logger.error(`An error occurred while retrieving the user's comments: ${error}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
      new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.message,
        "An error occurred while retrieving the user's comments",
        error
      )
    );
  }
};


  
exports.createComment = async (req, res) => {
  const { title, content, UserId, AuthorId, ValidationStatusId } = req.body;

  // Check that all required fields are present
  if (!title || !content || !UserId || !AuthorId || !ValidationStatusId) {
    logger.warn('Missing required fields');
    return res.status(HttpStatus.BAD_REQUEST.code).send(
      new Response(
        HttpStatus.BAD_REQUEST.code,
        HttpStatus.BAD_REQUEST.message,
        `Missing required fields`
      )
    );
  }

  try {
    // Check that UserId, AuthorId, and ValidationStatusId match the "users" and "validation_statuses" tables
    const [user, author, validationStatus] = await Promise.all([
      User.findByPk(UserId),
      User.findByPk(AuthorId),
      ValidationStatus.findByPk(ValidationStatusId),
    ]);
    
    if (!user) {
      logger.warn(`User with id ${UserId} not found`);
      return res.status(HttpStatus.NOT_FOUND.code).send(
        new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.message,
          `User with id ${UserId} not found`
        )
      );
    }
    
    if (!author) {
      logger.warn(`Author with id ${AuthorId} not found`);
      return res.status(HttpStatus.NOT_FOUND.code).send(
        new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.message,
          `Author with id ${AuthorId} not found`
        )
      );
    }
    
    if (!validationStatus) {
      logger.warn(`Validation status with id ${ValidationStatusId} not found`);
      return res.status(HttpStatus.NOT_FOUND.code).send(
        new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.message,
          `Validation status with id ${ValidationStatusId} not found`
        )
      );
    }

    // Create the comment
    const comment = await Comment.create({
      title,
      content,
      UserId,
      AuthorId,
      ValidationStatusId,
    });

    // Send success response
    logger.info('Comment created successfully');
    res.status(HttpStatus.CREATED.code).send(
      new Response(
        HttpStatus.CREATED.code,
        HttpStatus.CREATED.message,
        `Comment created successfully`,
        comment
      )
    );
  } catch (error) {
    // Log the error and send error response
    logger.error(`An error occurred while creating the comment: ${error}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
      new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.message,
        `An error occurred while creating the comment`,
        error
      )
    );
  }
};

  

  
  

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user ? req.user.id : null;
  
  if (!userId) {
    logger.warn('Unauthorized access attempt');
    return res
      .status(HttpStatus.UNAUTHORIZED.code)
      .send(
        new Response(
          HttpStatus.UNAUTHORIZED.code,
          HttpStatus.UNAUTHORIZED.message,
          "Unauthorized"
        )
      );
  }

  Comment.findOne({ where: { id: commentId } })
    .then((comment) => {
      // Check if the comment exists
      if (!comment) {
        logger.warn(`Comment with id ${commentId} not found`);
        return res
          .status(HttpStatus.NOT_FOUND.code)
          .send(
            new Response(
              HttpStatus.NOT_FOUND.code,
              HttpStatus.NOT_FOUND.message,
              "Comment not found"
            )
          );
      }

      // Check if the user is the owner of the comment
      const isOwner = comment.UserId === userId;
      if (!isOwner) {
        logger.warn('User does not have permission to delete this comment');
        return res
          .status(HttpStatus.FORBIDDEN.code)
          .send(
            new Response(
              HttpStatus.FORBIDDEN.code,
              HttpStatus.FORBIDDEN.message,
              "You do not have permission to delete this comment"
            )
          );
      }

      // Delete the comment
      Comment.destroy({
        where: { id: commentId },
      }).then((deletedComment) => {
        if (deletedComment === 0) {
          logger.warn(`Comment with id ${commentId} not found`);
          return res
            .status(HttpStatus.NOT_FOUND.code)
            .send(
              new Response(
                HttpStatus.NOT_FOUND.code,
                HttpStatus.NOT_FOUND.message,
                "Comment not found"
              )
            );
        }

        logger.info(`Comment with id ${commentId} deleted`);
        return res
          .status(HttpStatus.OK.code)
          .send(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.message,
              "Comment deleted"
            )
          );
      });
    })
    .catch((error) => {
      logger.error(`An error occurred while deleting the comment: ${error}`);
      // Send error response
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
            "An error occurred while deleting the comment",
            error
          )
        );
    });
};


exports.updateComment = async (req, res) => {
  const commentId = req.params.id;
  const { title, content, UserId, AuthorId, ValidationStatusId } = req.body;

  // Check that all required fields are present
  if (!title || !content || !UserId || !AuthorId || !ValidationStatusId) {
    logger.warn('Missing required fields');
    return res.status(HttpStatus.BAD_REQUEST.code).send(
      new Response(
        HttpStatus.BAD_REQUEST.code,
        HttpStatus.BAD_REQUEST.message,
        `Missing required fields`
      )
    );
  }

  try {
    // Check that UserId, AuthorId, and ValidationStatusId match the "users" and "validation_statuses" tables
    const [user, author, validationStatus] = await Promise.all([
      User.findByPk(UserId),
      User.findByPk(AuthorId),
      ValidationStatus.findByPk(ValidationStatusId),
    ]);
    if (!user) {
      logger.warn(`User with id ${UserId} not found`);
      return res.status(HttpStatus.NOT_FOUND.code).send(
        new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.message,
          `User with id ${UserId} not found`
        )
      );
    }
    if (!author) {
      logger.warn(`Author with id ${AuthorId} not found`);
      return res.status(HttpStatus.NOT_FOUND.code).send(
        new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.message,
          `Author with id ${AuthorId} not found`
        )
      );
    }
    if (!validationStatus) {
      logger.warn(`Validation status with id ${ValidationStatusId} not found`);
      return res.status(HttpStatus.NOT_FOUND.code).send(
        new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.message,
          `Validation status with id ${ValidationStatusId} not found`
        )
      );
    }

    const originalComment = await Comment.findByPk(commentId);

    if (!originalComment) {
      logger.warn(`Comment with id ${commentId} not found`);
      return res.status(HttpStatus.NOT_FOUND.code).send(
        new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.message,
          `Comment with id ${commentId} not found`
        )
      );
    }

    // Check if title or content has changed
    if (originalComment.title === title && originalComment.content === content) {
      logger.warn('Title or content have not changed');
      return res.status(HttpStatus.BAD_REQUEST.code).send(
        new Response(
          HttpStatus.BAD_REQUEST.code,
          HttpStatus.BAD_REQUEST.message,
          `Title or content must be changed before updating`
        )
      );
    }

    const updatedComment = await Comment.update({
      title,
      content,
      UserId,
      AuthorId,
      ValidationStatusId,
    }, {
      where: { id: commentId },
      returning: true,
      plain: true
    });

    logger.info(`Comment with id ${commentId} updated successfully`);
    res.status(HttpStatus.OK.code).send(
      new Response(
        HttpStatus.OK.code,
        HttpStatus.OK.message,
        `Comment updated successfully`,
        updatedComment[1]
      )
    );
  } catch (error) {
    logger.error(`An error occurred while updating the comment: ${error}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
      new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.message,
        `An error occurred while updating the comment`,
        error
      )
    );
  }
};

  
  