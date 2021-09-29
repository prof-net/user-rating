import React, {useEffect, useState} from 'react';
import {Table, Space, Button} from 'antd';
import {getData, } from "./api";
import {convertUsers} from "./utils";
import {listColumns} from "./config";
import {IColumn, IUser} from "./types";


const App:React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(  () => {
        getData().then((result) => {
            setUsers(convertUsers(result.data));
        });
    }, []);

    const columns = [...listColumns.map((item:IColumn) => {
        return        {
            title: item.name,
            dataIndex: item.key,
            key: item.key,
        }
    }),    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Space size="middle">
                <Button onClick={() => console.log('+')}>+</Button>
                <Button onClick={() => console.log('-')}>-</Button>
            </Space>
        ),
    }]


  return (
    <div>
        <Table
            columns={columns}
            dataSource={users}
            pagination={false}
        />
    </div>
  );
}

export default App;
