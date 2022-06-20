import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Orders } from 'src/orders/orders.entity';
@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column()
  name: string;
  @Column()
  surname: string;
  @Column('date')
  date_of_birth: Date;

  @OneToMany((_type) => Orders, (order) => order.user, { eager: true })
  books: Orders[];
}
