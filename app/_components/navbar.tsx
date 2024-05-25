import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "./profileMenu";
import Logo from "@/public/images/logo.png"
import LoginBtn from "./loginBtn";
import { getServerSession } from "next-auth";

const NavBar = async () => {
  const user = await getServerSession();

  return (
    <div className="top-0 bg-slate-950 py-4 border-b border-orange-500 w-full z-10 fixed">
      <div className="container flex items-center justify-between w-full flex-col sm:flex-row gap-2 sm:gap-0">
        <Link href={"/"}>
          <Image
            src={Logo}
            alt={"Corvid Logo"}
            height={80}
            width={80}
            priority
            className="rounded-full"
          />
        </Link>
        {user ? <ProfileMenu session={user} />: <LoginBtn session={user}/>}
      </div>
    </div>
  );
};

export default NavBar;
