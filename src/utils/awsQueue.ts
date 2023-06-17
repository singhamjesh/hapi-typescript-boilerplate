import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand
} from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import Logger from '@/config/logger';
const log = Logger.getLogger();

// Create an SQS client
const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: fromIni()
});

// Function to push an event to the queue
export const pushEvent = async (event: any) => {
  try {
    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: process.env.AWS_QUEUE_URL,
      MessageBody: JSON.stringify(event)
    });

    await sqsClient.send(sendMessageCommand);
    log.info('Event pushed successfully to the queue.');
  } catch (error) {
    log.error('Error pushing event to the queue:', error);
  }
};

// Function to pull and delete an event from the queue based on its name
export const pullEvent = async (eventName: string) => {
  try {
    const receiveMessageCommand = new ReceiveMessageCommand({
      QueueUrl: process.env.AWS_QUEUE_URL,
      MaxNumberOfMessages: 1, // Pull up to 10 messages at a time (adjust as needed)
      WaitTimeSeconds: 10 // Wait for up to 10 seconds for a message to be available
    });

    const response = await sqsClient.send(receiveMessageCommand);

    if (response.Messages && response.Messages.length > 0) {
      const matchingMessages = response.Messages.filter(
        (message) => JSON.parse(message.Body!).name === eventName
      );

      if (matchingMessages.length > 0) {
        for (const message of matchingMessages) {
          log.info('Received event:', JSON.parse(message.Body!));

          const deleteMessageCommand = new DeleteMessageCommand({
            QueueUrl: process.env.AWS_QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle!
          });

          await sqsClient.send(deleteMessageCommand);
          log.info('Event deleted from the queue.');
        }
      } else {
        log.info(`No event named '${eventName}' found in the queue.`);
      }
    } else {
      log.info('No events found in the queue.');
    }
  } catch (error) {
    log.error('Error pulling event from the queue:', error);
  }
};

export const removeEvent = async (message: any) => {
  try {
    log.info('Received event:', JSON.parse(message.Body!));

    const deleteMessageCommand = new DeleteMessageCommand({
      QueueUrl: process.env.AWS_QUEUE_URL,
      ReceiptHandle: message.ReceiptHandle!
    });

    await sqsClient.send(deleteMessageCommand);
    log.info('Event deleted from the queue.');
  } catch (error) {
    log.error('Event deleted from the queue.');
  }
};

// Usage examples
// const exampleEvent = { id: 1, name: 'Example Event' };

// pushEvent(exampleEvent); // Push an event to the queue

// pullEventByName('Example Event'); // Pull and delete events with the name 'Example Event'
