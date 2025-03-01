import { Server } from "socket.io";

interface Character {
  id: string;
  position: [number, number, number];
  hairColor: string;
  topColor: string;
  bottomColor: string;
}

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);

const characters: Character[] = [];

const generateRandomPosition = (): [number, number, number] => {
  return [Math.random() * 3, 0, Math.random() * 3];
};

const generateRandomHexColor = (): string => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

io.on("connection", (socket) => {
  console.log("user connected");

  const newCharacter: Character = {
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  };

  characters.push(newCharacter);

  socket.emit("hello");
  io.emit("characters", characters);

  socket.on("move", (position: [number, number, number]) => {
    const character = characters.find((char) => char.id === socket.id);
    if (character) {
      character.position = position;
      io.emit("characters", characters);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    const index = characters.findIndex((char) => char.id === socket.id);
    if (index !== -1) {
      characters.splice(index, 1);
      io.emit("characters", characters);
    }
  });
});
