import React from "react";
import {Modal} from 'antd';
import {IUsersRating} from "../../types";

interface IProps {
    isModalVisible: boolean;
    handleOk: () => void,
    handleCancel: () => void,
    limitRatingUser: IUsersRating | undefined,
    limitRating: boolean
}

const ModalMessage: React.FC<IProps> = (props) => {

    const {isModalVisible, handleOk, handleCancel, limitRatingUser, limitRating} = props;

    const username = limitRatingUser ? limitRatingUser.username : undefined;

    return <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {
            limitRating ? <p>Пора забанить {username}. Сделать это?"</p> : <p>Нужно вознаградить {username}. Сделать это"</p>
        }
    </Modal>


}

export default ModalMessage;