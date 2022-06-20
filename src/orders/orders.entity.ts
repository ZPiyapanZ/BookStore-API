import { Users } from 'src/users/users.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  bookId: number;
  @Column()
  book_name: string;
  @Column()
  author_name: string;
  @Column()
  price: number;
  @Column()
  is_recommended: boolean;
  @ManyToOne((_type) => Users, (user) => user.books, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: Users;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
