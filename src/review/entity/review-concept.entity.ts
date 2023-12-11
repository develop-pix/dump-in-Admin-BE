import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Review } from './review.entity';

@Entity('concept')
export class Concept {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    () => ReviewConcept,
    (reviewConcept: ReviewConcept) => reviewConcept.concept,
  )
  review_concepts: ReviewConcept[];
}

@Entity('review_concept')
export class ReviewConcept {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review, (review) => review.review_concepts)
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @ManyToOne(() => Concept, (concept) => concept.review_concepts, {
    eager: true,
  })
  @JoinColumn({ name: 'concept_id' })
  concept: Concept;
}
