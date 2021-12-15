import { Room } from "src/entity/Room";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";

@ObjectType()
class FieldResponse {
  @Field()
  values: boolean;

  @Field({ nullable: true })
  code: string;
}

@ObjectType()
class RoomResponse {
  @Field(() => FieldResponse, { nullable: true })
  response?: FieldResponse;
}

@Resolver(Room)
export class RoomResolver {
  @Mutation(() => RoomResponse)
  async createRoom(@Arg("adminId") adminId: string): Promise<RoomResponse> {
    console.log(adminId);
    let hashString =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@$&";

    let len = hashString.length;
    var ans: string = "";
    while (1) {
      var length = Math.floor(Math.random() * 4) + 5;
      for (var i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * len);
        ans += hashString[index];
      }

      var room = (await Room.findOne({ where: { id: ans } })) as Room;

      if (!room) {
        console.log(ans);
        break;
      }
      ans = "";
    }

    // await Room.create({
    //   id: ans,
    //   users: 4,
    //   adminSocketId: adminId,
    // }).save();

    return {
      response: {
        values: true,
        code: ans.toString(),
      },
    };
  }
}
