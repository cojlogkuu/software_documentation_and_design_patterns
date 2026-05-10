import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { IReviewRepository } from '../interfaces/i-review.repository';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async saveReviews(reviews: Review[]): Promise<Review[]> {
    return this.reviewRepo.save(reviews);
  }
}
