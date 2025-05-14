import { auth } from '@/auth';

export default auth;

// Cấu hình để middleware chỉ chạy trên các route cần thiết
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
