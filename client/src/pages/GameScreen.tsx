import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface GameScreenRoomIdProps {
  roomId: string;
}

export const GameScreen: React.FC<GameScreenRoomIdProps> = () => {
  const { roomId } = useParams<GameScreenRoomIdProps>();
  console.log(roomId);
  return (
    <>
      <div>asdasd</div>
    </>
  );
};
