"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";

const ratings = [1, 2, 3, 4, 5];

export function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: formData.get("author_name"),
          body: formData.get("body"),
          rating,
          website: formData.get("website"),
        }),
      });

      if (!response.ok) throw new Error("review_not_saved");

      form.reset();
      setRating(5);
      setFeedback({
        kind: "success",
        text: "Спасибо! Отзыв отправлен и появится после проверки.",
      });
    } catch {
      setFeedback({ kind: "error", text: "Не получилось отправить отзыв. Попробуй ещё раз позже." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="reviews-form" onSubmit={handleSubmit}>
      <div className="reviews-form-heading">
        <h3>Оставить отзыв</h3>
        <p>Расскажи, как прошла наша работа.</p>
      </div>

      <label className="reviews-field">
        <span>Как к тебе обращаться</span>
        <input
          autoComplete="name"
          maxLength={80}
          minLength={2}
          name="author_name"
          placeholder="Имя или название компании"
          required
        />
      </label>

      <fieldset className="reviews-rating">
        <legend>Оценка</legend>
        <div aria-label={`Оценка: ${rating} из 5`} className="reviews-stars" role="group">
          {ratings.map((value) => (
            <button
              aria-label={`${value} ${value === 1 ? "звезда" : "звезды"}`}
              aria-pressed={rating === value}
              className={value <= rating ? "is-selected" : ""}
              key={value}
              onClick={() => setRating(value)}
              type="button"
            >
              <Star aria-hidden="true" fill="currentColor" size={20} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </fieldset>

      <label className="reviews-field">
        <span>Твой отзыв</span>
        <textarea
          maxLength={1200}
          minLength={20}
          name="body"
          placeholder="Поделись впечатлениями о проекте и результате…"
          required
          rows={5}
        />
      </label>

      <label aria-hidden="true" className="reviews-honeypot" tabIndex={-1}>
        Оставь это поле пустым
        <input autoComplete="off" name="website" tabIndex={-1} />
      </label>

      <div className="reviews-form-footer">
        <p>Перед публикацией отзыв проверяется.</p>
        <button className="reviews-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Отправляем…" : "Отправить отзыв"}
        </button>
      </div>

      <p aria-live="polite" className={`reviews-feedback ${feedback ? `is-${feedback.kind}` : ""}`}>
        {feedback?.text ?? ""}
      </p>
    </form>
  );
}
