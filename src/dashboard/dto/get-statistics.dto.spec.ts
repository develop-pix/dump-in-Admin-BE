import { RawCountByDate, Statistics } from './get-statistics.dto';

describe('Statistics', () => {
  const rawCountByDate: RawCountByDate = {
    created: new Date(),
    user: 10,
    review: 5,
  };

  describe('constructor()', () => {
    it('SUCCESS: RawCountByDate으로 Statistics 인스턴스 생성', () => {
      const statistics = new Statistics(rawCountByDate);

      expect(statistics).toBeInstanceOf(Statistics);
      expect(statistics.date).toEqual(rawCountByDate.created);
      expect(statistics.user).toEqual(rawCountByDate.user);
      expect(statistics.review).toEqual(rawCountByDate.review);
    });
  });

  describe('compare()', () => {
    it('SUCCES: 두 개의 RawCountByDate 객체에 생성 일자 비교', () => {
      const a: RawCountByDate = {
        created: new Date('2022-01-01'),
        user: 10,
        review: 5,
      };
      const b: RawCountByDate = {
        created: new Date('2022-01-02'),
        user: 15,
        review: 8,
      };

      const result = Statistics.compare(a, b);

      expect(result).toBeGreaterThan(0);
    });
  });

  describe('mergeResults()', () => {
    it('SUCCES: 배열로 받은 RawCountByDate 객체 합치기', () => {
      const results: RawCountByDate[] = [
        {
          created: new Date('2022-01-01'),
          user: 10,
          review: 5,
        },
        {
          created: new Date('2022-01-01'),
          user: 5,
          review: 3,
        },
        {
          created: new Date('2022-01-02'),
          user: 15,
          review: 8,
        },
      ];

      const mergedResults = Statistics.mergeResults(results);

      expect(mergedResults.length).toEqual(2);
      expect(mergedResults[0].created).toEqual(new Date('2022-01-01'));
      expect(mergedResults[0].user).toEqual(15);
      expect(mergedResults[0].review).toEqual(8);
      expect(mergedResults[1].created).toEqual(new Date('2022-01-02'));
      expect(mergedResults[1].user).toEqual(15);
      expect(mergedResults[1].review).toEqual(8);
    });
  });

  describe('list()', () => {
    it('SUCCES: RawCountByDate 배열을 Statistic 배열 인스턴스 생성', () => {
      const response: RawCountByDate[] = [
        {
          created: new Date('2022-01-01'),
          user: 10,
          review: 5,
        },
        {
          created: new Date('2022-01-02'),
          user: 15,
          review: 8,
        },
      ];

      const statisticsList = Statistics.list(response);

      expect(statisticsList.length).toEqual(2);
      expect(statisticsList[0]).toBeInstanceOf(Statistics);
      expect(statisticsList[0].date).toEqual(new Date('2022-01-01'));
      expect(statisticsList[0].user).toEqual(10);
      expect(statisticsList[0].review).toEqual(5);
      expect(statisticsList[1]).toBeInstanceOf(Statistics);
      expect(statisticsList[1].date).toEqual(new Date('2022-01-02'));
      expect(statisticsList[1].user).toEqual(15);
      expect(statisticsList[1].review).toEqual(8);
    });
  });
});
