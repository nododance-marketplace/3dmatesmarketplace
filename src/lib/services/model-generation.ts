/**
 * Image-to-3D Model Generation Service
 *
 * Phase 2 hook: This module provides a clean abstraction for plugging in
 * an image-to-3D model generation service (e.g. Meshy, Tripo, CSM, Rodin,
 * or a self-hosted model).
 *
 * Currently returns placeholder/mock results. Replace the implementation
 * inside generate3DModelFromImages() when you're ready to connect a real API.
 */

export interface ModelGenerationInput {
  /** Cloudinary URLs of reference images */
  imageUrls: string[];
  /** User-provided description of the object */
  description: string;
  /** Approximate dimensions, e.g. "6 inches tall" */
  dimensions?: string;
  /** Intended use context */
  intendedUse?: string;
}

export type ModelGenerationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface ModelGenerationResult {
  status: ModelGenerationStatus;
  /** URL of the generated 3D model file (GLB/OBJ/STL) */
  modelUrl?: string;
  /** URL of a preview thumbnail render */
  previewUrl?: string;
  /** File format of the generated model */
  format?: "glb" | "obj" | "stl";
  /** Estimated processing time in seconds (for async APIs) */
  estimatedSeconds?: number;
  /** External job/task ID from the generation service */
  externalJobId?: string;
  /** Error message if generation failed */
  error?: string;
}

/**
 * Generate a 3D model from reference images.
 *
 * To connect a real service, replace this function body with API calls to
 * your chosen provider. Example integrations:
 *
 * - Meshy.ai: POST https://api.meshy.ai/v2/image-to-3d
 * - Tripo3D:  POST https://api.tripo3d.ai/v2/openapi/task
 * - CSM:      POST https://api.csm.ai/image-to-3d
 *
 * Most services are async — they return a job ID, and you poll for the result.
 * Consider using a webhook or background job to update `generatedModelUrl`
 * on the JobRequest when the model is ready.
 */
export async function generate3DModelFromImages(
  input: ModelGenerationInput
): Promise<ModelGenerationResult> {
  // ── Placeholder implementation ──────────────────────────────
  // Remove this block and replace with your real API call.

  console.log(
    `[model-generation] Placeholder called with ${input.imageUrls.length} image(s): "${input.description}"`
  );

  return {
    status: "PENDING",
    estimatedSeconds: 120,
    externalJobId: `mock_${Date.now()}`,
  };
}

/**
 * Check the status of an in-progress model generation job.
 *
 * For async APIs, call this with the externalJobId returned by
 * generate3DModelFromImages() to poll for completion.
 */
export async function checkModelGenerationStatus(
  externalJobId: string
): Promise<ModelGenerationResult> {
  console.log(
    `[model-generation] Placeholder status check for job: ${externalJobId}`
  );

  return {
    status: "PENDING",
    externalJobId,
  };
}
