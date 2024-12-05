import express from "express";
import { QuestionOperations } from "../shell/questionOperations";
import { validateRequest } from "../middleware/validateRequest";
import {
  createQuestionSchema,
  updateAnswerSchema,
  bulkAssignSchema,
} from "../schemas/question";

const router = express.Router();

router.get("/questions", async (req, res) => {
  try {
    const questions = await QuestionOperations.getQuestions();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      error: "Failed to return questions",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post(
  "/questions",
  validateRequest({ body: createQuestionSchema }),
  async (req, res) => {
    try {
      const question = await QuestionOperations.createQuestion({
        data: req.body,
        currentUser: "current-user@example.com",
      });
      res.status(200).json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      if (error instanceof Error && error.message.includes("invalid options")) {
        return res.status(400).json({
          error: "Invalid field options",
          details: error.message,
        });
      }
      res.status(500).json({
        error: "Failed to create question",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

router.post(
  "/questions/bulk-assign",
  validateRequest({ body: bulkAssignSchema }),
  async (req, res) => {
    try {
      const { ids, assignedTo } = req.body;

      await QuestionOperations.bulkAssign(
        ids,
        assignedTo,
        "current-user@example.com",
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error in bulk assign:", error);
      res.status(500).json({
        error: "Failed to bulk assign questions",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

router.get("/questions/search", async (req, res) => {
  try {
    const results = await QuestionOperations.search(req.query.q as string);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to search questions" });
  }
});

router.post("/questions/:id", async (req, res) => {
  try {
    const question = await QuestionOperations.updateQuestion(req.params.id, {
      ...req.body,
      currentUser: "current-user@example.com",
    });
    res.json(question);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      error: "Failed to update question",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.delete("/questions/:id", async (req, res) => {
  try {
    await QuestionOperations.deleteQuestion(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      error: "Failed to delete question",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export { router as questionRouter };
