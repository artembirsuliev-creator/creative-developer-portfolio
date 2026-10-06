"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { ReviewForm } from "@/components/reviews/ReviewForm";

type Review = {
  id: string;
  author_name: string;
  body: string;
  rating: number;
  created_at: string;
};

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/reviews", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("reviews_unavailable");
        return response.json() as Promise<Review[]>;
      })
      .then(setReviews)
      .catch(() => {
        setReviews([]);
        setLoadFailed(true);
      })
      .finally(() => setIsLoaded(true));

    return () => controller.abort();
  }, []);

  return (
    <section aria-labelledby="reviews-heading" className="template-section reviews-section" id="reviews">
      <div className="container-shell">
        <div className="reviews-heading">
          <div>
            <p className="template-kicker mb-5">Отзывы</p>
            <h2 className="reviews-title" id="reviews-heading">Слова после<br />совместной работы.</h2>
          </div>
          <p className="reviews-intro">
            Если мы уже работали вместе, расскажи о своём опыте. Это поможет другим понять, чего ждать от проекта.
          </p>
        </div>

        <div className="reviews-layout">
          <div aria-live="polite" className="reviews-list" aria-busy={!isLoaded}>
            {reviews.map((review) => (
              <article className="review-entry" key={review.id}>
                <div aria-label={`Оценка: ${review.rating} из 5`} className="review-entry-rating">
                  {ratingsForReview(review.rating).map((star) => (
                    <Star aria-hidden="true" fill="currentColor" key={star} size={15} strokeWidth={1.5} />
                  ))}
                </div>
                <p className="review-entry-body">“{review.body}”</p>
                <div className="review-entry-meta">
                  <strong>{review.author_name}</strong>
                  <time dateTime={review.created_at}>{formatReviewDate(review.created_at)}</time>
                </div>
              </article>
            ))}
            {isLoaded && reviews.length === 0 && (
              <p className="reviews-empty">
                {loadFailed ? "Не удалось загрузить отзывы. Попробуй обновить страницу позже." : "Пока отзывов нет. Буду рад твоему."}
              </p>
            )}
          </div>

          <ReviewForm />
        </div>
      </div>
    </section>
  );
}

function ratingsForReview(rating: number) {
  return Array.from({ length: Math.min(5, Math.max(0, rating)) }, (_, index) => index + 1);
}
