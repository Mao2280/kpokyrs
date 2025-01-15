// import { Employee } from '@/models/employee/employee'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'


const EmployeePage = observer(() => {
    const { id } = useParams()
    // debugger
    // const employee: Employee = Employee.get(id) as Employee
    return (
        <div> Сотрудник {id} </div>
    )
})

export default EmployeePage
