import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdAddCircleOutline, MdEdit } from 'react-icons/md';
import { FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import AddBoardModal from './Board/AddBoardModal';
import EditBoardModal from './Board/EditBoardModal';
import DeleteBoardModal from './Board/DeleteBoardModal';
import InviteUserModal from './Board/InviteUserModal';
import styles from '../styles/Board.module.css';
import Board from './Board/Board';

function Main() {
    const [boards, setBoards] = useState({});
    const [selectedBoard, setSelectedBoard] = useState('');
    const [editBoardDescription, setEditBoardDescription] = useState('');
    const [editBoardKey, setEditBoardKey] = useState('');
    const [editBoardName, setEditBoardName] = useState('');
    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const updateSelectBoard = (selectedBoard) => {
        setSelectedBoard(selectedBoard);
    };

    const updateBoards = (boards) => {
        setBoards(boards);
        console.log(boards[selectedBoard].description);
    };

    const getAccessToken = () => {
        return localStorage.getItem('accessToken');
    };

    const handleAddBoard = async (boardName, boardDescription) => {
        try {
            const response = await axios.post('http://localhost:8080/boards', {
                boardName: boardName,
                introduction: boardDescription,
            }, {
                headers: {
                    Authorization: getAccessToken(),
                },
            });

            setBoards((prevBoards) => ({
                ...prevBoards,
                [response.data.result.boardName.trim()]: {
                    id: response.data.result.id,
                    columns: [],
                    description: response.data.result.introduction,
                },
            }));

            setSelectedBoard(response.data.result.boardName.trim());
            setIsBoardModalOpen(false);
        } catch (error) {
            alert(`${error.response.data.msg}`);
        }
    };

    const handleEditBoard = () => {
        if (!selectedBoard) {
            alert('Please select a board first.');
            return;
        }

        setEditBoardKey(selectedBoard);
        setEditBoardName(selectedBoard);
        setEditBoardDescription(boards[selectedBoard]?.description || '');

        setIsEditModalOpen(true);
    };

    const handleSubmitEditBoard = async () => {
        if (!editBoardKey || !editBoardName || !editBoardDescription) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/boards/${boards[selectedBoard].id}`, {
                boardName: editBoardName,
                introduction: editBoardDescription,
            }, {
                headers: {
                    authorization: getAccessToken(),
                },
            });

            setBoards((prevBoards) => {
                const updatedBoards = { ...prevBoards };
                const updatedBoard = {
                    id: response.id,
                    columns: updatedBoards[selectedBoard]?.columns || [],
                    description: response.introduction,
                };
                delete updatedBoards[selectedBoard];
                updatedBoards[editBoardName] = updatedBoard;
                return updatedBoards;
            });

            setSelectedBoard(editBoardName);
            setIsEditModalOpen(false);
        } catch (error) {
            alert(`${error.response.data.msg}`);
        }
    };

    const handleDeleteBoard = () => {
        if (!selectedBoard) {
            alert('Please select a board first.');
            return;
        }

        setIsDeleteModalOpen(true);
    };

    const confirmDeleteBoard = async () => {
        const selectedBoardData = boards[selectedBoard];
        if (!selectedBoardData || !selectedBoardData.id) {
            alert('Selected board does not have a valid ID.');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8080/boards/${selectedBoardData.id}`, {
                headers: {
                    Authorization: getAccessToken(),
                },
            });

            const updatedBoards = { ...boards };
            delete updatedBoards[selectedBoard];
            setBoards(updatedBoards);
            setSelectedBoard('');
            setIsDeleteModalOpen(false);
            alert('보드 삭제 성공');
        } catch (error) {
            alert(`${error.response.data.msg}`);
        }
    };

    const handleInviteUser = () => {
        setIsInviteModalOpen(true);
    };

    const sendInvitation = async (email) => {
        if (!selectedBoard || !boards[selectedBoard]) {
            alert('Please select a board first.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/boards/${boards[selectedBoard].id}/invite`, {
                email: email,
            }, {
                headers: { Authorization: getAccessToken() },
            });

            alert('사용자 초대 성공');
        } catch (error) {
            alert(`${error.response.data.msg}`);
        }
    };

    return (
        <div className={styles.board}>
            <span className={styles.boardIcons}>
                <span className={styles.boardText}>Board</span>
                <MdAddCircleOutline onClick={() => setIsBoardModalOpen(true)} className={styles.boardIcon} size={25} />
                <MdEdit onClick={handleEditBoard} className={styles.boardIcon} size={25} />
                <FaTrashAlt onClick={handleDeleteBoard} className={styles.boardIcon} size={23} />
                <FaUserPlus onClick={handleInviteUser} className={styles.boardIcon} size={24} />
            </span>
            <div className={styles.boardHeader}>
                <h1>{selectedBoard || '보드 이름'}</h1>
                <p>{boards[selectedBoard]?.description || '보드 한 줄 설명'}</p>
            </div>
            <Board onSelectBoard={updateSelectBoard} onSetBoards={updateBoards}/>
            <AddBoardModal isOpen={isBoardModalOpen} onClose={() => setIsBoardModalOpen(false)} onAddBoard={handleAddBoard} />
            <EditBoardModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                boardName={editBoardName}
                boardDescription={editBoardDescription}
                onSubmit={handleSubmitEditBoard}
                onNameChange={setEditBoardName}
                onDescriptionChange={setEditBoardDescription}
            />
            <DeleteBoardModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={confirmDeleteBoard}
            />
            <InviteUserModal isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={sendInvitation} />
        </div>
    );
}

export default Main;
