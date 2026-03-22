import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import MessageToast from './components/MessageToast';


function App() {

  return (
    <>
      <MessageToast />
      <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true}}/>
    </>
  )
}

export default App;
