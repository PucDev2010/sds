import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StyleProvider } from '@ant-design/cssinjs'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <StyleProvider hashPriority='high'>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </StyleProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
