import './index.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import NotFoundPage from './pages/404.tsx'

const root = document.getElementById('root')

import EmployeesPage from './pages/app/employees.tsx'
import EmployeePage from './pages/app/employee.tsx'

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route path='/'>
                <Route index               element={<EmployeesPage/>}/>
                <Route path='employee/:id' element={<EmployeePage/>}/>=
            </Route>
            <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
    </BrowserRouter>
)
