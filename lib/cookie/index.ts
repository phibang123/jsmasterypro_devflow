import Cookies from 'js-cookie';

export const storageCookieKey = {
  TAG: 'tag',
};

const verifyCookie = () => {
  return Cookies.get('cookie-consent') === 'accepted';
};

export const setCookie = <T>(name: string, value: T, expires?: number) => {
  if (!verifyCookie()) return;

  const cookieExpires = expires || 365;
  const cookie = Cookies.get('cookie-storage') || '{}';
  const cookieData: Record<string, T> = JSON.parse(cookie);

  cookieData[name] = value;
  Cookies.set('cookie-storage', JSON.stringify(cookieData), { expires: cookieExpires });
};

export const getCookie = <T>(name: string): T | null => {
  if (!verifyCookie()) return null;

  const cookie = Cookies.get('cookie-storage') || '{}';
  const cookieData: Record<string, T> = JSON.parse(cookie);
  if (!cookieData[name]) return null;
  return JSON.parse(cookieData[name] as string) || null;
};

export const deleteCookie = (name: string) => {
  if (!verifyCookie()) return;
  const cookie = Cookies.get('cookie-storage') || '{}';
  const cookieData = JSON.parse(cookie);
  delete cookieData[name];
  Cookies.set('cookie-storage', JSON.stringify(cookieData));
};
