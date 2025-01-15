import { format } from 'date-fns'


export const DATETIME_FORMAT = "dd.MM.yyyy hh:mm:ss"

export const dtf = (datetime: string): string => {
    return format(new Date(datetime), DATETIME_FORMAT)
}