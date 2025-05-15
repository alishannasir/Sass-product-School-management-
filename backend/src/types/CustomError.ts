export interface ICustomErrorData {
    [key: string]: any; // Adjust this to be more specific if you know the structure of `data`
}

export interface ICustomError extends Error {
    statusCode: number;
    data: ICustomErrorData;
}

   