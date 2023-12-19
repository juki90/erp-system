import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import { store } from 'store';
import { router } from 'router';

const App: React.FC = () => (
    <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer
            autoClose={2000}
            position="top-right"
            newestOnTop={true}
            pauseOnFocusLoss={false}
        />
    </Provider>
);

export default App;
