import { InferenceClient } from "@huggingface/inference";
import { HUGGINGFACE_API_KEY } from "./env.js";

const hf = new InferenceClient(HUGGINGFACE_API_KEY);

export default hf;
