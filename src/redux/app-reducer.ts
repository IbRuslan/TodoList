export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: "ERROR" as null | string
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

type ActionsType = SetAppStatusAT | SetAppErrorAT

export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>
export type SetAppErrorAT = ReturnType<typeof setAppErrorAC>

export const setAppStatusAC = (status: RequestStatusType) => (
    {type: 'APP/SET-STATUS', status} as const
)
export const setAppErrorAC = (error: null | string) => (
    {type: 'APP/SET-ERROR', error} as const
)