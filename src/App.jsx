import { RouterProvider } from 'react-router-dom';
import { router } from './router';


function App() {

  return (
    <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true}}/>
  )
}

export default App;
