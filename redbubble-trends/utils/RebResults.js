import mongoose from "mongoose";

const schema = mongoose.Schema({
  date: { type: String, unique: true },
  data: {},
});

export const RedResults =
  mongoose.models["results"] ||
  mongoose.model("results", schema, "redbubble-data");
