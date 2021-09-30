import React from "react";
import {Button, Table} from "antd";
import {listColumns} from "../../config";
import {enumTypeGrid, IColumn, IUser, IUsersRating} from "../../types";
import './grid.css';

interface IProps {
    users: IUser[] | IUsersRating[],
    typeGrid: enumTypeGrid,
    changeRating: (item:IUser | IUsersRating, typeAction: '+' | '-', typeGrid: enumTypeGrid) => void,
    removeRating?: (item:IUsersRating, typeGrid: enumTypeGrid) => void
}

const Grid: React.FC<IProps> = (props) => {

    const {users, typeGrid, changeRating, removeRating} = props;

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
            <div >
                <div style={{display: 'flex', margin: '5px'}}>
                    <Button onClick={() => changeRating(item, '+', typeGrid)}>+</Button>
                    <Button onClick={() => changeRating(item, '-', typeGrid)}>-</Button>
                </div>


                {
                    typeGrid !== enumTypeGrid.users ?
                        (item as IUsersRating).rating === 0 ?
                            <div style={{display: 'flex', margin: '5px'}}><Button onClick={() => removeRating!((item as IUsersRating),  typeGrid)}>Убрать</Button></div>
                            : null
                        : null
                }
            </div>
        ),
    }

    const columns = typeGrid === enumTypeGrid.users ? [...baseColumns, action] : [...baseColumns, rating, action] ;


    return         <Table
        columns={columns}
        dataSource={users}
        pagination={false}
    />
}

export default Grid;