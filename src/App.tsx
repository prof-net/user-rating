import React, {useEffect, useState} from 'react';
import {getData,} from "./api";
import {convertUsers} from "./utils";
import {enumTypeGrid, IUser, IUsersRating} from "./types";
import Grid from "./components/grid/grid";
import {Button, Tabs} from "antd";
import './App.css';


const App: React.FC = () => {
    const {TabPane} = Tabs;

    const [users, setUsers] = useState<IUser[]>([]);
    const [usersRatingGood, setUsersRatingGood] = useState<IUsersRating[]>([]);
    const [usersRatingBad, setUsersRatingBad] = useState<IUsersRating[]>([]);

    const [activeTab, setActiveTab] = useState<string>('1');


    useEffect(() => {
        getData().then((result) => {
            setUsers(convertUsers(result.data));
        });
    }, []);


    function callback(key: any) {
        console.log(key);
    }

    const changeRating = (item:IUser | IUsersRating, typeAction: '+' | '-', typeGrid: enumTypeGrid) => {


        const changeRow = (arr: IUsersRating[], action: '+' | '-'): IUsersRating[] => {
            return arr.map((row) => {
                if (row.uid === item.uid) {
                    return {
                        ...row,
                        rating: (item as IUsersRating).rating + (action === '+' ? 1 : -1)
                    }
                }
                return row;
            })
        }

        if (typeGrid === enumTypeGrid.users) {
            // убрать из основных
            setUsers((prev) => prev.filter((i) => i.uid !== item.uid));
            // добавить в доп.
            if (typeAction === '+') {
                setUsersRatingGood(prev => [...prev, {...item, rating: 1}]);
                setActiveTab('1');
            } else {
                setUsersRatingBad(prev => [...prev, {...item, rating: -1}]);
                setActiveTab('2');
            }
        } else {
            //Изменяем рейтинг нужной строки
            if (typeGrid === enumTypeGrid.usersRatingGood) {
                setUsersRatingGood(prev => changeRow(prev, typeAction));
            } else {
                setUsersRatingBad(prev => changeRow(prev, typeAction));
            }

        }

        console.log(item, typeAction, typeGrid)
    }

    return (
        <div className="test-main">
            <div className="test-column">
                <div>
                    <Button className="test-buttons">Обновить список</Button>
                    <Button className="test-buttons">Следующая страница</Button>
                </div>
                <Grid
                    users={users}
                    typeGrid={enumTypeGrid.users}
                    changeRating={changeRating}
                />
            </div>

            <div className="test-column">
                <Tabs defaultActiveKey="1" onChange={callback} activeKey={activeTab}>
                    <TabPane tab="Хорошие" key="1">
                        <Grid
                            users={usersRatingGood}
                            typeGrid={enumTypeGrid.usersRatingGood}
                            changeRating={changeRating}
                        />
                    </TabPane>
                    <TabPane tab="Плохие" key="2">
                        <Grid
                            users={usersRatingBad}
                            typeGrid={enumTypeGrid.usersRatingBad}
                            changeRating={changeRating}
                        />
                    </TabPane>

                </Tabs>
            </div>


        </div>
    );
}

export default App;
