import { GetReviewList } from './get-review-list.dto';
import { GetReviewDetail } from './get-review-detail.dto';
import { Review } from '../entity/review.entity';

describe('GetReviewList', () => {
  let mockReviewData: Review;

  beforeEach(() => {
    mockReviewData = new Review();
    mockReviewData.id = 1;
    mockReviewData.content = 'Sample review content';
    mockReviewData.date = new Date('2022-01-01');
    mockReviewData.viewCount = 1;
    mockReviewData.likeCount = 1;
    mockReviewData.isPublic = true;
  });

  it('should create an instance', () => {
    expect(mockReviewData).toBeInstanceOf(Review);
    expect(mockReviewData).toBeDefined();
  });

  describe('GetReviewList', () => {
    it('SUCCESS: Review 엔티티로 GetReviewList DTO 생성', () => {
      const getReviewList: GetReviewList = new GetReviewList(mockReviewData);

      expect(getReviewList.id).toEqual(mockReviewData.id);
      expect(getReviewList.content).toEqual(mockReviewData.content);
      expect(getReviewList.date).toEqual(mockReviewData.date);
    });
  });

  describe('GetReviewDetail', () => {
    it('SUCCESS: Review 엔티티로 GetReviewDetail DTO 생성', () => {
      const getReviewDetail: GetReviewDetail = new GetReviewDetail(
        mockReviewData,
      );

      expect(getReviewDetail.id).toEqual(mockReviewData.id);
      expect(getReviewDetail.content).toEqual(mockReviewData.content);
      expect(getReviewDetail.date).toEqual(mockReviewData.date);
      expect(getReviewDetail.viewCount).toEqual(mockReviewData.viewCount);
      expect(getReviewDetail.likeCount).toEqual(mockReviewData.likeCount);
      expect(getReviewDetail.isPublic).toEqual(mockReviewData.isPublic);
    });
  });
});
