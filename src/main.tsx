import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import { Provider } from 'react-redux'

import App from './App.tsx'
import { store } from './store/store.ts'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    {/* <BrowserRouter> */}
    <HashRouter >
      <StrictMode>
        <App />
      </StrictMode>
    </HashRouter>
    {/* </BrowserRouter> */}
  </Provider>
)
