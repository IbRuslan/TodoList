import {TaskStateType} from "../app/AppWithRedux";
import {AddTodoListsAT, RemoveTodoListAT, SetTodoListAT} from "./todolists-reducer";
import {RESUL_CODE, TasksApi, TaskStatuses, TaskType, UpdateTaskType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {setAppErrorAC, setAppStatusAC} from "./app-reducer";

export type RemoveTasksAT = ReturnType<typeof removeTaskAC>

export type AddTasksAT = ReturnType<typeof addTaskAC>

export type ChangeTasksTitleAT = ReturnType<typeof changeTaskTitleAC>

export type ChangeTasksStatusAT = ReturnType<typeof changeTaskStatusAC>

export type SetTasksAt = ReturnType<typeof setTasksAc>

export type tasksReducerAT = RemoveTasksAT | AddTasksAT
    | ChangeTasksTitleAT | ChangeTasksStatusAT | RemoveTodoListAT | AddTodoListsAT | SetTodoListAT | SetTasksAt

const initialState:TaskStateType = {}

export const tasksReducer = (state: TaskStateType = initialState, action: tasksReducerAT): TaskStateType => {
    switch (action.type) {
        case "SET-TODOLIST":
            const copyState = {...state}
            action.data.forEach((t) => {
                copyState[t.id] = []
            })
            return copyState
        case "SET-TASKS":
            return {...state,
                [action.todoId]: action.tasks
            }
        case "REMOVE-TASKS":
            return {...state, [action.todoListId]: state[action.todoListId].filter(t=> t.id !== action.id)}
        case "ADD-TASKS":
            return {...state, [action.todoListId]: [action.task, ...state[action.todoListId]]}
        case "CHANGE-TASKS-STATUS":
            return {...state, [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.id ? {...t, status: action.status} : t)}
        case "CHANGE-TASKS-TITLE":
            return {...state, [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.id ? {...t, title: action.newTitle} : t)}
        case "ADD-TODOLIST":
            return {...state, [action.todoListId.id]: []}
        case "REMOVE-TODOLIST":
            // let {[action.todoListId]: [], ...rest} = state
            // return rest
            let stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy
        default:
            return state
    }
}

export const removeTaskAC = (todoListId: string, id: string) => (
    {type: "REMOVE-TASKS", todoListId: todoListId, id: id } as const
)
export const addTaskAC = (task: TaskType, todoListId: string) => (
    {type: "ADD-TASKS", task, todoListId} as const
)
export const changeTaskTitleAC = (newTitle: string, todoListId: string, id: string) => (
    {type: "CHANGE-TASKS-TITLE", newTitle: newTitle, todoListId: todoListId, id} as const
)
export const changeTaskStatusAC = (status: TaskStatuses, todoListId: string, id: string) => (
    {type: "CHANGE-TASKS-STATUS", status, todoListId, id} as const
)
export const setTasksAc = (tasks: TaskType[], todoId: string) => (
    {type: "SET-TASKS", todoId, tasks} as const
)


export const getTasksTC = (todoId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    TasksApi.getTasks(todoId)
        .then((res) => {
            dispatch(setTasksAc(res.data.items, todoId))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const createTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    TasksApi.createTask(todoId, title)
        .then((res) => {
            if (res.data.resultCode === RESUL_CODE.SUCCESS) {
                dispatch(addTaskAC(res.data.data.item, todoId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.data.messages[0]) {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('Some error'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch((e)=> {
            dispatch(setAppStatusAC('loading'))
            dispatch(setAppErrorAC(e.messages))
        })
}
export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
        const model: UpdateTaskType = {
            title: task.title,
            description: task.description,
            status: status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }
        dispatch(setAppStatusAC('loading'))
        TasksApi.updateTask(todolistId, taskId, model)
            .then((res) => {
                if (res.data.resultCode === RESUL_CODE.SUCCESS) {
                    dispatch(changeTaskStatusAC(status, todolistId, taskId))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    if (res.data.messages[0]) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setAppErrorAC('Some error'))
                    }
                    dispatch(setAppStatusAC('failed'))
                }
            })
            .catch((e)=> {
                dispatch(setAppStatusAC('loading'))
                dispatch(setAppErrorAC(e.messages))
            })
    }
}
export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
        const model: UpdateTaskType = {
            title: title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }
        dispatch(setAppStatusAC('loading'))
        TasksApi.updateTask(todolistId, taskId, model)
            .then((res) => {
                dispatch(changeTaskTitleAC(title, todolistId, taskId))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    TasksApi.deleteTask(todoId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(todoId, taskId))
            dispatch(setAppStatusAC('succeeded'))
    })
}