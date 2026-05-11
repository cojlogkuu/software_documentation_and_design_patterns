import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Visitor, Owner, Admin } from './dal/entities/user.entity';
import { Establishment, Hotel, Restaurant } from './dal/entities/establishment.entity';
import { Review } from './dal/entities/review.entity';
import { ICsvReaderToken } from './dal/interfaces/i-csv.reader';
import { CsvReader } from './dal/repositories/csv.reader';
import { IUserRepositoryToken } from './dal/interfaces/i-user.repository';
import { UserRepository } from './dal/repositories/user.repository';
import { IEstablishmentRepositoryToken } from './dal/interfaces/i-establishment.repository';
import { EstablishmentRepository } from './dal/repositories/establishment.repository';
import { IReviewRepositoryToken } from './dal/interfaces/i-review.repository';
import { ReviewRepository } from './dal/repositories/review.repository';
import { SeederService } from './bll/services/seeder.service';
import { SeederController } from './pl/controllers/seeder.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'password',
      database: 'tripadvisor_db',
      entities: [User, Visitor, Owner, Admin, Establishment, Hotel, Restaurant, Review],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Visitor, Owner, Admin, Establishment, Hotel, Restaurant, Review]),
  ],
  controllers: [SeederController],
  providers: [
    {
      provide: ICsvReaderToken,
      useClass: CsvReader,
    },
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
    {
      provide: IEstablishmentRepositoryToken,
      useClass: EstablishmentRepository,
    },
    {
      provide: IReviewRepositoryToken,
      useClass: ReviewRepository,
    },
    SeederService,
  ],
})
export class AppModule {}
