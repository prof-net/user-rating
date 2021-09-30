import {listColumns} from "./config";


// Получаю данные с сервера, и выбирае те колонки, которые указаны в конфиге
export const convertUsers = (serverUsers:any) => {
    return serverUsers.map((item:any) => {

        const newUser: any = {}

        for (let column of listColumns) {
            newUser[column.key] = item[column.key]
        }
        return {
            ...newUser,
            key: item.uid
        };
    });
}