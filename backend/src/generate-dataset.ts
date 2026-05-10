import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import { stringify } from 'csv-stringify/sync';

interface FlatRow {
  visitorName: string;
  email: string;
  establishmentName: string;
  address: string;
  type: string; // 'Hotel' | 'Restaurant'
  stars?: number;
  cuisineType?: string;
  reviewText: string;
  rating: number;
  date: string;
}

const generateData = () => {
  const data: FlatRow[] = [];
  
  // Create fixed number of unique visitors and establishments to create relations
  const numVisitors = 100;
  const numEstablishments = 50;

  const visitors = Array.from({ length: numVisitors }).map(() => ({
    name: faker.internet.username(),
    email: faker.internet.email(),
  }));

  const establishments = Array.from({ length: numEstablishments }).map(() => {
    const isHotel = faker.datatype.boolean();
    return {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      type: isHotel ? 'Hotel' : 'Restaurant',
      stars: isHotel ? faker.number.int({ min: 1, max: 5 }) : undefined,
      cuisineType: !isHotel ? faker.helpers.arrayElement(['Italian', 'Mexican', 'Asian', 'American', 'French']) : undefined,
    };
  });

  for (let i = 0; i < 1000; i++) {
    const visitor = faker.helpers.arrayElement(visitors);
    const establishment = faker.helpers.arrayElement(establishments);

    data.push({
      visitorName: visitor.name,
      email: visitor.email,
      establishmentName: establishment.name,
      address: establishment.address,
      type: establishment.type,
      stars: establishment.stars,
      cuisineType: establishment.cuisineType,
      reviewText: faker.lorem.sentences(2),
      rating: faker.number.int({ min: 1, max: 5 }),
      date: faker.date.recent({ days: 365 }).toISOString(),
    });
  }

  const csvOutput = stringify(data, { header: true });
  fs.writeFileSync('dataset.csv', csvOutput);
  console.log('Successfully generated dataset.csv with 1000 rows.');
};

generateData();
