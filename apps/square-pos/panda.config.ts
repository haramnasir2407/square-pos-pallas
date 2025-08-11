import { createPreset } from '@pallas-ui/panda-preset'
import { presetPrimaryColors } from '@pallas-ui/panda-preset/colors/paletteGenerator'
import type { ThemeColorPalette } from '@pallas-ui/panda-preset/types'
import { defineConfig } from '@pandacss/dev'
import { textStyles } from './src/theme/textStyles'

const themeColorPalette: ThemeColorPalette = {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  primary: { colorName: 'blue', colorValue: presetPrimaryColors['blue']! },
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  error: { colorName: 'red', colorValue: presetPrimaryColors['red']! },
  success: {
    colorName: 'green',
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    colorValue: presetPrimaryColors['green']!,
  },
  warning: {
    colorName: 'yellow',
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    colorValue: presetPrimaryColors['yellow']!,
  },
  info: {
    colorName: 'blue',
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    colorValue: presetPrimaryColors['blue']!,
  },
}
export default defineConfig({
  // Whether to use css reset
  preflight: true,
  presets: [
    createPreset({
      colors: themeColorPalette,
      baseRadius: 2,
    }),
  ],

  // Where to look for your css declarations
  include: ['./src/components/**/*.{ts,tsx,js,jsx}', './src/app/**/*.{ts,tsx,js,jsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      textStyles,
      tokens: {
        colors: {
          gray: {
            50: { value: '#f9fafb' },
            100: { value: '#f3f4f6' },
            200: { value: '#e5e7eb' },
            300: { value: '#d1d5db' },
            400: { value: '#9ca3af' },
            500: { value: '#6b7280' },
            600: { value: '#4b5563' },
            700: { value: '#374151' },
            800: { value: '#1f2937' },
            900: { value: '#111827' },
          },
          white: {
            50: { value: '#eff6ff' },
            100: { value: '#e0e7ff' },
            200: { value: '#f3e8ff' },
          },
          blue: {
            50: { value: '#2563eb' },
            100: { value: '#1d4ed8' },
          },
          purple: {
            50: { value: '#4f46e5' },
            100: { value: '#4338ca' },
          },
        },
        fonts: {
          heading: {
            value: 'var(--font-noto-sans-jp)',
          },
          body: {
            value: 'var(--font-inter)',
          },
        },
        gradients: {
          'green-diagonal': {
            value: 'linear-gradient(to bottom right, #f0fdf4, #d1fae5)',
          },
          'blue-purple': {
            value: 'linear-gradient(to right, #2563eb, #4f46e5)',
          },
        },
      },
      semanticTokens: {
        colors: {
          'code-bg': {
            value: {
              base: '{colors.gray.50}',
              _dark: '{colors.gray.900}',
            },
          },
          'code-border': {
            value: {
              base: '{colors.gray.200}',
              _dark: '{colors.gray.700}',
            },
          },
          'prose-headings': {
            value: {
              base: '{colors.gray.900}',
              _dark: '{colors.gray.100}',
            },
          },
          'prose-text': {
            value: {
              base: '{colors.gray.700}',
              _dark: '{colors.gray.300}',
            },
          },
        },
        sizes: {
          header: {
            height: {
              value: {
                base: '72px',
              },
            },
          },
          sidebar: {
            width: {
              value: {
                base: '200px',
                md: '235px',
              },
            },
            height: {
              value: {
                base: 'calc(100vh - 72px)',
              },
            },
          },
          toc: {
            width: {
              value: {
                base: '250px',
              },
            },
          },
        },
      },
      recipes: {
        prose: {
          className: 'docs-prose',
          base: {
            color: 'prose-text',
            maxWidth: '65ch',
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: 'prose-headings',
              fontWeight: 'semibold',
              lineHeight: 'tight',
              mt: '6',
              mb: '4',
              scrollMarginTop: '24',
            },
            '& h1': { fontSize: '3xl', fontWeight: 'bold' },
            '& h2': {
              fontSize: '2xl',
              borderBottom: '1px solid',
              borderColor: 'gray.200',
              pb: '2',
              mt: '12',
            },
            '& h3': { fontSize: 'xl' },
            '& h4': { fontSize: 'lg' },
            '& p': { lineHeight: '1.7', my: '4' },
            '& a': {
              color: 'primary.600',
              _dark: { color: 'primary.400' },
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            },
            '& ul, & ol': { pl: '6', my: '4' },
            '& ul': { listStyle: 'disc' },
            '& ol': { listStyle: 'decimal' },
            '& li': { mb: '2' },
            '& blockquote': {
              borderLeft: '3px solid',
              borderColor: 'gray.300',
              pl: '4',
              py: '1',
              my: '4',
              color: 'gray.600',
            },
          },
        },
        docsCard: {
          className: 'docs-card',
          base: {
            p: '6',
            rounded: 'md',
            border: '1px solid',
            borderColor: 'gray.200',
            _dark: {
              borderColor: 'gray.800',
            },
            transition: 'all 0.2s',
            _hover: {
              shadow: 'md',
              borderColor: 'primary.400',
            },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
  jsxFramework: 'react',
  jsxStyleProps: 'minimal',
})
