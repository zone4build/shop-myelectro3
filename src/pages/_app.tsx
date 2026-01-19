import type { AppProps, AppContext } from 'next/app';
import App from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import '@/assets/css/main.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ModalProvider } from '@/components/ui/modal/modal.context';
import DefaultSeo from '@/components/seo/default-seo';
import { SearchProvider } from '@/components/ui/search/search.context';
import PrivateRoute from '@/lib/private-route';
import { CartProvider } from '@/store/quick-cart/cart.context';
import SocialLogin from '@/components/auth/social-login';
import { NextPageWithLayout } from '@/types';
import QueryProvider from '@/framework/client/query-provider';
import { getDirection } from '@/lib/constants';
import { useRouter } from 'next/router';

// Import components that use Jotai atoms as client-side only
const ManagedModal = dynamic(
  () => import('@/components/ui/modal/managed-modal'),
  { ssr: false }
);
const ManagedDrawer = dynamic(
  () => import('@/components/ui/drawer/managed-drawer'),
  { ssr: false }
);

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const authenticationRequired = Component.authenticationRequired ?? false;
  const { locale } = useRouter();
  const dir = getDirection(locale);

  return (
    <div dir={dir}>
      <SessionProvider session={session}>
        <QueryProvider pageProps={pageProps}>
          <SearchProvider>
            <ModalProvider>
              <CartProvider>
                <>
                  <DefaultSeo />
                  {authenticationRequired ? (
                    <PrivateRoute>
                      {getLayout(<Component {...pageProps} />)}
                    </PrivateRoute>
                  ) : (
                    getLayout(<Component {...pageProps} />)
                  )}
                  <ManagedModal />
                  <ManagedDrawer />
                  <ToastContainer autoClose={2000} theme="colored" />
                  <SocialLogin />
                </>
              </CartProvider>
            </ModalProvider>
          </SearchProvider>
        </QueryProvider>
      </SessionProvider>
    </div>
  );
}

// Disable automatic static optimization to avoid Jotai context errors during SSR
// This makes all pages use server-side rendering instead of static generation
CustomApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default appWithTranslation(CustomApp);
