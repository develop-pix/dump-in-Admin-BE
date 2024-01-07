import { Hashtag } from '../entity/hashtag.entity';
import { GetHashtagList } from './get-hastag-list.dto';

describe('GetHashtagList', () => {
  let mockHashtagData: Hashtag;
  let hashtagList: GetHashtagList;

  beforeEach(() => {
    mockHashtagData = new Hashtag();
    mockHashtagData.id = 1;
    mockHashtagData.name = '스냅';
    mockHashtagData.description = '스냅 설명';

    hashtagList = new GetHashtagList(mockHashtagData);
  });

  it('should be defined', () => {
    expect(hashtagList).toBeDefined();
  });

  it('SUCCESS: Hashtag 엔티티로 GetHashtagList DTO 생성', () => {
    expect(hashtagList.id).toEqual(mockHashtagData.id);
    expect(hashtagList.name).toEqual(mockHashtagData.name);
  });
});
