export interface IUser {
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    date_of_birth: Date ,
    uid: string,
}

export interface IUsersRating extends IUser {
    rating: number;
}

export interface IColumn {
    key: string,
    name: string
}

export enum enumTypeGrid {
    users = 'USERS',
    usersRatingGood = 'USERS_RATING_GOOD',
    usersRatingBad = 'USERS_RATING_BAD'
}


