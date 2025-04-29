const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ASK_QUESTION: '/ask-question',
  COLLECTION: '/collection',
  TAGS: '/tags',
  JOBS: '/jobs',
  QUESTION: (id: string) => `/question/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  TAG: (id: string) => `/tags/${id}`,
  SIGNIN_WITH_OATH: '/auth/signin-with-oauth',
  SIGNUP_WITH_CREDENTIALS: '/auth/signup-with-credentials',
  SIGNIN_WITH_CREDENTIALS: '/auth/signin-with-credentials',
  EDIT_QUESTION: (id: string) => `/question/${id}/edit`,
};

export default ROUTES;
