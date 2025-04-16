const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/ask-question",
  QUESTION: (id: string) => `/ask-question/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  SIGNIN_WITH_OATH: "signin-with-oauth",
  SIGNUP_WITH_CREDENTIALS: "signup-with-credentials",
  SIGNIN_WITH_CREDENTIALS: "signin-with-credentials",
};

export default ROUTES;
