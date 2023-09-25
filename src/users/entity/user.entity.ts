import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    type: String,
  })
  firstName: string;

  @Prop({
    required: true,
    type: String,
  })
  lastName: string;

  @Prop({
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  phoneNumber: string;

  @Prop({
    required: false,
    type: Date,
  })
  createdAt?: Date;

  @Prop({
    required: false,
    type: Date,
  })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
