import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import 'react-virtualized/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.min.css';

import { useStore } from 'store';
import SsrContext from 'context/ssr';

import 'styles/globals.css';

import type { FC } from 'react';
import type { AppProps } from 'next/app';

const App: FC<AppProps> = ({
    Component,
    pageProps,
    pageProps: { initialReduxState, fetchErrors = {} }
}) => {
    const store = useStore(initialReduxState);

    return (
        <div id="root" className="w-full min-h-screen">
            <Provider store={store}>
                <SsrContext.Provider
                    value={{
                        fetchErrors
                    }}
                >
                    <Component {...pageProps} />
                </SsrContext.Provider>
            </Provider>
            <ToastContainer
                autoClose={2000}
                position="top-right"
                newestOnTop={true}
                pauseOnFocusLoss={false}
            />
        </div>
    );
};

export default App;
