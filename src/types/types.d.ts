export interface IEnv {
  flags: {
    isEnabled: (flag?: string) => boolean;
  },
  sense?: {
    isSmallDevice: () => boolean,
  }
}
