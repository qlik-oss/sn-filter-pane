export interface IEnv {
  flags: {
    isEnabled: (flag?: string) => boolean;
  },
  sense?: {
    isSmallDevice: () => boolean,
  }
}

export interface IConstraints {
  active?: boolean;
  passive?: boolean;
}
