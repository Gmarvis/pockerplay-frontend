"use client";
import { useState } from "react";
import { CiLogout } from "react-icons/ci";
import Overlay from "../atoms/Overlay";
import Popups from "../atoms/Popups";
import { useRouter } from "next/navigation";
import Image from "next/image";

// React Icons
import { IoClose } from "react-icons/io5";
import Link from "next/link";

type Props = {
  onClick: () => void;
};

export default function MobileNav({ onClick }: Props) {
  const router = useRouter();

  const [openLogout, setOpenLogout] = useState(false);
  return (
    <div className="flex flex-col justify-between bg-themecolor w-[100vw] h-[100vh] items-start py-2 px-4 z-40">
      <div className="text-white font-bold flex items-center justify-between w-full">
        <Link href={"/"}>
          <Image
            src={"/POCKERPLAY-LOGO-white.png"}
            alt=""
            width={200}
            height={100}
          />
        </Link>
        <button onClick={onClick}>
          <IoClose size={24} />
        </button>
      </div>
      <div>
        <div></div>
        <div></div>
      </div>

      <button
        onClick={() => setOpenLogout((prev) => !prev)}
        className="flex items-center font-bold text-lg justify-center py-1 text-white gap-3 px-4"
      >
        <CiLogout /> <span>logout</span>
      </button>

      {openLogout && (
        <>
          <Popups
            title={"Hey"}
            content={"Are you sure you want to leave the Game?"}
            actionText={"Logout"}
            onCancel={() => setOpenLogout((prev) => !prev)}
            onAction={() => {
              localStorage.clear();
              router.push("/");
              setOpenLogout((prev) => !prev);
            }}
            styles={"bg-themecolor text-white rounded"}
            actionBTNStyle={"border border-red-600 text-red-600"}
          />
          <Overlay onClick={() => setOpenLogout((prev) => !prev)} transparent />
        </>
      )}
    </div>
  );
}
