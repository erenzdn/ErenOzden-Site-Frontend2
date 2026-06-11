import type tr from '../../messages/tr.json';

type Messages = typeof tr;

declare global {
  // next-intl için tip güvenliği
  interface IntlMessages extends Messages {}
}

export {};
