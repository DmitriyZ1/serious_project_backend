export interface UserI{
    tel: string,
    name: string,
    mail: string,
    discounts:string[],
    bonuses: number,
    appeals:string[],
    orders:string[],
}
export interface FormUserI{
    tel: string,
    name: string,
    mail: string,
}

export interface findObjI{
    label?: Object,
    "characteristic.gender"?: Object,
    category?: String,
    price?: Object
}
