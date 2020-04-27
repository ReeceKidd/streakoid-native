import { streakoidFactory, streakoidClientFactory } from '@streakoid/streakoid-sdk';

const baseURL = 'https://87fgqab4d2.execute-api.eu-west-1.amazonaws.com/prod';

const registrationClient = streakoidClientFactory(baseURL, 'Europe/London');

export const streakoidRegistration = streakoidFactory(registrationClient);
