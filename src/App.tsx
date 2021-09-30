import React, {useEffect, useState} from 'react';
import {getData,} from "./api";
import {convertUsers} from "./utils";
import {enumTypeGrid, IUser, IUsersRating} from "./types";
import Grid from "./components/grid/grid";
import {Button, Tabs} from "antd";
import './App.css';
import ModalMessage from "./components/modal/modal";



const App: React.FC = () => {
    const {TabPane} = Tabs;

    const [users, setUsers] = useState<IUser[]>([]);
    const [usersRatingGood, setUsersRatingGood] = useState<IUsersRating[]>([]);
    const [usersRatingBad, setUsersRatingBad] = useState<IUsersRating[]>([]);

    const [activeTab, setActiveTab] = useState<string>('1');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [limitRating, setLimitRating] = useState<boolean>(false);
    const [limitRatingUser, setLimitRatingUser] = useState<undefined | IUsersRating>(undefined);


    useEffect(() => {
        updateData();
    }, []);

    const updateData = () => {
        getData().then((result) => {
            setUsers(convertUsers(result.data));
        });
        setUsersRatingGood([]);
        setUsersRatingBad([]);
    }

    const changeTab = (key: string) => {
        setActiveTab(key);
    }

    const changeRating = (item:IUser | IUsersRating, typeAction: '+' | '-', typeGrid: enumTypeGrid):void => {
        const changeRow = (arr: IUsersRating[], action: '+' | '-'): IUsersRating[] => {
            return arr.map((row) => {
                if (row.uid === item.uid) {

                    const newRating = (item as IUsersRating).rating + (action === '+' ? 1 : -1);

                    const setParamRow = (limitRating: boolean):IUsersRating => {
                        showModal();
                        setLimitRating(limitRating);
                        setLimitRatingUser(row);
                        return row;
                    }

                    if (newRating > 5) {
                        return setParamRow(false);
                    }

                    if (newRating < -5) {
                        return setParamRow(true);
                    }

                    return {
                        ...row,
                        rating: newRating
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

            let currentRating: IUsersRating | undefined;

            if (typeGrid === enumTypeGrid.usersRatingGood) {
                setUsersRatingGood(prev => {
                    const newArr = changeRow(prev, typeAction);
                    currentRating =  newArr.find(row => row.uid === item.uid);
                    return newArr;
                });

                // если рейтинг стал -1, удаляем из списка хороших и добавляем в список плохих
                if (currentRating?.rating === -1) {
                    setUsersRatingGood(usersRatingGood.filter(row => row.uid !== item.uid));
                    setUsersRatingBad([...usersRatingBad, currentRating!]);
                    setActiveTab('2');
                }
            } else {

                setUsersRatingBad(prev => {
                    const newArr = changeRow(prev, typeAction);
                    currentRating =  newArr.find(row => row.uid === item.uid);
                    return newArr;
                });
                // если рейтинг стал 1, удаляем из списка плохих и добавляем в список хороших
                if (currentRating?.rating === 1) {
                    setUsersRatingBad(usersRatingBad.filter(row => row.uid !== item.uid));
                    setUsersRatingGood([...usersRatingGood, currentRating!]);
                    setActiveTab('1');
                }
            }
        }
    }

    const removeRating = (item:IUsersRating, typeGrid: enumTypeGrid):void => {
        // убрать из рейтинга
        if (typeGrid === enumTypeGrid.usersRatingGood) {
            setUsersRatingGood(prev => prev.filter(row => row.uid !== item.uid));
        } else {
            setUsersRatingBad(prev => prev.filter(row => row.uid !== item.uid));
        }
        // Добавить в основной список
        setUsers(prev => [...prev, item]);
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (limitRating) {
            //удаляем из базы
            setUsersRatingBad(prev => prev.filter(row => row.uid !== limitRatingUser?.uid));

        } else {
            // возвращаем в основной список
            setUsersRatingGood(prev => prev.filter(row => row.uid !== limitRatingUser?.uid));
            setUsers(prev => [...prev, limitRatingUser as IUser])
        }

        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
        <ModalMessage isModalVisible={isModalVisible}  handleOk={handleOk} handleCancel={handleCancel} limitRating={limitRating} limitRatingUser={limitRatingUser}/>
        <div className="test-main">
            <div className="test-column">
                <div>
                    <Button className="test-buttons" onClick={updateData}>Обновить список</Button>
                    <Button className="test-buttons">Следующая страница</Button>
                </div>
                <Grid
                    users={users}
                    typeGrid={enumTypeGrid.users}
                    changeRating={changeRating}
                />
            </div>

            <div className="test-column">
                <Tabs defaultActiveKey="1" onChange={changeTab} activeKey={activeTab}>
                    <TabPane tab="Хорошие" key="1">
                        <Grid
                            users={usersRatingGood}
                            typeGrid={enumTypeGrid.usersRatingGood}
                            changeRating={changeRating}
                            removeRating={removeRating}
                        />
                    </TabPane>
                    <TabPane tab="Плохие" key="2">
                        <Grid
                            users={usersRatingBad}
                            typeGrid={enumTypeGrid.usersRatingBad}
                            changeRating={changeRating}
                            removeRating={removeRating}
                        />
                    </TabPane>

                </Tabs>
            </div>
        </div>
        </>
    );
}

export default App;
