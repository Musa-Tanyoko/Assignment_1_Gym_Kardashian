import type { Preview } from "@storybook/react";
import React from "react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'form-field-multiple-labels',
            enabled: true,
          },
        ],
      },
    },
  },
  decorators: [
    (Story) => React.createElement(
      "div",
      { className: "min-h-screen bg-gray-50 p-4" },
      React.createElement(Story)
    ),
  ],
};

export default preview; 