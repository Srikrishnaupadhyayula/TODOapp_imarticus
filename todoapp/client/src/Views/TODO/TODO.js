import { useEffect, useState } from 'react';
import Styles from './TODO.module.css';
import { dummy } from './dummy';
import axios from 'axios';

export function TODO(props) {
    const [newTodo, setNewTodo] = useState('');
    const [newDescription, setNewDescription] = useState(''); // State for new description
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo();
            setTodoData(apiData);
            setLoading(false);
        };
        fetchTodo();
    }, []);

    const getTodo = async () => {
        const options = {
            method: "GET",
            url: `http://localhost:9000/api/todo`,
            headers: {
                accept: "application/json",
            }
        };
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const addTodo = () => {
        const options = {
            method: "POST",
            url: `http://localhost:9000/api/todo`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTodo,
                description: newDescription // Include newDescription in the data
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => [...prevData, response.data.newTodo]);
                setNewTodo('');
                setNewDescription(''); // Clear description field after adding todo
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTodo = (id) => {
        const options = {
            method: "DELETE",
            url: `http://localhost:9000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.filter(todo => todo._id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateTodo = (id, newTitle, newDescription) => {
        const options = {
            method: "PATCH",
            url: `http://localhost:9000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTitle,
                description: newDescription
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo));
                setEditingId(null);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>Tasks</h1>
                <span>
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Todo'
                        value={newTodo}
                        onChange={(event) => setNewTodo(event.target.value)}
                        placeholder='New Todo Title'
                    />
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Todo Description'
                        value={newDescription}
                        onChange={(event) => setNewDescription(event.target.value)}
                        placeholder='New Todo Description'
                    />
                    <button
                        id='addButton'
                        name='add'
                        className={Styles.addButton}
                        onClick={addTodo}
                    >
                        + New Todo
                    </button>
                </span>
            </div>
            <div id='todoContainer' className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : (
                    todoData.length > 0 ? (
                        todoData.map((entry) => (
                            <div key={entry._id} className={Styles.todo}>
                                {editingId === entry._id ? (
                                    <>
                                        <input
                                            type='text'
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                        />
                                        <input
                                            type='text'
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                        <button
                                            onClick={() => updateTodo(entry._id, editTitle, editDescription)}
                                        >
                                            Save
                                        </button>
                                        <button onClick={() => setEditingId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <span className={Styles.infoContainer}>
                                            <input
                                                type='checkbox'
                                                checked={entry.done}
                                                onChange={() => updateTodo(entry._id, entry.title, entry.description)}
                                            />
                                            <div>
                                                <strong>Title:</strong> {entry.title}
                                            </div>
                                            <div>
                                                <strong>Description:</strong> {entry.description}
                                            </div>
                                        </span>
                                        <span
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => deleteTodo(entry._id)}
                                        >
                                            Delete
                                        </span>
                                        <span
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setEditingId(entry._id);
                                                setEditTitle(entry.title);
                                                setEditDescription(entry.description);
                                            }}
                                        >
                                            Edit
                                        </span>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
                    )
                )}
            </div>
        </div>
    );
}
