import * as Mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { ObjectId } from 'mongodb';
import { User } from '@/types/user';
import { agentDetailsById } from '@/types/agent';
export interface IAgentResponse extends Mongoose.Document {
  url: string;
  agentDetails: agentDetailsById;
  creator: User;
  status: string;
  createdAt: Date;
  updateAt: Date;
}

export const AgentResponse = new Mongoose.Schema(
  {
    url: { type: String },
    agent: {
      name: { type: String },
      url: { type: String },
      color: { type: String },
      label: { type: String }
    },
    creator: {
      userId: { type: ObjectId },
      username: { type: String },
      avatar: { type: String },
      email: { type: String }
    },
    response: {
      statusCode: { type: Number, default: null },
      statusType: { type: String, default: null },
      data: { type: Object, default: null },
      message: { type: String, default: null }
    },
    generateDate: { type: Date, default: null },
    generateTime: { type: String, default: null },
    status: {
      type: String,
      enum: ['inprogress', 'pending', 'completed', 'failed'],
      default: 'inprogress'
    }
  },
  {
    timestamps: true
  }
);

// paginate with this plugin
AgentResponse.plugin(paginate);

const agentResponse = Mongoose.model<
  IAgentResponse,
  Mongoose.PaginateModel<IAgentResponse>
>('AgentResponse', AgentResponse);

export default agentResponse;
