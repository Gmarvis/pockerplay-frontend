"use client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Card from "@/components/atoms/Card";
import Scores from "@/components/organisms/Scores";
import { useEffect, useState } from "react";

// react icons
import { PiCopySimpleLight } from "react-icons/pi";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { api_call } from "@/utils/service/constant";
import { useParams } from "next/navigation";
export const socket = io(api_call || "", {
  path: "/socket.io/",
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: 10,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
});
export default function Page() {
  const [generatedData, setGenerataedData] = useState<Array<string>>([]);
  const [selectedCard, setSelectedCard] = useState<CardType>();
  const [score, setScore] = useState<Score>();
  const [homePlayer, setHomePlayer] = useState<User>();
  const [guessPlayer, setGuessPlayer] = useState<User>();
  const [round, setRound] = useState<Round>();
  const [homeChoice, setHomeChoice] = useState<string>("");
  const [guessChoice, setGuessChoice] = useState<string>("");
  const [guessGuess, setGuessGuess] = useState<string>("");
  const [homeGuess, setHomeGuess] = useState<string>("");
  const [category, setCategory] = useState<string>("words");
  const [numberOfOptions, setNumberOfOptions] = useState<number>(5);
  const [homeplayerHint, setHomePlayerHint] = useState<string>("");
  const [guessPlayerHint, setGuessPlayerHint] = useState<string>("");
  const [gameUrl, setGameUrl] = useState<string>("");
  const [game, setGame] = useState<GameSession>();
  const params = useParams();
  useEffect(() => {
    setGameUrl(window.location.toString());
  }, []);

  const cardData: any[] = [];
  socket.on("generate", (data) => {
    if (data) {
      setRound(data);
      setGenerataedData(data.proposals);
    }
  });
  const handleGenerate = () => {
    const data = {
      gamesession_id: params ? params : "",
      category,
      number_of_proposals: numberOfOptions,
      round_number: round?.round_number ? round.round_number : 0,
    };
    if (data.round_number > 5) alert("this is the end of game");
    socket.emit("generate", data);
  };
  socket.on("receive_guess", (data) => {
    if (data) {
      if (data.role === "home_player") {
        setHomeGuess(data.guess);
      } else if (data.role === "guess_player") {
        setGuessGuess(data.guess);
      }
    }
  });
  socket.on("receive_choice", (data) => {
    if (data) {
      if (data.role === "home_player") {
        setGenerataedData(data.proposals);
        setGuessPlayerHint(data.message);
      } else if (data.role === "guess_player") {
        setGenerataedData(data.proposals);
        setHomePlayerHint(data.message);
      }
    }
  });
  const handleCopy = () => {
    toast.success("Copied!", {
      position: "top-right",
      hideProgressBar: true,
      autoClose: 3000,
    });
  };
  socket.on("endGame", (data) => {
    if (data) {
      if (data.role === "home_player") {
        setHomeGuess(data.guess);
      } else if (data.role === "guess_player") {
        setGuessGuess(data.guess);
      }
      if (data.gameState === "end Game") alert("the game is finish! retry...");
      setGame(data.game);
    }
  });

  return (
    <main className="flex mobile:max-sm:flex-col-reverse  justify-between bg-bgGray mobile:max-sm:h-auto bigScreen:h-[calc(100vh-50px)] h-[calc(100vh-49px)] ">
      {/* ############ GAME AREA ########### */}
      <div className="py-4 px-8 w-full mobile:max-sm:px-2 mobile:max-sm:h-[calc(100vh-180px)] flex flex-col gap-5">
        <div className=" flex justify-between w-full">
          <div className="flex gap-2 mobile:max-sm:h-[4rem] ">
            <select
              name="Type"
              defaultValue="Words"
              id=""
              className="border-themecolor  rounded px-2 cursor-pointer outline-none   text-themecolor border mobile:max-sm:w-[5rem] mobile:max-sm:px-0   w-[7rem] duration-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option
                className="hover:bg-themecolor p-2 focus:bg-themecolor hover:text-white"
                value="Words"
              >
                Words
              </option>
              <option value="Images">Images</option>
            </select>

            {/* <select
              name="Type"
              defaultValue="cards"
              id=""
              className="border-themecolor  rounded px-2 cursor-pointer outline-none   text-themecolor border mobile:max-sm:w-[5rem] mobile:max-sm:px-0   w-[7rem] duration-300"
            >
              <option value="cards">cards</option>
              <option value="animals">animals</option>
              <option value="food">food</option>
              <option value="cars">cars</option>
              <option value="people">people</option>
              <option value="birds">birds</option>
            </select> */}

            <select
              name="Number"
              defaultValue="5"
              id=""
              className="border-themecolor  rounded px-2 cursor-pointer outline-none   text-themecolor border  w-[4rem] duration-300"
              value={numberOfOptions}
              onChange={(e) => setNumberOfOptions(+e.target.value)}
            >
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            className=" border rounded-md mobile:max-sm:h-[4rem] border-themecolor hover:bg-themecolor hover:text-white transition-all duration-300 text-themecolor p-2"
          >
            🃏 Generate
          </button>
        </div>

        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col justify-center items-center">
            <Card
              image={selectedCard?.image || ""}
              text={""}
              className={"w-[80px] h-[80px]"}
            />
            <span>{homePlayer?.username}</span>
          </div>

          <div className="flex gap-3 items-center justify-center">
            <CopyToClipboard
              text="this is the link you copied"
              onCopy={handleCopy}
            >
              <button
                // onClick={handleCopy}
                className="flex gap-1  items-center p-2  text-green-600"
              >
                <span className="text-green-600">{gameUrl ? gameUrl : ""}</span>
                <PiCopySimpleLight size={20} />
              </button>
            </CopyToClipboard>
          </div>

          <div className="flex flex-col justify-center items-center">
            <Card image={""} text={""} className={"w-[80px] h-[80px] "} />
            <span>Hills</span>
          </div>
        </div>
        {/* ###### Cards section ##### */}
        <div className="w-full flex items-center justify-center gap-2 p-2 flex-wrap h-[40vh] bigScreen:h-[60vh] rounded border border-themecolor">
          {generatedData.map((data, index) => (
            <Card
              key={index}
              image={data.image}
              text={""}
              onClick={() => setSelectedCard(data)}
              className="w-[100px] h-[100px] bigScreen:w-[250px] bigScreen:h-[250px]"
            />
          ))}
        </div>
        {/* ###### Cards section ##### */}

        <textarea
          className="h-[10vh] outline-none border border-gray-300 p-2 text-xs"
          placeholder="enter a hint message..."
        />
        <button className="bg-themecolor text-white p-2">Play</button>
      </div>

      {/* ############ GAME AREA ########### */}

      <div className="bg-white flex flex-col w-[240px] mobile:max-sm:w-full shadow-md  h-full px-2 py-4 gap-5">
        <Scores />
        <div className="flex border border-themecolor rounded-[5px] p-2 justify-center gap-4 font-extrabold text-themecolor">
          <span>{`${round?.round_number}/5`}</span>
          <span>Rounds</span>
        </div>

        <button className=" border mobile:max-sm:hidden bg-themecolor text-white p-2">
          insights
        </button>
      </div>
    </main>
  );
}
