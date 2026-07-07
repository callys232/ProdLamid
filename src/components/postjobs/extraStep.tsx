"use client";

interface ExtrasStepProps {
  comment: string;
  setComment: (val: string) => void;
  extraField: string;
  setExtraField: (val: string) => void;
  errors: Record<string, string>;
}

export default function ExtrasStep({
  comment, setComment, extraField, setExtraField, errors,
}: ExtrasStepProps) {
  const remaining = 500 - comment.length;

  return (
    <div className="space-y-5">
      <div className="group">
        <label className="pj-label">Additional Comments</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any extra context, requirements, or notes for your consultant..."
          rows={4}
          className={`pj-field resize-none${errors.comment ? " pj-error" : ""}`}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.comment
            ? <p className="pj-error-msg">{errors.comment}</p>
            : <span />}
          <span className={`text-xs ml-auto transition-colors duration-150 ${
            remaining < 50 ? "text-amber-500 font-semibold" : "text-gray-400"
          }`}>
            {remaining} left
          </span>
        </div>
      </div>

      <div className="group">
        <label className="pj-label">
          Extra Field{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={extraField}
          onChange={(e) => setExtraField(e.target.value)}
          placeholder="Custom input..."
          className={`pj-field${errors.extraField ? " pj-error" : ""}`}
        />
        {errors.extraField && <p className="pj-error-msg">{errors.extraField}</p>}
      </div>
    </div>
  );
}
