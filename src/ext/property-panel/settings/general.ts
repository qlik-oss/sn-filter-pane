const general = {
  items: {
    showDisclaimer: {
      translation: 'properties.showDisclaimer',
      type: 'boolean',
      ref: 'showDisclaimer',
      component: 'switch',
      defaultValue: true,
      options: [
        {
          value: true,
          translation: 'Common.Show',
        },
        {
          value: false,
          translation: 'properties.hide',
        },
      ],
    },
  },
};

export default general;
