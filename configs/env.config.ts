const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const ENV_CONFIG = {
  MONGODB_URI: getEnvVar('MONGODB_URI'),
  BCRYPT_HASH_NUMBER: parseInt(getEnvVar('BCRYPT_HASH_NUMBER'), 10),
} as const;
