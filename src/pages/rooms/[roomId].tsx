import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../constants/schemas";
import { trpc } from "../../utils/trpc";
import { HomeIcon, SendIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

function MessageItem({
  message,
  session,
}: {
  message: Message;
  session: Session;
}) {
  const baseStyles =
    "bg-gray-100 mb-4 text-md w-7/12 px-4 py-1.5 text-gray-700 border border-gray-200 rounded-md relative";

  const liStyles =
    message.sender.name === session.user?.name
      ? baseStyles
      : baseStyles.concat(" self-end bg-gray-300 text-gray-700");

  return (
    <li className={liStyles}>
      <div className="flex text-lg justify-between border-b border-green-500/30">
        <span
          className="font-semibold capitalize"
        >
          {message.sender.name}
        </span>
        <time className="text-sm">
          {message.sentAt.toLocaleTimeString("pt-BR", {
            timeStyle: "short",
          })}
        </time>
      </div>
      {message.message}
    </li>
  );
}

function RoomPage() {
  const { query } = useRouter();
  const roomId = query.roomId as string;
  const { data: session } = useSession();
  const [nickname, setNickname] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: sendMessageMutation } = trpc.useMutation([
    "room.send-message",
  ]);

  trpc.useSubscription(
    [
      "room.onSendMessage",
      {
        roomId,
      },
    ],
    {
      onNext: (message) => {
        setMessages((m) => {
          return [...m, message];
        });
      },
    }
  );

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  if (!session) {
    return (
      <>
        <Head>
          <title>Identificação - SDChat</title>
        </Head>
        <form
          className="flex flex-col gap-y-4 absolute inset-0 items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();

            signIn("credentials", { name: nickname, redirect: false }).then(() => {
              setNickname("");
            });
          }}
        >
          <input type="text" className="block text-gray-600 px-4 py-4 mt-2 text-xl placeholder-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-600 focus:ring-opacity-50 w-72" data-primary="green-600" data-rounded="rounded-lg" placeholder="Seu Nome" value={nickname} onChange={e => setNickname(e.target.value)} />

          <button
            className="relative rounded px-4 py-4 text-xl overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300 w-72 hover:ring-offset-gray-900"
            type="submit"
          >
            <span className="absolute right-0 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease" />
            <span className="relative">
              Conectar
            </span>
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Chat {roomId} - SDChat</title>
      </Head>
      <div className="flex flex-col absolute inset-0">
        <div className="flex w-full p-4 justify-between">
          <Link
            legacyBehavior={false}
            className="relative rounded p-2 text-xl group bg-gray-500 hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 hover:ring-offset-gray-900 transition-all ease-out duration-300"
            href="/"
            passHref
          >
            <span
              className="absolute right-0 -mt-12 transition-all duration-1000 transform translate-x-12 bg-transparent opacity-10 rotate-12 group-hover:-translate-x-40 ease"
            />
            <span className="relative flex gap-x-2">
              <HomeIcon className="h-5 w-5 m-auto" /> Início
            </span>
          </Link>
          <button
            className="relative rounded p-2 text-xl group bg-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-red-400 transition-all ease-out hover:ring-offset-gray-900 duration-300"
            onClick={() => {
              signOut({ redirect: false }).then(() => {
                setMessage("");
                setMessages([]);
              });
            }}
          >
            <span
              className="absolute right-0 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"
            />
            <span className="relative">
              Desconectar
            </span>
          </button>
        </div>
        <div className="flex-1 overflow-y-scroll my-2" id="messagesBox">
          <ul className="flex flex-col py-2 px-4">
            {messages.map((m) => {
              return <MessageItem key={m.id} message={m} session={session} />;
            })}
          </ul>
          <div ref={messagesEndRef} />
        </div>

        <form
          className="flex w-full gap-x-3 pb-2 px-5"
          onSubmit={(e) => {
            e.preventDefault();

            if (message) {
              sendMessageMutation({
                roomId,
                message,
                sender: {
                  name: session?.user?.name ?? "Unknown"
                }
              });
    
              setMessage("");
            }
          }}
        >
          <input
            className="block p-4 text-xl text-gray-600 placeholder-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-600 focus:ring-opacity-50 w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite..."
          />

          <button
            className="relative rounded px-4 py-4 text-xl overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300 w-20 hover:ring-offset-gray-900"
            type="submit"
          >
            <span
              className="absolute right-0 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"
            />
            <span className="relative">
              <SendIcon className="h-6 w-6 mx-auto" />
            </span>
          </button>
        </form>
      </div>
    </>
  );
}

export default RoomPage;
