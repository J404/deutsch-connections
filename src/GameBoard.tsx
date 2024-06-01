import { useEffect, useState } from 'react';
import BlockBoard from './BlockBoard';
import connectionsSettings from './connections.json';
import './GameBoard.css';

type Block = { label: string, color: Color };
export type BoardBlock = { label: string, clicked: boolean, color: Color, solved: boolean };
type Connection = { label: string, color: Color, blocks: Block[], solved: boolean };
type Color = 'yellow' | 'green' | 'blue' | 'purple';

export default function GameBoard() {
    const { blocks, connections: connectionsArr } = initialState();
    const [connections, setConnections] = useState<Connection[]>(connectionsArr);
    const [boardBlocks, setBoardBlocks] = useState<BoardBlock[]>(shuffleArray(blocks.map(block => ({ label: block.label, clicked: false, color: block.color, solved: false }))));
    const [clickedBlocks, setClickedBlocks] = useState<BoardBlock[]>([]);
    const [solvedConnections, setSolvedConnections] = useState<Connection[]>([]);
    const [statusMessage, setStatusMessage] = useState<string>('');

    useEffect(() => {
        for (const connection of connections) {
            if (!connection.solved)
                return;
        }

        setStatusMessage('Gewonnen!')
    }, [connections])

    // Get all blocks from connections.json as a single array in initial order
    function initialState(): { blocks: Block[], connections: Connection[] } {
        let blocks: Block[] = [];
        let connections: Connection[] = [];

        const colors: Color[] = ['yellow', 'green', 'blue', 'purple'];
        for (const color of colors) {
            const colorBlocks: Block[] = [];

            for (const block of connectionsSettings[color].blocks) {
                colorBlocks.push({ label: block, color });
            }

            const connection: Connection = {
                label: connectionsSettings[color].answer,
                color,
                blocks: colorBlocks,
                solved: false,
            };

            blocks = [...blocks, ...colorBlocks];
            connections = [...connections, connection];
        }

        return {blocks, connections};
    }

    // Credit: https://stackoverflow.com/a/12646864
    // @ts-expect-error - shuffleArray is supposed to use generic 'any' type array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    /**
     * Handles the click event on a block, adding (or removing, if appropriate) it to the 
     * the list of currently clicked blocks.
     *  
     * @param label Label of pressed button
     */
    function handleBlockClick(label: string) {
        const blockCopy = [...boardBlocks];
        const clickedBlock = blockCopy.find(block => block.label == label);

        if (!clickedBlock || clickedBlock.solved) {
            return;
        }

        // If the user is clicking the block 'off', that is always allowed, so do it. 
        // Remove from clickedBlocks if it's there.
        if (clickedBlock.clicked) {
            clickedBlock.clicked = false;
            setBoardBlocks(blockCopy);
            setClickedBlocks(currClicked => currClicked.filter(block => block.label !== label));
        // Otherwise, we first check if we are permitted to click a new block, i.e. if there's less than 4 clicked blocks.
        // If so, add it!
        } else if (clickedBlocks.length < 4) {
            clickedBlock.clicked = true;
            setBoardBlocks(blockCopy);
            setClickedBlocks(currClickedBlocks => [...currClickedBlocks, clickedBlock]);
        }
    }

    /**
     * Checks the current status of the board guesses to determine if the user has correctly guessed a 
     * category or not.
     */
    function checkSelected() {
        // First, make sure the user has selected 4 blocks, or do not process the request.
        if (clickedBlocks.length < 4) {
            return;
        }

        // Get the number of guesses in each color category -- a correct guess will have 4 in one category
        // and 0 in all others.
        const colorGuesses: Record<Color, number> = { 'yellow': 0, 'green': 0, 'blue': 0, 'purple': 0 };
        for (const block of clickedBlocks) {
            colorGuesses[block.color]++;
        }

        let correctGroup: Color | undefined = undefined;
        const colors: Color[] = ['yellow', 'green', 'blue', 'purple'];
        for (const color of colors) {
            // If any one category has 4 blocks, we know the user has correctly guessed that category, and we may stop.
            if (colorGuesses[color] == 4) {
                correctGroup = color;
                break;
            } else if (colorGuesses[color] == 3) {
                // Otherwise, if the user guessed 3 / 4 of a category, show a hint message
                setStatusMessage('Nur einen Fehler!');
                return;
            }
        }

        // If no correct guess was made, show a status message stating so.
        if (!correctGroup) {
            setStatusMessage('Falsch!');
            return;
        }

        // Otherwise, a correct guess was made, so update the clicked blocks and solved status of the board
        // accordingly.
        const connectionsCopy = [...connections];
        const boardBlocksCopy = [...boardBlocks];
        const connection = connectionsCopy.find(group => group.color == correctGroup);

        if (!connection) {
            return;
        }

        connection.solved = true;
        for (const block of clickedBlocks) {
            block.solved = true;
            block.color = connection.color;
            block.clicked = false;
        }

        setSolvedConnections(currSolved => [...currSolved, connection]);
        setConnections(connectionsCopy);
        setClickedBlocks([]);
        setBoardBlocks(boardBlocksCopy);
        setStatusMessage('');
    }

    return <div className='game-container'>
        <BlockBoard blocks={boardBlocks} onBlockClicked={handleBlockClick}/>
        <br/>
        <button onClick={checkSelected} disabled={clickedBlocks.length != 4}>Submit</button>
        <br/>
        <span className='status-message'>{statusMessage}</span>
        <br/>
        {solvedConnections.length > 0 && <div className='answer-container'>
            {solvedConnections.map((connection, i) => (
                <div key={i} className={`solved ${connection.color}`}>{connection.label}</div>
            ))}
        </div>}
    </div>
}