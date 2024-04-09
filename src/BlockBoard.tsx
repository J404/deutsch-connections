import './BlockBoard.css';
import { BoardBlock } from "./GameBoard";

interface BlockBoardProps {
    blocks: BoardBlock[];
    onBlockClicked: (label: string) => void;
}

export default function BlockBoard(props: BlockBoardProps) {
    return (
        <div className="block-container">
            {props.blocks.map((block, i) => (
                <div
                    className={`cell ${block.clicked ? 'active' : ''} ${block.solved ? block.color : ''}`}
                    key={i}
                    onClick={() => props.onBlockClicked(block.label)}
                >
                    {block.label}
                </div>
            ))}
        </div>
    );
}
