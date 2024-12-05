import Airtable from "airtable";
import { Question } from "@privasee/types";
import { config } from "../config";
import { questionSchema, type QuestionSchema } from "../schemas/question";

Airtable.configure({
  apiKey: config.airtable.apiKey,
});

const base = Airtable.base(config.airtable.baseId!);

const convertRecord = (record: any): Question => {
  const properties = record.get("Properties");
  let parsedProperties: Record<string, string> | null = null;

  // Parse properties if it exists and is a string
  if (properties && typeof properties === "string") {
    try {
      // Split by comma and convert to object
      parsedProperties = properties.split(",").reduce(
        (acc, pair) => {
          const [key, value] = pair.split(":").map((s) => s.trim());
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );
    } catch (error) {
      console.warn("Failed to parse properties:", properties);
    }
  } else if (properties && typeof properties === "object") {
    parsedProperties = properties;
  }

  const rawData = {
    recordId: record.get("_recordId"),
    companyName: record.get("Company Name") || "",
    companyId: record.get("_companyId") || 0,
    question: record.get("Question") || "",
    questionDescription: record.get("Question Description") || null,
    answer: record.get("Answer") || null,
    createdAt: record.get("Created At") || "",
    createdBy: record.get("Created By") || "",
    updatedAt: record.get("Updated At") || "",
    updatedBy: record.get("Updated By") || "",
    assignedTo: record.get("Assigned To") || null,
    properties: parsedProperties,
  };

  return questionSchema.parse(rawData);
};

export const AirtableRepository = {
  async getAllQuestions(): Promise<Question[]> {
    try {
      const records = await base(config.airtable.tableName!).select().all();

      return records.map((record) => {
        try {
          return convertRecord(record);
        } catch (error) {
          console.error("Error converting record:", error);
          throw error;
        }
      });
    } catch (error) {
      console.error("Error in getAllQuestions:", error);
      throw new Error(
        `Failed to fetch questions from Airtable: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  async getQuestion(id: string): Promise<Question> {
    const record = await base(config.airtable.tableName!)
      .select({
        filterByFormula: `{_recordId} = '${id}'`,
      })
      .firstPage();

    if (!record || record.length === 0) {
      throw new Error("Question not found");
    }

    return convertRecord(record[0]);
  },

  async createQuestion(data: Partial<Question>): Promise<Question> {
    try {
      const propertiesString = data.properties
        ? Object.entries(data.properties)
            .map(([key, value]) => `${key}:${value}`)
            .join(",")
        : undefined;

      const fields: Record<string, any> = {
        _recordId: data.recordId,
        "Company Name": data.companyName || "",
        Question: data.question,
        "Question Description": data.questionDescription || "",
        Properties: propertiesString,
        _companyId: data.companyId || 0,
        "Created At": data.createdAt,
        "Updated At": data.updatedAt,
        "Created By": data.createdBy,
        "Updated By": data.updatedBy,
      };

      // Only add optional fields if they have valid values
      if (data.answer) {
        fields.Answer = data.answer;
      }

      if (data.assignedTo) {
        fields["Assigned To"] = data.assignedTo;
      }

      // Removes undefined and null values
      Object.keys(fields).forEach(
        (key) =>
          (fields[key] === undefined || fields[key] === null) &&
          delete fields[key],
      );

      const records = await base(config.airtable.tableName!).create(
        [{ fields }],
        { typecast: true },
      );

      if (!records || records.length === 0) {
        throw new Error("Failed to create record in Airtable");
      }

      return convertRecord(records[0]);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("INVALID_MULTIPLE_CHOICE_OPTIONS")
      ) {
        console.error("Select field validation error:", error);
        throw new Error(
          "One or more fields contain invalid options. Please check your input values.",
        );
      }
      console.error("Error in createQuestion:", error);
      throw error;
    }
  },

  async deleteQuestion(recordId: string): Promise<void> {
    try {
      const record = await base(config.airtable.tableName!)
        .select({
          filterByFormula: `{_recordId} = '${recordId}'`,
        })
        .firstPage();

      if (!record || record.length === 0) {
        throw new Error(`Question not found with recordId: ${recordId}`);
      }

      const airtableId = record[0].id;

      await base(config.airtable.tableName!).destroy(airtableId);
    } catch (error) {
      console.error(`Error deleting question ${recordId}:`, error);
      throw error;
    }
  },

  async updateQuestion(
    recordId: string,
    data: Partial<Question>,
  ): Promise<Question> {
    try {
      const record = await base(config.airtable.tableName!)
        .select({
          filterByFormula: `{_recordId} = '${recordId}'`,
        })
        .firstPage();

      if (!record || record.length === 0) {
        throw new Error(`Question not found with recordId: ${recordId}`);
      }

      const airtableId = record[0].id;

      // Prepare fields object, only including fields that are being updated
      const fields: Record<string, any> = {};

      if (data.assignedTo !== undefined) {
        fields["Assigned To"] = data.assignedTo;
      }

      if (data.answer !== undefined) {
        fields["Answer"] = data.answer;
      }

      // Only update timestamps if they're in a valid format
      const now = new Date().toISOString();
      fields["Updated At"] = now;
      fields["Updated By"] = data.updatedBy || "system";

      const updatedRecords = await base(config.airtable.tableName!).update(
        [
          {
            id: airtableId,
            fields,
          },
        ],
        { typecast: true },
      );

      if (!updatedRecords || updatedRecords.length === 0) {
        throw new Error(`Failed to update question with recordId: ${recordId}`);
      }

      return convertRecord(updatedRecords[0]);
    } catch (error) {
      console.error(`Error updating question ${recordId}:`, error);
      throw error;
    }
  },

  async searchQuestions(searchTerm: string): Promise<Question[]> {
    const records = await base(config.airtable.tableName!)
      .select({
        filterByFormula: `OR(FIND('${searchTerm}', LOWER({Question})), FIND('${searchTerm}', LOWER({Answer})), FIND('${searchTerm}', LOWER({Question Description})))`,
      })
      .all();
    return records.map(convertRecord);
  },
};
