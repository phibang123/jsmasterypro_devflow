import Cookies from 'js-cookie';

const verifyCookie = () => {
  const cookie = Cookies.get('cookie-consent');
  if (!cookie || cookie === 'declined') return false;
  return true;
};

export const setCookie = (name: string, value: string, expires?: number) => {
  if (!verifyCookie()) return;
  const cookieExpires = expires || 365;
  const cookie = Cookies.get('cookie-storage') || '{}';
  const cookieData = JSON.parse(cookie);
  cookieData[name] = value;
  Cookies.set('cookie-storage', JSON.stringify(cookieData), { expires: cookieExpires });
};

export const getCookie = async (name: string) => {
  if (!verifyCookie()) return null;
  const cookie = Cookies.get('cookie-storage') || '{}';
  return JSON.parse(cookie)[name];
};

export const deleteCookie = (name: string) => {
  if (!verifyCookie()) return;
  const cookie = Cookies.get('cookie-storage') || '{}';
  const cookieData = JSON.parse(cookie);
  delete cookieData[name];
  Cookies.set('cookie-storage', JSON.stringify(cookieData));
};
