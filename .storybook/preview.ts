import type { Preview } from '@storybook/web-components';

// Import layer order + minimal theme tokens for Light DOM components
import '../packages/common/src/shared/layers.css';
import '../packages/common/src/shared/tokens.css';

// Import legacy theme CSS for components not yet migrated to Light DOM
import '../src/shared/themes/default.css';

// Import social app design system (DevConnect theme bridge)
import './social-theme.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      extractComponentDescription: (component: any, { notes }: any) => {
        if (notes) {
          return typeof notes === 'string' ? notes : notes.markdown || notes.text;
        }
        return null;
      },
    },
    backgrounds: { disable: true },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'General',
          ['Button', 'Icon', 'Label'],
          'Data Entry',
          ['ColorPicker', 'Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'DatePicker', 'TimePicker', 'Slider', 'Form'],
          'Data Display',
          ['Card', 'Collapse', 'Tabs'],
          'Feedback',
          ['Modal'],
          'Navigation',
          ['Dropdown'],
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'default-light',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'default-light', title: 'Default Light', icon: 'circle' },
          { value: 'default-dark', title: 'Default Dark', icon: 'circlehollow' },
          { value: 'carbon-light', title: 'Carbon Light', icon: 'sun' },
          { value: 'carbon-dark', title: 'Carbon Dark', icon: 'moon' },
          { value: 'editor-light', title: 'Editor Light', icon: 'sun' },
          { value: 'editor-dark', title: 'Editor Dark', icon: 'moon' },
          { value: 'social-light', title: 'Social Light', icon: 'heart' },
          { value: 'social-dark', title: 'Social Dark', icon: 'hearthollow' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story: any, context: any) => {
      const theme = context.globals.theme || 'default-light';
      
      // Apply theme to document root for components to detect
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      
      // Add theme class for CSS targeting
      document.body.className = `theme-${theme}`;
      
      // Social theme CSS variables (DevConnect)
      const socialLight: Record<string, string> = {
        '--bg': '#fff', '--bg-secondary': '#f7f9f9', '--bg-hover': '#fafafa',
        '--border': '#eff3f4', '--border-light': '#f0f0f0',
        '--text': '#0f1419', '--text-secondary': '#536471', '--text-tertiary': '#a3a3a3',
        '--accent': '#7c3aed', '--accent-hover': '#6d28d9',
        '--input-bg': '#eff3f4', '--card-bg': '#f7f9f9',
      };
      const socialDark: Record<string, string> = {
        '--bg': '#15202b', '--bg-secondary': '#1e2d3d', '--bg-hover': '#1c2b3a',
        '--border': '#38444d', '--border-light': '#2f3b44',
        '--text': '#e7e9ea', '--text-secondary': '#8b98a5', '--text-tertiary': '#6e767d',
        '--accent': '#8b5cf6', '--accent-hover': '#7c3aed',
        '--input-bg': '#253341', '--card-bg': '#1e2d3d',
      };

      // Clear social vars first
      const allSocialVars = Object.keys({ ...socialLight, ...socialDark });
      allSocialVars.forEach(v => document.documentElement.style.removeProperty(v));

      // Apply social theme vars when social theme selected
      if (theme === 'social-light') {
        Object.entries(socialLight).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
      } else if (theme === 'social-dark') {
        Object.entries(socialDark).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
      }

      // Apply background styling based on theme
      const bgColors: Record<string, string> = {
        'default-light': '#ffffff',
        'default-dark': '#111827',
        'carbon-light': '#ffffff',
        'carbon-dark': '#161616',
        'social-light': '#ffffff',
        'social-dark': '#15202b',
      };
      const textColors: Record<string, string> = {
        'default-light': '#161616',
        'default-dark': '#ffffff',
        'carbon-light': '#161616',
        'carbon-dark': '#ffffff',
        'social-light': '#0f1419',
        'social-dark': '#e7e9ea',
      };

      document.body.style.backgroundColor = bgColors[theme] || '#ffffff';
      document.body.style.color = textColors[theme] || '#000000';
      
      return story();
    },
  ],
};

export default preview;
