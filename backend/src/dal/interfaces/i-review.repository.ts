import { Review } from '../entities/review.entity';

export const IReviewRepositoryToken = Symbol('IReviewRepository');

export interface IReviewRepository {
  saveReviews(reviews: Review[]): Promise<Review[]>;
}
