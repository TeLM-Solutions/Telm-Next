import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../theme';
import createEmotionCache from '../createEmotionCache';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import '@/styles/common.scss';
import '@/styles/uppy.css';

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Support for custom layouts: If a page has a `getLayout` function, use it; otherwise, use the component as-is.
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ReduxProvider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <title>Tecnavis</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {/* Render page with its layout */}
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </CacheProvider>
    </ReduxProvider>
  );
}
