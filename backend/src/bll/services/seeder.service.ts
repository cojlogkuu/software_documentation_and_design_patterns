import { Injectable, Inject } from '@nestjs/common';
import { ICsvReaderToken } from '../../dal/interfaces/i-csv.reader';
import type { ICsvReader } from '../../dal/interfaces/i-csv.reader';
import { IUserRepositoryToken } from '../../dal/interfaces/i-user.repository';
import type { IUserRepository } from '../../dal/interfaces/i-user.repository';
import { IEstablishmentRepositoryToken } from '../../dal/interfaces/i-establishment.repository';
import type { IEstablishmentRepository } from '../../dal/interfaces/i-establishment.repository';
import { IReviewRepositoryToken } from '../../dal/interfaces/i-review.repository';
import type { IReviewRepository } from '../../dal/interfaces/i-review.repository';
import { Visitor } from '../../dal/entities/user.entity';
import { Hotel, Restaurant, Establishment } from '../../dal/entities/establishment.entity';
import { Review } from '../../dal/entities/review.entity';

@Injectable()
export class SeederService {
  constructor(
    @Inject(ICsvReaderToken) private readonly csvReader: ICsvReader,
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @Inject(IEstablishmentRepositoryToken) private readonly establishmentRepository: IEstablishmentRepository,
    @Inject(IReviewRepositoryToken) private readonly reviewRepository: IReviewRepository,
  ) {}

  async seedDatabase(filePath: string): Promise<void> {
    console.log('Reading CSV...');
    const rawData = await this.csvReader.readCsv(filePath);
    
    // Normalize Visitors
    const uniqueVisitorsMap = new Map<string, any>();
    for (const row of rawData) {
      if (!uniqueVisitorsMap.has(row.email)) {
        uniqueVisitorsMap.set(row.email, {
          username: row.visitorName,
          email: row.email,
        });
      }
    }
    const visitorsToSave = Array.from(uniqueVisitorsMap.values()).map(v => {
      const visitor = new Visitor();
      visitor.username = v.username;
      visitor.email = v.email;
      return visitor;
    });
    console.log(`Saving ${visitorsToSave.length} visitors...`);
    const savedVisitors = await this.userRepository.saveVisitors(visitorsToSave);
    const visitorEmailMap = new Map(savedVisitors.map(v => [v.email, v]));

    // Normalize Establishments
    const uniqueEstablishmentsMap = new Map<string, any>();
    for (const row of rawData) {
      if (!uniqueEstablishmentsMap.has(row.establishmentName)) {
        uniqueEstablishmentsMap.set(row.establishmentName, {
          name: row.establishmentName,
          address: row.address,
          type: row.type,
          stars: row.stars ? parseInt(row.stars) : null,
          cuisineType: row.cuisineType,
        });
      }
    }
    const establishmentsToSave = Array.from(uniqueEstablishmentsMap.values()).map(e => {
      let est: Establishment;
      if (e.type === 'Hotel') {
        const hotel = new Hotel();
        hotel.stars = e.stars;
        est = hotel;
      } else {
        const restaurant = new Restaurant();
        restaurant.cuisineType = e.cuisineType;
        est = restaurant;
      }
      est.name = e.name;
      est.address = e.address;
      est.averageRating = 0;
      return est;
    });
    console.log(`Saving ${establishmentsToSave.length} establishments...`);
    const savedEstablishments = await this.establishmentRepository.saveEstablishments(establishmentsToSave);
    const estNameMap = new Map(savedEstablishments.map(e => [e.name, e]));

    // Create Reviews
    const reviewsToSave = rawData.map(row => {
      const review = new Review();
      review.text = row.reviewText;
      review.rating = parseInt(row.rating);
      review.date = new Date(row.date);
      review.isApproved = true;
      review.visitor = visitorEmailMap.get(row.email)!;
      review.establishment = estNameMap.get(row.establishmentName)!;
      return review;
    });

    console.log(`Saving ${reviewsToSave.length} reviews...`);
    // Save in chunks to avoid overwhelming the driver (although 1000 is usually fine)
    await this.reviewRepository.saveReviews(reviewsToSave);
    console.log('Seeding completed successfully!');
  }
}
