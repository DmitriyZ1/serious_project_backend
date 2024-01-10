
export function dateFormat():string {

    const date:Date = new Date();

    const n:number = date.getDate()
    const g:number = date.getFullYear()
    const m:number = date.getMonth()

    const monthString = (d:number):string => {
        switch (d){
            case 0:{
                return 'Января'
            }
            case 1:{
                return 'Февраля'
            }
            case 2:{
                return 'Марта'
            }
            case 3:{
                return 'Апреля'
            }
            case 4:{
                return 'Мая'
            }
            case 5:{
                return 'Июня'
            }
            case 6:{
                return 'Июля'
            }
            case 7:{
                return 'Августа'
            }
            case 8:{
                return 'Сентября'
            }
            case 9:{
                return 'Октября'
            }
            case 10:{
                return 'Ноября'
            }
            case 11:{
                return 'Декабря'
            }
            default:
                return ''
        }
    }

    return `${n}  ${monthString(m)}  ${g}}`
}