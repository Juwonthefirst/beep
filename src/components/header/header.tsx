import Logo from "../logo";
import NavBar from "./nav-bar";
import ProfileLink from "./profile-link";

const Header = () => {
  return (
    <header className="flex items-center justify-between h-12 md:h-14 px-6 border-b border-neutral-200">
      <Logo />
      <div className="flex gap-24 items-center">
        <NavBar />
        <ProfileLink />
      </div>
    </header>
  );
};

export default Header;
