import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
    @Field(() => String)
    _id: MongooSchema.Types.ObjectId;

    @Prop({ required: true, unique: true })
    @Field(() => String, { description: "Username" })
    username: string;

    @Prop({ required: true })
    @Field(() => String, { description: "Password" })
    password: string;

    @Prop({ required: false })
    @Field(() => String, { description: "User description" })
    description?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
