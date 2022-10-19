interface ISense {
  isSmallDevice: () => boolean,
  isZoomed: () => boolean,
  zoomSelf: () => void,
}

export interface IEnv {
  flags: {
    isEnabled: (flag?: string) => boolean;
  },
  sense?: ISense,
}

export interface IConstraints {
  active?: boolean;
  passive?: boolean;
  select?: boolean;
}
