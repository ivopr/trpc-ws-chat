import type { NextPage } from "next";
import { customAlphabet } from "nanoid";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { RefreshCwIcon } from "lucide-react";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvqxyz0123456789", 8);

const Home: NextPage = () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  function generateRoomId() {
    setRoomId(nanoid());
  }

  function goToRoom(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    router.push(`/rooms/${roomId}`);
  }

  return (
    <>
      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1 className="prose prose-invert prose-2xl font-bold">SDChat</h1>
        <h4 className="prose prose-invert prose-lg font-medium">Um Chat Incrível</h4>
        <form onSubmit={goToRoom}>
          <div className="relative">
            <button type="button" className="absolute inset-y-0 left-0 flex items-center pl-2" onClick={generateRoomId}>
              <RefreshCwIcon className="h-5 2-5 m-auto" />
            </button>
            <input type="text" className="block px-4 py-4 mt-2 text-xl placeholder-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-600 focus:ring-opacity-50 w-72 pl-10" data-primary="green-600" data-rounded="rounded-lg" placeholder="Digite o ID do Chat" value={roomId} onChange={e => setRoomId(e.target.value)} />
          </div>

          <button className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300 my-2.5 w-72 hover:ring-offset-gray-900" type="submit">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease" />
            <span className="relative">Entrar no Chat</span>
          </button>
        </form>
      </main>
    </>
  );
};

export default Home;
