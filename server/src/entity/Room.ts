import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
@ObjectType()
export class Room extends BaseEntity {
  @Field()
  @PrimaryColumn()
  @Column("text", { unique: true })
  id!: string;

  @Field()
  @Column("int", { default: 5 })
  users!: number;

  @Field()
  @Column("boolean", { default: false })
  inGame: boolean;

  @Field()
  @Column("text")
  adminSocketId!: string;
}
