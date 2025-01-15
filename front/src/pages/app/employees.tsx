import { Employee } from '@/models/employee/employee'
import { useQuery } from '@/utils'
import { Query } from 'mobx-orm'
import { observer } from 'mobx-react-lite'


const EmployeesPage = observer(() => {
    const [employee, ready] = useQuery(Employee, { autoupdate: true }) as [Query<Employee>, Promise<void>]
    return (
        <>
            <div> Сотрудники </div>
            <ul>
                { 
                    employee.items.map((i: Employee) => {
                        return <li><a href={`/employee/${i.id}`}>{i.id} {i.fio()}</a></li>
                    })
                }
            </ul>
        </>
  
    )
})

export default EmployeesPage
