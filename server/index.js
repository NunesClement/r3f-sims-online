"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:5173",
    },
});
io.listen(3001);
var characters = [];
var generateRandomPosition = function () {
    return [Math.random() * 3, 0, Math.random() * 3];
};
var generateRandomHexColor = function () {
    return ("#" +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0"));
};
io.on("connection", function (socket) {
    console.log("user connected");
    var newCharacter = {
        id: socket.id,
        position: generateRandomPosition(),
        hairColor: generateRandomHexColor(),
        topColor: generateRandomHexColor(),
        bottomColor: generateRandomHexColor(),
    };
    characters.push(newCharacter);
    socket.emit("hello");
    io.emit("characters", characters);
    socket.on("move", function (position) {
        var character = characters.find(function (char) { return char.id === socket.id; });
        if (character) {
            character.position = position;
            io.emit("characters", characters);
        }
    });
    socket.on("disconnect", function () {
        console.log("user disconnected");
        var index = characters.findIndex(function (char) { return char.id === socket.id; });
        if (index !== -1) {
            characters.splice(index, 1);
            io.emit("characters", characters);
        }
    });
});
