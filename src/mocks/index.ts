import { countryMock } from './country';
import { defaultMock } from './default';
import { emoMock } from './emo';
import { hip_hopMock } from './hip_hop';
import { popMock } from './pop';
import { reggaeMock } from './reggae';
import { rockMock } from './rock';

export const mocks = {
  default: defaultMock,
  emo: emoMock,
  country: countryMock,
  hip_hop: hip_hopMock,
  pop: popMock,
  reggae: reggaeMock,
  rock: rockMock,
} as const;

export type MockKey = keyof typeof mocks;
