import * as Mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { ObjectId } from 'mongodb';
import { User } from '@/types/user';

export interface IAgents extends Mongoose.Document {
  name: string;
  url: string;
  creator: User;
}

export const Agents = new Mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },
    url: {
      type: String
    },
    color: {
      type: String
    },
    label: {
      type: String
    },
    creator: {
      userId: { type: ObjectId },
      username: { type: String },
      avatar: { type: String },
      email: { type: String }
    },
    status: {
      type: String,
      enum: ['ideal', 'busy'],
      default: 'ideal'
    }
  },
  {
    timestamps: true
  }
);

// paginate with this plugin
Agents.plugin(paginate);

const agents = Mongoose.model<IAgents, Mongoose.PaginateModel<IAgents>>(
  'agents',
  Agents
);

export default agents;
