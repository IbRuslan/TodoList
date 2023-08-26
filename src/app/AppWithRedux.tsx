import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {
    AppBar,
    Paper,
    Button,
    Container,
    Grid,
    IconButton,
    Toolbar,
    Typography,
    createTheme,
    ThemeProvider, PaletteMode
} from "@material-ui/core";
import {Brightness4, Menu} from "@material-ui/icons";
import {amber, teal} from '@material-ui/core/colors';
import {createTodoTC, getTodosTC, TodoListDomainType} from "../redux/todolists-reducer";
import {useAppDispatch, useAppSelector} from "../redux/store";
import {TaskType} from "../api/api";
import {TodoListsList} from "../features/TodoListsList/TodoListsList";

export type TaskStateType = {
    [id: string]: Array<TaskType>
}

export const AppWithRedux = () => {

    const dispatch = useAppDispatch()

    const maxTodoListTitle = 10

    const addTodoList = useCallback((newTitle: string) => {
        dispatch(createTodoTC(newTitle))
    }, [dispatch])

    useEffect(() => {
        dispatch(getTodosTC())
    }, [])

    let [mode, setMode] = useState<PaletteMode | undefined>('light');

    const customTheme = createTheme({
        palette: {
            primary: teal,
            secondary: amber,
            mode: mode
        }
    })

    const changeTheme = () => mode === 'light' ? setMode('dark') : setMode('light')

    return (
        <ThemeProvider theme={customTheme}>
            <div className="App">
                <AppBar position={"static"}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <Menu/>
                        </IconButton>
                        <Typography variant={"h6"} component={'div'} sx={{flexGrow: 1}}>
                            TodoList
                        </Typography>
                        <Button color={'inherit'} variant={'outlined'}>Log out</Button>
                        <IconButton onClick={changeTheme}>
                            <Brightness4/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container>
                    <Grid container sx={{p: "15px 0"}}>
                        <Paper elevation={2}>
                            <AddItemForm maxTitle={maxTodoListTitle} addItem={addTodoList}/>
                        </Paper>
                    </Grid>
                    <TodoListsList />
                </Container>
            </div>
        </ThemeProvider>
    );
}