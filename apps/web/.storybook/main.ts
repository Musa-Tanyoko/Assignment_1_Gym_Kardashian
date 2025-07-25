import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/testing-library"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) => {
    // Add Tailwind CSS support
    // Import plugins at the top of the file to avoid require()
    // (see imports below)
    config.css = {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      },
    };
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
    return config;
  },
};

export default config; 