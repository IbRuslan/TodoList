import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import { HighlightOff } from "@material-ui/icons";
import { deleteTaskTC, TasksDomainType, updateTaskStatusTC, updateTaskTitleTC } from "../../../../redux/tasks-reducer";
import { TaskStatuses } from "../../../../api/api";
import { useAppDispatch } from "../../../../redux/store";

export type TaskPropsType = {
  task: TasksDomainType
  todoListId: string
}


export const Task = ({ task, todoListId }: TaskPropsType) => {

  const { id, title, status, entityStatus } = task;

  const dispatch = useAppDispatch();

  const removeTaskHandler = () => {
    dispatch(deleteTaskTC(todoListId, id));
  };
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      dispatch(updateTaskStatusTC(todoListId, id, TaskStatuses.Completed));
    } else {
      dispatch(updateTaskStatusTC(todoListId, id, TaskStatuses.New));
    }
  };

  const changeTaskTitleHandler = useCallback((newTitle: string) => dispatch(updateTaskTitleTC(todoListId, id, newTitle)), [dispatch, todoListId, id]);

  return (
    <li className={"tasks-list-item"}>
      <div>
        <Checkbox
          size="small"
          checked={status === TaskStatuses.Completed}
          onChange={changeTaskStatusHandler}
        />
        <EditableSpan
          classes={status === TaskStatuses.Completed ? "task-done" : "task"}
          title={title}
          changeTitle={changeTaskTitleHandler}
          disabled={entityStatus === "loading"}
        />
      </div>
      <IconButton disabled={entityStatus === "loading"} onClick={removeTaskHandler}>
        <HighlightOff />
      </IconButton>
    </li>
  );
};