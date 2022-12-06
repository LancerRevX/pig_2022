export enum DataStatus {
    Loading,
    Ready,
    Forbidden,
    Error
}

export type DataStatusStore = {
    dataStatus: DataStatus
}