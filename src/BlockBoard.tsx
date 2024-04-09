import { BoardBlock } from "./GameBoard";

interface BlockBoardProps {
    blocks: BoardBlock[];
    onBlockClicked: (label: string) => void;
}

export default function BlockBoard(props: BlockBoardProps) {
    const grid = [props.blocks.slice(0, 4), props.blocks.slice(4, 8), props.blocks.slice(8, 12), props.blocks.slice(12, 16)];
    return <>
        {grid.map((row, i) => <div key={i}>
            {row.map((block, j) => 
                <div key={j} onClick={() => props.onBlockClicked(block.label)}>{`Label: ${block.label}, Clicked: ${block.clicked}, Solved: ${block.solved}`}</div>
            )}
        </div>)}
    </>
}