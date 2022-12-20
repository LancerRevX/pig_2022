export enum DataStatus {
    Loading,
    Ready,
    Forbidden,
    Error,
    NotFound
}

export type DataStatusStore = {
    dataStatus: DataStatus
}