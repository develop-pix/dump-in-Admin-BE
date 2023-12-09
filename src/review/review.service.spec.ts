import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PhotoBoothService } from '../photo-booth/photo-booth.service';
import { UserService } from '../user/user.service';
import { ReviewRepository } from './repository/review.repository';

class MockReviewRepository {}

class MockUserService {}

class MockPhotoBoothService {}

describe('ReviewService', () => {
  let userService: UserService;
  let reviewService: ReviewService;
  let reviewRepository: ReviewRepository;
  let photoBoothService: PhotoBoothService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: UserService, useClass: MockUserService },
        { provide: ReviewRepository, useClass: MockReviewRepository },
        { provide: PhotoBoothService, useClass: MockPhotoBoothService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    reviewService = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);
    photoBoothService = module.get<PhotoBoothService>(PhotoBoothService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(reviewService).toBeDefined();
    expect(reviewRepository).toBeDefined();
    expect(photoBoothService).toBeDefined();
  });
});
