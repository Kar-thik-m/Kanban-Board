import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BordTileSuccess, GetBordTileSuccess } from "../Redux/Slice";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [BoardValue, SetBoardValue] = useState('');
  const [board, SetBoard] = useState<{ id: string, title: string }[]>([]);
  const { boarddata } = useSelector((state: any) => state?.Board);

  const dispatch = useDispatch();

  
  const LOCAL_STORAGE_KEY = "kanbanBoards";

  
  useEffect(() => {
    const savedBoards = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedBoards) {
      try {
        const parsedBoards = JSON.parse(savedBoards);
        if (Array.isArray(parsedBoards)) {
          dispatch(GetBordTileSuccess(parsedBoards)); 
          SetBoard(parsedBoards); 
        } else {
          console.error("Invalid board data in localStorage");
        }
      } catch (error) {
        console.error("Error parsing saved boards", error);
      }
    }
  }, [dispatch]);

 
  const handleCreateBoard = () => {
    if (BoardValue.trim() === "") {
      alert("Board name cannot be empty.");
      return;
    }

    const newBoard = {
      id: `${Date.now()}`,
      title: BoardValue,
    };

    const updatedBoards = [...board, newBoard];
    SetBoard(updatedBoards);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedBoards)); 
    dispatch(BordTileSuccess(updatedBoards)); 
    SetBoardValue(""); 
  };

  return (
    <>
      <header className="flex flex-col items-center justify-center pt-4 pb-4">
        <h1 className="text-3xl font-serif font-bold p-3">Welcome to the Kanban Board</h1>
        <p>Organize your tasks and manage your workflow effortlessly!</p>
      </header>

      <div className="flex flex-col items-center justify-center">
        <div>
          <input
            type="text"
            name="board"
            placeholder="Create Board"
            value={BoardValue}
            onChange={(e) => SetBoardValue(e.target.value)}
            className="my-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        <button
          className="bg-green-500 px-5 py-3 rounded hover:text-white hover:bg-green-600"
          onClick={handleCreateBoard}
        >
          Create Board
        </button>
        <div className="mt-4">
          {Array.isArray(boarddata) && boarddata.length > 0 ? (
            boarddata.map((b: any) => (
              <div key={b.id} className="my-2 px-10 py-2 w-full border rounded bg-blue-600 cursor-pointer">
                <Link to={`/border/${b.id}`}>
                  <h3 className="text-white text-lg">{b.title}</h3>
                </Link>
              </div>
            ))
          ) : (
            <p>No boards available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
