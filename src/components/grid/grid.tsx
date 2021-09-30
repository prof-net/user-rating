import React from "react";
import {Button, Space, Table} from "antd";
import {listColumns} from "../../config";
import {enumTypeGrid, IColumn, IUser, IUsersRating} from "../../types";
import './grid.css';

interface IProps {
    users: IUser[] | IUsersRating[],
    typeGrid: enumTypeGrid,
    changeRating: (item:IUser | IUsersRating, typeAction: '+' | '-', typeGrid: enumTypeGrid) => void
}

const Grid: React.FC<IProps> = (props) => {

    const {users, typeGrid, changeRating} = props;

    const baseColumns = listColumns.map((item:IColumn) => {
        return        {
            title: item.name,
            dataIndex: item.key,
            key: item.key,
        }
    });
    const rating = {
        title: 'Рейтинг',
        dataIndex: 'rating',
        key: 'rating',

    }

    const action = {
        title: 'Действия',
        key: 'action',
        render: (item:IUser | IUsersRating ) => (
            <Space size="middle">
                <Button onClick={() => changeRating(item, '+', typeGrid)}>+</Button>
                <Button onClick={() => changeRating(item, '-', typeGrid)}>-</Button>
            </Space>
        ),
    }


    const columns = typeGrid === enumTypeGrid.users ? [...baseColumns, action] : [...baseColumns, rating, action] ;


    console.log('aaaaaaaaaaaa')
    console.log('aaaaaaaaaaaa')
    console.log(users)
    console.log('aaaaaaaaaaaa')

    return         <Table
        columns={columns}
        dataSource={users}
        pagination={false}
    />
}

export default Grid;