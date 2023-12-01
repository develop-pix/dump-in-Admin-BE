import { Test, TestingModule } from '@nestjs/testing';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { PhotoBoothRawRepository } from './repository/photo-booth-raw-data.repository';
import { PhotoBoothBrandRepository } from './repository/photo-booth-brand.repository';

class MockPhotoBoothRepository {
  findBoothByOptionAndCount = jest.fn();
  findOneBoothById = jest.fn();
}

class MockPhotoBoothRawRepository {
  // findByUsername = jest.fn();
}

class MockPhotoBoothBrandRepository {
  // findByUsername = jest.fn();
}

describe('PhotoBoothService', () => {
  let photoBoothService: PhotoBoothService;
  let photoBoothRepository: PhotoBoothRepository;
  let photoBoothRawRepository: PhotoBoothRawRepository;
  let photoBoothBrandRepository: PhotoBoothBrandRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoBoothService,
        { provide: PhotoBoothRepository, useClass: MockPhotoBoothRepository },
        {
          provide: PhotoBoothRawRepository,
          useClass: MockPhotoBoothRawRepository,
        },
        {
          provide: PhotoBoothBrandRepository,
          useClass: MockPhotoBoothBrandRepository,
        },
      ],
    }).compile();

    photoBoothService = module.get<PhotoBoothService>(PhotoBoothService);
    photoBoothRepository =
      module.get<PhotoBoothRepository>(PhotoBoothRepository);
    photoBoothRawRepository = module.get<PhotoBoothRawRepository>(
      PhotoBoothRawRepository,
    );
    photoBoothBrandRepository = module.get<PhotoBoothBrandRepository>(
      PhotoBoothBrandRepository,
    );

    // PhotoBoothRepository Stub
    jest
      .spyOn(photoBoothRepository, 'findBoothByOptionAndCount')
    // .mockImplementation(() => { })

    jest
      .spyOn(photoBoothRepository, 'findOneBoothById')
    // .mockImplementationOnce(() => { })
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(photoBoothService).toBeDefined();
    expect(photoBoothRepository).toBeDefined();
    expect(photoBoothRawRepository).toBeDefined();
    expect(photoBoothBrandRepository).toBeDefined();
  });
});
