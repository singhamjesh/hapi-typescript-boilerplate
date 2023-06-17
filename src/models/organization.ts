import * as Mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { ObjectId } from 'mongodb';
// import { User } from '@/types/user';

export interface IOrganization extends Mongoose.Document {
  title: string;
  template: boolean;
  // creator: User;
  createdAt: Date;
  updateAt: Date;
}

export const OrganizationSchema = new Mongoose.Schema(
  {
    profile: {
      name: {
        type: String
      },
      logo: {
        type: String
      },
      cover: {
        type: String
      }
    },
    users: [
      {
        userId: { type: ObjectId },
        userName: { type: String },
        avatar: { type: String },
        email: { type: String }
      }
    ],
    agents: [
      {
        agentId: {
          type: ObjectId
        },
        name: {
          type: String
        },
        url: {
          type: String
        }
      }
    ],
    creator: {
      userId: { type: ObjectId },
      username: { type: String },
      avatar: { type: String },
      email: { type: String }
    },
    status: {
      type: String,
      enum: ['active', 'inActive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// paginate with this plugin
OrganizationSchema.plugin(paginate);

const Organization = Mongoose.model<
  IOrganization,
  Mongoose.PaginateModel<IOrganization>
>('Organization', OrganizationSchema);

export default Organization;
